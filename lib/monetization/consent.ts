import type { ConsentState } from './policy';

export type AdvertisingConsentPreferences = Readonly<{ advertising?: boolean }>;

export function advertisingConsent(preferences?: AdvertisingConsentPreferences): ConsentState {
  if (preferences?.advertising === true) return 'granted';
  if (preferences?.advertising === false) return 'denied';
  return 'unknown';
}
