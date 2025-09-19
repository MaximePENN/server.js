'use client';

import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AudioLines,
  AudioWaveform,
  Clapperboard,
  Disc3,
  Headphones,
  SlidersHorizontal,
  Sparkles,
  Speaker,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type UsageId = 'audiophile' | 'studio' | 'home_cinema';
type BudgetLevelId = 'decouverte' | 'equilibre' | 'prestige';
type CategoryId = 'amplifier' | 'speakers' | 'source' | 'headphones' | 'treatment';

type UsageOption = {
  id: UsageId;
  title: string;
  tagline: string;
  description: string;
  highlights: Array<string>;
  icon: LucideIcon;
};

type BudgetLevel = {
  id: BudgetLevelId;
  label: string;
  description: string;
  range: [number, number];
};

type CategoryConfig = {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
};

type EquipmentOption = {
  id: string;
  name: string;
  price: number;
  levels: Array<BudgetLevelId>;
  usages: Array<UsageId>;
  description: string;
  highlights: Array<string>;
  synergy: Array<string>;
};

const usageOptions: Array<UsageOption> = [
  {
    id: 'audiophile',
    title: 'Salon audiophile',
    tagline: 'Votre salon devient une scène vivante et raffinée.',
    description:
      'Priorité absolue à la musicalité, aux timbres justes et à une scène sonore ample pour des écoutes longues et émotionnelles.',
    highlights: [
      'Réalisme des timbres acoustiques',
      'Compatibilité vinyle & streaming haute résolution',
      'Intégration élégante dans votre décoration',
    ],
    icon: Disc3,
  },
  {
    id: 'studio',
    title: 'Studio de création',
    tagline: 'Prenez des décisions sûres pour vos mix et masters.',
    description:
      'Neutralité, précision et flexibilité pour enregistrer, produire et mixer dans un environnement maîtrisé.',
    highlights: [
      'Réponse linéaire et image stéréo stable',
      'Monitoring de proximité et casques de référence',
      'Connectivité audio professionnelle et faible latence',
    ],
    icon: AudioWaveform,
  },
  {
    id: 'home_cinema',
    title: 'Home cinéma immersif',
    tagline: 'Chaque séance devient une projection privée d’exception.',
    description:
      'Immersion multicanale, impact spectaculaire et gestion vidéo dernier cri pour votre salon ou salle dédiée.',
    highlights: [
      'Compatibilité Dolby Atmos et HDMI 2.1',
      'Scène sonore enveloppante et dialogues précis',
      'Pilotage intuitif pour toute la famille',
    ],
    icon: Clapperboard,
  },
];

const budgetLevels: Array<BudgetLevel> = [
  {
    id: 'decouverte',
    label: 'Découverte',
    description: 'Une base solide et évolutive pour goûter au vrai son hi-fi.',
    range: [1500, 4000],
  },
  {
    id: 'equilibre',
    label: 'Équilibre',
    description: 'Équipements ambitieux et polyvalents pour un système durable.',
    range: [4000, 8000],
  },
  {
    id: 'prestige',
    label: 'Prestige',
    description: 'Références iconiques et finitions luxueuses pour passionnés.',
    range: [8000, 15000],
  },
];

const categories: Array<CategoryConfig> = [
  {
    id: 'amplifier',
    label: 'Amplification & contrôle',
    description: 'Le cœur de votre système pour piloter enceintes et casques.',
    icon: AudioLines,
  },
  {
    id: 'speakers',
    label: 'Enceintes principales',
    description: 'La signature sonore qui structure votre scène.',
    icon: Speaker,
  },
  {
    id: 'source',
    label: 'Source & lecture',
    description: 'Streaming, interfaces et transports pour vos musiques et films.',
    icon: Disc3,
  },
  {
    id: 'headphones',
    label: 'Casque & écoute intime',
    description: 'Complément idéal pour des sessions tardives ou analytiques.',
    icon: Headphones,
  },
  {
    id: 'treatment',
    label: 'Optimisation acoustique',
    description: 'Traitez la pièce et soignez les détails pour libérer le potentiel.',
    icon: SlidersHorizontal,
  },
];

