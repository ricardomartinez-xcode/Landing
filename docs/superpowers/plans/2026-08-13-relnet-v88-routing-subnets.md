# RelNet v88 Routing and Subnets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build auditable per-node Internet egress and globally advertised, per-node opt-in subnet routing without disrupting control-plane recovery.

**Architecture:** PostgreSQL stores gateways, advertisements, and route preferences as revisioned desired state. The API delivers a bounded `network_configuration` in heartbeats; Linux, Windows, and Controller/Relay reconcilers apply only RelNet-owned rules and report applied state separately.

**Tech Stack:** Python 3.12, FastAPI, asyncpg/PostgreSQL, WireGuard, iproute2, nftables, PowerShell 5.1/WinNAT, vanilla JavaScript, Docker Compose, pytest, Linux network namespaces.

## Global Constraints

- Base the v88 candidate on the immutable v87 source tree.
- Keep every existing node on `local` egress after migration.
- Default failure policy is `block`; `fallback_local` is explicit and disabled by default.
- A subnet advertisement is globally visible but installs no consumer route by default.
- Preserve SSH, Tailscale, WireGuard/Relay, IKEv2 UDP 500/4500, UFW, and host recovery.
- Never flush or replace firewall, route, NAT, Hyper-V, or Windows Firewall state not owned by RelNet.
- Keep the controller logical identity control-plane-only.
- Do not add Docker socket, host filesystem, host networking, or new public TCP listeners.
- Keep Python dependencies pinned and compatible with linux/arm64.
- Preserve exactly 30 GPT `operationId` values and a flattened GPT Actions schema.
- All mutating UI/API operations retain confirmation, reauthentication, RBAC, tag scope, and audit.
- Do not print node tokens, private keys, complete route tables, or secrets in tests or logs.
- The platform release tree is intentionally not a Git checkout; use per-task source checksums there. Use normal commits only in the public-site Git repository.

## File Structure

- `core/ai_core/relnet_routing.py`: pure routing validation, desired-state models, and heartbeat serialization.
- `core/ai_core/db.py`: canonical DDL for gateways, subnet advertisements, and route preferences.
- `migrations/0004_relnet_routing.sql`: migration marker for the embedded canonical DDL.
- `core/ai_core/relnet.py`: asyncpg persistence, authorization scope, and heartbeat reconciliation.
- `api/app/relnet.py`: node/Relay protocol request models and applied-state reporting.
- `api/app/v2.py`: administrator query/execute operations and confirmation gates.
- `relnet-relay/networking.py`: Controller/Relay forwarding and NAT reconciler.
- `relnet-relay/relay.py`: invokes the reconciler and reports health.
- `agents/relnet-node/relnet_network.py`: Linux command planning, atomic apply, rollback, and state cache.
- `agents/relnet-node/relnet_node.py`: heartbeat integration only; routing logic remains in `relnet_network.py`.
- `windows-installer/payload/RelNet-Network.psm1`: Windows preflight and RelNet-owned WinNAT/routing.
- `windows-installer/payload/RelNet-Node.ps1`: imports the module and reports network state.
- `admin/app/static/relnet-routing.js`: pure console view models and request payload construction.
- `admin/app/static/app.js`: module registration, rendering hooks, and action wiring.
- `admin/app/static/styles.css`: routing/subnet cards and state styles using existing tokens.
- `admin/app/main.py`: console read sections and action allowlist.
- `api/tests/test_relnet_routing.py`: routing domain and service behavior.
- `relnet-relay/tests/test_networking.py`: Relay command plan and ownership behavior.
- `ops/tests/test_relnet_network.py`: Linux agent plan/apply/rollback behavior.
- `ops/tests/test-relnet-egress-netns.sh`: real Linux namespace NAT, fail-closed, and subnet tests.
- `ops/tests/RelNet-Network.Tests.ps1`: Windows preflight and owned-rule behavior.
- `admin/tests/relnet-routing-ui.test.mjs`: pure console presentation/payload behavior.

---

### Task 1: Routing Domain Model and Database Schema

