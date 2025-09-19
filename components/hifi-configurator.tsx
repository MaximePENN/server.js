'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Tier =
  | 'entrée'
  | 'milieu'
  | 'supérieur'
  | 'haut'
  | 'référence'
  | 'flagship';

type SourceCategory = 'streamer' | 'cd' | 'vinyl';

type SpeakerType = 'colonnes' | 'bibliotheques';

interface TieredItem {
  id: string;
  price?: number;
  tier?: Tier;
}

interface Amplifier extends TieredItem {
  brand: string;
  name: string;
  price: number;
  power: number | null;
  allInOne: boolean;
  hasPhonoStage: boolean;
  signature: string;
}

interface Source extends TieredItem {
  brand: string;
  name: string;
  price: number;
  signature: string;
  category: SourceCategory;
}

interface Speaker extends TieredItem {
  brand: string;
  name: string;
  price: number;
  signature: string;
  type: SpeakerType;
}

interface Cable extends TieredItem {
  brand: string;
  name: string;
  price?: number;
  pricePerMeter?: number;
  signature: string;
}

const TIERS: Array<Tier> = [
  'entrée',
  'milieu',
  'supérieur',
  'haut',
  'référence',
  'flagship',
];
const AMPLIFIERS: Array<Amplifier> = [
  {
    id: 'rega-io',
    brand: 'Rega',
    name: 'iO',
    price: 589,
    power: 30,
    allInOne: false,
    hasPhonoStage: true,
    signature: 'chaleureux, musical',
  },
  {
    id: 'atoll-in-80',
    brand: 'Atoll',
    name: 'IN 80',
    price: 1000,
    power: 80,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'neutre, rapide',
  },
  {
    id: 'naim-nait-5si',
    brand: 'Naim',
    name: 'NAIT 5si',
    price: 1799,
    power: 60,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'rythmique, vivant',
  },
  {
    id: 'naim-uniti-atom',
    brand: 'Naim',
    name: 'Uniti Atom',
    price: 2599,
    power: 40,
    allInOne: true,
    hasPhonoStage: false,
    signature: 'rythmique, précis',
  },
  {
    id: 'atoll-in-300-evo',
    brand: 'Atoll',
    name: 'IN 300 EVO',
    price: 2700,
    power: 150,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'neutre, énergique',
  },
  {
    id: 'naim-nait-xs3',
    brand: 'Naim',
    name: 'NAIT XS 3',
    price: 2999,
    power: 70,
    allInOne: false,
    hasPhonoStage: true,
    signature: 'dynamique, chaleureux',
  },
  {
    id: 'moonriver-404',
    brand: 'Moonriver',
    name: '404',
    price: 3499,
    power: 50,
    allInOne: false,
    hasPhonoStage: true,
    signature: 'organique, musical',
  },
  {
    id: 'rega-aethos',
    brand: 'Rega',
    name: 'AETHOS',
    price: 4290,
    power: 125,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'charnu, transparent',
  },
  {
    id: 'naim-uniti-nova',
    brand: 'Naim',
    name: 'Uniti Nova',
    price: 4999,
    power: 80,
    allInOne: true,
    hasPhonoStage: false,
    signature: 'autorité, fluidité',
  },
  {
    id: 'moonriver-404-reference',
    brand: 'Moonriver',
    name: '404 Référence',
    price: 4999,
    power: 50,
    allInOne: false,
    hasPhonoStage: true,
    signature: 'soyeux, subtil',
  },
  {
    id: 'copland-cta-407',
    brand: 'Copland',
    name: 'CTA 407',
    price: 6990,
    power: 50,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'lampe: soyeux, ample',
  },
  {
    id: 'audio-analogue-maestro',
    brand: 'Audio Analogue',
    name: 'MAESTRO',
    price: 9950,
    power: 150,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'plein, raffiné',
  },
  {
    id: 'gryphon-diablo-120',
    brand: 'Gryphon',
    name: 'Diablo 120',
    price: 14250,
    power: 120,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'puissance, contraste',
  },
  {
    id: 'devialet-astra',
    brand: 'Devialet',
    name: 'ASTRA',
    price: 16000,
    power: null,
    allInOne: true,
    hasPhonoStage: false,
    signature: 'très précis, moderne',
  },
  {
    id: 'gryphon-diablo-333',
    brand: 'Gryphon',
    name: 'Diablo 333',
    price: 25950,
    power: 333,
    allInOne: false,
    hasPhonoStage: false,
    signature: 'autorité, résolution',
  },
];
const STREAMERS: Array<Source> = [
  {
    id: 'bluesound-node-nano',
    brand: 'Bluesound',
    name: 'NODE NANO',
    price: 399,
    signature: 'neutre, pratique',
    category: 'streamer',
  },
  {
    id: 'bluesound-node',
    brand: 'Bluesound',
    name: 'NODE',
    price: 599,
    signature: 'équilibré, vivant',
    category: 'streamer',
  },
  {
    id: 'lindemann-limetree-network-ii',
    brand: 'Lindemann',
    name: 'Limetree Network II',
    price: 995,
    signature: 'doux, aéré',
    category: 'streamer',
  },
  {
    id: 'atoll-st-200',
    brand: 'Atoll',
    name: 'ST 200',
    price: 2000,
    signature: 'neutre, détaillé',
    category: 'streamer',
  },
  {
    id: 'atoll-st-300',
    brand: 'Atoll',
    name: 'ST 300',
    price: 3000,
    signature: 'neutre, rapide',
    category: 'streamer',
  },
  {
    id: 'naim-nd5-xs2',
    brand: 'Naim',
    name: 'ND5 XS 2',
    price: 3500,
    signature: 'rythmique, fluide',
    category: 'streamer',
  },
  {
    id: 'lindemann-musicbook-source-ii',
    brand: 'Lindemann',
    name: 'Musicbook Source II',
    price: 5500,
    signature: 'raffiné, soyeux',
    category: 'streamer',
  },
  {
    id: 'naim-nss-333',
    brand: 'Naim',
    name: 'NSS 333',
    price: 9000,
    signature: 'autorité, précision',
    category: 'streamer',
  },
  {
    id: 'esoteric-n-05xd',
    brand: 'Esoteric',
    name: 'N-05XD',
    price: 13000,
    signature: 'analytique, rapide',
    category: 'streamer',
  },
  {
    id: 'esoteric-n-01xd-se',
    brand: 'Esoteric',
    name: 'N-01XD SE',
    price: 26000,
    signature: 'résolution, silence',
    category: 'streamer',
  },
  {
    id: 'naim-nd-555',
    brand: 'Naim',
    name: 'ND 555',
    price: 30000,
    signature: 'organique, naturel',
    category: 'streamer',
  },
];
const CD_PLAYERS: Array<Source> = [
  {
    id: 'atoll-cd-50',
    brand: 'Atoll',
    name: 'CD 50',
    price: 700,
    signature: 'neutre, dynamique',
    category: 'cd',
  },
  {
    id: 'atoll-cd-80',
    brand: 'Atoll',
    name: 'CD 80',
    price: 900,
    signature: 'neutre, précis',
    category: 'cd',
  },
  {
    id: 'atoll-cd-100-evo',
    brand: 'Atoll',
    name: 'CD 100 EVO',
    price: 1200,
    signature: 'équilibré, musical',
    category: 'cd',
  },
  {
    id: 'naim-cd5si',
    brand: 'Naim',
    name: 'CD5si',
    price: 1500,
    signature: 'rythmique, punchy',
    category: 'cd',
  },
  {
    id: 'rega-saturn-mkiii',
    brand: 'Rega',
    name: 'Saturn MKIII',
    price: 3000,
    signature: 'chaleureux, analogique',
    category: 'cd',
  },
  {
    id: 'atoll-cd-400-evo',
    brand: 'Atoll',
    name: 'CD 400 EVO',
    price: 4000,
    signature: 'résolution, énergie',
    category: 'cd',
  },
  {
    id: 'esoteric-k-05xd',
    brand: 'Esoteric',
    name: 'K-05XD',
    price: 9800,
    signature: 'analytique, micro-détails',
    category: 'cd',
  },
  {
    id: 'esoteric-k-01xd',
    brand: 'Esoteric',
    name: 'K-01XD',
    price: 28000,
    signature: 'ultra défini, rigoureux',
    category: 'cd',
  },
  {
    id: 'gryphon-ethos',
    brand: 'Gryphon',
    name: 'ETHOS',
    price: 39000,
    signature: 'corpulent, analogique',
    category: 'cd',
  },
];
const TURNTABLES: Array<Source> = [
  {
    id: 'rega-planar-1',
    brand: 'Rega',
    name: 'Planar 1',
    price: 439,
    signature: 'chaleureux, fluide',
    category: 'vinyl',
  },
  {
    id: 'rega-planar-2',
    brand: 'Rega',
    name: 'Planar 2',
    price: 790,
    signature: 'musical, doux',
    category: 'vinyl',
  },
  {
    id: 'rega-planar-3',
    brand: 'Rega',
    name: 'Planar 3',
    price: 1050,
    signature: 'équilibré, vivant',
    category: 'vinyl',
  },
  {
    id: 'rega-planar-6',
    brand: 'Rega',
    name: 'Planar 6',
    price: 2090,
    signature: 'résolutif, naturel',
    category: 'vinyl',
  },
  {
    id: 'rega-planar-8',
    brand: 'Rega',
    name: 'Planar 8',
    price: 3489,
    signature: 'translucide, rapide',
    category: 'vinyl',
  },
  {
    id: 'vertere-dg-1-x',
    brand: 'Vertere',
    name: 'DG-1 X',
    price: 4350,
    signature: 'aéré, précis',
    category: 'vinyl',
  },
  {
    id: 'vertere-mg-1',
    brand: 'Vertere',
    name: 'MG-1',
    price: 13700,
    signature: 'raffiné, soyeux',
    category: 'vinyl',
  },
  {
    id: 'vertere-sg-1',
    brand: 'Vertere',
    name: 'SG-1',
    price: 30565,
    signature: 'référence, silence',
    category: 'vinyl',
  },
];
const BOOKSHELF_SPEAKERS: Array<Speaker> = [
  {
    id: 'acoustic-energy-ae100',
    brand: 'Acoustic Energy',
    name: 'AE100',
    price: 499,
    signature: 'vive, compacte',
    type: 'bibliotheques',
  },
  {
    id: 'rega-kyte',
    brand: 'Rega',
    name: 'Kyte',
    price: 589,
    signature: 'rythmique, naturelle',
    type: 'bibliotheques',
  },
  {
    id: 'acoustic-energy-ae300',
    brand: 'Acoustic Energy',
    name: 'AE300',
    price: 890,
    signature: 'équilibrée, précise',
    type: 'bibliotheques',
  },
  {
    id: 'jern-11',
    brand: 'JERN',
    name: '11',
    price: 1750,
    signature: 'dense, articulée',
    type: 'bibliotheques',
  },
  {
    id: 'apertura-swing',
    brand: 'AperturA',
    name: 'Swing',
    price: 2200,
    signature: 'raffinée, agile',
    type: 'bibliotheques',
  },
  {
    id: 'totem-bison-monitor',
    brand: 'Totem',
    name: 'Bison Monitor',
    price: 2590,
    signature: 'vivante, expansive',
    type: 'bibliotheques',
  },
  {
    id: 'jern-11-s',
    brand: 'JERN',
    name: '11 S',
    price: 2690,
    signature: 'dense, soyeuse',
    type: 'bibliotheques',
  },
  {
    id: 'harbeth-p3esr-xd',
    brand: 'Harbeth',
    name: 'P3ESR XD',
    price: 2900,
    signature: 'chaleureuse, intime',
    type: 'bibliotheques',
  },
  {
    id: 'totem-signature-one',
    brand: 'Totem',
    name: 'Signature One',
    price: 3899,
    signature: 'texture, profondeur',
    type: 'bibliotheques',
  },
  {
    id: 'borresen-x1',
    brand: 'Børresen',
    name: 'X1',
    price: 5000,
    signature: 'aérée, raffinée',
    type: 'bibliotheques',
  },
  {
    id: 'harbeth-hl5-plus-xd2',
    brand: 'Harbeth',
    name: 'HL5 Plus XD2',
    price: 5900,
    signature: 'ample, soyeuse',
    type: 'bibliotheques',
  },
  {
    id: 'totem-element-fire-v2',
    brand: 'Totem',
    name: 'Element Fire V2',
    price: 8199,
    signature: 'rapide, holographique',
    type: 'bibliotheques',
  },
  {
    id: 'tad-micro-evo-one',
    brand: 'TAD',
    name: 'Micro EVO One',
    price: 15000,
    signature: 'précise, immersive',
    type: 'bibliotheques',
  },
  {
    id: 'tad-compact-evo-one',
    brand: 'TAD',
    name: 'Compact Evo One',
    price: 35000,
    signature: 'référence, majestueuse',
    type: 'bibliotheques',
  },
  {
    id: 'tad-compact-reference',
    brand: 'TAD',
    name: 'Compact Reference',
    price: 84000,
    signature: 'flagship, infiniment lisible',
    type: 'bibliotheques',
  },
];
const FLOORSTANDING_SPEAKERS: Array<Speaker> = [
  {
    id: 'acoustic-energy-ae109',
    brand: 'Acoustic Energy',
    name: 'AE109',
    price: 999,
    signature: 'ample, facile',
    type: 'colonnes',
  },
  {
    id: 'acoustic-energy-ae120',
    brand: 'Acoustic Energy',
    name: 'AE120',
    price: 1399,
    signature: 'énergique, engageante',
    type: 'colonnes',
  },
  {
    id: 'acoustic-energy-ae309',
    brand: 'Acoustic Energy',
    name: 'AE309',
    price: 1790,
    signature: 'rapide, articulée',
    type: 'colonnes',
  },
  {
    id: 'rega-aya',
    brand: 'Rega',
    name: 'AYA',
    price: 1999,
    signature: 'rythmique, organique',
    type: 'colonnes',
  },
  {
    id: 'totem-arro',
    brand: 'Totem',
    name: 'ARRO',
    price: 2299,
    signature: 'vive, fluide',
    type: 'colonnes',
  },
  {
    id: 'acoustic-energy-ae509',
    brand: 'Acoustic Energy',
    name: 'AE509',
    price: 2950,
    signature: 'raffinée, analytique',
    type: 'colonnes',
  },
  {
    id: 'apertura-sensa',
    brand: 'AperturA',
    name: 'Sensa',
    price: 3150,
    signature: 'douce, charpentée',
    type: 'colonnes',
  },
  {
    id: 'totem-bison-tower',
    brand: 'Totem',
    name: 'Bison Tower',
    price: 3399,
    signature: 'ouverte, charismatique',
    type: 'colonnes',
  },
  {
    id: 'apertura-stella',
    brand: 'AperturA',
    name: 'Stella',
    price: 4350,
    signature: 'soyeuse, contrastée',
    type: 'colonnes',
  },
  {
    id: 'acoustic-energy-ae500',
    brand: 'Acoustic Energy',
    name: 'AE500',
    price: 4490,
    signature: 'transparente, rapide',
    type: 'colonnes',
  },
  {
    id: 'totem-bison-twin-tower',
    brand: 'Totem',
    name: 'Bison Twin Tower',
    price: 4499,
    signature: 'expressive, dense',
    type: 'colonnes',
  },
  {
    id: 'totem-forest',
    brand: 'Totem',
    name: 'Forest',
    price: 5999,
    signature: 'texturée, immersive',
    type: 'colonnes',
  },
  {
    id: 'apertura-armonia',
    brand: 'AperturA',
    name: 'Armonia',
    price: 6000,
    signature: 'harmonieuse, ample',
    type: 'colonnes',
  },
  {
    id: 'totem-tribe-tower',
    brand: 'Totem',
    name: 'Tribe Tower',
    price: 6299,
    signature: 'verticale, transparente',
    type: 'colonnes',
  },
  {
    id: 'apertura-forte',
    brand: 'AperturA',
    name: 'Forte',
    price: 7500,
    signature: 'impactante, détaillée',
    type: 'colonnes',
  },
  {
    id: 'borresen-x2',
    brand: 'Børresen',
    name: 'X2',
    price: 8000,
    signature: 'raffinée, ultra rapide',
    type: 'colonnes',
  },
  {
    id: 'totem-forest-signature',
    brand: 'Totem',
    name: 'Forest Signature',
    price: 8199,
    signature: 'dense, holographique',
    type: 'colonnes',
  },
  {
    id: 'apertura-edena',
    brand: 'AperturA',
    name: 'Edena',
    price: 8900,
    signature: 'luxuriante, fluide',
    type: 'colonnes',
  },
  {
    id: 'totem-wind',
    brand: 'Totem',
    name: 'Wind',
    price: 12999,
    signature: 'ample, cinématique',
    type: 'colonnes',
  },
  {
    id: 'egglestonworks-oso',
    brand: 'EgglestonWorks',
    name: 'Oso',
    price: 16300,
    signature: 'large, charpentée',
    type: 'colonnes',
  },
  {
    id: 'tad-evolution-one',
    brand: 'TAD',
    name: 'Evolution One',
    price: 17000,
    signature: 'précise, majestueuse',
    type: 'colonnes',
  },
  {
    id: 'apertura-adamante',
    brand: 'AperturA',
    name: 'Adamante',
    price: 17500,
    signature: 'sombre, nuancée',
    type: 'colonnes',
  },
  {
    id: 'totem-element-metal-v2',
    brand: 'Totem',
    name: 'Element Metal V2',
    price: 17799,
    signature: 'incisive, aérienne',
    type: 'colonnes',
  },
  {
    id: 'borresen-x6',
    brand: 'Børresen',
    name: 'X6',
    price: 20000,
    signature: 'colossale, agile',
    type: 'colonnes',
  },
  {
    id: 'apertura-enigma-mk3',
    brand: 'AperturA',
    name: 'Enigma MK III',
    price: 26500,
    signature: 'mystérieuse, profonde',
    type: 'colonnes',
  },
  {
    id: 'gryphon-eos-2',
    brand: 'Gryphon',
    name: 'EOS 2',
    price: 27350,
    signature: 'sombre, holographique',
    type: 'colonnes',
  },
  {
    id: 'gryphon-eos-5',
    brand: 'Gryphon',
    name: 'EOS 5',
    price: 59750,
    signature: 'monumentale, lumineuse',
    type: 'colonnes',
  },
  {
    id: 'gryphon-trident-ii',
    brand: 'Gryphon',
    name: 'Trident II',
    price: 143700,
    signature: 'absolue, sans contrainte',
    type: 'colonnes',
  },
  {
    id: 'tad-reference-one',
    brand: 'TAD',
    name: 'Reference One',
    price: 159000,
    signature: 'flagship, souveraine',
    type: 'colonnes',
  },
];
const CABLES: Array<Cable> = [
  {
    id: 'totem-tress-hp',
    brand: 'Totem',
    name: 'Tress HP',
    pricePerMeter: 29,
    signature: 'souple, énergique',
    tier: 'entrée',
  },
  {
    id: 'audioquest-rocket-11',
    brand: 'AudioQuest',
    name: 'Rocket 11',
    price: 379,
    signature: 'équilibré, doux',
    tier: 'milieu',
  },
  {
    id: 'audioquest-type-5',
    brand: 'AudioQuest',
    name: 'Type 5',
    price: 569,
    signature: 'dynamique, clair',
    tier: 'supérieur',
  },
  {
    id: 'audioquest-rocket-33',
    brand: 'AudioQuest',
    name: 'Rocket 33',
    price: 629,
    signature: 'précis, rapide',
    tier: 'haut',
  },
  {
    id: 'audioquest-type-9',
    brand: 'AudioQuest',
    name: 'Type 9',
    price: 789,
    signature: 'transparent, ample',
    tier: 'référence',
  },
  {
    id: 'audioquest-william-tell-zero',
    brand: 'AudioQuest',
    name: 'William Tell ZERO',
    price: 3099,
    signature: 'ultra défini, majestueux',
    tier: 'flagship',
  },
];

