'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Download, Info, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Tier = 'entrée' | 'milieu' | 'supérieur' | 'haut' | 'référence' | 'flagship';

const TIERS: Array<Tier> = ['entrée', 'milieu', 'supérieur', 'haut', 'référence', 'flagship'];

const TIER_COLORS: Record<Tier, string> = {
  entrée: 'bg-blue-100 text-blue-900',
  milieu: 'bg-sky-100 text-sky-900',
  supérieur: 'bg-emerald-100 text-emerald-900',
  haut: 'bg-indigo-100 text-indigo-900',
  référence: 'bg-purple-100 text-purple-900',
  flagship: 'bg-amber-100 text-amber-900',
};

type TieredEntity = {
  id: string;
  price?: number;
  tier?: Tier;
};

type RecommendationOptions = {
  allowAbove?: number;
  allowBelow?: number;
  limit?: number;
  targetPrice?: number;
};

type RecommendationWithMinOptions = RecommendationOptions & {
  minCount?: number;
};

function tierFromPrice(price: number): Tier {
  if (price < 800) return 'entrée';
  if (price < 2_000) return 'milieu';
  if (price < 5_000) return 'supérieur';
  if (price < 12_000) return 'haut';
  if (price < 30_000) return 'référence';
  return 'flagship';
}

function getTier(item: TieredEntity): Tier {
  if (item.tier) return item.tier;
  const price = item.price ?? 0;
  return tierFromPrice(price);
}

function tierIndex(tier: Tier) {
  return TIERS.indexOf(tier);
}

function pickRecommendedByTier<T extends TieredEntity>(
  items: Array<T>,
  targetTier: Tier,
  options?: RecommendationOptions,
): Array<T> {
  const { allowAbove = TIERS.length, allowBelow = TIERS.length, limit, targetPrice } =
    options ?? {};
  const targetIndex = tierIndex(targetTier);

  const filtered = items.filter((item) => {
    const itemTier = getTier(item);
    const index = tierIndex(itemTier);
    return index >= targetIndex - allowBelow && index <= targetIndex + allowAbove;
  });

  const sorted = [...filtered].sort((a, b) => {
    const tierA = getTier(a);
    const tierB = getTier(b);
    const distanceA = Math.abs(tierIndex(tierA) - targetIndex);
    const distanceB = Math.abs(tierIndex(tierB) - targetIndex);

    if (distanceA !== distanceB) {
      return distanceA - distanceB;
    }

    if (typeof targetPrice === 'number') {
      const priceA = a.price ?? targetPrice;
      const priceB = b.price ?? targetPrice;
      const priceDistance = Math.abs(priceA - targetPrice) - Math.abs(priceB - targetPrice);
      if (priceDistance !== 0) {
        return priceDistance;
      }
    }

    return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
  });

  if (typeof limit === 'number') {
    return sorted.slice(0, limit);
  }

  return sorted;
}

function pickRecommendedByTierAtLeast<T extends TieredEntity>(
  items: Array<T>,
  targetTier: Tier,
  options?: RecommendationWithMinOptions,
): Array<T> {
  const { minCount = 2, limit = 3, targetPrice } = options ?? {};
  let allowAbove = options?.allowAbove ?? 0;
  let allowBelow = options?.allowBelow ?? 0;
  let expandAboveNext = true;
  const maxSpan = TIERS.length;
  let recommended: Array<T> = [];

  while (allowAbove <= maxSpan || allowBelow <= maxSpan) {
    recommended = pickRecommendedByTier(items, targetTier, {
      allowAbove,
      allowBelow,
      limit,
      targetPrice,
    });

    if (
      recommended.length >= minCount ||
      (allowAbove >= maxSpan && allowBelow >= maxSpan)
    ) {
      break;
    }

    if (expandAboveNext) {
      allowAbove = Math.min(maxSpan, allowAbove + 1);
    } else {
      allowBelow = Math.min(maxSpan, allowBelow + 1);
    }
    expandAboveNext = !expandAboveNext;
  }

  return recommended.slice(0, limit);
}

