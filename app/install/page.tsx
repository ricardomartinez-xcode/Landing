import type { Metadata } from 'next';
import { InstallExperience } from './InstallExperience';

export const metadata: Metadata = {
  title: 'Instalar RelNet | ReLead',
  description: 'Instala RelNet en iPhone, iPad, Android o Windows y accede a tu red privada desde cualquier dispositivo.'
};

export default function InstallPage() {
  return <InstallExperience />;
}