const SOURCES: Array<Source> = [...STREAMERS, ...CD_PLAYERS, ...TURNTABLES];

const SPEAKERS: Array<Speaker> = [...BOOKSHELF_SPEAKERS, ...FLOORSTANDING_SPEAKERS];
function tierFromPrice(price: number): Tier {
  if (price < 800) return 'entrée';
  if (price < 2000) return 'milieu';
  if (price < 5000) return 'supérieur';
  if (price < 12000) return 'haut';
  if (price < 30000) return 'référence';
  return 'flagship';
}

function getTier<T extends TieredItem>(item: T): Tier {
  if (item.tier) return item.tier;
  const fallbackPrice = item.price ?? 0;
  return tierFromPrice(fallbackPrice);
}

type RecommendationOptions = {
  allowAbove?: number;
  allowBelow?: number;
  limit?: number;
  targetPrice?: number;
};

type RecommendationAtLeastOptions = RecommendationOptions & {
  minCount?: number;
};

function pickRecommendedByTier<T extends TieredItem>(
  items: Array<T>,
  targetTier: Tier,
  options: RecommendationOptions = {},
): Array<T> {
  const { allowAbove = TIERS.length, allowBelow = TIERS.length, limit, targetPrice } = options;
  const targetIndex = TIERS.indexOf(targetTier);

  const filtered = items.filter((item) => {
    const tierIndex = TIERS.indexOf(getTier(item));
    if (tierIndex === -1) return false;
    if (tierIndex > targetIndex && tierIndex - targetIndex > allowAbove) return false;
    if (tierIndex < targetIndex && targetIndex - tierIndex > allowBelow) return false;
    return true;
  });

  const sorted = filtered.sort((a, b) => {
    const tierDiffA = Math.abs(TIERS.indexOf(getTier(a)) - targetIndex);
    const tierDiffB = Math.abs(TIERS.indexOf(getTier(b)) - targetIndex);
    if (tierDiffA !== tierDiffB) return tierDiffA - tierDiffB;

    if (typeof targetPrice === 'number') {
      const priceA = a.price ?? targetPrice;
      const priceB = b.price ?? targetPrice;
      const priceDiffA = Math.abs(priceA - targetPrice);
      const priceDiffB = Math.abs(priceB - targetPrice);
      if (priceDiffA !== priceDiffB) return priceDiffA - priceDiffB;
    }

    const priceA = a.price ?? 0;
    const priceB = b.price ?? 0;
    return priceA - priceB;
  });

  if (typeof limit === 'number') {
    return sorted.slice(0, limit);
  }

  return sorted;
}

