import contract from '@/data/public-plans.json';

export type PublicPlan = (typeof contract.plans)[number];
export const publicPlans = contract.plans;
export const publicPricingRevision = contract.source_revision;

const mxn = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

export function formatMxn(value: number | null) {
  return value === null ? 'Cotización' : `MXN $${mxn.format(value)}`;
}

export function monthlyCadence(plan: PublicPlan) {
  return plan.monthly_price === null ? 'por organización' : '/mes';
}

export function yearlyLabel(plan: PublicPlan) {
  if (plan.yearly_price === null) return 'Condiciones por contrato';
  return plan.yearly_price === 0 ? 'MXN $0/año' : `MXN $${mxn.format(plan.yearly_price)}/año`;
}

export function aiLabel(plan: PublicPlan) {
  if (!plan.ai.enabled) return 'Sin RelNet AI';
  if (plan.ai.monthly_credits === null) return 'RelNet AI · cuota contractual configurable';
  return `${plan.ai.pooled ? 'Pool de ' : ''}${plan.ai.monthly_credits} AI Credits/mes`;
}

export function planCta(plan: PublicPlan) {
  if (plan.slug === 'free') return { label: 'Empezar con Free', href: 'https://console.relead.com.mx/register' };
  if (plan.slug === 'pro') return { label: 'Elegir Pro', href: 'https://console.relead.com.mx/billing?plan=pro' };
  return { label: plan.slug === 'business' ? 'Solicitar cotización' : 'Consultar Team', href: 'https://console.relead.com.mx/' };
}
