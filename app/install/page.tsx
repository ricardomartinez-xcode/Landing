import type { Metadata } from 'next';
import { InstallExperience } from './InstallExperience';

export const metadata: Metadata = {
  title: 'Instalar RelNets | Windows, Linux, CLI y PWA',
  description: 'Instala RelNets en Windows y Linux, usa la CLI o agrega la PWA a la pantalla de inicio en iOS y Android con perfil VPN para Mobile Gateway.'
};

export default function InstallPage() {
  return <InstallExperience />;
}