function pickRecommendedByTierAtLeast<T extends TieredItem>(
  items: Array<T>,
  targetTier: Tier,
  options: RecommendationAtLeastOptions = {},
): Array<T> {
  const {
    allowAbove = 0,
    allowBelow = 0,
    minCount = 2,
    limit = 3,
    targetPrice,
  } = options;

  let currentAbove = allowAbove;
  let currentBelow = allowBelow;
  let expansionStep = 0;
  let result: Array<T> = [];
  const maxRange = TIERS.length;

  while (true) {
    result = pickRecommendedByTier(items, targetTier, {
      allowAbove: currentAbove,
      allowBelow: currentBelow,
      limit,
      targetPrice,
    });

    if (result.length >= minCount || (currentAbove >= maxRange && currentBelow >= maxRange)) {
      return result;
    }

    if (expansionStep % 2 === 0) {
      currentAbove = Math.min(currentAbove + 1, maxRange);
    } else {
      currentBelow = Math.min(currentBelow + 1, maxRange);
    }
    expansionStep += 1;
  }
}

function recommendHpCable(totalSansCable: number): string {
  if (totalSansCable < 3000) return 'totem-tress-hp';
  if (totalSansCable < 7000) return 'audioquest-rocket-11';
  if (totalSansCable < 12000) return 'audioquest-type-5';
  if (totalSansCable < 20000) return 'audioquest-rocket-33';
  if (totalSansCable < 35000) return 'audioquest-type-9';
  return 'audioquest-william-tell-zero';
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function brandAndName(item?: { brand: string; name: string } | null) {
  if (!item) return 'Non sélectionné';
  return `${item.brand} ${item.name}`;
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  );
}