const equipmentCatalogue: Record<CategoryId, Array<EquipmentOption>> = {
  amplifier: [
    {
      id: 'rega-elex-mk4',
      name: 'Rega Elex MK4',
      price: 1599,
      levels: ['decouverte'],
      usages: ['audiophile'],
      description: 'Amplificateur intégré 2x72W, musical et vivant.',
      highlights: ['Entrée phono MM', 'Signature analogique', 'Format compact'],
      synergy: ['Idéal avec des enceintes bibliothèques sensibles pour des écoutes feutrées.'],
    },
    {
      id: 'cambridge-evo150',
      name: 'Cambridge Audio Evo 150',
      price: 3290,
      levels: ['decouverte', 'equilibre'],
      usages: ['audiophile', 'home_cinema'],
      description: 'Tout-en-un streaming puissant avec amplification en classe G.',
      highlights: ['Streaming Roon Ready', 'HDMI ARC', 'Écran couleur'],
      synergy: ['Offre une solution moderne et élégante pour un salon polyvalent.'],
    },
    {
      id: 'hegel-h190',
      name: 'Hegel H190',
      price: 3990,
      levels: ['equilibre'],
      usages: ['audiophile'],
      description: 'Amplificateur 2x150W avec DAC intégré et contrôle de volume précis.',
      highlights: ['Réserve de courant impressionnante', 'AirPlay 2 & UPnP', 'Conception norvégienne soignée'],
      synergy: ['Pilote sans effort des colonnes exigeantes tout en restant neutre.'],
    },
    {
      id: 'naim-uniti-nova',
      name: 'Naim Uniti Nova',
      price: 7499,
      levels: ['prestige'],
      usages: ['audiophile'],
      description: 'Tout-en-un de référence alliant puissance, DAC haut de gamme et interface tactile.',
      highlights: ['Streaming multiroom', 'Préampli phono optionnel', 'Châssis aluminium massif'],
      synergy: ['Associe la musicalité Naim à une ergonomie premium pour les intérieurs design.'],
    },
    {
      id: 'marantz-cinema50',
      name: 'Marantz Cinema 50',
      price: 2499,
      levels: ['decouverte', 'equilibre'],
      usages: ['home_cinema'],
      description: 'Amplificateur Home-Cinéma 9.4 canaux compatible Dolby Atmos et 8K.',
      highlights: ['Calibration Audyssey XT32', 'HDMI 2.1 complet', 'Signature chaleureuse Marantz'],
      synergy: ['Garantit une scène immersive tout en restant simple à intégrer.'],
    },
    {
      id: 'anthem-mrx740',
      name: 'Anthem MRX 740',
      price: 4290,
      levels: ['equilibre'],
      usages: ['home_cinema'],
      description: 'Amplificateur A/V avec calibration Anthem Room Correction.',
      highlights: ['ARC Genesis inclus', '9 canaux évolutifs', 'Gestion caisson avancée'],
      synergy: ['Permet une calibration précise même dans des pièces complexes.'],
    },
    {
      id: 'lyngdorf-tdai-3400',
      name: 'Lyngdorf TDAI-3400',
      price: 6890,
      levels: ['prestige'],
      usages: ['home_cinema', 'audiophile'],
      description: 'Amplificateur numérique avec correction RoomPerfect et streaming complet.',
      highlights: ['Correction RoomPerfect', 'HDMI 2.1 optionnel', 'Puissance maîtrisée'],
      synergy: ['Combine précision scandinave et correction de pièce de haut niveau.'],
    },
    {
      id: 'dangerous-source',
      name: 'Dangerous Music Source',
      price: 1299,
      levels: ['decouverte'],
      usages: ['studio'],
      description: 'Contrôleur de monitoring 4 sources ultra transparent.',
      highlights: ['Double sortie casque', 'Convertisseurs précis', 'Portable'],
      synergy: ['S’intègre parfaitement à un poste de production mobile ou hybride.'],
    },
    {
      id: 'rme-adi2-pro',
      name: 'RME ADI-2 Pro FS R Black Edition',
      price: 2299,
      levels: ['equilibre', 'prestige'],
      usages: ['studio'],
      description: 'DAC/ADC de référence avec amplification casque puissante.',
      highlights: ['EQ paramétrique', 'Analyse spectrale', 'Entrées/sorties symétriques'],
      synergy: ['Offre un centre de contrôle numérique fiable pour le mixage critique.'],
    },
    {
      id: 'grace-m905',
      name: 'Grace Design m905',
      price: 5990,
      levels: ['prestige'],
      usages: ['studio'],
      description: 'Contrôleur de monitoring mastering avec DAC et talkback.',
      highlights: ['Télécommande grand écran', 'Conversion 24/192 haut de gamme', 'Gestion multi-enceintes'],
      synergy: ['Apporte une précision mastering et une ergonomie studio moderne.'],
    },
  ],
  speakers: [
    {
      id: 'bowers-705s3',
      name: 'Bowers & Wilkins 705 S3',
      price: 2498,
      levels: ['decouverte'],
      usages: ['audiophile'],
      description: 'Bibliothèques haut de gamme avec tweeter découplé Carbon Dome.',
      highlights: ['Tweeter surmonté', 'Finition luxueuse', 'Clarté exceptionnelle'],
      synergy: ['Recrée une scène large même à faible volume.'],
    },
    {
      id: 'focal-kanta2',
      name: 'Focal Kanta N°2',
      price: 6998,
      levels: ['equilibre'],
      usages: ['audiophile'],
      description: 'Colonnes 3 voies mariant médium en lin et tweeter Béryllium.',
      highlights: ['Fabrication française', 'Grave rapide', 'Design audacieux'],
      synergy: ['Allie dynamique et douceur pour tous les styles musicaux.'],
    },
    {
      id: 'sonusfaber-olympica',
      name: 'Sonus Faber Olympica Nova II',
      price: 11400,
      levels: ['prestige'],
      usages: ['audiophile'],
      description: 'Colonnes artisanales avec coffret en bois et tweeter à dôme soie.',
      highlights: ['Fabriquées à Vicence', 'Grave articulé', 'Finitions luxueuses'],
      synergy: ['Idéales pour une écoute longue et émotionnelle.'],
    },
    {
      id: 'dali-oberon-51',
      name: 'Pack DALI Oberon 5 5.1',
      price: 2290,
      levels: ['decouverte'],
      usages: ['home_cinema'],
      description: 'Pack colonnes + centrale + surrounds + caisson pour pièce de vie.',
      highlights: ['Caisson E-9F inclus', 'Design discret', 'Son chaleureux'],
      synergy: ['Un ensemble cohérent pour les premières séances home cinéma.'],
    },
    {
      id: 'monitor-audio-silver',
      name: 'Monitor Audio Silver 300 7G Atmos Pack',
      price: 4590,
      levels: ['equilibre'],
      usages: ['home_cinema'],
      description: 'Ensemble 5.1.2 avec modules Atmos intégrés.',
      highlights: ['Finitions bois multiples', 'Module Atmos dédié', 'Caisson 500W'],
      synergy: ['Crée un dôme sonore immersif dans un salon moderne.'],
    },
    {
      id: 'kef-reference-3',
      name: 'KEF Reference 3 Meta + Surrounds',
      price: 11900,
      levels: ['prestige'],
      usages: ['home_cinema'],
      description: 'Colonnes coaxiales avec technologie Meta et pack surround assorti.',
      highlights: ['Uni-Q 12e génération', 'Gestion multicanale haut de gamme', 'Scène sonore holographique'],
      synergy: ['Reproduit les mix Dolby Atmos avec précision et ampleur.'],
    },
    {
      id: 'focal-shape65',
      name: 'Focal Shape 65 (paire)',
      price: 1698,
      levels: ['decouverte'],
      usages: ['studio'],
      description: 'Monitors actifs nearfield sans évent arrière.',
      highlights: ['Double radiateur passif', 'Réglages embarqués', 'Fabriquées en France'],
      synergy: ['S’intègrent facilement dans les espaces compacts sans boom de grave.'],
    },
    {
      id: 'neumann-kh310',
      name: 'Neumann KH 310 A (paire)',
      price: 5398,
      levels: ['equilibre'],
      usages: ['studio'],
      description: 'Monitors 3 voies tri-amplifiés pour mixage critique.',
      highlights: ['Dispersion contrôlée', 'Réponse 34 Hz – 21 kHz', 'Transducteurs sur-mesure'],
      synergy: ['Offrent une image stable et des graves profonds pour le mastering.'],
    },
    {
      id: 'atc-scm45a',
      name: 'ATC SCM45A Pro (paire)',
      price: 11990,
      levels: ['prestige'],
      usages: ['studio'],
      description: 'Monitors actifs dual-tweeter pour studios professionnels.',
      highlights: ['Transducteurs fabriqués main', 'Puissance 150 + 60 + 25W', 'Neutralité extrême'],
      synergy: ['Permettent des décisions de mix sûres à fort volume.'],
    },
  ],
  source: [
    {
      id: 'bluesound-node-x',
      name: 'Bluesound Node X',
      price: 799,
      levels: ['decouverte'],
      usages: ['audiophile', 'home_cinema'],
      description: 'Lecteur réseau avec DAC ESS et sortie HDMI eARC.',
      highlights: ['Streaming BluOS', 'Prise casque', 'AirPlay 2'],
      synergy: ['Centralise tous vos services streaming haute résolution.'],
    },
    {
      id: 'lumin-d2',
      name: 'Lumin D2',
      price: 2290,
      levels: ['equilibre'],
      usages: ['audiophile'],
      description: 'Lecteur réseau double DAC Wolfson à alimentation linéaire.',
      highlights: ['DSD natif', 'Up-sampling configurable', 'Application soignée'],
      synergy: ['Apporte douceur et détails aux enregistrements numériques.'],
    },
    {
      id: 'aurender-a200',
      name: 'Aurender A200',
      price: 6500,
      levels: ['prestige'],
      usages: ['audiophile'],
      description: 'Streamer avec stockage interne 2 To et écran couleur.',
      highlights: ['Double horloge femto', 'Application Conductor', 'Sorties XLR'],
      synergy: ['Combine simplicité d’usage et restitution analogique.'],
    },
    {
      id: 'nvidia-shield-pro',
      name: 'Nvidia Shield TV Pro + Plex Premium',
      price: 349,
      levels: ['decouverte'],
      usages: ['home_cinema'],
      description: 'Lecteur vidéo 4K HDR pour streaming Atmos.',
      highlights: ['AI Upscaling', 'Dolby Vision & Atmos', 'Compatibilité domotique'],
      synergy: ['Accède rapidement à tout votre contenu cinéma en 4K.'],
    },
    {
      id: 'zappiti-neo',
      name: 'Zappiti Neo',
      price: 1399,
      levels: ['equilibre'],
      usages: ['home_cinema'],
      description: 'Lecteur média 4K HDR10+ avec double baie pour NAS.',
      highlights: ['Gestion vidéothèque', 'Dolby Vision', 'Sortie HDMI double'],
      synergy: ['Idéal pour une bibliothèque cinéma locale et un rendu spectaculaire.'],
    },
    {
      id: 'kaleidescape-strato',
      name: 'Kaleidescape Strato C',
      price: 5490,
      levels: ['prestige'],
      usages: ['home_cinema'],
      description: 'Lecteur cinéma téléchargeant des masters 4K sans compression.',
      highlights: ['Bitrate jusqu’à 100 Mbps', 'Audio lossless', 'Catalogue premium'],
      synergy: ['Offre la meilleure qualité vidéo disponible à domicile.'],
    },
    {
      id: 'focusrite-clarett',
      name: 'Focusrite Clarett+ 4Pre',
      price: 999,
      levels: ['decouverte'],
      usages: ['studio'],
      description: 'Interface USB-C 18 entrées pour home-studio exigeant.',
      highlights: ['Préamplis Air', 'Monitoring faible latence', 'Sorties ADAT'],
      synergy: ['Fournit une base polyvalente pour enregistrer et mixer.'],
    },
    {
      id: 'universal-audio-apollo-x6',
      name: 'Universal Audio Apollo x6',
      price: 3399,
      levels: ['equilibre'],
      usages: ['studio'],
      description: 'Interface Thunderbolt avec DSP UAD HEXA.',
      highlights: ['Convertisseurs 129 dB', 'Deux préamplis Unison', 'Surround 5.1'],
      synergy: ['Permet de mixer en temps réel avec les plug-ins UAD.'],
    },
    {
      id: 'antelope-galaxy32',
      name: 'Antelope Galaxy 32 Synergy Core',
      price: 5699,
      levels: ['prestige'],
      usages: ['studio'],
      description: 'Interface réseau 32 canaux avec DSP et horloge de précision.',
      highlights: ['Thunderbolt & Dante', 'Horloge 64-bit AFC', 'DSP FPGA'],
      synergy: ['S’adresse aux studios hybrides nécessitant flexibilité et qualité maître.'],
    },
  ],
  headphones: [
    {
      id: 'meze-109-pro',
      name: 'Meze 109 Pro',
      price: 899,
      levels: ['decouverte'],
      usages: ['audiophile'],
      description: 'Casque ouvert dynamique en noyer, facile à alimenter.',
      highlights: ['Transducteur 50 mm', 'Fabrication roumaine', 'Confort longue durée'],
      synergy: ['Parfait pour compléter une écoute salon sans déranger.'],
    },
    {
      id: 'focal-clear-mg',
      name: 'Focal Clear MG',
      price: 1499,
      levels: ['equilibre'],
      usages: ['audiophile', 'studio'],
      description: 'Casque ouvert en magnésium à grande dynamique.',
      highlights: ['Fabriqué en France', 'Câbles interchangeables', 'Signature légèrement chaude'],
      synergy: ['Retranscrit fidèlement la scène pour analyser vos mix.'],
    },
    {
      id: 'audeze-lcd5',
      name: 'Audeze LCD-5',
      price: 4999,
      levels: ['prestige'],
      usages: ['audiophile', 'studio'],
      description: 'Casque planaire flagship à distorsion ultra faible.',
      highlights: ['Membrane nano-scale', 'Serre-tête carbone', 'Made in USA'],
      synergy: ['Met en valeur les moindres micro-détails d’enregistrements haut de gamme.'],
    },
    {
      id: 'beyerdynamic-dt1990',
      name: 'Beyerdynamic DT 1990 Pro',
      price: 649,
      levels: ['decouverte'],
      usages: ['studio'],
      description: 'Casque de monitoring ouvert 250 Ω livré avec deux signatures de pads.',
      highlights: ['Fabriqué en Allemagne', 'Grande précision', 'Pads interchangeables'],
      synergy: ['Référence en mixage pour repérer sifflantes et balances.'],
    },
    {
      id: 'sennheiser-hd660s2',
      name: 'Sennheiser HD 660S2',
      price: 599,
      levels: ['decouverte', 'equilibre'],
      usages: ['audiophile', 'studio'],
      description: 'Casque ouvert revu avec graves renforcés et impédance 300 Ω.',
      highlights: ['Made in Ireland', 'Câble symétrique', 'Signature naturelle'],
      synergy: ['S’accorde parfaitement avec les DAC/Ampli casque haut de gamme.'],
    },
    {
      id: 'sony-mdr-hw700',
      name: 'Sony MDR-HW700DS',
      price: 499,
      levels: ['decouverte'],
      usages: ['home_cinema'],
      description: 'Casque sans fil 9.1 canaux avec processeur surround.',
      highlights: ['Trois modes cinéma', 'Transmetteur HDMI', 'Audio haute résolution'],
      synergy: ['Immersion cinéma tard le soir sans déranger la famille.'],
    },
    {
      id: 'sennheiser-rs195',
      name: 'Sennheiser RS 195',
      price: 549,
      levels: ['equilibre'],
      usages: ['home_cinema'],
      description: 'Casque RF hi-fi avec profils audio personnalisables.',
      highlights: ['Portée 100 m', 'Réglages clairs/aigus', 'Station de charge élégante'],
      synergy: ['Permet de suivre dialogues et détails à volume réduit.'],
    },
    {
      id: 'focal-bathys',
      name: 'Focal Bathys Dolby Atmos Edition',
      price: 799,
      levels: ['equilibre', 'prestige'],
      usages: ['home_cinema', 'audiophile'],
      description: 'Casque Bluetooth hi-fi avec ANC et mode USB-DAC 24/192.',
      highlights: ['Technologie M-dome', 'Dolby Atmos intégré', 'Fabrication française'],
      synergy: ['Combine portabilité et restitution spatiale immersive.'],
    },
  ],
  treatment: [
    {
      id: 'vicoustic-vmt-set',
      name: 'Vicoustic VMT Starter Kit',
      price: 899,
      levels: ['decouverte'],
      usages: ['audiophile', 'home_cinema'],
      description: 'Jeu de panneaux muraux design pour traiter les premières réflexions.',
      highlights: ['Installation facile', 'Finitions multiples', 'Classement feu B-s2'],
      synergy: ['Stabilise l’image stéréo sans dénaturer la décoration.'],
    },
    {
      id: 'gik-impression',
      name: 'GIK Acoustics Impression Pack',
      price: 1490,
      levels: ['equilibre'],
      usages: ['audiophile', 'home_cinema'],
      description: 'Bass traps et diffuseurs pour pièces de 20 à 35 m².',
      highlights: ['Diffusion 2D', 'Absorption large bande', 'Customisation visuelle'],
      synergy: ['Apporte un grave lisible et une scène précise dans un salon.'],
    },
    {
      id: 'trinnov-st2',
      name: 'Trinnov ST2-HiFi + kit calibration',
      price: 4190,
      levels: ['prestige'],
      usages: ['audiophile', 'home_cinema'],
      description: 'Processeur de correction de pièce 4 canaux avec micro 3D.',
      highlights: ['Optimisation active', 'Courbes sur-mesure', 'Scène tridimensionnelle'],
      synergy: ['Corrige les modes de pièce sans ajout de traitements visibles.'],
    },
    {
      id: 'sonarworks-reference',
      name: 'Sonarworks SoundID Reference + micro',
      price: 299,
      levels: ['decouverte'],
      usages: ['studio'],
      description: 'Calibration logicielle pour enceintes et casques.',
      highlights: ['Profil casque inclus', 'Plug-ins DAW', 'Courbe cible personnalisable'],
      synergy: ['Assure une neutralité fiable entre studio et home studio.'],
    },
    {
      id: 'gik-244-bass',
      name: 'GIK 244 Bass Trap Bundle',
      price: 1099,
      levels: ['equilibre'],
      usages: ['studio'],
      description: 'Lot de pièges à basses épais pour contrôler les résonances.',
      highlights: ['Absorption jusqu’à 40 Hz', 'Cadres rigides', 'Choix de tissus'],
      synergy: ['Permet de maîtriser le grave dans des pièces non traitées.'],
    },
    {
      id: 'psi-avaa',
      name: 'PSI Audio AVAA C20',
      price: 4940,
      levels: ['prestige'],
      usages: ['studio'],
      description: 'Absorbeur actif de basses équivalent à un traitement massif.',
      highlights: ['Plug & Play', 'Sans DSP', 'Réduction modes stationnaires'],
      synergy: ['Libère la zone d’écoute des ondes stationnaires sans travaux.'],
    },
  ],
};

