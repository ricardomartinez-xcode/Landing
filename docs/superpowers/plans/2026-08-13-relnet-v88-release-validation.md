# RelNet v88 Release Validation and Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Assemble the routing, public FAQs, and theme deliverables into a reproducible v88 candidate, validate real network behavior safely, publish the public site, and promote only after current evidence passes.

**Architecture:** Build an immutable v88 tree alongside v87, deploy it to the existing isolated staging project and ports, run controlled canaries that begin and end in local-route mode, then use the existing human approval/backup/promotion workflow. The public Cloudflare Worker is deployed and verified independently before console links are promoted.

**Tech Stack:** Docker Compose, Bash, pytest, Playwright, curl, PostgreSQL, restic, Cloudflare/OpenNext, WireGuard, strongSwan/IKEv2.

## Global Constraints

- Never modify `/opt/ai-platform/current` in place.
- Preserve the current v87 release and its rollback data until v88 production verification passes.
- Keep staging listeners on their current isolated IP/ports; do not bind production listeners.
- Do not activate a new default route automatically during migration or promotion.
- Real gateway tests start with an explicit recovery route and end by restoring local mode.
- Latitude is selectable only after Windows preflight and a controlled NAT canary pass.
- Create a current backup before promotion and verify its manifest.
- Promotion requires the existing human approval flow.
- Make no completion claim without fresh command output from staging and production.

## File Structure

- Candidate: `/home/ubuntu/relnet-v88-work/`.
- Staging release: `/opt/ai-platform/staging/<timestamp>-v88/`.
- Production release: `/opt/ai-platform/releases/<timestamp>-v88/`.
- Candidate `VERSION`, `RELEASE_NOTES.md`, `VALIDATION_REPORT.md`, `ROLLBACK.md`, and `SOURCE_TREE.sha256`.
- Public repo deployment artifacts under `.open-next/` (ignored by Git).
- Evidence under `/opt/ai-platform/artifacts/v88-validation/` without secrets.

---

### Task 1: Assemble the Immutable v88 Candidate

**Files:**
- Create: `/home/ubuntu/relnet-v88-work/` from the verified v87 tree.
- Modify: `VERSION`
- Modify: `RELEASE_NOTES.md`
- Create: `ops/checkpoints/` task checksums.

**Interfaces:**
- Consumes all three implementation plans.
- Produces one source tree whose checksum can be compared with staged and production copies.

- [ ] **Step 1: Verify source inputs before copying**

Run: `readlink -f /opt/ai-platform/current && cat /opt/ai-platform/current/VERSION && git -C /home/ubuntu/landing-relnet-validation status --short --branch`

Expected: current points to v87, version is v87, and public repo has only intentional plan/code commits.

- [ ] **Step 2: Copy v87 to a new explicit candidate path**

Run `rsync -a --delete` only with source `/home/ubuntu/relnet-v87-work/` and destination `/home/ubuntu/relnet-v88-work/` after verifying neither resolves to `/`, `/home/ubuntu`, or `/opt/ai-platform`. Do not copy `.env`, data, backups, logs, or secrets.

Expected: candidate exists separately and v87 checksums still match its source manifest before v88 edits are overlaid.

- [ ] **Step 3: Overlay reviewed changes and set version metadata**

Set platform `VERSION` to `v88` and agent package version to `0.7.0`. Release notes must list routing data model, Controller/Relay NAT, Linux/Windows agent support, console flows, public FAQs, theme coverage, safe migration default, and rollback behavior.

- [ ] **Step 4: Run source-level validation**

Run:

```bash
python3 -m compileall -q api/app auth-broker/app browser/app core/ai_core mcp/app worker/app agents/relnet-node relnet-relay
shellcheck scripts/*.sh browser/entrypoint.sh ops/tests/*.sh
sudo docker compose --env-file /opt/ai-platform/.env -f compose.yml config >/dev/null
```

Expected: all commands exit 0.

- [ ] **Step 5: Freeze the candidate manifest**

Generate `SOURCE_TREE.sha256` over source/config/test files while excluding `.env`, `.git`, data, dist binaries, caches, logs, and build output. Verify it immediately with `sha256sum -c SOURCE_TREE.sha256`.