**Files:**
- Create: `core/ai_core/relnet_routing.py`
- Modify: `core/ai_core/db.py`
- Create: `migrations/0004_relnet_routing.sql`
- Create: `api/tests/test_relnet_routing.py`

**Interfaces:**
- Produces: `normalize_private_cidr(value: str) -> str`
- Produces: `normalize_failure_policy(value: str) -> Literal["block", "fallback_local"]`
- Produces: `normalize_route_mode(value: str) -> Literal["local", "relnet"]`
- Produces: `RoutingRows(revision, gateways, advertisements, preferences, controller_bypasses)`.
- Produces: `build_network_configuration(rows: RoutingRows) -> dict[str, Any]`
- Produces tables `relnet_gateways`, `relnet_subnet_advertisements`, and `relnet_route_preferences`.

- [ ] **Step 1: Write the failing domain tests**

```python
from ipaddress import IPv4Network

import pytest
from ai_core.relnet_routing import (
    normalize_failure_policy,
    normalize_private_cidr,
    normalize_route_mode,
)
from ai_core.security import SecurityError


def test_private_subnet_is_canonical_and_public_default_is_rejected() -> None:
    assert normalize_private_cidr("192.168.50.17/24") == "192.168.50.0/24"
    with pytest.raises(SecurityError):
        normalize_private_cidr("0.0.0.0/0")
    with pytest.raises(SecurityError):
        normalize_private_cidr("8.8.8.0/24")


def test_route_defaults_are_fail_closed_and_local() -> None:
    assert normalize_failure_policy("") == "block"
    assert normalize_failure_policy("fallback_local") == "fallback_local"
    assert normalize_route_mode("") == "local"
    with pytest.raises(SecurityError):
        normalize_failure_policy("silent_local")
```

- [ ] **Step 2: Run the tests and observe the missing module failure**

Run: `sudo docker compose --env-file .env run --rm api pytest -q api/tests/test_relnet_routing.py`

Expected: FAIL with `ModuleNotFoundError: No module named 'ai_core.relnet_routing'`.

- [ ] **Step 3: Implement the minimal pure validators and canonical DDL**

```python
def normalize_private_cidr(value: str) -> str:
    try:
        network = ipaddress.ip_network(str(value).strip(), strict=False)
    except ValueError as exc:
        raise SecurityError("invalid RelNet subnet") from exc
    if not isinstance(network, ipaddress.IPv4Network) or not network.is_private or network.prefixlen == 0:
        raise SecurityError("RelNet subnets must be private IPv4 networks")
    return str(network)


def normalize_failure_policy(value: str) -> Literal["block", "fallback_local"]:
    normalized = str(value or "block").strip().lower()
    if normalized not in {"block", "fallback_local"}:
        raise SecurityError("unsupported RelNet failure policy")
    return cast(Literal["block", "fallback_local"], normalized)


@dataclass(frozen=True)
class RoutingRows:
    revision: int
    gateways: list[dict[str, Any]]
    advertisements: list[dict[str, Any]]
    preferences: list[dict[str, Any]]
    controller_bypasses: list[str]
```

Add CHECK constraints for gateway kind/state, destination kind, route mode, and failure policy. Add unique indexes for one system gateway, one gateway per node, one active advertisement per CIDR, and one preference per node/destination. Use `ON DELETE CASCADE` only for rows owned by a RelNet network or node; do not cascade from a deleted gateway while active preferences reference it.

The migration file must insert `0004_relnet_routing` into `schema_migrations` with checksum `embedded:core/ai_core/db.py`, matching the existing migration convention.

- [ ] **Step 4: Run the focused tests and database bootstrap test**

Run: `sudo docker compose --env-file .env run --rm api pytest -q api/tests/test_relnet_routing.py`

Expected: PASS.

Run: `sudo docker compose --env-file .env config >/dev/null && python3 -m compileall -q core/ai_core`

