import type { Metadata } from 'next';

import { HiFiConfigurator } from '@/components/hifi-configurator';

export const metadata: Metadata = {
  title: 'Configurateur Hi-Fi sur mesure',
  description:
    'Personnalisez votre installation hi-fi, studio ou home cinéma grâce à un configurateur interactif et des recommandations cohérentes.',
};

export default function Page() {
  return <HiFiConfigurator />;
}