Expected: every entry reports `OK`.

### Task 2: Deploy Isolated Staging and Run Baseline Regression

**Files:**
- Create: `/opt/ai-platform/staging/<timestamp>-v88/`
- Update only after validation: `/opt/ai-platform/staging/current`.
- Create: `VALIDATION_REPORT.md` in candidate/release.

**Interfaces:**
- Produces healthy staging services and a baseline report before route canaries.

- [ ] **Step 1: Prove staging/production port separation**

Run existing v87 port-policy tests plus `ss -lntup` and compare effective Compose `ports:` for both projects.

Expected: staging Caddy remains `127.0.0.1:18443`, staging gateway remains on its designated Tailscale IP/port, staging Relay uses 51822, production ports remain unchanged, and no duplicate bind exists.

- [ ] **Step 2: Build and start only the v88 staging project**

Use `ops/staging-compose.sh` with the v88 tree and existing staging data root. Never invoke production Compose during this step.

Expected: every staging service becomes healthy within its declared health deadline.

- [ ] **Step 3: Run unit and integration suites in staging images**

Run API, admin, auth-broker, Relay, Linux agent, namespace, Compose, security, and OpenAPI tests from the implementation plans.

Expected: all tests PASS; the namespace test cleans up its exact namespaces.

- [ ] **Step 4: Run existing platform verification**

Run: `sudo ./scripts/verify.sh && sudo ./scripts/smoke-test.sh`

Expected: `verify: PASS` and `smoke-test: PASS` from the v88 staging tree.

- [ ] **Step 5: Record baseline evidence**

Append command, UTC timestamp, exit code, and redacted outcome to `VALIDATION_REPORT.md`. Do not paste tokens, cookies, complete container environments, or opaque approval URLs.

### Task 3: Controlled Egress and Subnet Canaries

**Files:**
- Create: `ops/tests/relnet-routing-e2e-staging.py`
- Append: `VALIDATION_REPORT.md`

**Interfaces:**
- Exercises real desired/applied revisions through the staging API and agents.
- Leaves every real node in its original local-route state.

- [ ] **Step 1: Write the failing end-to-end assertions before activation**

The script must query routing state and fail unless every target starts in `local`, Controller/Relay is healthy, bypasses are present, and the selected canary advertises the expected capabilities. It stores original preferences in memory and uses `finally` to request restoration.

- [ ] **Step 2: Run preflight-only mode**

Run: `python3 ops/tests/relnet-routing-e2e-staging.py --preflight-only`

Expected: PASS without changing desired revision.

- [ ] **Step 3: Test Controller/Relay and fail-closed on a Linux canary**

Select the staging Linux canary, preserve its physical public-IP observation, choose Controller/Relay, wait for desired and applied revision equality, and assert its observed egress identity equals Controller/Relay. Temporarily stop only the staging Relay, assert public Internet fails while the API heartbeat path remains reachable, restart Relay, then restore local mode.

- [ ] **Step 4: Test subnet opt-in and optional node gateway**

Announce a disposable RFC1918 test subnet from a staging gateway. Assert another node sees it but retains its local route, opt it into RelNet, verify the remote test service, switch back to local, and remove the advertisement. Run Windows/Latitude gateway preflight; perform a NAT canary only if `supported=true` and there is no foreign NAT conflict.

- [ ] **Step 5: Verify cleanup and record evidence**

Query every canary until desired/applied mode is local, confirm the disposable advertisement is absent, confirm no stale RelNet-owned test NAT/rules remain, and append redacted evidence to `VALIDATION_REPORT.md`.

### Task 4: Publish and Verify Public FAQs

**Files:**
- Build output: `/home/ubuntu/landing-relnet-validation/.open-next/`
- Append: public deployment evidence in the spec repository commit history and v88 validation report.

**Interfaces:**
- Produces public routes consumed by the v88 console links.

- [ ] **Step 1: Verify clean public build and tests**

Run: `npm ci && npm run lint && npm run build && npm run test:public && npm run test:theme`

Expected: all commands PASS from a clean dependency install.