Expected: exit 0.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum core/ai_core/relnet_routing.py core/ai_core/db.py migrations/0004_relnet_routing.sql > ops/checkpoints/v88-task1.sha256`

Expected: three checksums and no secret-bearing files.

### Task 2: Service Persistence and Heartbeat Desired/Applied State

**Files:**
- Modify: `core/ai_core/relnet.py`
- Modify: `core/ai_core/relnet_routing.py`
- Modify: `api/tests/test_relnet_routing.py`

**Interfaces:**
- Consumes: validators and tables from Task 1.
- Produces: `RelNetService.routing() -> dict[str, Any]`
- Produces: `RelNetService.set_gateway(*, actor: str, gateway_id: str, node_id: str | None, enabled: bool) -> dict[str, Any]`.
- Produces: `RelNetService.advertise_subnet(*, actor: str, gateway_id: str, name: str, cidr: str) -> dict[str, Any]`.
- Produces: `RelNetService.remove_subnet(*, actor: str, advertisement_id: str) -> dict[str, Any]`.
- Produces: `RelNetService.set_route_preference(*, actor: str, node_id: str, destination_kind: str, destination_id: str | None, mode: str, gateway_id: str | None, failure_policy: str) -> dict[str, Any]`.
- Produces: `RelNetService.report_network_state(*, node_id: str, token: str, revision: int, report: dict[str, Any]) -> dict[str, Any]`.
- Produces: `network_configuration` in the existing heartbeat result.

- [ ] **Step 1: Add failing service behavior tests with a complete fake row shape**

```python
def test_network_configuration_defaults_to_local_and_block() -> None:
    rows = RoutingRows(
        revision=7,
        gateways=[],
        advertisements=[],
        preferences=[],
        controller_bypasses=["203.0.113.10/32"],
    )
    assert build_network_configuration(rows) == {
        "revision": 7,
        "internet": {"mode": "local", "gateway_id": None, "failure_policy": "block"},
        "subnets": [],
        "gateway": None,
        "control_plane_bypasses": ["203.0.113.10/32"],
    }


def test_global_advertisement_is_not_installed_without_preference() -> None:
    rows = RoutingRows(
        revision=8,
        gateways=[{
            "gateway_id": "controller_relay", "kind": "controller_relay",
            "node_id": None, "state": "active", "virtual_ip": "10.77.0.1",
        }],
        advertisements=[{
            "advertisement_id": "relnet_subnet_docs", "gateway_id": "controller_relay",
            "cidr": "192.168.50.0/24", "state": "active", "desired_revision": 8,
            "applied_revision": 8,
        }],
        preferences=[],
        controller_bypasses=["203.0.113.10/32"],
    )
    configuration = build_network_configuration(rows)
    assert configuration["subnets"] == []
```

The fixture must include every field documented for a gateway, advertisement, and preference so a partial double cannot hide a missing production field.

- [ ] **Step 2: Run the focused tests and observe missing serialization behavior**

Run: `sudo docker compose --env-file .env run --rm api pytest -q api/tests/test_relnet_routing.py`

Expected: FAIL because `RoutingRows` and `build_network_configuration` do not yet exist.

- [ ] **Step 3: Implement transactional service methods**

```python
async def set_route_preference(
    self, *, actor: str, node_id: str, destination_kind: str,
    destination_id: str | None, mode: str, gateway_id: str | None,
    failure_policy: str = "block",
) -> dict[str, Any]:
    clean = normalize_preference(
        node_id=node_id, destination_kind=destination_kind,
        destination_id=destination_id, mode=mode, gateway_id=gateway_id,
        failure_policy=failure_policy,
    )
    async with self.pool.acquire() as connection:
        async with connection.transaction():
            return await self._upsert_route_preference(
                connection=connection, actor=actor, preference=clean,
            )
