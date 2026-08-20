import type {ConsentState,MonetizationFormat,ProviderKind,PublicMonetizationSurface} from './policy.ts'; export type SponsorCreative=Readonly<{id:string;title:string;body:string;href:string}>; export type ProviderRequest=Readonly<{surface:PublicMonetizationSurface;placement:string;format:MonetizationFormat;consent:ConsentState}>; export interface MonetizationProvider{readonly id:string;readonly kind:ProviderKind;readonly requiresConsent:boolean;resolve(request:ProviderRequest):SponsorCreative|null|Promise<SponsorCreative|null>} export const directSponsorProvider:MonetizationProvider={id:'direct-sponsor',kind:'direct',requiresConsent:false,resolve:()=>null}; export type ContextualProviderAdapter=MonetizationProvider&{readonly kind:'third_party';readonly requiresConsent:true};

export interface LazyContextualProviderAdapter extends MonetizationProvider {
  readonly kind: 'third_party';
  readonly requiresConsent: true;
  readonly origins: readonly string[];
  load(): Promise<void>;
}

export async function resolveContextualProvider(adapter: LazyContextualProviderAdapter, request: ProviderRequest) {
  if (request.consent !== 'granted') return null;
  if (request.surface !== 'public_landing' && request.surface !== 'public_docs') return null;
  try {
    await adapter.load();
    return await adapter.resolve(request);
  } catch {
    return null;
  }
}