function recommendHpCable(totalSansCable: number) {
  if (totalSansCable < 3_000) return 'totem-tress-hp';
  if (totalSansCable < 7_000) return 'audioquest-rocket-11';
  if (totalSansCable < 12_000) return 'audioquest-type-5';
  if (totalSansCable < 20_000) return 'audioquest-rocket-33';
  if (totalSansCable < 35_000) return 'audioquest-type-9';
  return 'audioquest-william-tell-zero';
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

type Amplifier = TieredEntity & {
  brand: string;
  name: string;
  price: number;
  power: number;
  allInOne: boolean;
  hasPhono?: boolean;
  signature: string;
};

const AMPLIFIERS: Array<Amplifier> = [
  {
    id: 'rega-io',
    brand: 'Rega',
    name: 'iO',
    price: 589,
    power: 30,
    allInOne: false,
    hasPhono: true,
    signature: 'chaleureux, musical',
  },
  {
    id: 'atoll-in-80',
    brand: 'Atoll',
    name: 'IN 80',
    price: 1_000,
    power: 80,
    allInOne: false,
    signature: 'neutre, rapide',
  },
  {
    id: 'naim-nait-5si',
    brand: 'Naim',
    name: 'NAIT 5si',
    price: 1_799,
    power: 60,
    allInOne: false,
    signature: 'rythmique, vivant',
  },
  {
    id: 'naim-uniti-atom',
    brand: 'Naim',
    name: 'Uniti ATOM',
    price: 2_599,
    power: 40,
    allInOne: true,
    signature: 'rythmique, précis',
  },
  {
    id: 'atoll-in-300-evo',
    brand: 'Atoll',
    name: 'IN 300 EVO',
    price: 2_700,
    power: 150,
    allInOne: false,
    signature: 'neutre, énergique',
  },
  {
    id: 'naim-nait-xs3',
    brand: 'Naim',
    name: 'NAIT XS 3',
    price: 2_999,
    power: 70,
    allInOne: false,
    hasPhono: true,
    signature: 'dynamique, chaleureux',
  },
  {
    id: 'moonriver-404',
    brand: 'Moonriver',
    name: '404',
    price: 3_499,
    power: 50,
    allInOne: false,
    signature: 'organique, musical',
  },
  {
    id: 'rega-aethos',
    brand: 'Rega',
    name: 'AETHOS',
    price: 4_290,
    power: 125,
    allInOne: false,
    signature: 'charnu, transparent',
  },
  {
    id: 'naim-uniti-nova',
    brand: 'Naim',
    name: 'Uniti NOVA',
    price: 4_999,
    power: 80,
    allInOne: true,
    signature: 'autorité, fluidité',
  },
  {
    id: 'moonriver-404-reference',
    brand: 'Moonriver',
    name: '404 Référence',
    price: 4_999,
    power: 50,
    allInOne: false,
    signature: 'soyeux, subtil',
  },
  {
    id: 'copland-cta-407',
    brand: 'Copland',
    name: 'CTA 407',
    price: 6_990,
    power: 50,
    allInOne: false,
    signature: 'lampe: soyeux, ample',
  },
  {
    id: 'audio-analogue-maestro',
    brand: 'Audio Analogue',
    name: 'MAESTRO',
    price: 9_950,
    power: 150,
    allInOne: false,
    signature: 'plein, raffiné',
  },
  {
    id: 'gryphon-diablo-120',
    brand: 'Gryphon',
    name: 'Diablo 120',
    price: 14_250,
    power: 120,
    allInOne: false,
    signature: 'puissance, contraste',
  },
  {
    id: 'devialet-astra',
    brand: 'Devialet',
    name: 'ASTRA',
    price: 16_000,
    power: 0,
    allInOne: true,
    signature: 'très précis, moderne',
    hasPhono: true,
  },
  {
    id: 'gryphon-diablo-333',
    brand: 'Gryphon',
    name: 'Diablo 333',
    price: 25_950,
    power: 333,
    allInOne: false,
    signature: 'autorité, résolution',
  },
];

type SourceType = 'streamer' | 'cd' | 'vinyl';

type Source = TieredEntity & {
  brand: string;
  name: string;
  type: SourceType;
  price: number;
  signature: string;
};

const SOURCES: Array<Source> = [
  {
    id: 'bluesound-node-nano',
    brand: 'Bluesound',
    name: 'NODE NANO',
    type: 'streamer',
    price: 399,
    signature: 'neutre, pratique',
  },
  {
    id: 'bluesound-node',
    brand: 'Bluesound',
    name: 'NODE',
    type: 'streamer',
    price: 599,
    signature: 'équilibré, vivant',
  },
  {
    id: 'lindemann-limetree-network-ii',
    brand: 'Lindemann',
    name: 'Limetree Network II',
    type: 'streamer',
    price: 1_190,
    signature: 'doux, aéré',
  },
  {
    id: 'atoll-st-200',
    brand: 'Atoll',
    name: 'ST 200',
    type: 'streamer',
    price: 1_999,
    signature: 'neutre, détaillé',
  },
  {
    id: 'atoll-st-300',
    brand: 'Atoll',
    name: 'ST 300',
    type: 'streamer',
    price: 2_999,
    signature: 'neutre, rapide',
  },
  {
    id: 'naim-nd5-xs2',
    brand: 'Naim',
    name: 'ND5 XS 2',
    type: 'streamer',
    price: 3_999,
    signature: 'rythmique, fluide',
  },
  {
    id: 'lindemann-musicbook-source-ii',
    brand: 'Lindemann',
    name: 'Musicbook Source II',
    type: 'streamer',
    price: 5_490,
    signature: 'raffiné, soyeux',
  },
  {
    id: 'naim-nss-333',
    brand: 'Naim',
    name: 'NSS 333',
    type: 'streamer',
    price: 8_990,
    signature: 'autorité, précision',
  },
  {
    id: 'esoteric-n05xd',
    brand: 'Esoteric',
    name: 'N-05XD',
    type: 'streamer',
    price: 12_990,
    signature: 'analytique, rapide',
  },
  {
    id: 'esoteric-n01xd-se',
    brand: 'Esoteric',
    name: 'N-01XD SE',
    type: 'streamer',
    price: 24_990,
    signature: 'résolution, silence',
  },
  {
    id: 'naim-nd-555',
    brand: 'Naim',
    name: 'ND 555',
    type: 'streamer',
    price: 35_000,
    signature: 'organique, naturel',
  },
  {
    id: 'atoll-cd-50',
    brand: 'Atoll',
    name: 'CD 50',
    type: 'cd',
    price: 790,
    signature: 'neutre, dynamique',
  },
  {
    id: 'atoll-cd-80',
    brand: 'Atoll',
    name: 'CD 80',
    type: 'cd',
    price: 1_090,
    signature: 'neutre, précis',
  },
  {
    id: 'atoll-cd-100-evo',
    brand: 'Atoll',
    name: 'CD 100 EVO',
    type: 'cd',
    price: 1_490,
    signature: 'équilibré, musical',
  },
  {
    id: 'naim-cd5si',
    brand: 'Naim',
    name: 'CD5si',
    type: 'cd',
    price: 1_899,
    signature: 'rythmique, punchy',
  },
  {
    id: 'rega-saturn-mkiii',
    brand: 'Rega',
    name: 'Saturn MKIII',
    type: 'cd',
    price: 2_799,
    signature: 'chaleureux, analogique',
  },
  {
    id: 'atoll-cd-400-evo',
    brand: 'Atoll',
    name: 'CD 400 EVO',
    type: 'cd',
    price: 3_999,
    signature: 'résolution, énergie',
  },
  {
    id: 'esoteric-k05xd',
    brand: 'Esoteric',
    name: 'K-05XD',
    type: 'cd',
    price: 11_499,
    signature: 'analytique, micro-détails',
  },
  {
    id: 'esoteric-k01xd',
    brand: 'Esoteric',
    name: 'K-01XD',
    type: 'cd',
    price: 28_999,
    signature: 'ultra défini, rigoureux',
  },
  {
    id: 'gryphon-ethos',
    brand: 'Gryphon',
    name: 'ETHOS',
    type: 'cd',
    price: 39_999,
    signature: 'corpulent, analogique',
  },
  {
    id: 'rega-planar-1',
    brand: 'Rega',
    name: 'Planar 1',
    type: 'vinyl',
    price: 439,
    signature: 'chaleureux, fluide',
  },
  {
    id: 'rega-planar-2',
    brand: 'Rega',
    name: 'Planar 2',
    type: 'vinyl',
    price: 790,
    signature: 'musical, doux',
  },
  {
    id: 'rega-planar-3',
    brand: 'Rega',
    name: 'Planar 3',
    type: 'vinyl',
    price: 1_050,
    signature: 'équilibré, vivant',
  },
  {
    id: 'rega-planar-6',
    brand: 'Rega',
    name: 'Planar 6',
    type: 'vinyl',
    price: 2_090,
    signature: 'résolutif, naturel',
  },
  {
    id: 'rega-planar-8',
    brand: 'Rega',
    name: 'Planar 8',
    type: 'vinyl',
    price: 3_489,
    signature: 'translucide, rapide',
  },
  {
    id: 'vertere-dg1x',
    brand: 'Vertere',
    name: 'DG-1 X',
    type: 'vinyl',
    price: 4_350,
    signature: 'aéré, précis',
  },
  {
    id: 'vertere-mg1',
    brand: 'Vertere',
    name: 'MG-1',
    type: 'vinyl',
    price: 13_700,
    signature: 'raffiné, soyeux',
  },
  {
    id: 'vertere-sg1',
    brand: 'Vertere',
    name: 'SG-1',
    type: 'vinyl',
    price: 30_565,
    signature: 'référence, silence',
  },
];
type SpeakerType = 'bookshelf' | 'floorstanding';

type Speaker = TieredEntity & {
  brand: string;
  name: string;
  type: SpeakerType;
  price: number;
  signature: string;
};

const SPEAKERS: Array<Speaker> = [
  {
    id: 'acoustic-energy-ae100',
    brand: 'Acoustic Energy',
    name: 'AE100',
    type: 'bookshelf',
    price: 499,
    signature: 'vivant, compact',
  },
  {
    id: 'rega-kyte',
    brand: 'Rega',
    name: 'Kyte',
    type: 'bookshelf',
    price: 589,
    signature: 'rapide, engageant',
  },
  {
    id: 'acoustic-energy-ae300',
    brand: 'Acoustic Energy',
    name: 'AE300',
    type: 'bookshelf',
    price: 890,
    signature: 'équilibré, dynamique',
  },
  {
    id: 'jern-11',
    brand: 'JERN',
    name: '11',
    type: 'bookshelf',
    price: 1_750,
    signature: 'dense, précis',
  },
  {
    id: 'apertura-swing',
    brand: 'AperturA',
    name: 'Swing',
    type: 'bookshelf',
    price: 2_200,
    signature: 'fin, articulé',
  },
  {
    id: 'totem-bison-monitor',
    brand: 'Totem',
    name: 'Bison Monitor',
    type: 'bookshelf',
    price: 2_590,
    signature: 'ample, énergique',
  },
  {
    id: 'jern-11s',
    brand: 'JERN',
    name: '11 S',
    type: 'bookshelf',
    price: 2_690,
    signature: 'chaleur, lisibilité',
  },
  {
    id: 'harbeth-p3esr-xd',
    brand: 'Harbeth',
    name: 'P3ESR XD',
    type: 'bookshelf',
    price: 2_900,
    signature: 'raffiné, naturel',
  },
  {
    id: 'totem-signature-one',
    brand: 'Totem',
    name: 'Signature One',
    type: 'bookshelf',
    price: 3_899,
    signature: 'rapide, charpenté',
  },
  {
    id: 'borresen-x1',
    brand: 'Børresen',
    name: 'X1',
    type: 'bookshelf',
    price: 5_000,
    signature: 'translucide, détaillé',
  },
  {
    id: 'harbeth-hl5-plus-xd2',
    brand: 'Harbeth',
    name: 'HL5 Plus XD2',
    type: 'bookshelf',
    price: 5_900,
    signature: 'ample, feutré',
  },
  {
    id: 'totem-element-fire-v2',
    brand: 'Totem',
    name: 'Element Fire V2',
    type: 'bookshelf',
    price: 8_199,
    signature: 'percutant, holographique',
  },
  {
    id: 'tad-micro-evo-one',
    brand: 'TAD',
    name: 'Micro EVO One',
    type: 'bookshelf',
    price: 15_000,
    signature: 'micro-détails, neutralité',
  },
  {
    id: 'tad-compact-evo-one',
    brand: 'TAD',
    name: 'Compact Evo One',
    type: 'bookshelf',
    price: 35_000,
    signature: 'puissant, enveloppant',
  },
  {
    id: 'tad-compact-reference',
    brand: 'TAD',
    name: 'Compact Reference',
    type: 'bookshelf',
    price: 84_000,
    signature: 'ultra précis, souverain',
  },
  {
    id: 'acoustic-energy-ae109',
    brand: 'Acoustic Energy',
    name: 'AE109',
    type: 'floorstanding',
    price: 999,
    signature: 'chaleureux, accessible',
  },
  {
    id: 'acoustic-energy-ae120',
    brand: 'Acoustic Energy',
    name: 'AE120',
    type: 'floorstanding',
    price: 1_399,
    signature: 'équilibré, généreux',
  },
  {
    id: 'acoustic-energy-ae309',
    brand: 'Acoustic Energy',
    name: 'AE309',
    type: 'floorstanding',
    price: 1_790,
    signature: 'rapide, dynamique',
  },
  {
    id: 'rega-aya',
    brand: 'Rega',
    name: 'AYA',
    type: 'floorstanding',
    price: 1_999,
    signature: 'rythmique, texturé',
  },
  {
    id: 'totem-arro',
    brand: 'Totem',
    name: 'ARRO',
    type: 'floorstanding',
    price: 2_299,
    signature: 'détaillé, aéré',
  },
  {
    id: 'acoustic-energy-ae509',
    brand: 'Acoustic Energy',
    name: 'AE509',
    type: 'floorstanding',
    price: 2_950,
    signature: 'transparent, énergique',
  },
  {
    id: 'apertura-sensa',
    brand: 'AperturA',
    name: 'Sensa',
    type: 'floorstanding',
    price: 3_150,
    signature: 'fluide, engageant',
  },
  {
    id: 'totem-bison-tower',
    brand: 'Totem',
    name: 'Bison Tower',
    type: 'floorstanding',
    price: 3_399,
    signature: 'ample, vivant',
  },
  {
    id: 'apertura-stella',
    brand: 'AperturA',
    name: 'Stella',
    type: 'floorstanding',
    price: 4_350,
    signature: 'raffiné, équilibré',
  },
  {
    id: 'acoustic-energy-ae500',
    brand: 'Acoustic Energy',
    name: 'AE500',
    type: 'floorstanding',
    price: 4_490,
    signature: 'précis, articulé',
  },
  {
    id: 'totem-bison-twin-tower',
    brand: 'Totem',
    name: 'Bison Twin Tower',
    type: 'floorstanding',
    price: 4_499,
    signature: 'punchy, immersif',
  },
  {
    id: 'totem-forest',
    brand: 'Totem',
    name: 'Forest',
    type: 'floorstanding',
    price: 5_999,
    signature: 'charnu, organique',
  },
  {
    id: 'apertura-armonia',
    brand: 'AperturA',
    name: 'Armonia',
    type: 'floorstanding',
    price: 6_000,
    signature: 'dynamique, suave',
  },
  {
    id: 'totem-tribe-tower',
    brand: 'Totem',
    name: 'Tribe Tower',
    type: 'floorstanding',
    price: 6_299,
    signature: 'rapide, holographique',
  },
  {
    id: 'apertura-forte',
    brand: 'AperturA',
    name: 'Forte',
    type: 'floorstanding',
    price: 7_500,
    signature: 'autorité, nuance',
  },
  {
    id: 'borresen-x2',
    brand: 'Børresen',
    name: 'X2',
    type: 'floorstanding',
    price: 8_000,
    signature: 'translucide, vibrant',
  },
  {
    id: 'totem-forest-signature',
    brand: 'Totem',
    name: 'Forest Signature',
    type: 'floorstanding',
    price: 8_199,
    signature: 'dense, viscéral',
  },
  {
    id: 'apertura-edena',
    brand: 'AperturA',
    name: 'Edena',
    type: 'floorstanding',
    price: 8_900,
    signature: 'ample, soyeux',
  },
  {
    id: 'totem-wind',
    brand: 'Totem',
    name: 'Wind',
    type: 'floorstanding',
    price: 12_999,
    signature: 'tonique, spectaculaire',
  },
  {
    id: 'egglestonworks-oso',
    brand: 'EgglestonWorks',
    name: 'Oso',
    type: 'floorstanding',
    price: 16_300,
    signature: 'ampleur, richesse',
  },
  {
    id: 'tad-evolution-one',
    brand: 'TAD',
    name: 'Evolution One',
    type: 'floorstanding',
    price: 17_000,
    signature: 'précision, impact',
  },
  {
    id: 'apertura-adamante',
    brand: 'AperturA',
    name: 'Adamante',
    type: 'floorstanding',
    price: 17_500,
    signature: 'texture, souffle',
  },
  {
    id: 'totem-element-metal-v2',
    brand: 'Totem',
    name: 'Element Metal V2',
    type: 'floorstanding',
    price: 17_799,
    signature: 'pouvoir, détails',
  },
  {
    id: 'borresen-x6',
    brand: 'Børresen',
    name: 'X6',
    type: 'floorstanding',
    price: 20_000,
    signature: 'monumental, aérien',
  },
  {
    id: 'apertura-enigma-mk3',
    brand: 'AperturA',
    name: 'Enigma MK III',
    type: 'floorstanding',
    price: 26_500,
    signature: 'liquéfié, profond',
  },
  {
    id: 'gryphon-eos-2',
    brand: 'Gryphon',
    name: 'EOS 2',
    type: 'floorstanding',
    price: 27_350,
    signature: 'dynamique, transparent',
  },
  {
    id: 'gryphon-eos-5',
    brand: 'Gryphon',
    name: 'EOS 5',
    type: 'floorstanding',
    price: 59_750,
    signature: 'autorité, immersion',
  },
  {
    id: 'gryphon-trident-ii',
    brand: 'Gryphon',
    name: 'Trident II',
    type: 'floorstanding',
    price: 143_700,
    signature: 'illimité, grandiose',
  },
  {
    id: 'tad-reference-one',
    brand: 'TAD',
    name: 'Reference One',
    type: 'floorstanding',
    price: 159_000,
    signature: 'référence, holographique',
  },
];

type Cable = TieredEntity & {
  brand: string;
  name: string;
  price: number;
  pricePerMeter?: boolean;
  signature: string;
};

const CABLES: Array<Cable> = [
  {
    id: 'totem-tress-hp',
    brand: 'Totem',
    name: 'Tress HP',
    price: 29,
    pricePerMeter: true,
    signature: 'souple, chaleureux',
  },
  {
    id: 'audioquest-rocket-11',
    brand: 'AudioQuest',
    name: 'Rocket 11',
    price: 379,
    signature: 'fluide, équilibré',
  },
  {
    id: 'audioquest-type-5',
    brand: 'AudioQuest',
    name: 'Type 5',
    price: 569,
    signature: 'détaillé, rapide',
  },
  {
    id: 'audioquest-rocket-33',
    brand: 'AudioQuest',
    name: 'Rocket 33',
    price: 629,
    signature: 'dynamique, ouvert',
  },
  {
    id: 'audioquest-type-9',
    brand: 'AudioQuest',
    name: 'Type 9',
    price: 789,
    signature: 'résolution, douceur',
  },
  {
    id: 'audioquest-william-tell-zero',
    brand: 'AudioQuest',
    name: 'William Tell ZERO',
    price: 3_099,
    signature: 'précision, autorité',
  },
];

const SOURCE_TABS: Array<{ value: SourceType; label: string }> = [
  { value: 'streamer', label: 'Streamer' },
  { value: 'cd', label: 'CD' },
  { value: 'vinyl', label: 'Vinyl' },
];

const SPEAKER_TYPES: Array<{
  value: SpeakerType;
  label: string;
  description: string;
}> = [
  {
    value: 'floorstanding',
    label: 'Colonnes',
    description: 'Pour remplir de grands volumes avec une scène ample.',
  },
  {
    value: 'bookshelf',
    label: 'Bibliothèques',
    description: 'Idéal en pièce de taille moyenne ou pour un rendu précis.',
  },
];

const STEP_LABELS = [
  'Budget & pièce',
  'Amplification',
  'Source',
  'Enceintes',
  'Câble HP',
  'Résumé',
];

const SOURCES_BY_TYPE = SOURCE_TABS.reduce<Record<SourceType, Array<Source>>>(
  (acc, tab) => {
    acc[tab.value] = SOURCES.filter((source) => source.type === tab.value);
    return acc;
  },
  { streamer: [], cd: [], vinyl: [] },
);

const SPEAKERS_BY_TYPE = SPEAKER_TYPES.reduce<Record<SpeakerType, Array<Speaker>>>(
  (acc, option) => {
    acc[option.value] = SPEAKERS.filter((speaker) => speaker.type === option.value);
    return acc;
  },
  { floorstanding: [], bookshelf: [] },
);

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="mb-8">
      <div className="relative flex items-start justify-between">
        <div className="absolute inset-x-0 top-5 h-0.5 bg-border" />
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="relative flex flex-col items-center gap-3">
            <div
              className={cn(
                'z-10 flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                index <= activeStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground',
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                'w-28 text-center text-xs font-medium',
                index === activeStep ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HiFiConfiguratorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [budget, setBudget] = useState(5_000);
  const [roomSize, setRoomSize] = useState(20);
  const [notes, setNotes] = useState('');
  const [selectedAmplifierId, setSelectedAmplifierId] = useState<string | undefined>();
  const [sourceTab, setSourceTab] = useState<SourceType>('streamer');
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>();
  const [selectedSpeakerType, setSelectedSpeakerType] = useState<SpeakerType | undefined>();
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | undefined>();
  const [cableLength, setCableLength] = useState(3);
  const [selectedCableId, setSelectedCableId] = useState<string | undefined>();

  const selectedAmplifier = useMemo(
    () => AMPLIFIERS.find((amplifier) => amplifier.id === selectedAmplifierId),
    [selectedAmplifierId],
  );
  const amplifierTier = selectedAmplifier ? getTier(selectedAmplifier) : 'milieu';

  const selectedSource = useMemo(
    () => SOURCES.find((source) => source.id === selectedSourceId),
    [selectedSourceId],
  );

  const selectedSpeakers = useMemo(
    () => SPEAKERS.find((speaker) => speaker.id === selectedSpeakerId),
    [selectedSpeakerId],
  );

  const selectedCable = useMemo(
    () => CABLES.find((cable) => cable.id === selectedCableId),
    [selectedCableId],
  );

  const totalSansCable =
    (selectedAmplifier?.price ?? 0) +
    (selectedSource?.price ?? 0) +
    (selectedSpeakers?.price ?? 0);
  const cableRecommendationId = recommendHpCable(totalSansCable);

  useEffect(() => {
    if (!selectedCableId && cableRecommendationId) {
      setSelectedCableId(cableRecommendationId);
    }
  }, [cableRecommendationId, selectedCableId]);

  const recommendedSourceIdsByType = useMemo(() => {
    const targetPrice = selectedAmplifier?.price;
    return SOURCE_TABS.reduce<Record<SourceType, Set<string>>>((acc, tab) => {
      const recommended = pickRecommendedByTierAtLeast(
        SOURCES_BY_TYPE[tab.value],
        amplifierTier,
        {
          minCount: 2,
          limit: 3,
          targetPrice,
        },
      );
      acc[tab.value] = new Set(recommended.map((item) => item.id));
      return acc;
    }, { streamer: new Set(), cd: new Set(), vinyl: new Set() });
  }, [amplifierTier, selectedAmplifier?.price]);

  const recommendedSpeakerIdsByType = useMemo(() => {
    const targetPrice = selectedAmplifier?.price;
    return SPEAKER_TYPES.reduce<Record<SpeakerType, Set<string>>>((acc, option) => {
      const recommended = pickRecommendedByTierAtLeast(
        SPEAKERS_BY_TYPE[option.value],
        amplifierTier,
        {
          allowAbove: 1,
          allowBelow: 0,
          minCount: 2,
          limit: 3,
          targetPrice,
        },
      );
      acc[option.value] = new Set(recommended.map((item) => item.id));
      return acc;
    }, { floorstanding: new Set(), bookshelf: new Set() });
  }, [amplifierTier, selectedAmplifier?.price]);

  const cableTotal = selectedCable
    ? selectedCable.pricePerMeter
      ? selectedCable.price * cableLength
      : selectedCable.price
    : 0;
  const totalEstimate = totalSansCable + cableTotal;
  const cableMatchesRecommendation = selectedCableId === cableRecommendationId;

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Boolean(selectedAmplifier);
      case 2:
        return Boolean(selectedSource);
      case 3:
        return Boolean(selectedSpeakerId);
      case 4:
        return Boolean(selectedCable);
      default:
        return true;
    }
  }, [currentStep, selectedAmplifier, selectedSource, selectedSpeakerId, selectedCable]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleExport = () => {
    if (!selectedAmplifier || !selectedSource || !selectedSpeakers || !selectedCable) {
      return;
    }

    const payload = {
      budget,
      roomSize,
      notes,
      selections: {
        amplifier: {
          id: selectedAmplifier.id,
          name: `${selectedAmplifier.brand} ${selectedAmplifier.name}`,
          tier: getTier(selectedAmplifier),
          signature: selectedAmplifier.signature,
        },
        source: {
          id: selectedSource.id,
          name: `${selectedSource.brand} ${selectedSource.name}`,
          tier: getTier(selectedSource),
          signature: selectedSource.signature,
        },
        speakers: {
          id: selectedSpeakers.id,
          name: `${selectedSpeakers.brand} ${selectedSpeakers.name}`,
          tier: getTier(selectedSpeakers),
          signature: selectedSpeakers.signature,
          type: selectedSpeakers.type,
        },
        cable: {
          id: selectedCable.id,
          name: `${selectedCable.brand} ${selectedCable.name}`,
          tier: getTier(selectedCable),
          signature: selectedCable.signature,
          length: cableLength,
        },
      },
      totals: {
        withoutCable: totalSansCable,
        cable: cableTotal,
        withCable: totalEstimate,
      },
      recommendedCableId: cableRecommendationId,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `config-hifi-${Date.now()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };
  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    onSelect: () => void,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Budget & configuration de la pièce</CardTitle>
              <CardDescription>
                Ajustez les curseurs pour donner un cadre à votre future installation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="budget">Budget cible</Label>
                  <span className="text-sm font-semibold">{formatCurrency(budget)}</span>
                </div>
                <Slider
                  id="budget"
                  min={1_000}
                  max={60_000}
                  step={500}
                  value={[budget]}
                  onValueChange={(value) => setBudget(value[0] ?? budget)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="room-size">Surface de la pièce</Label>
                  <span className="text-sm font-semibold">{roomSize} m²</span>
                </div>
                <Slider
                  id="room-size"
                  min={8}
                  max={60}
                  step={1}
                  value={[roomSize]}
                  onValueChange={(value) => setRoomSize(value[0] ?? roomSize)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Ex. préférence pour un son chaleureux, meubles existants, contraintes déco..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choisissez votre amplification intégrée</CardTitle>
              <CardDescription>
                Tous les amplificateurs listés sont des intégrés Hi-Fi. Sélectionnez celui qui définit votre niveau de gamme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {AMPLIFIERS.map((amplifier) => {
                  const tier = getTier(amplifier);
                  const isSelected = selectedAmplifierId === amplifier.id;
                  return (
                    <Card
                      key={amplifier.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedAmplifierId(amplifier.id)}
                      onKeyDown={(event) => handleCardKeyDown(event, () => setSelectedAmplifierId(amplifier.id))}
                      className={cn(
                        'flex h-full cursor-pointer flex-col gap-4 border transition hover:shadow-md focus:outline-none',
                        isSelected ? 'ring-2 ring-black' : 'border-border',
                      )}
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">
                              {amplifier.brand} {amplifier.name}
                            </CardTitle>
                            <CardDescription>{formatCurrency(amplifier.price)}</CardDescription>
                          </div>
                          <div className="flex flex-wrap justify-end gap-2">
                            <Pill className="bg-blue-100 text-blue-900">Intégré</Pill>
                            {amplifier.allInOne ? (
                              <Pill className="bg-violet-100 text-violet-900">Tout-en-un</Pill>
                            ) : null}
                            {amplifier.hasPhono ? (
                              <Pill className="bg-amber-100 text-amber-900">Phono intégré</Pill>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{amplifier.power ? `${amplifier.power} W` : 'Puissance variable'}</span>
                          <Pill className={cn('capitalize', TIER_COLORS[tier])}>{tier}</Pill>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Signature sonore : {amplifier.signature}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sélectionnez la source</CardTitle>
              <CardDescription>
                Les recommandations se basent sur le niveau de votre amplificateur. Vous restez libre de choisir la source qui vous inspire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={sourceTab} onValueChange={(value) => setSourceTab(value as SourceType)}>
                <TabsList>
                  {SOURCE_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {SOURCE_TABS.map((tab) => {
                  const items = SOURCES_BY_TYPE[tab.value];
                  const recommendedIds = recommendedSourceIdsByType[tab.value];
                  const showPhonoAlert =
                    tab.value === 'vinyl' &&
                    Boolean(selectedAmplifier) &&
                    !selectedAmplifier?.hasPhono;
                  return (
                    <TabsContent key={tab.value} value={tab.value}>
                      {showPhonoAlert ? (
                        <div className="mb-4 flex items-start gap-3 rounded-md border-l-4 border-yellow-400 bg-yellow-100/70 p-4 text-sm text-yellow-900">
                          <Info className="mt-0.5 size-5" />
                          <div>
                            <p className="font-semibold">Ajouter un préampli phono</p>
                            <p>
                              L&apos;amplificateur sélectionné ne possède pas d&apos;entrée phono dédiée. Prévoyez un préampli phono externe pour votre platine vinyle.
                            </p>
                          </div>
                        </div>
                      ) : null}
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((source) => {
                          const tier = getTier(source);
                          const isSelected = selectedSourceId === source.id;
                          const isRecommended = recommendedIds.has(source.id);
                          return (
                            <Card
                              key={source.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedSourceId(source.id)}
                              onKeyDown={(event) =>
                                handleCardKeyDown(event, () => setSelectedSourceId(source.id))
                              }
                              className={cn(
                                'flex h-full cursor-pointer flex-col gap-3 border transition hover:shadow-md focus:outline-none',
                                isSelected ? 'ring-2 ring-black' : 'border-border',
                                isRecommended ? 'bg-emerald-50/60' : null,
                              )}
                            >
                              <CardHeader className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-xl">
                                      {source.brand} {source.name}
                                    </CardTitle>
                                    <CardDescription>{formatCurrency(source.price)}</CardDescription>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Pill className={cn('capitalize', TIER_COLORS[tier])}>{tier}</Pill>
                                    {isRecommended ? (
                                      <Pill className="bg-emerald-200 text-emerald-900">
                                        <Sparkles className="mr-1 size-3" /> Recommandé
                                      </Pill>
                                    ) : null}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Signature sonore : {source.signature}
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choix des enceintes</CardTitle>
              <CardDescription>
                Commencez par le type d&apos;enceintes souhaité puis explorez les recommandations alignées sur votre amplificateur.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {SPEAKER_TYPES.map((option) => {
                  const isActive = selectedSpeakerType === option.value;
                  return (
                    <Card
                      key={option.value}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedSpeakerType(option.value);
                        setSelectedSpeakerId(undefined);
                      }}
                      onKeyDown={(event) =>
                        handleCardKeyDown(event, () => {
                          setSelectedSpeakerType(option.value);
                          setSelectedSpeakerId(undefined);
                        })
                      }
                      className={cn(
                        'cursor-pointer border transition hover:shadow-md focus:outline-none',
                        isActive ? 'ring-2 ring-black' : 'border-border',
                      )}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{option.label}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
              {selectedSpeakerType ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {SPEAKERS_BY_TYPE[selectedSpeakerType].map((speaker) => {
                    const tier = getTier(speaker);
                    const isSelected = selectedSpeakerId === speaker.id;
                    const isRecommended = recommendedSpeakerIdsByType[selectedSpeakerType]?.has(
                      speaker.id,
                    );
                    return (
                      <Card
                        key={speaker.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedSpeakerId(speaker.id)}
                        onKeyDown={(event) =>
                          handleCardKeyDown(event, () => setSelectedSpeakerId(speaker.id))
                        }
                        className={cn(
                          'flex h-full cursor-pointer flex-col gap-3 border transition hover:shadow-md focus:outline-none',
                          isSelected ? 'ring-2 ring-black' : 'border-border',
                          isRecommended ? 'bg-emerald-50/60' : null,
                        )}
                      >
                        <CardHeader className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                {speaker.brand} {speaker.name}
                              </CardTitle>
                              <CardDescription>{formatCurrency(speaker.price)}</CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Pill className={cn('capitalize', TIER_COLORS[tier])}>{tier}</Pill>
                              {isRecommended ? (
                                <Pill className="bg-emerald-200 text-emerald-900">
                                  <Sparkles className="mr-1 size-3" /> Recommandé
                                </Pill>
                              ) : null}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Signature sonore : {speaker.signature}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Choisissez d&apos;abord un type d&apos;enceintes pour afficher les modèles correspondants.
                </p>
              )}
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Câble HP</CardTitle>
              <CardDescription>
                Ajustez la longueur souhaitée et comparez les options adaptées au niveau de votre système.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cable-length">Longueur souhaitée</Label>
                  <span className="text-sm font-semibold">{cableLength} m</span>
                </div>
                <Slider
                  id="cable-length"
                  min={2}
                  max={12}
                  step={1}
                  value={[cableLength]}
                  onValueChange={(value) => setCableLength(value[0] ?? cableLength)}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="size-4" />
                  Recommandation automatique
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCableId(cableRecommendationId)}
                  type="button"
                  size="sm"
                >
                  Appliquer la recommandation
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {CABLES.map((cable) => {
                  const tier = getTier(cable);
                  const isSelected = selectedCableId === cable.id;
                  const isRecommended = cable.id === cableRecommendationId;
                  const totalForCable = cable.pricePerMeter
                    ? cable.price * cableLength
                    : cable.price;
                  return (
                    <Card
                      key={cable.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCableId(cable.id)}
                      onKeyDown={(event) => handleCardKeyDown(event, () => setSelectedCableId(cable.id))}
                      className={cn(
                        'flex h-full cursor-pointer flex-col gap-3 border transition hover:shadow-md focus:outline-none',
                        isSelected ? 'ring-2 ring-black' : 'border-border',
                        isRecommended ? 'bg-emerald-50/60 border-emerald-300' : null,
                      )}
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">
                              {cable.brand} {cable.name}
                            </CardTitle>
                            <CardDescription>
                              {cable.pricePerMeter
                                ? `${formatCurrency(cable.price)} / m`
                                : formatCurrency(cable.price)}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Pill className={cn('capitalize', TIER_COLORS[tier])}>{tier}</Pill>
                            {isRecommended ? (
                              <Pill className="bg-emerald-200 text-emerald-900">
                                <Sparkles className="mr-1 size-3" /> Recommandé
                              </Pill>
                            ) : null}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Signature sonore : {cable.signature}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          Total câble ({cableLength} m) : {formatCurrency(totalForCable)}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Résumé de votre système</CardTitle>
              <CardDescription>
                Vérifiez vos choix, leur niveau de gamme et la signature sonore associée avant de passer à l&apos;action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Amplificateur</h3>
                  {selectedAmplifier ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-lg font-semibold">
                        {selectedAmplifier.brand} {selectedAmplifier.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Pill className={cn('capitalize', TIER_COLORS[getTier(selectedAmplifier)])}>
                          {getTier(selectedAmplifier)}
                        </Pill>
                        <span className="text-sm text-muted-foreground">
                          Signature : {selectedAmplifier.signature}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Source</h3>
                  {selectedSource ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-lg font-semibold">
                        {selectedSource.brand} {selectedSource.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Pill className={cn('capitalize', TIER_COLORS[getTier(selectedSource)])}>
                          {getTier(selectedSource)}
                        </Pill>
                        <span className="text-sm text-muted-foreground">
                          Signature : {selectedSource.signature}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Enceintes</h3>
                  {selectedSpeakers ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-lg font-semibold">
                        {selectedSpeakers.brand} {selectedSpeakers.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill className={cn('capitalize', TIER_COLORS[getTier(selectedSpeakers)])}>
                          {getTier(selectedSpeakers)}
                        </Pill>
                        <Pill className="bg-slate-100 text-slate-900">
                          {selectedSpeakers.type === 'floorstanding' ? 'Colonnes' : 'Bibliothèques'}
                        </Pill>
                        <span className="text-sm text-muted-foreground">
                          Signature : {selectedSpeakers.signature}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div
                  className={cn(
                    'rounded-lg border p-4',
                    cableMatchesRecommendation ? 'border-emerald-300 bg-emerald-50/70' : null,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">Câble HP</h3>
                    {cableMatchesRecommendation ? (
                      <Pill className="bg-emerald-200 text-emerald-900">
                        <Sparkles className="mr-1 size-3" /> Recommandé
                      </Pill>
                    ) : null}
                  </div>
                  {selectedCable ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-lg font-semibold">
                        {selectedCable.brand} {selectedCable.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill className={cn('capitalize', TIER_COLORS[getTier(selectedCable)])}>
                          {getTier(selectedCable)}
                        </Pill>
                        <Pill className="bg-slate-100 text-slate-900">{cableLength} m</Pill>
                        <span className="text-sm text-muted-foreground">
                          Signature : {selectedCable.signature}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total estimatif</p>
                    <p className="text-3xl font-semibold">{formatCurrency(totalEstimate)}</p>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Sans câble : {formatCurrency(totalSansCable)}</p>
                    <p>Câble ({cableLength} m) : {formatCurrency(cableTotal)}</p>
                    <p>Budget cible : {formatCurrency(budget)}</p>
                    <p>Surface : {roomSize} m²</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="secondary">
                  Demander un devis
                </Button>
                <Button type="button" onClick={handleExport}>
                  <Download className="mr-2 size-4" /> Exporter JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Stepper activeStep={currentStep} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="size-4" /> Retour
        </Button>
        {currentStep < STEP_LABELS.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-2"
          >
            Continuer <ArrowRight className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