```

Implement `_upsert_route_preference` as a single asyncpg transaction that:

1. locks the consumer node and selected gateway with `FOR UPDATE`;
2. rejects logical/revoked/offline-ineligible nodes and self-gateway selection;
3. verifies tag scope and ACL eligibility before the write;
4. increments a network routing revision;
5. upserts the preference as `pending` without modifying applied revision;
6. returns only safe fields.

`routing()` must return gateways, advertisements, preferences, desired/applied revisions, state, and bounded errors. `heartbeat()` must include only advertisements offered by the current gateway and only preferences for the authenticated consumer.

- [ ] **Step 4: Run service, regression, and compile tests**

Run: `sudo docker compose --env-file .env run --rm api pytest -q api/tests/test_relnet_routing.py api/tests/test_relnet_security.py`

Expected: PASS.

Run: `python3 -m compileall -q core/ai_core api/app`

Expected: exit 0.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum core/ai_core/relnet.py core/ai_core/relnet_routing.py api/tests/test_relnet_routing.py > ops/checkpoints/v88-task2.sha256`

Expected: three checksums.

### Task 3: Public Node Protocol and Administrative Operations

**Files:**
- Modify: `api/app/relnet.py`
- Modify: `api/app/v2.py`
- Modify: `api/tests/test_relnet_routing.py`
- Modify: `api/tests/test_relnet_security.py`

**Interfaces:**
- Consumes: Task 2 service methods.
- Produces query operation `routing`.
- Produces execute operations `gateway_set`, `subnet_advertise`, `subnet_remove`, and `route_select`.
- Extends `HeartbeatRequest` with `network_revision` and `network_state`.
- Produces: `normalize_routing_action(operation: str, parameters: dict[str, Any]) -> dict[str, Any]` in `api/app/v2.py`.

- [ ] **Step 1: Write failing request validation and route behavior tests**

```python
def test_heartbeat_network_report_is_bounded() -> None:
    report = HeartbeatRequest(
        network_revision=9,
        network_state={"status": "active", "applied_routes": 2, "nat": False},
    )
    assert report.network_revision == 9
    assert report.network_state["status"] == "active"
    with pytest.raises(ValidationError):
        HeartbeatRequest(network_revision=-1)


def test_route_select_rejects_unknown_parameters() -> None:
    with pytest.raises(SecurityError):
        normalize_routing_action("route_select", {
            "node_id": "relnet_node_source",
            "destination_kind": "internet",
            "mode": "local",
            "shell": "ip route flush table main",
        })
```

- [ ] **Step 2: Run the tests and observe missing model fields/helper**

Run: `sudo docker compose --env-file .env run --rm api pytest -q api/tests/test_relnet_routing.py`

Expected: FAIL for missing `network_revision` or `normalize_routing_action`.

- [ ] **Step 3: Add strict models, allowlists, and confirmation gates**

```python
class NetworkStateReport(StrictModel):
    status: Literal["disabled", "pending", "applying", "active", "degraded", "error"]
    applied_routes: int = Field(default=0, ge=0, le=64)
    nat: bool = False
    error_code: str | None = Field(default=None, max_length=64)


class HeartbeatRequest(StrictModel):
    # existing fields remain
    network_revision: int = Field(default=0, ge=0)
    network_state: NetworkStateReport | None = None
```

Every execute branch must call `confirmation_gate` with the exact action name and resource before invoking the service. `routing` accepts no parameters. `subnet_advertise` accepts exactly `gateway_id`, `name`, and `cidr`; `route_select` accepts exactly the fields for its destination kind.

- [ ] **Step 4: Run API tests and verify the GPT schema count is unchanged**

Run: `sudo docker compose --env-file .env run --rm api pytest -q api/tests/test_relnet_routing.py api/tests/test_security.py api/tests/test_relnet_security.py`

Expected: PASS.

Run: `python3 scripts/flatten-gpt-openapi.py docs/openapi-gpt-actions.yaml && python3 - <<'PY'
import json
data=json.load(open('docs/openapi-gpt-actions.json'))
ops=[v['operationId'] for p in data['paths'].values() for v in p.values() if isinstance(v,dict) and 'operationId' in v]
assert len(ops)==len(set(ops))==30
PY`