const STEPS = [
  'Budget & pièce',
  'Amplification',
  'Source',
  'Enceintes',
  'Câble HP',
  'Résumé',
] as const;
export default function HifiConfigurator() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [budget, setBudget] = useState<number>(10000);
  const [roomSize, setRoomSize] = useState<number>(20);
  const [notes, setNotes] = useState<string>('');
  const [selectedAmpId, setSelectedAmpId] = useState<string | null>(null);
  const [sourceTab, setSourceTab] = useState<SourceCategory>('streamer');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedSpeakerType, setSelectedSpeakerType] = useState<SpeakerType | null>(null);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(null);
  const [cableLength, setCableLength] = useState<number>(4);
  const [selectedCableId, setSelectedCableId] = useState<string | null>(null);

  const selectedAmp = useMemo(
    () => AMPLIFIERS.find((amp) => amp.id === selectedAmpId) ?? null,
    [selectedAmpId],
  );
  const selectedSource = useMemo(
    () => SOURCES.find((source) => source.id === selectedSourceId) ?? null,
    [selectedSourceId],
  );
  const selectedSpeaker = useMemo(
    () => SPEAKERS.find((speaker) => speaker.id === selectedSpeakerId) ?? null,
    [selectedSpeakerId],
  );
  const selectedCable = useMemo(
    () => CABLES.find((cable) => cable.id === selectedCableId) ?? null,
    [selectedCableId],
  );

  const ampTier = selectedAmp ? getTier(selectedAmp) : 'milieu';
  const amplifierPrice = selectedAmp?.price ?? 0;
  const sourcePrice = selectedSource?.price ?? 0;
  const speakerPrice = selectedSpeaker?.price ?? 0;

  const totalSansCable = amplifierPrice + sourcePrice + speakerPrice;

  const recommendedCableId = useMemo(
    () => recommendHpCable(totalSansCable),
    [totalSansCable],
  );

  const cableCost = selectedCable
    ? selectedCable.pricePerMeter
      ? selectedCable.pricePerMeter * cableLength
      : selectedCable.price ?? 0
    : 0;

  const totalAvecCable = totalSansCable + cableCost;

  const currentSources = useMemo(
    () => SOURCES.filter((source) => source.category === sourceTab),
    [sourceTab],
  );

  const sourceRecommendations = useMemo(
    () =>
      pickRecommendedByTierAtLeast(currentSources, ampTier, {
        minCount: 2,
        limit: 3,
        targetPrice: amplifierPrice,
      }).map((item) => item.id),
    [ampTier, amplifierPrice, currentSources],
  );

  const speakersOfType = useMemo(
    () => SPEAKERS.filter((speaker) => speaker.type === selectedSpeakerType),
    [selectedSpeakerType],
  );

  const speakerRecommendations = useMemo(
    () =>
      pickRecommendedByTierAtLeast(speakersOfType, ampTier, {
        allowAbove: 1,
        allowBelow: 0,
        minCount: 2,
        limit: 3,
        targetPrice: amplifierPrice,
      }).map((item) => item.id),
    [ampTier, amplifierPrice, speakersOfType],
  );

  const canGoPrevious = currentStep > 0;
  const canGoNext = currentStep < STEPS.length - 1;

  const goToStep = (index: number) => {
    setCurrentStep(Math.min(Math.max(index, 0), STEPS.length - 1));
  };

  const nextStep = () => {
    if (canGoNext) {
      goToStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (canGoPrevious) {
      goToStep(currentStep - 1);
    }
  };

  const resetCableIfLengthChanges = (value: number) => {
    setCableLength(value);
  };

  const handleApplyCableRecommendation = () => {
    setSelectedCableId(recommendedCableId);
  };

  const handleExport = () => {
    const data = {
      budget,
      roomSize,
      notes,
      selections: {
        amplifier: selectedAmp
          ? {
              id: selectedAmp.id,
              name: brandAndName(selectedAmp),
              tier: getTier(selectedAmp),
              signature: selectedAmp.signature,
              price: selectedAmp.price,
            }
          : null,
        source: selectedSource
          ? {
              id: selectedSource.id,
              name: brandAndName(selectedSource),
              tier: getTier(selectedSource),
              signature: selectedSource.signature,
              price: selectedSource.price,
            }
          : null,
        speakers: selectedSpeaker
          ? {
              id: selectedSpeaker.id,
              name: brandAndName(selectedSpeaker),
              tier: getTier(selectedSpeaker),
              signature: selectedSpeaker.signature,
              price: selectedSpeaker.price,
            }
          : null,
        cable: selectedCable
          ? {
              id: selectedCable.id,
              name: brandAndName(selectedCable),
              tier: getTier(selectedCable),
              signature: selectedCable.signature,
              price:
                selectedCable.pricePerMeter
                  ? selectedCable.pricePerMeter * cableLength
                  : selectedCable.price ?? 0,
            }
          : null,
        cableLength,
      },
      recommendedCableId,
      total: totalAvecCable,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `config-hifi-${Date.now()}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const speakerTypeCards: Array<{
    type: SpeakerType;
    title: string;
    description: string;
  }> = [
    {
      type: 'colonnes',
      title: 'Colonnes',
      description: 'Impact et ampleur pour les pièces généreuses.',
    },
    {
      type: 'bibliotheques',
      title: 'Bibliothèques',
      description: 'Compacité, précision et intégration aisée.',
    },
  ];

  const sourceTabs: Array<SourceCategory> = ['streamer', 'cd', 'vinyl'];

  const recommendedCableModel = CABLES.find(
    (cable) => cable.id === recommendedCableId,
  );
  const isCableRecommendedChoice = selectedCableId === recommendedCableId;

  const summaryItems = [
    {
      key: 'amplifier',
      label: 'Amplificateur',
      value: brandAndName(selectedAmp),
      tier: selectedAmp ? getTier(selectedAmp) : null,
      signature: selectedAmp?.signature,
      price: selectedAmp?.price,
    },
    {
      key: 'source',
      label: 'Source',
      value: brandAndName(selectedSource),
      tier: selectedSource ? getTier(selectedSource) : null,
      signature: selectedSource?.signature,
      price: selectedSource?.price,
    },
    {
      key: 'speakers',
      label: 'Enceintes',
      value: brandAndName(selectedSpeaker),
      tier: selectedSpeaker ? getTier(selectedSpeaker) : null,
      signature: selectedSpeaker?.signature,
      price: selectedSpeaker?.price,
    },
    {
      key: 'cable',
      label: 'Câble HP',
      value: selectedCable ? brandAndName(selectedCable) : 'Non sélectionné',
      tier: selectedCable ? getTier(selectedCable) : null,
      signature: selectedCable?.signature,
      price: selectedCable
        ? selectedCable.pricePerMeter
          ? selectedCable.pricePerMeter * cableLength
          : selectedCable.price ?? 0
        : undefined,
      extra: selectedCable
        ? `Longueur : ${cableLength} m`
        : recommendedCableModel
          ? `Recommandation : ${brandAndName(recommendedCableModel)}`
          : undefined,
      isRecommended: isCableRecommendedChoice,
    },
  ];
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Budget & pièce</CardTitle>
              <CardDescription>
                Définissez vos contraintes pour guider les recommandations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="budget-input">Budget cible</Label>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex-1">
                    <Slider
                      value={[budget]}
                      min={1000}
                      max={60000}
                      step={500}
                      onValueChange={(value) =>
                        setBudget(
                          Math.min(Math.max(value[0] ?? 1000, 1000), 60000),
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="budget-input"
                      type="number"
                      min={1000}
                      max={60000}
                      step={500}
                      value={budget}
                      onChange={(event) =>
                        setBudget(
                          Math.min(
                            Math.max(Number(event.target.value) || 0, 1000),
                            60000,
                          ),
                        )
                      }
                      className="w-28"
                    />
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(budget)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="room-input">Surface de la pièce</Label>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex-1">
                    <Slider
                      value={[roomSize]}
                      min={8}
                      max={60}
                      step={1}
                      onValueChange={(value) =>
                        setRoomSize(Math.min(Math.max(value[0] ?? 8, 8), 60))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id="room-input"
                      type="number"
                      min={8}
                      max={60}
                      step={1}
                      value={roomSize}
                      onChange={(event) =>
                        setRoomSize(
                          Math.min(
                            Math.max(Number(event.target.value) || 0, 8),
                            60,
                          ),
                        )
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">m²</span>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Précisez vos attentes sonores, vos contraintes..."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Sélectionnez un amplificateur intégré. Les pastilles indiquent son niveau de gamme et ses capacités.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {AMPLIFIERS.map((amp) => {
                const isSelected = selectedAmpId === amp.id;
                const tierLabel = getTier(amp);
                return (
                  <Card
                    key={amp.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'cursor-pointer transition hover:shadow-md',
                      isSelected ? 'ring-2 ring-black' : 'ring-0',
                    )}
                    onClick={() => setSelectedAmpId(amp.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedAmpId(amp.id);
                      }
                    }}
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-semibold">
                          {brandAndName(amp)}
                        </CardTitle>
                        <Pill className="bg-zinc-100 text-zinc-700 capitalize">
                          {tierLabel}
                        </Pill>
                      </div>
                      <CardDescription>{amp.signature}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Pill className="bg-sky-100 text-sky-700">Intégré</Pill>
                        {amp.allInOne ? (
                          <Pill className="bg-violet-100 text-violet-700">
                            Tout-en-un
                          </Pill>
                        ) : null}
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(amp.price)}
                        </span>
                        <span>
                          Puissance : {amp.power ? `${amp.power} W` : '—'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <Tabs
              value={sourceTab}
              onValueChange={(value) => setSourceTab(value as SourceCategory)}
            >
              <TabsList className="grid w-full grid-cols-3">
                {sourceTabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="capitalize">
                    {tab === 'cd' ? 'CD' : tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {sourceTabs.map((tab) => {
                const list = SOURCES.filter((source) => source.category === tab);
                const recommendations =
                  tab === sourceTab
                    ? sourceRecommendations
                    : pickRecommendedByTierAtLeast(list, ampTier, {
                        minCount: 2,
                        limit: 3,
                        targetPrice: amplifierPrice,
                      }).map((item) => item.id);

                return (
                  <TabsContent key={tab} value={tab}>
                    {tab === 'vinyl' && selectedAmp && !selectedAmp.hasPhonoStage ? (
                      <div className="mb-4 flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-amber-900">
                        <AlertTriangle className="mt-1 size-5" />
                        <div>
                          <p className="text-sm font-semibold">Ajouter un préampli phono</p>
                          <p className="text-sm">
                            L’amplificateur sélectionné ne possède pas d’entrée phono intégrée.
                          </p>
                        </div>
                      </div>
                    ) : null}
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {list.map((source) => {
                        const isSelected = selectedSourceId === source.id;
                        const isRecommended = recommendations.includes(source.id);
                        const tierLabel = getTier(source);
                        return (
                          <Card
                            key={source.id}
                            role="button"
                            tabIndex={0}
                            className={cn(
                              'cursor-pointer transition hover:shadow-md',
                              isSelected ? 'ring-2 ring-black' : 'ring-0',
                              isRecommended ? 'border-emerald-200' : null,
                            )}
                            onClick={() => setSelectedSourceId(source.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSelectedSourceId(source.id);
                              }
                            }}
                          >
                            <CardHeader className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg font-semibold">
                                  {brandAndName(source)}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Pill className="bg-zinc-100 text-zinc-700 capitalize">
                                    {tierLabel}
                                  </Pill>
                                  {isRecommended ? (
                                    <Pill className="bg-emerald-100 text-emerald-700">
                                      Recommandé
                                    </Pill>
                                  ) : null}
                                </div>
                              </div>
                              <CardDescription>{source.signature}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">
                                {formatCurrency(source.price)}
                              </span>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {speakerTypeCards.map((card) => {
                const isActive = selectedSpeakerType === card.type;
                return (
                  <Card
                    key={card.type}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'h-full cursor-pointer transition hover:shadow-md',
                      isActive ? 'ring-2 ring-black' : 'ring-0',
                    )}
                    onClick={() => setSelectedSpeakerType(card.type)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedSpeakerType(card.type);
                      }
                    }}
                  >
                    <CardHeader>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
            {selectedSpeakerType ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {speakersOfType.map((speaker) => {
                  const isSelected = selectedSpeakerId === speaker.id;
                  const isRecommended = speakerRecommendations.includes(speaker.id);
                  const tierLabel = getTier(speaker);
                  return (
                    <Card
                      key={speaker.id}
                      role="button"
                      tabIndex={0}
                      className={cn(
                        'cursor-pointer transition hover:shadow-md',
                        isSelected ? 'ring-2 ring-black' : 'ring-0',
                        isRecommended ? 'border-emerald-200' : null,
                      )}
                      onClick={() => setSelectedSpeakerId(speaker.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedSpeakerId(speaker.id);
                        }
                      }}
                    >
                      <CardHeader className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg font-semibold">
                            {brandAndName(speaker)}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2">
                            <Pill className="bg-zinc-100 text-zinc-700 capitalize">
                              {tierLabel}
                            </Pill>
                            {isRecommended ? (
                              <Pill className="bg-emerald-100 text-emerald-700">
                                Recommandé
                              </Pill>
                            ) : null}
                          </div>
                        </div>
                        <CardDescription>{speaker.signature}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(speaker.price)}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Choisissez un type d’enceintes pour afficher les modèles recommandés.
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Longueur du câble</CardTitle>
                <CardDescription>
                  Ajustez la longueur nécessaire pour relier vos enceintes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex-1">
                    <Slider
                      value={[cableLength]}
                      min={2}
                      max={12}
                      step={1}
                      onValueChange={(value) =>
                        resetCableIfLengthChanges(
                          Math.min(Math.max(value[0] ?? 2, 2), 12),
                        )
                      }
                    />
                  </div>
                  <span className="text-lg font-semibold">
                    {cableLength} m
                  </span>
                </div>
              </CardContent>
            </Card>
            {recommendedCableModel ? (
              <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4" /> Câble recommandé
                </div>
                <p className="text-sm">
                  {brandAndName(recommendedCableModel)} équilibre idéalement un système d’une valeur de {formatCurrency(totalSansCable)}.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-fit"
                  onClick={handleApplyCableRecommendation}
                >
                  Appliquer la recommandation
                </Button>
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CABLES.map((cable) => {
                const isSelected = selectedCableId === cable.id;
                const isRecommended = cable.id === recommendedCableId;
                const tierLabel = getTier(cable);
                const unitLabel = cable.pricePerMeter
                  ? `${formatCurrency(cable.pricePerMeter)} / m`
                  : formatCurrency(cable.price ?? 0);
                const totalForLength = cable.pricePerMeter
                  ? cable.pricePerMeter * cableLength
                  : cable.price ?? 0;
                return (
                  <Card
                    key={cable.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'cursor-pointer transition hover:shadow-md',
                      isSelected ? 'ring-2 ring-black' : 'ring-0',
                      isRecommended ? 'border-emerald-300 bg-emerald-50/70' : null,
                    )}
                    onClick={() => setSelectedCableId(cable.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedCableId(cable.id);
                      }
                    }}
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-semibold">
                          {brandAndName(cable)}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill className="bg-zinc-100 text-zinc-700 capitalize">
                            {tierLabel}
                          </Pill>
                          {isRecommended ? (
                            <Pill className="bg-emerald-100 text-emerald-700">
                              Recommandé
                            </Pill>
                          ) : null}
                        </div>
                      </div>
                      <CardDescription>{cable.signature}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{unitLabel}</span>
                      <span>Total (longueur) : {formatCurrency(totalForLength)}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de départ</CardTitle>
                <CardDescription>
                  Rappel des informations fournies pour guider la configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-lg font-semibold">{formatCurrency(budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Surface</p>
                  <p className="text-lg font-semibold">{roomSize} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm text-foreground">
                    {notes ? notes : 'Aucune précision'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Résumé du système</CardTitle>
                <CardDescription>
                  Vérifiez la cohérence des associations et des signatures sonores.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summaryItems.map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      'rounded-lg border p-4',
                      item.isRecommended ? 'border-emerald-400 bg-emerald-50' : 'border-border',
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-base font-semibold text-foreground">
                          {item.value}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tier ? (
                          <Pill className="bg-zinc-100 text-zinc-700 capitalize">
                            {item.tier}
                          </Pill>
                        ) : null}
                        {item.isRecommended ? (
                          <Pill className="bg-emerald-100 text-emerald-700">
                            Recommandé
                          </Pill>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                      {item.signature ? <span>Signature : {item.signature}</span> : null}
                      {typeof item.price === 'number' ? (
                        <span>Prix : {formatCurrency(item.price)}</span>
                      ) : null}
                      {item.extra ? <span>{item.extra}</span> : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex flex-col justify-between gap-4 rounded-lg border bg-card p-6 shadow-sm md:flex-row md:items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total estimatif</p>
                <p className="text-2xl font-semibold">{formatCurrency(totalAvecCable)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.alert('Demande envoyée !')}
                >
                  Demander un devis
                </Button>
                <Button type="button" onClick={handleExport}>
                  <Download className="size-4" />
                  Exporter JSON
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configurateur Hi-Fi</h1>
            <p className="text-sm text-muted-foreground">
              Composez un système complet : amplification, source, enceintes et câble HP.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Étape {currentStep + 1} / {STEPS.length}
            <div className="text-base font-semibold text-foreground">
              {STEPS[currentStep]}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {STEPS.map((label, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <button
                key={label}
                type="button"
                onClick={() => goToStep(index)}
                className="flex flex-col items-center gap-2 text-xs font-medium focus:outline-none"
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full border-2 transition-colors',
                    isActive
                      ? 'border-black bg-black text-white'
                      : isCompleted
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-zinc-300 text-muted-foreground',
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'max-w-[120px] text-center',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          disabled={!canGoPrevious}
        >
          <ArrowLeft className="size-4" />
          Étape précédente
        </Button>
        <Button type="button" onClick={nextStep} disabled={!canGoNext}>
          Étape suivante
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