- [ ] **Step 2: Upload a preview without changing the production route**

Run the pinned OpenNext upload command and capture the preview URL. Do not print Cloudflare credentials.

Expected: preview `/FAQs`, `/terms`, and `/privacy` return 200; `/faqs` redirects.

- [ ] **Step 3: Run public route and visual audits against preview**

Expected: no auth challenge, no `Set-Cookie` from FAQs, exact footer links, all anchors, mobile/desktop screenshots, and no production identifiers.

- [ ] **Step 4: Deploy the reviewed Worker to production**

Run: `npm run cf:deploy:built`

Expected: Wrangler reports a successful deployment for Worker `landing` and its configured route.

- [ ] **Step 5: Verify live URLs from an external request path**

Run HTTP checks for `https://relead.com.mx/FAQs`, `/faqs`, `/terms`, `/privacy`, and `/`. Confirm the footer on all four rendered pages and save only statuses/content hashes in validation evidence.

### Task 5: Final Staging Gate, Backup, and Human Promotion

**Files:**
- Finalize: `VALIDATION_REPORT.md`
- Finalize: `ROLLBACK.md`
- Create: verified backup manifest through existing `scripts/backup.sh`.

**Interfaces:**
- Produces an approved v88 production release or stops before promotion.

- [ ] **Step 1: Run the full final staging matrix fresh**

Run Compose config, compile, shellcheck, all service tests, netns, controlled routing E2E, visual audit, IKEv2 external test, `verify.sh`, and `smoke-test.sh` again after the final build.

Expected: every check PASS in the same final image set.

- [ ] **Step 2: Verify IKEv2 and current public listeners**

Confirm strongSwan health, external IKE_SA negotiation, production/staging UDP 500/4500 ownership, Relay UDP 51821/51822, HTTPS 443, and absence of new public internal-service ports.

- [ ] **Step 3: Create and verify the pre-promotion backup**

Run the existing backup script, verify restic snapshot/list/manifest, database inclusion, and root-only permissions. Record snapshot ID in the root-only operational report, not in public docs.

- [ ] **Step 4: Prepare and complete human approval**

Use the existing release promotion operation to create the exact approval request. The human reviews the v88 release ID and command on the themed approval page. Execute promotion only after status is approved and single-use.

- [ ] **Step 5: Confirm production release identity**

Verify `/opt/ai-platform/current` points to the v88 release, `VERSION` is v88, source checksum matches the staged candidate, all production services are healthy, and every migrated route preference is still local.

### Task 6: Post-Promotion Production Verification and Rollback Decision

**Files:**
- Append: `VALIDATION_REPORT.md`
- Preserve: v87 release and rollback data until completion.

**Interfaces:**
- Produces the final evidence-backed completion state.

- [ ] **Step 1: Run production verification without activating routes**

Run production `verify.sh`, `smoke-test.sh`, auth positive/negative checks, MCP health, REST health, IKEv2 external test, and public FAQ checks.

Expected: PASS and no egress preference changed from local.

- [ ] **Step 2: Run one approved production Controller/Relay canary**

Use a noncritical node, capture its original preference, switch to Controller/Relay, verify applied revision and egress identity, then restore local in `finally`. Do not stop the production Relay for a failure test; fail-closed was proven in staging.

- [ ] **Step 3: Restart affected services and verify persistence**

Restart API, Relay, admin, and auth-broker one at a time through Compose. Confirm database migrations, route state, approvals, FAQs links, and health survive restart. Do not restart external nodes solely for this check.

- [ ] **Step 4: Inspect logs and security boundaries**

Check bounded recent logs for traceback, token/cookie/private-key patterns, routing loops, nft/WinNAT conflicts, IKE errors, and repeated reconcile failures. Confirm no Docker socket, host root mount, privileged container, or unexpected listener was introduced.

- [ ] **Step 5: Decide completion or rollback from evidence**

If any critical health, recovery, IKEv2, authentication, routing cleanup, or public-site gate fails, execute the documented v87 rollback and verify it. Otherwise finalize the validation report with UTC timestamps and retain v87 until the normal rollback retention window ends.