Expected: exit 0 with exactly 30 unique operations.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum api/app/relnet.py api/app/v2.py docs/openapi-gpt-actions.json > ops/checkpoints/v88-task3.sha256`

Expected: three checksums.

### Task 4: Controller/Relay Gateway Reconciler

**Files:**
- Create: `relnet-relay/networking.py`
- Create: `relnet-relay/tests/test_networking.py`
- Modify: `relnet-relay/relay.py`
- Modify: `relnet-relay/Dockerfile`
- Modify: `compose.yml`

**Interfaces:**
- Produces: `NetworkApplyReport(status: str, revision: int, nat: bool, applied_routes: int, error_code: str | None)`.
- Produces: `RelayNetworkReconciler.apply(configuration: dict[str, Any]) -> NetworkApplyReport`.
- Consumes a gateway-only configuration from the internal Relay API.
- Reports `status`, `revision`, `nat`, `applied_routes`, and bounded `error_code`.

- [ ] **Step 1: Write the failing command-plan tests**

```python
def test_relay_nat_plan_owns_only_the_relnet_table() -> None:
    plan = build_relay_plan(interface="relnet0", uplink="eth0", enabled=True)
    assert plan.nft_script == (
        "table ip relnet {\n"
        " chain forward { type filter hook forward priority 10; policy accept; "
        "iifname \"relnet0\" accept; oifname \"relnet0\" ct state established,related accept; }\n"
        " chain postrouting { type nat hook postrouting priority 100; policy accept; "
        "iifname \"relnet0\" oifname \"eth0\" masquerade; }\n"
        "}\n"
    )
    assert "flush ruleset" not in plan.nft_script
```

- [ ] **Step 2: Run the tests and observe the missing networking module**

Run: `python3 -m pytest -q relnet-relay/tests/test_networking.py`

Expected: FAIL with missing `relnet-relay/networking.py` import.

- [ ] **Step 3: Implement validation, check-before-apply, and Relay reporting**

Use `nft --check -f -` before applying the `table ip relnet` script. Determine the default uplink from `ip -json route show default`, reject loopback/WireGuard uplinks, and delete only `table ip relnet` when disabled. Add `nftables` to the pinned Ubuntu image install and keep only `NET_ADMIN`.

The Relay loop must fetch `/relnet/v1/relay/network-configuration`, apply only a newer revision, and POST the report to `/relnet/v1/relay/network-report`. Failures retain the last valid table and report an error code without command output.

- [ ] **Step 4: Run unit tests and inspect the effective Compose security settings**

Run: `python3 -m pytest -q relnet-relay/tests/test_networking.py`

Expected: PASS.

Run: `sudo docker compose --env-file .env config | sed -n '/relnet-relay:/,/relnet-ikev2:/p'`

Expected: `NET_ADMIN`, `/dev/net/tun`, read-only root, no privileged mode, no host network, and no Docker socket.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum relnet-relay/networking.py relnet-relay/relay.py relnet-relay/Dockerfile compose.yml > ops/checkpoints/v88-task4.sha256`

Expected: four checksums.

### Task 5: Linux Node Routing Reconciler

**Files:**
- Create: `agents/relnet-node/relnet_network.py`
- Modify: `agents/relnet-node/relnet_node.py`
- Modify: `agents/relnet-node/relnet_updater.py`
- Modify: `linux-installer/build-relnet-node-installer.sh`
- Modify: `linux-installer/install-relnet-node.sh`
- Create: `ops/tests/test_relnet_network.py`

**Interfaces:**
- Produces: `PhysicalRoute(gateway: str, interface: str)` and `Route(destination: str, gateway: str | None, interface: str)`.
- Produces: `build_network_plan(network_configuration: dict[str, Any], mesh_interface: str, physical_route: PhysicalRoute) -> NetworkPlan`.
- Produces: `NetworkPlan(revision, routes, default_route, failure_policy, gateway, nft_script)`.
- Produces: `NetworkReconciler.apply(plan: NetworkPlan) -> dict[str, Any]`.
- Consumes `network_configuration` and reports `network_revision`/`network_state` in the next heartbeat.

- [ ] **Step 1: Write failing pure plan and rollback tests**