const MIN_BUDGET = 2000;
const MAX_BUDGET = 15000;
const BUDGET_STEP = 250;

const formatPrice = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

const getBudgetLevelFromValue = (value: number): BudgetLevelId => {
  if (value < 4000) return 'decouverte';
  if (value < 8000) return 'equilibre';
  return 'prestige';
};

const getBudgetMeta = (level: BudgetLevelId) =>
  budgetLevels.find((item) => item.id === level) ?? budgetLevels[0];

const getRecommendedSelection = (usage: UsageId, level: BudgetLevelId) => {
  return categories.reduce((acc, category) => {
    const options = equipmentCatalogue[category.id];
    const usageMatch = options.find(
      (option) => option.usages.includes(usage) && option.levels.includes(level),
    );
    const levelMatch = options.find((option) => option.levels.includes(level));
    const fallback = options[0];

    acc[category.id] = (usageMatch ?? levelMatch ?? fallback).id;
    return acc;
  }, {} as Record<CategoryId, string>);
};

export function HiFiConfigurator() {
  const [selectedUsage, setSelectedUsage] = useState<UsageId>('audiophile');
  const [budget, setBudget] = useState<number>(6000);

  const activeBudgetLevel = useMemo(() => getBudgetLevelFromValue(budget), [budget]);
  const activeBudgetMeta = getBudgetMeta(activeBudgetLevel);
  const recommendedSelection = useMemo(
    () => getRecommendedSelection(selectedUsage, activeBudgetLevel),
    [selectedUsage, activeBudgetLevel],
  );

  const [selectedItems, setSelectedItems] = useState<Record<CategoryId, string>>(
    () => recommendedSelection,
  );

  useEffect(() => {
    setSelectedItems(recommendedSelection);
  }, [recommendedSelection]);

  const activeUsage = usageOptions.find((option) => option.id === selectedUsage) ?? usageOptions[0];

  const selectedProducts = useMemo(
    () =>
      categories.map((category) => {
        const option = equipmentCatalogue[category.id].find(
          (item) => item.id === selectedItems[category.id],
        );
        return { category, option };
      }),
    [selectedItems],
  );

  const totalPrice = useMemo(
    () =>
      selectedProducts.reduce((sum, entry) => {
        if (!entry.option) return sum;
        return sum + entry.option.price;
      }, 0),
    [selectedProducts],
  );

  const synergyNotes = useMemo(() => {
    const notes = new Set<string>();
    selectedProducts.forEach((entry) => {
      entry.option?.synergy.forEach((note) => notes.add(note));
    });
    return Array.from(notes).slice(0, 6);
  }, [selectedProducts]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 pb-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[-20%] h-[520px] bg-gradient-to-b from-emerald-400/15 via-slate-900/0 to-slate-950/0 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-16 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_40px_120px_-50px_rgba(16,185,129,0.55)] sm:p-12">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
                <Sparkles className="size-4" />
                Configurateur hi-fi sur-mesure
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Construisez un système hi-fi parfaitement ajusté à vos envies
                </h1>
                <p className="max-w-3xl text-lg text-slate-200">
                  Explorez des recommandations cohérentes et évolutives : en quelques clics, obtenez une sélection d’équipements pensés pour votre usage, votre pièce et votre budget.
                </p>
              </div>
              <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="font-medium text-white">Scénarios guidés</p>
                  <p className="mt-1 text-slate-300">
                    Trois univers d’écoute inspirés des demandes les plus fréquentes : audiophile, studio et home cinéma.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="font-medium text-white">Budget maîtrisé</p>
                  <p className="mt-1 text-slate-300">
                    Ajustez un budget réaliste et découvrez le meilleur équilibre performance / plaisir.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="font-medium text-white">Synthèse claire</p>
                  <p className="mt-1 text-slate-300">
                    Récapitulatif détaillé, astuces acoustiques et prochaines étapes personnalisées.
                  </p>
                </div>
              </div>
            </div>
            <div className="shrink-0 rounded-3xl border border-emerald-400/40 bg-emerald-400/10 p-6 text-sm text-emerald-100 sm:max-w-xs">
              <p className="text-xs uppercase tracking-wide text-emerald-200">Focus actuel</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeUsage.title}</p>
              <p className="mt-2 text-emerald-100/90">{activeUsage.tagline}</p>
              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-200">Budget cible</p>
                  <p className="text-2xl font-semibold text-white">{formatPrice(budget)}</p>
                  <p className="text-xs text-emerald-100/80">{activeBudgetMeta.label}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-200">Objectif</p>
                  <p className="text-sm text-emerald-100/90">{activeBudgetMeta.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Étape 1</span>
              <h2 className="mt-2 text-2xl font-semibold text-white">Choisissez votre univers d’écoute</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Chaque mode ajuste les recommandations pour respecter vos contraintes de pièce, de connectique et de rendu sonore.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {usageOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.id === selectedUsage;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedUsage(option.id)}
                  className={cn(
                    'group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-left transition hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10',
                    isActive &&
                      'border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/20 backdrop-blur',
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full border border-white/10 bg-white/5 p-3 text-emerald-200">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-emerald-200">
                        {isActive ? 'Sélectionné' : 'Explorer'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{option.title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{option.description}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-slate-300">
                    {option.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 size-4 flex-none text-emerald-300" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Étape 2</span>
              <h2 className="mt-2 text-2xl font-semibold text-white">Calibrez votre budget</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Faites glisser le curseur pour visualiser les gammes de produits correspondantes. Les recommandations s’adaptent automatiquement.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-6 py-4 text-right text-emerald-100">
              <p className="text-xs uppercase tracking-wide text-emerald-200">Niveau</p>
              <p className="text-lg font-semibold text-white">{activeBudgetMeta.label}</p>
              <p className="text-sm text-emerald-100/90">{activeBudgetMeta.description}</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={BUDGET_STEP}
              value={budget}
              onChange={(event) => setBudget(Number.parseInt(event.target.value, 10))}
              className="w-full accent-emerald-400"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{formatPrice(MIN_BUDGET)}</span>
              <span>{formatPrice((MIN_BUDGET + MAX_BUDGET) / 2)}</span>
              <span>{formatPrice(MAX_BUDGET)}</span>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Étape 3</span>
            <h2 className="mt-2 text-2xl font-semibold text-white">Affinez chaque maillon</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Chaque proposition est sélectionnée pour fonctionner en synergie avec le reste du système. Vous pouvez personnaliser les éléments tout en conservant une cohérence globale.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const options = equipmentCatalogue[category.id];

              return (
                <div
                  key={category.id}
                  className="flex h-full flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-white/5 p-2 text-emerald-200">
                          <Icon className="size-4" />
                        </span>
                        <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{category.description}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {options.map((option) => {
                      const isSelected = selectedItems[category.id] === option.id;
                      const isRecommended = recommendedSelection[category.id] === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [category.id]: option.id,
                            }))
                          }
                          className={cn(
                            'w-full rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left transition hover:border-emerald-300/60 hover:bg-slate-900/70',
                            isSelected && 'border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/10',
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-white">{option.name}</p>
                              <p className="mt-1 text-sm text-slate-300">{option.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-emerald-200">{formatPrice(option.price)}</p>
                              <p className="text-xs uppercase tracking-wide text-emerald-200">
                                {isSelected ? 'Sélectionné' : isRecommended ? 'Recommandé' : 'Option compatible'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                            {option.highlights.map((highlight) => (
                              <span
                                key={highlight}
                                className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-8 rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Étape 4</span>
              <h2 className="mt-2 text-2xl font-semibold text-white">Synthèse de votre configuration</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Voici la combinaison optimale selon vos critères. Elle constitue une base solide que vous pouvez partager ou affiner avec un conseiller spécialisé.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-6 py-4 text-right text-emerald-100">
              <p className="text-xs uppercase tracking-wide text-emerald-200">Budget estimatif</p>
              <p className="text-3xl font-semibold text-white">{formatPrice(totalPrice)}</p>
              <p className="text-xs text-emerald-100/90">Hors installation et câblage sur mesure</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {selectedProducts.map(({ category, option }) => {
              if (!option) {
                return null;
              }

              return (
                <div
                  key={category.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-slate-400">{category.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{option.name}</p>
                    </div>
                    <p className="text-base font-semibold text-emerald-200">{formatPrice(option.price)}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{option.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                    {option.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
            <h3 className="text-lg font-semibold text-white">Pourquoi cette sélection fonctionne</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              {synergyNotes.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 flex-none text-emerald-300" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              Installation premium disponible
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              Simulation acoustique 3D sur demande
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              Possibilité de financement en 10 fois
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