```python
def test_fail_closed_plan_preserves_controller_before_default_route() -> None:
    plan = build_network_plan(
        {
            "revision": 8,
            "internet": {"mode": "relnet", "gateway_ip": "10.77.125.17", "failure_policy": "block"},
            "control_plane_bypasses": ["203.0.113.10/32", "198.51.100.20/32"],
            "subnets": [],
            "gateway": None,
        },
        "relnet0",
        PhysicalRoute(gateway="192.0.2.1", interface="eth0"),
    )
    assert plan.routes[:2] == [
        Route("203.0.113.10/32", "192.0.2.1", "eth0"),
        Route("198.51.100.20/32", "192.0.2.1", "eth0"),
    ]
    assert plan.default_route == Route("0.0.0.0/0", None, "relnet0")
    assert plan.failure_policy == "block"


def test_unselected_advertisement_produces_no_route() -> None:
    plan = build_network_plan(local_configuration_with_global_advertisement(), "relnet0", PHYSICAL)
    assert all(route.destination != "192.168.50.0/24" for route in plan.routes)
```

- [ ] **Step 2: Run the tests and observe the missing module failure**

Run: `python3 -m pytest -q ops/tests/test_relnet_network.py`

Expected: FAIL because `relnet_network` does not exist.

- [ ] **Step 3: Implement atomic Linux reconciliation**

The reconciler must:

1. validate the full revision and resolve the pre-change physical default route;
2. stage controller/Relay/peer host routes first;
3. stage a dedicated `ip rule` and route table for RelNet egress;
4. apply a dedicated `table inet relnet_node` kill switch and gateway forwarding table;
5. verify API reachability through the bypass;
6. atomically replace the root-only JSON state cache;
7. on failure, restore only the recorded prior RelNet-owned rules and return `error`.

Expose `relnet.egress.consumer`, `relnet.egress.gateway`, and `relnet.subnet` only when `ip`, `wg`, `nft`, forwarding, and a supported uplink pass preflight. Add `nftables` to installer dependencies without changing UFW.

- [ ] **Step 4: Run behavior tests, compile, and package verification**

Run: `python3 -m pytest -q ops/tests/test_relnet_network.py ops/tests/test-relnet-p2p-063.py`

Expected: PASS.

Run: `python3 -m compileall -q agents/relnet-node && bash ops/tests/test-relnet-multi-instance-mesh.sh`

Expected: PASS.

Build a staging installer into a temporary directory and inspect its tar manifest:

```bash
candidate_output="$(mktemp -d -t relnet-v88-linux.XXXXXX)"
linux-installer/build-relnet-node-installer.sh --channel staging --output-dir "$candidate_output"
tar -tzf "$candidate_output"/*.tar.gz | grep '/agents/relnet-node/relnet_network.py$'
```

Expected: exactly one packaged `relnet_network.py`.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum agents/relnet-node/relnet_network.py agents/relnet-node/relnet_node.py linux-installer/build-relnet-node-installer.sh > ops/checkpoints/v88-task5.sha256`

Expected: three checksums.

### Task 6: Windows Gateway and Consumer Reconciler

**Files:**
- Create: `windows-installer/payload/RelNet-Network.psm1`
- Modify: `windows-installer/payload/RelNet-Node.ps1`
- Modify: `windows-installer/build-relnet-installers.sh`
- Create: `ops/tests/RelNet-Network.Tests.ps1`

**Interfaces:**
- Produces: `Test-RelNetGatewaySupport -Configuration <object> -> object`.
- Produces: `ConvertTo-RelNetNetworkPlan -Configuration <object> -> object`.
- Produces: `Sync-RelNetNetwork -Configuration <object> -DataDir <path> -> object`.
- Reports the same status/revision fields as Linux.

- [ ] **Step 1: Write failing Pester behavior tests**

```powershell
Describe 'RelNet network preflight' {
  It 'does not offer gateway capability when a foreign WinNAT overlaps RelNet' {
    Mock Get-NetNat { [pscustomobject]@{ Name='HyperV'; InternalIPInterfaceAddressPrefix='10.77.0.0/16' } }
    $result = Test-RelNetGatewaySupport -MeshPrefix '10.77.0.0/16'
    $result.supported | Should -BeFalse
    $result.error_code | Should -Be 'nat_conflict'
  }

  It 'defaults an absent route preference to local fail-closed state' {
    $result = ConvertTo-RelNetNetworkPlan -Configuration ([pscustomobject]@{ revision=3 })
    $result.internet.mode | Should -Be 'local'
    $result.internet.failure_policy | Should -Be 'block'
  }
}
```

- [ ] **Step 2: Run the tests on the Windows staging node and observe missing module commands**

Run from its existing controlled terminal: `Invoke-Pester -Path .\ops\tests\RelNet-Network.Tests.ps1 -Output Detailed`

Expected: FAIL because `Test-RelNetGatewaySupport` and `ConvertTo-RelNetNetworkPlan` are unavailable.

- [ ] **Step 3: Implement preflight, owned WinNAT, routes, and rollback**

Use the fixed name `RelNet-v88` for WinNAT and the description/policy store prefix `RelNet-v88` for routes/firewall rules. Reject foreign overlap before calling `New-NetNat`. Preserve explicit physical routes to API, Relay, and peer endpoints. Cache the last applied revision under the existing root-only ProgramData directory and remove only objects with the RelNet prefix during rollback.

`RelNet-Node.ps1` must import the module, include the report in its heartbeat, apply a newer desired revision after receiving the heartbeat, and never report active until the following successful observation.

- [ ] **Step 4: Run Pester and build both channel installers**

Run: `Invoke-Pester -Path .\ops\tests\RelNet-Network.Tests.ps1 -Output Detailed`

Expected: PASS on the Windows staging node.

Run on the build host:

```bash
candidate_output="$(mktemp -d -t relnet-v88-windows.XXXXXX)"
RELNET_VERSION=0.7.0 windows-installer/build-relnet-installers.sh "$candidate_output"
unzip -l "$candidate_output/staging/"*.zip | grep 'RelNet-Network.psm1'
```

Expected: the module is present once and both channel builds finish successfully.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum windows-installer/payload/RelNet-Network.psm1 windows-installer/payload/RelNet-Node.ps1 windows-installer/build-relnet-installers.sh > ops/checkpoints/v88-task6.sha256`

Expected: three checksums.

### Task 7: Guided Console Routing and Subnet UI

**Files:**
- Create: `admin/app/static/relnet-routing.js`
- Modify: `admin/app/static/app.js`
- Modify: `admin/app/static/index.html`
- Modify: `admin/app/static/styles.css`
- Modify: `admin/app/main.py`
- Create: `admin/tests/relnet-routing-ui.test.mjs`

**Interfaces:**
- Consumes `routing` query output and execute operations from Task 3.
- Produces `routingViewModel(payload)` and `routeSelectPayload(form)` pure functions.
- Adds console modules `relnet_egress` and `relnet_subnets`.

- [ ] **Step 1: Write failing Node behavior tests for visible state and payloads**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { routeSelectPayload, routingViewModel } from "../app/static/relnet-routing.js";

test("shows desired and applied state separately", () => {
  const view = routingViewModel({
    gateways: [{ gateway_id: "controller_relay", name: "Controller / Relay", state: "active" }],
    preferences: [{ node_id: "node_ubuntu", desired_mode: "relnet", applied_mode: "local", state: "pending" }],
    advertisements: [],
  });
  assert.deepEqual(view.nodes[0].status, { desired: "Controller / Relay", applied: "Red local", tone: "pending" });
});

test("fallback stays disabled unless explicitly checked", () => {
  assert.deepEqual(routeSelectPayload({ nodeId: "node_ubuntu", mode: "relnet", gatewayId: "controller_relay", fallback: false }), {
    node_id: "node_ubuntu",
    destination_kind: "internet",
    destination_id: null,
    mode: "relnet",
    gateway_id: "controller_relay",
    failure_policy: "block",
  });
});
```

- [ ] **Step 2: Run the tests and observe missing module failure**

Run: `node --test admin/tests/relnet-routing-ui.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement guided views and confirmation wiring**

The Internet view must provide one select per node, an advanced fallback switch, desired/applied status, gateway health, impact summary, and a fixed “Conocer más” link to `https://relead.com.mx/FAQs#exit-nodes` with `target="_blank" rel="noreferrer"`.

The subnet view must separate “Anunciar subred” from per-node “Red local / Usar vía RelNet”. Disable activation when ACL/tag scope or gateway health forbids it, but keep the announcement visible with an explanation. Normal flows must not require JSON editing.

Add `routing` to `READ_MODULES["relnet"]` and allow the four Task 3 actions only on `/console`, retaining minimum administrator role and confirmation.

- [ ] **Step 4: Run Node, admin, and accessibility smoke tests**

Run: `node --test admin/tests/relnet-routing-ui.test.mjs`

Expected: PASS.

Run: `sudo docker compose --env-file .env run --rm admin pytest -q admin/tests`

Expected: PASS.

Run: `python3 -m compileall -q admin/app`

Expected: exit 0.

- [ ] **Step 5: Record the source checkpoint**

Run: `sha256sum admin/app/static/relnet-routing.js admin/app/static/app.js admin/app/main.py > ops/checkpoints/v88-task7.sha256`

Expected: three checksums.

### Task 8: Real Linux Dataplane Integration Tests

**Files:**
- Create: `ops/tests/test-relnet-egress-netns.sh`
- Modify: `scripts/verify.sh`
- Modify: `scripts/smoke-test.sh`

**Interfaces:**
- Exercises Task 4 and Task 5 reconcilers against real kernel namespaces.
- Produces a deterministic pass/fail gate for NAT, fail-closed, fallback, and subnet selection.

- [ ] **Step 1: Write the failing namespace scenario**

The script must create four temporary namespaces with a random suffix: consumer, Relay, remote subnet gateway, and Internet target. It must install the generated RelNet plans, then assert literal outcomes with `curl --interface` and `ip route get`:

```bash
ip netns exec "$consumer_ns" curl -fsS --max-time 3 http://198.18.0.2/identity | grep -Fx 'controller-relay'
ip netns exec "$consumer_ns" ip route get 192.168.50.10 | grep -F "dev relnet0"
ip netns exec "$consumer_ns" ip route get 192.168.60.10 | grep -F "dev eth0"
```

After deleting the Relay namespace, Internet curl must fail while API bypass curl still succeeds. In a second isolated case with `fallback_local`, Internet curl must succeed and return `consumer-local`. The trap must delete only the exact suffixed namespaces it created.

- [ ] **Step 2: Run the test and observe failure before reconcilers support the plan**

Run: `sudo bash ops/tests/test-relnet-egress-netns.sh`

Expected: FAIL at the first missing route/NAT assertion.

- [ ] **Step 3: Adjust only the reconciler boundaries exposed by the real kernel test**

Fix route ordering, nft hook priority, reverse-path filtering, or cleanup in `relnet_network.py`/`relnet-relay/networking.py`. Do not add sleeps longer than one second; poll explicit handshake/route conditions with a 15-second deadline.

- [ ] **Step 4: Run the namespace and existing mesh suites**

Run: `sudo bash ops/tests/test-relnet-egress-netns.sh`

Expected: PASS with six named assertions and cleanup confirmation.

Run: `bash ops/tests/test-relnet-multi-instance-mesh.sh && python3 ops/tests/test-relnet-p2p-063.py`

Expected: PASS.

- [ ] **Step 5: Add the non-destructive portion to verification and record checkpoint**

Add pure/unit routing tests to `verify.sh`; keep root network-namespace mutation as an explicit staging gate in `smoke-test.sh` only when `RELNET_RUN_NETNS_TESTS=1`.

Run: `sha256sum ops/tests/test-relnet-egress-netns.sh scripts/verify.sh scripts/smoke-test.sh > ops/checkpoints/v88-task8.sha256`

Expected: three checksums.
