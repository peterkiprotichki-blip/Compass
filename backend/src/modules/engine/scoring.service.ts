import { Injectable } from '@nestjs/common';
import { Business } from '../../database/schemas/business.schema';
import {
  Result,
  StrengthProfileItem,
  ReadinessPillar,
  BusinessMatchItem,
} from '../../database/schemas/result.schema';

export interface StrengthDefinitions {
  name: string;
  nameSw: string;
  description: string;
  descriptionSw: string;
}

export const STRENGTH_DEFINITIONS: Record<string, StrengthDefinitions> = {
  Communication: {
    name: 'Communication',
    nameSw: 'Mawasiliano',
    description: 'You naturally connect with people, listen attentively, and express ideas with clarity.',
    descriptionSw: 'Unaungana na watu kwa urahisi, unasikiliza kwa makini, na kueleza mawazo kwa uwazi.',
  },
  Sales: {
    name: 'Sales',
    nameSw: 'Mauzo',
    description: 'You are comfortable persuading customers, presenting value, and closing deals.',
    descriptionSw: 'Una uwezo mkubwa wa kushawishi wateja, kueleza thamani ya bidhaa, na kukamilisha mauzo.',
  },
  Networking: {
    name: 'Networking',
    nameSw: 'Ujenzi wa Mahusiano',
    description: 'You easily cultivate high-trust personal connections and unlock collaborative opportunities.',
    descriptionSw: 'Unajenga uhusiano wa kuaminika kwa urahisi na kufungua fursa mpya za kibiashara.',
  },
  Leadership: {
    name: 'Leadership',
    nameSw: 'Uongozi',
    description: 'You can guide teams, cast a compelling vision, and make confident decisions under pressure.',
    descriptionSw: 'Unaweza kuongoza timu, kuonyesha maono thabiti, na kufanya maamuzi sahihi.',
  },
  Creativity: {
    name: 'Creativity',
    nameSw: 'Ubunifu',
    description: 'You generate original ideas, aesthetic presentations, and innovative solutions others overlook.',
    descriptionSw: 'Unazalisha mawazo mapya ya kibunifu na suluhu ambazo wengine hawazione haraka.',
  },
  'Problem Solving': {
    name: 'Problem Solving',
    nameSw: 'Utatuzi wa Matatizo',
    description: 'You deconstruct complex challenges, diagnose root causes, and engineer practical fixes.',
    descriptionSw: 'Unachambua changamoto ngumu, kugundua chanzo halisi, na kuweka suluhu thabiti.',
  },
  Organization: {
    name: 'Organization',
    nameSw: 'Mpangilio na Mifumo',
    description: 'You design orderly structures, manage logistics, and maintain reliable daily routines.',
    descriptionSw: 'Unapanga mifumo mizuri ya utendaji kazi na kusimamia ratiba kwa ukamilifu.',
  },
  'Strategic Thinking': {
    name: 'Strategic Thinking',
    nameSw: 'Fikra za Kimkakati',
    description: 'You think several steps ahead, foresee market shifts, and plan for sustainable long-term growth.',
    descriptionSw: 'Unafikiria hatua kadhaa mbele, kutabiri mwelekeo wa soko, na kupanga maendeleo ya kudumu.',
  },
  Adaptability: {
    name: 'Adaptability',
    nameSw: 'Uwezo wa Kubadilika',
    description: 'You adjust rapidly when circumstances shift, turning setbacks into fresh strategic pivots.',
    descriptionSw: 'Unabadilika haraka kulingana na mazingira na kugeuza vikwazo kuwa fursa mpya.',
  },
  Persistence: {
    name: 'Persistence',
    nameSw: 'Uvumilivu na Uthabiti',
    description: 'You possess the tenacity to push through initial hurdles, slow days, and market friction.',
    descriptionSw: 'Una ustahimilivu wa kipekee wa kuendelea hata wakati mambo yanapokuwa magumu.',
  },
  Teaching: {
    name: 'Teaching',
    nameSw: 'Kufundisha na Kuelekeza',
    description: 'You take complex knowledge and explain it patiently so others gain confidence and clarity.',
    descriptionSw: 'Una uwezo wa kurahisisha maarifa magumu na kuelekeza wengine kwa uvumilivu.',
  },
  'Technical Ability': {
    name: 'Technical Ability',
    nameSw: 'Umahiri wa Kiufundi',
    description: 'You are naturally comfortable with digital tools, equipment, software, and mechanical systems.',
    descriptionSw: 'Una uelewa wa haraka wa vifaa vya kiteknolojia, mifumo ya kompyuta na ufundi.',
  },
  'Customer Service': {
    name: 'Customer Service',
    nameSw: 'Huduma kwa Wateja',
    description: 'You genuinely care about customer satisfaction and turn first-time buyers into loyal advocates.',
    descriptionSw: 'Unajali sana kuridhika kwa wateja na kugeuza wanunuzi wa kwanza kuwa wateja wa kudumu.',
  },
  'Decision Making': {
    name: 'Decision Making',
    nameSw: 'Ufanyaji Maamuzi',
    description: 'You make sound, timely choices without getting trapped in endless analysis paralysis.',
    descriptionSw: 'Unafanya maamuzi sahihi kwa wakati bila kupoteza muda kwa kusitasita.',
  },
  'Attention To Detail': {
    name: 'Attention To Detail',
    nameSw: 'Umakini wa Maelezo',
    description: 'You spot errors before they become costly and ensure precision in product and service quality.',
    descriptionSw: 'Unaona kasoro ndogo mapema na kuhakikisha ubora wa juu wa bidhaa na huduma.',
  },
};

export const ARCHETYPE_INFO: Record<string, {
  name: string;
  nameSw: string;
  summary: string;
  summarySw: string;
  traits: string[];
  traitsSw: string[];
  blindSpots: string[];
  blindSpotsSw: string[];
  growthAdvice: string;
  growthAdviceSw: string;
}> = {
  'The Seller': {
    name: 'The Seller',
    nameSw: 'Muuza Thamani (The Seller)',
    summary: 'You create commercial value through trust, charisma, persuasion, and human relationships. You spot opportunities fast and can generate cash flow in almost any environment.',
    summarySw: 'Unatengeneza thamani kubwa kupitia uaminifu, ushawishi na mahusiano ya kibinadamu. Unaona fursa haraka na unaweza kuleta mauzo mahali popote.',
    traits: ['Charismatic', 'Influential', 'Relationship-Driven', 'High Energy'],
    traitsSw: ['Mshawishi', 'Mwenye Nguvu', 'Uhusiano Imara', 'Mchangamfu'],
    blindSpots: [
      'Starting too many new ventures at once without finishing',
      'Chasing shiny short-term opportunities that distract from core focus',
      'Neglecting back-office systems, bookkeeping, and operational follow-through'
    ],
    blindSpotsSw: [
      'Kuanzisha biashara nyingi kwa wakati mmoja bila kukamilisha',
      'Kuvutiwa na fursa za muda mfupi zinazopoteza mwelekeo mkuu',
      'Kupuuza mifumo ya hesabu, kumbukumbu na taratibu za kiofisi'
    ],
    growthAdvice: 'Your next level comes from consistency and documented systems, not from adding more ideas.',
    growthAdviceSw: 'Mafanikio yako yajayo yatatokana na msimamo thabiti na mifumo, si kwa kuongeza mawazo zaidi.'
  },
  'The Builder': {
    name: 'The Builder',
    nameSw: 'Mjenzi wa Kudumu (The Builder)',
    summary: 'You thrive when constructing durable, long-term enterprises that accumulate substantial value over time. You think in decades and build strong foundations.',
    summarySw: 'Unafurahia kujenga biashara thabiti zinazodumu na kukua kwa muda mrefu. Una maono ya mbali na msingi madhubuti.',
    traits: ['Disciplined', 'Strategic', 'Persistent', 'Responsible'],
    traitsSw: ['Mwenye Nidhamu', 'Mwanamikakati', 'Mvumilivu', 'Mwenye Wajibu'],
    blindSpots: [
      'Overworking and taking on excessive personal burden without delegating',
      'Perfectionism leading to delayed launches while waiting for ideal conditions',
      'Moving too slowly and missing fast market windows'
    ],
    blindSpotsSw: [
      'Kufanya kazi kupita kiasi bila kugawa majukumu kwa wengine',
      'Kutaka kila kitu kiwe kamili kabla ya kuanza (Perfectionism)',
      'Kusonga polepole sana na kukosa fursa za haraka za soko'
    ],
    growthAdvice: 'Launch before everything feels completely perfect. Real-world progress beats perfection every time.',
    growthAdviceSw: 'Anza kabla ya kila kitu kuwa kikamilifu. Hatua halisi inashinda kusubiri ukamilifu.'
  },
  'The Creator': {
    name: 'The Creator',
    nameSw: 'Mbunifu wa Asili (The Creator)',
    summary: 'You generate value through originality, artistic design, cultural trends, and fresh perspective. You see creative possibilities that others completely overlook.',
    summarySw: 'Unatengeneza thamani kupitia ubunifu halisi, mtindo wa kisasa na mtazamo mpya. Unaona uzuri na fursa ambazo wengine hawazioni.',
    traits: ['Visionary', 'Original', 'Trend-Aware', 'Expressive'],
    traitsSw: ['Mwenye Maono', 'Mbunifu', 'Kuelewa Mitindo', 'Kujieleza Vizuri'],
    blindSpots: [
      'Losing interest once the initial thrill of ideation fades',
      'Inconsistent execution and difficulty maintaining repetitive operational routines',
      'Reluctance to charge premium prices for your intellectual and creative labor'
    ],
    blindSpotsSw: [
      'Kupoteza hamasa pindi msisimko wa mwanzo wa wazo unapopungua',
      'Kukosa uthabiti katika utekelezaji wa kazi za kila siku',
      'Kusitasita kutoza bei stahiki yenye faida kubwa kwa kazi zako'
    ],
    growthAdvice: 'Your creative ideas are deeply valuable. Standardized operating systems are what transform ideas into sustainable wealth.',
    growthAdviceSw: 'Mawazo yako ya kibunifu yana thamani kubwa. Mifumo thabiti ndiyo inayobadilisha mawazo kuwa utajiri.'
  },
  'The Teacher': {
    name: 'The Teacher',
    nameSw: 'Mwelekezi na Mwalimu (The Teacher)',
    summary: 'You generate impact by mentoring, guiding, and empowering others to achieve personal and professional breakthroughs. People naturally seek your wisdom.',
    summarySw: 'Unaleta matokeo makubwa kwa kulea, kuelekeza na kuinua wengine. Watu kwa kawaida huja kwako kupata ushauri na mwongozo.',
    traits: ['Empathetic', 'Articulate', 'Insightful', 'Service-Oriented'],
    traitsSw: ['Mwenye Huruma', 'Mfasaha', 'Mwenye Busara', 'Mtumishi wa Jamii'],
    blindSpots: [
      'Undercharging or giving away your expertise for free out of guilt',
      'Over-giving emotional energy to clients until you suffer burnout',
      'Discomfort with assertive selling and asking directly for contract commitment'
    ],
    blindSpotsSw: [
      'Kutoza bei ndogo sana au kutoa huduma bure kwa kuonea watu huruma',
      'Kutumia nguvu nyingi kupita kiasi hadi kuchoka bila malipo stahiki',
      'Kuona ugumu kufanya mauzo ya moja kwa moja na kudai malipo'
    ],
    growthAdvice: 'Helping people and making significant profit are not opposites. When you charge what you are worth, you serve clients at a much higher level.',
    growthAdviceSw: 'Kusaidia watu na kupata faida kubwa si vitu vinavyopingana. Unapotoza thamani stahiki, unahudumia kwa kiwango cha juu zaidi.'
  },
  'The Operator': {
    name: 'The Operator',
    nameSw: 'Msimamizi wa Mifumo (The Operator)',
    summary: 'You create value through structure, precision, reliability, and smooth execution. You are the dependable rock who makes complex businesses run like clockwork.',
    summarySw: 'Unatengeneza thamani kupitia mpangilio, umakini, na utekelezaji usio na makosa. Wewe ndiye nguzo inayofanya biashara iende vizuri bila kusimama.',
    traits: ['Systematic', 'Precise', 'Reliable', 'Action-Oriented'],
    traitsSw: ['Mwenye Mifumo', 'Makini', 'Mwenye Kuaminika', 'Mtekelezaji'],
    blindSpots: [
      'Resistance to taking bold calculated risks outside your comfort zone',
      'Over-analyzing logistics and operational details until momentum is lost',
      'Thinking too small and underestimating your enterprise scale potential'
    ],
    blindSpotsSw: [
      'Kuhofia kuchukua maamuzi ya kibiashara nje ya mazoea yako',
      'Kutumia muda mrefu kuchambua kila kitu hadi fursa inapita',
      'Kujidharau na kupanga biashara ndogo sana kuliko uwezo wako'
    ],
    growthAdvice: 'Do not wait until 100% of information is known. The greatest business opportunities require decisive action before total certainty arrives.',
    growthAdviceSw: 'Usisubiri hadi kila kitu kiwe na uhakika wa asilimia 100. Fursa kubwa zinahitaji kuanza kwa ujasiri.'
  },
  'The Problem Solver': {
    name: 'The Problem Solver',
    nameSw: 'Mtatuzi wa Changamoto (The Problem Solver)',
    summary: 'You create value by untangling friction, fixing broken processes, and inventing practical solutions to difficult real-world headaches.',
    summarySw: 'Unatengeneza thamani kwa kutatua migogoro, kurekebisha mifumo iliyoharibika, na kubuni suluhu za kiutendaji kwa changamoto halisi.',
    traits: ['Analytical', 'Ingenious', 'Logical', 'Resourceful'],
    traitsSw: ['Mchambuzi', 'Mvumbuzi', 'Mwenye Mantiki', 'Mwenye Ujuzi wa Suluhu'],
    blindSpots: [
      'Overthinking and falling into paralysis by analysis',
      'Waiting too long to take action while trying to build the ultimate solution',
      'Focusing so heavily on the technical solution that you neglect marketing and customer emotions'
    ],
    blindSpotsSw: [
      'Kufikiria kupita kiasi na kukwama katika uchambuzi usio na mwisho',
      'Kuchelewa kuchukua hatua ukingoja kutengeneza suluhu kamilifu',
      'Kuzingatia sana ufundi na kusahau masoko na hisia za wateja'
    ],
    growthAdvice: 'You do not need perfect information or a flawless product to begin. Put your practical solution in front of real customers immediately.',
    growthAdviceSw: 'Huna haja ya taarifa kamili au bidhaa isiyo na dosari ili kuanza. Weka suluhu yako mbele ya wateja halisi haraka.'
  }
};

@Injectable()
export class ScoringService {
  computeFullResult(
    assessmentId: string,
    answers: Record<string, any>,
    allBusinesses: Business[],
    userId?: string,
  ): Partial<Result> {
    // 1. STRENGTH ENGINE
    const strengthScores = this.computeStrengths(answers);
    const sortedStrengths = Object.entries(strengthScores)
      .sort((a, b) => b[1] - a[1])
      .map(([name, score]) => ({
        name,
        nameSw: STRENGTH_DEFINITIONS[name]?.nameSw || name,
        score,
        description: STRENGTH_DEFINITIONS[name]?.description || '',
      }));

    const top5Strengths: StrengthProfileItem[] = sortedStrengths.slice(0, 5);

    // 2. ARCHETYPE ENGINE
    const archetypeScores = this.computeArchetypes(strengthScores, answers['q10']);
    const sortedArchetypes = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1]);
    const primaryArchetype = sortedArchetypes[0][0];
    const secondaryArchetype = sortedArchetypes[1][0];

    const archetypeMeta = ARCHETYPE_INFO[primaryArchetype] || ARCHETYPE_INFO['The Seller'];

    // 3. RISK PROFILE
    const riskProfile = this.computeRiskProfile(answers);

    // 4. BUSINESS READINESS SCORE (5 PILLARS X 20 PTS = 100 PTS)
    const { readinessScore, readinessVerdict, readinessPillars } = this.computeReadinessScore(
      answers,
      top5Strengths,
    );

    // 5. MATCHING ENGINE
    const topMatches = this.computeBusinessMatches(
      allBusinesses,
      primaryArchetype,
      secondaryArchetype,
      top5Strengths,
      answers,
      riskProfile,
    );

    // 6. BLIND SPOTS, SKILLS TO LEARN, CAPITAL ALLOCATION
    const commonBlindSpots = archetypeMeta.blindSpots;
    const topBusiness = allBusinesses.find(b => b.slug === topMatches[0]?.businessId) || allBusinesses[0];

    const userTopStrengthNames = new Set(top5Strengths.map(s => s.name));
    const skillsToLearn = topBusiness.skillsNeeded.filter(
      skill => !userTopStrengthNames.has(skill),
    );

    const capitalAllocationGuide = topBusiness?.capitalSplit || {
      inventory: 60,
      marketing: 20,
      emergencyFund: 10,
      operations: 10,
    };

    return {
      assessmentId,
      userId,
      primaryArchetype,
      primaryArchetypeSw: archetypeMeta.nameSw,
      secondaryArchetype,
      secondaryArchetypeSw: ARCHETYPE_INFO[secondaryArchetype]?.nameSw || secondaryArchetype,
      archetypeSummary: archetypeMeta.summary,
      traitPills: archetypeMeta.traits,
      topStrengths: top5Strengths,
      riskProfile,
      readinessScore,
      readinessVerdict,
      readinessPillars,
      topMatches,
      commonBlindSpots,
      skillsToLearn: skillsToLearn.length > 0 ? skillsToLearn : ['Digital Financial Bookkeeping', 'Tax & County Permitting Compliance'],
      capitalAllocationGuide,
    };
  }

  private computeStrengths(answers: Record<string, any>): Record<string, number> {
    const points: Record<string, number> = {
      Communication: 0,
      Sales: 0,
      Networking: 0,
      Leadership: 0,
      Creativity: 0,
      'Problem Solving': 0,
      Organization: 0,
      'Strategic Thinking': 0,
      Adaptability: 0,
      Persistence: 0,
      Teaching: 0,
      'Technical Ability': 0,
      'Customer Service': 0,
      'Decision Making': 0,
      'Attention To Detail': 0,
    };

    const add = (strength: string, pts: number) => {
      if (points[strength] !== undefined) {
        points[strength] += pts;
      }
    };

    // Q6: Activity Gives You Energy
    switch (answers['q6']) {
      case 'talking_people':
        add('Communication', 20); add('Networking', 15); add('Customer Service', 10); add('Sales', 10);
        break;
      case 'creating_things':
        add('Creativity', 20); add('Adaptability', 10); add('Strategic Thinking', 5);
        break;
      case 'solving_problems':
        add('Problem Solving', 20); add('Technical Ability', 10); add('Strategic Thinking', 10);
        break;
      case 'teaching_people':
        add('Teaching', 20); add('Communication', 15); add('Leadership', 10);
        break;
      case 'organizing_things':
        add('Organization', 20); add('Attention To Detail', 15); add('Decision Making', 5);
        break;
      case 'building_over_time':
        add('Strategic Thinking', 20); add('Persistence', 15); add('Leadership', 5);
        break;
      case 'creating_content':
        add('Creativity', 20); add('Communication', 10); add('Adaptability', 5);
        break;
    }

    // Q7: People Come To You For
    switch (answers['q7']) {
      case 'advice':
        add('Teaching', 20); add('Communication', 10);
        break;
      case 'creativity':
        add('Creativity', 20); add('Adaptability', 10);
        break;
      case 'leadership':
        add('Leadership', 20); add('Decision Making', 10);
        break;
      case 'technical_help':
        add('Technical Ability', 20); add('Problem Solving', 15);
        break;
      case 'organization':
        add('Organization', 20); add('Attention To Detail', 10);
        break;
      case 'selling':
        add('Sales', 20); add('Networking', 10); add('Communication', 10);
        break;
    }

    // Q8: Which Statement Sounds Most Like You
    switch (answers['q8']) {
      case 'sell_anything':
        add('Sales', 25); add('Communication', 15); add('Networking', 10);
        break;
      case 'help_learn':
        add('Teaching', 25); add('Communication', 15); add('Leadership', 5);
        break;
      case 'enjoy_creating':
        add('Creativity', 25); add('Adaptability', 10);
        break;
      case 'solve_difficult':
        add('Problem Solving', 25); add('Technical Ability', 15); add('Strategic Thinking', 10);
        break;
      case 'systems_org':
        add('Organization', 25); add('Attention To Detail', 15);
        break;
      case 'build_lasts':
        add('Strategic Thinking', 20); add('Persistence', 15); add('Leadership', 10);
        break;
    }

    // Q9: Best Describes You
    switch (answers['q9']) {
      case 'outgoing':
        add('Communication', 15); add('Networking', 15); add('Sales', 10);
        break;
      case 'reserved':
        add('Attention To Detail', 10); add('Technical Ability', 10);
        break;
      case 'analytical':
        add('Problem Solving', 20); add('Strategic Thinking', 15);
        break;
      case 'creative':
        add('Creativity', 20); add('Adaptability', 10);
        break;
      case 'practical':
        add('Organization', 10); add('Decision Making', 10);
        break;
      case 'adaptable':
        add('Adaptability', 20); add('Problem Solving', 5);
        break;
    }

    // Q11: Customer Interaction
    switch (answers['q11']) {
      case 'yes':
        add('Customer Service', 20); add('Communication', 10); add('Sales', 10);
        break;
      case 'sometimes':
        add('Customer Service', 10); add('Communication', 5);
        break;
      case 'no':
        add('Technical Ability', 10); add('Attention To Detail', 10);
        break;
    }

    // Q14: Manage Employees
    switch (answers['q14']) {
      case 'yes':
        add('Leadership', 20); add('Decision Making', 10);
        break;
      case 'no':
        add('Technical Ability', 5); add('Organization', 5);
        break;
      case 'eventually':
        add('Leadership', 10); add('Strategic Thinking', 10);
        break;
    }

    // Q15: Why a Business
    switch (answers['q15']) {
      case 'extra_income':
        add('Persistence', 10); add('Decision Making', 5);
        break;
      case 'financial_freedom':
        add('Strategic Thinking', 15); add('Persistence', 10);
        break;
      case 'replace_job':
        add('Persistence', 10); add('Decision Making', 10);
        break;
      case 'build_wealth':
        add('Strategic Thinking', 20); add('Leadership', 5);
        break;
      case 'create_impact':
        add('Teaching', 15); add('Leadership', 15);
        break;
      case 'build_legacy':
        add('Leadership', 20); add('Strategic Thinking', 20); add('Persistence', 10);
        break;
    }

    // Q19: If Business Failed
    switch (answers['q19']) {
      case 'try_again':
        add('Persistence', 20); add('Decision Making', 10);
        break;
      case 'learn_pivot':
        add('Adaptability', 15); add('Problem Solving', 10);
        break;
      case 'job_regroup':
        add('Strategic Thinking', 10); add('Decision Making', 5);
        break;
      case 'pause_reflect':
        add('Strategic Thinking', 5);
        break;
    }

    // Q20: Decision Style
    switch (answers['q20']) {
      case 'act_quickly':
        add('Decision Making', 20); add('Adaptability', 10);
        break;
      case 'gather_info':
        add('Problem Solving', 10); add('Decision Making', 10);
        break;
      case 'research_extensively':
        add('Strategic Thinking', 15); add('Attention To Detail', 15); add('Problem Solving', 10);
        break;
    }

    // Normalization to 0–100 against theoretical maximums per strength
    const maxTheoretical: Record<string, number> = {
      Communication: 80,
      Sales: 75,
      Networking: 60,
      Leadership: 75,
      Creativity: 85,
      'Problem Solving': 90,
      Organization: 75,
      'Strategic Thinking': 90,
      Adaptability: 65,
      Persistence: 75,
      Teaching: 80,
      'Technical Ability': 65,
      'Customer Service': 50,
      'Decision Making': 65,
      'Attention To Detail': 50,
    };

    const normalized: Record<string, number> = {};
    for (const [key, val] of Object.entries(points)) {
      const max = maxTheoretical[key] || 80;
      const rawPct = Math.round((val / max) * 100);
      normalized[key] = Math.min(Math.max(rawPct, 25), 98); // Ensure sensible baseline
    }

    return normalized;
  }

  private computeArchetypes(
    strengths: Record<string, number>,
    q10Answer?: string,
  ): Record<string, number> {
    const get = (name: string) => strengths[name] || 50;

    // Formulas defined in Brand Specification:
    // The Seller: Sales 40, Communication 25, Networking 20, Customer Service 15
    const seller = Math.round(
      get('Sales') * 0.40 +
      get('Communication') * 0.25 +
      get('Networking') * 0.20 +
      get('Customer Service') * 0.15,
    );

    // The Builder: Leadership 35, Persistence 25, Strategic Thinking 25, Organization 15
    const builder = Math.round(
      get('Leadership') * 0.35 +
      get('Persistence') * 0.25 +
      get('Strategic Thinking') * 0.25 +
      get('Organization') * 0.15,
    );

    // The Creator: Creativity 45, Adaptability 30, Communication 25
    let creator = Math.round(
      get('Creativity') * 0.45 +
      get('Adaptability') * 0.30 +
      get('Communication') * 0.25,
    );

    // The Teacher: Teaching 50, Communication 30, Leadership 20
    let teacher = Math.round(
      get('Teaching') * 0.50 +
      get('Communication') * 0.30 +
      get('Leadership') * 0.20,
    );

    // The Operator: Organization 40, Attention To Detail 30, Decision Making 15, Persistence 15
    const operator = Math.round(
      get('Organization') * 0.40 +
      get('Attention To Detail') * 0.30 +
      get('Decision Making') * 0.15 +
      get('Persistence') * 0.15,
    );

    // The Problem Solver: Problem Solving 35, Technical 25, Strategic Thinking 25, Decision Making 15
    const problemSolver = Math.round(
      get('Problem Solving') * 0.35 +
      get('Technical Ability') * 0.25 +
      get('Strategic Thinking') * 0.25 +
      get('Decision Making') * 0.15,
    );

    // Q10 online visibility adjustments:
    // A -> Creator +20, Teacher +10
    // B -> Creator +10
    // C -> none
    // D -> Creator -10
    // E -> Creator -20
    switch (q10Answer) {
      case 'opt_a':
        creator += 15;
        teacher += 8;
        break;
      case 'opt_b':
        creator += 8;
        break;
      case 'opt_d':
        creator -= 8;
        break;
      case 'opt_e':
        creator -= 15;
        break;
    }

    return {
      'The Seller': Math.min(Math.max(seller, 30), 99),
      'The Builder': Math.min(Math.max(builder, 30), 99),
      'The Creator': Math.min(Math.max(creator, 30), 99),
      'The Teacher': Math.min(Math.max(teacher, 30), 99),
      'The Operator': Math.min(Math.max(operator, 30), 99),
      'The Problem Solver': Math.min(Math.max(problemSolver, 30), 99),
    };
  }

  private computeRiskProfile(answers: Record<string, any>): string {
    const q18 = answers['q18'];
    const q19 = answers['q19'];
    const q20 = answers['q20'];

    if (q18 === 'aggressive') {
      return 'Aggressive';
    } else if (q18 === 'conservative') {
      return 'Conservative';
    } else {
      // Moderate baseline
      if (q19 === 'try_again' && q20 === 'act_quickly') {
        return 'Aggressive';
      }
      if (q19 === 'job_regroup' && q20 === 'research_extensively') {
        return 'Conservative';
      }
      return 'Moderate';
    }
  }

  private computeReadinessScore(
    answers: Record<string, any>,
    topStrengths: StrengthProfileItem[],
  ): {
    readinessScore: number;
    readinessVerdict: string;
    readinessPillars: ReadinessPillar[];
  } {
    // 1. Capital readiness (Q3): 20 pts
    let capScore = 10;
    switch (answers['q3']) {
      case 'under_10k': capScore = 8; break;
      case '10k_50k': capScore = 12; break;
      case '50k_100k': capScore = 16; break;
      case '100k_500k': capScore = 18; break;
      case '500k_1m':
      case 'above_1m': capScore = 20; break;
    }

    // 2. Time readiness (Q4): 20 pts
    let timeScore = 10;
    switch (answers['q4']) {
      case 'lt_10h': timeScore = 8; break;
      case '10_20h': timeScore = 12; break;
      case '20_40h': timeScore = 16; break;
      case 'full_time': timeScore = 20; break;
    }

    // 3. Goal clarity (Q15): 20 pts
    let goalScore = 15;
    switch (answers['q15']) {
      case 'extra_income': goalScore = 12; break;
      case 'replace_job': goalScore = 16; break;
      case 'financial_freedom': goalScore = 18; break;
      case 'build_wealth':
      case 'build_legacy': goalScore = 20; break;
      case 'create_impact': goalScore = 18; break;
    }

    // 4. Opportunity awareness (Q21, Q22): 20 pts
    const q21Count = Array.isArray(answers['q21']) ? answers['q21'].length : 0;
    const q22Count = Array.isArray(answers['q22']) ? answers['q22'].length : 0;
    const totalGaps = q21Count + q22Count;
    let oppScore = 8;
    if (totalGaps === 0) oppScore = 4;
    else if (totalGaps <= 2) oppScore = 10;
    else if (totalGaps <= 4) oppScore = 16;
    else oppScore = 20;

    // 5. Strength alignment: 20 pts
    const avgTopStrength = topStrengths.reduce((acc, s) => acc + s.score, 0) / (topStrengths.length || 1);
    let strengthScore = 14;
    if (avgTopStrength >= 75) strengthScore = 20;
    else if (avgTopStrength >= 55) strengthScore = 16;
    else strengthScore = 10;

    const totalScore = Math.min(Math.max(capScore + timeScore + goalScore + oppScore + strengthScore, 20), 100);

    let verdict = 'Almost ready';
    if (totalScore >= 80) verdict = 'Ready to start';
    else if (totalScore >= 60) verdict = 'Almost ready';
    else if (totalScore >= 40) verdict = 'Needs preparation';
    else verdict = 'Focus on skills first';

    const pillars: ReadinessPillar[] = [
      { pillar: 'Capital Readiness', score: capScore, maxScore: 20, description: 'Available startup liquidity and working capital reserve' },
      { pillar: 'Time Commitment', score: timeScore, maxScore: 20, description: 'Weekly hours realistically allocated to business operations' },
      { pillar: 'Goal Clarity', score: goalScore, maxScore: 20, description: 'Alignment on the core financial or impact mission' },
      { pillar: 'Opportunity Awareness', score: oppScore, maxScore: 20, description: 'Vigilance regarding local unmet consumer needs and frustrations' },
      { pillar: 'Strength Alignment', score: strengthScore, maxScore: 20, description: 'Concentration of natural entrepreneurial abilities' },
    ];

    return {
      readinessScore: totalScore,
      readinessVerdict: verdict,
      readinessPillars: pillars,
    };
  }

  private computeBusinessMatches(
    allBusinesses: Business[],
    primaryArchetype: string,
    secondaryArchetype: string,
    topStrengths: StrengthProfileItem[],
    answers: Record<string, any>,
    riskProfile: string,
  ): BusinessMatchItem[] {
    const userStrengthNames = new Set(topStrengths.map(s => s.name));
    const userLocation = answers['q2'] === 'rural' ? 'Rural' : answers['q2'] === 'town' ? 'Town' : 'Urban';
    const userCapital = answers['q3'] || '50k_100k';
    const userTime = answers['q4'] || '20_40h';

    // Opportunity keywords from Q21 / Q22 to grant +5 pts bonus
    const selectedOpportunities: string[] = [
      ...(Array.isArray(answers['q21']) ? answers['q21'] : []),
      ...(Array.isArray(answers['q22']) ? answers['q22'] : []),
    ];

    const scored = allBusinesses.map(biz => {
      let score = 0;

      // 1. Archetype Fit (30%)
      if (biz.bestArchetypes.includes(primaryArchetype)) {
        score += 30;
      } else if (biz.bestArchetypes.includes(secondaryArchetype)) {
        score += 18;
      } else {
        score += 8;
      }

      // 2. Strength Overlap (30%)
      const overlapCount = biz.idealStrengths.filter(st => userStrengthNames.has(st)).length;
      const overlapRatio = overlapCount / (biz.idealStrengths.length || 1);
      score += Math.round(overlapRatio * 30);

      // 3. Capital Fit (20%)
      // Hard filter / penalty if beyond user's capital band
      const capitalTiers = ['under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'above_1m'];
      const userCapIdx = capitalTiers.indexOf(userCapital);
      const bizCapIdx = capitalTiers.indexOf(biz.capitalBand);

      if (userCapIdx >= bizCapIdx) {
        score += 20;
      } else if (userCapIdx + 1 === bizCapIdx) {
        score += 8; // stretch capital
      } else {
        score -= 20; // out of reach
      }

      // 4. Location Fit (10%)
      if (biz.locationFit.includes(userLocation)) {
        score += 10;
      } else {
        score += 4;
      }

      // 5. Time Fit (5%)
      const timeRanks = ['lt_10h', '10_20h', '20_40h', 'full_time'];
      const userTimeIdx = timeRanks.indexOf(userTime);
      const bizTimeIdx = timeRanks.indexOf(biz.timeCommitment);
      if (userTimeIdx >= bizTimeIdx) {
        score += 5;
      } else {
        score += 2;
      }

      // 6. Risk Fit (5%)
      if (riskProfile === 'Aggressive') {
        score += biz.riskLevel === 'High' ? 5 : 4;
      } else if (riskProfile === 'Conservative') {
        score += biz.riskLevel === 'Low' ? 5 : biz.riskLevel === 'Medium' ? 3 : 0;
      } else {
        score += biz.riskLevel === 'Medium' ? 5 : 4;
      }

      // 7. Opportunity Bonus (+5%)
      const matchesLocalOpportunity = selectedOpportunities.some(opp => {
        if (opp === 'beauty_services' && biz.category === 'Beauty & Personal Care') return true;
        if (opp === 'affordable_food' && biz.category === 'Food & Beverage') return true;
        if (opp === 'reliable_transport' && biz.slug.includes('delivery')) return true;
        if (opp === 'farming_inputs' && biz.category === 'Agriculture') return true;
        if (opp === 'business_services' && (biz.category === 'Services' || biz.category === 'Digital')) return true;
        if (opp === 'household_supplies' && biz.category === 'Retail') return true;
        return false;
      });

      if (matchesLocalOpportunity) {
        score += 5;
      }

      // Scale to realistic match percentage (72% to 96%)
      const normalizedScore = Math.min(Math.max(Math.round(62 + (score / 100) * 34), 65), 97);

      // Construct "Why it fits" bullets
      const topMatchingStrength = biz.idealStrengths.find(st => userStrengthNames.has(st)) || 'Strong adaptability';
      const whyItFits = [
        `Aligned with your ${primaryArchetype} strengths`,
        `Capital requirement fits within your available investment budget`,
        `High operational demand in your ${userLocation} environment`,
      ];

      return {
        business: biz,
        score: normalizedScore,
        whyItFits,
      };
    });

    // Sort descending by match score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map(item => ({
      businessId: item.business.slug,
      name: item.business.name,
      nameSw: item.business.nameSw,
      category: item.business.category,
      categorySw: item.business.categorySw,
      matchScore: item.score,
      capitalBand: item.business.capitalBand,
      capitalRequiredMin: item.business.capitalRequiredMin,
      capitalRequiredMax: item.business.capitalRequiredMax,
      riskLevel: item.business.riskLevel,
      firstCustomerTimeline: item.business.firstCustomerTimeline,
      whyItFits: item.whyItFits,
      biggestAdvantage: item.business.biggestAdvantage,
      biggestRisk: item.business.biggestRisk,
      firstStep: item.business.firstStep,
      imageUrl: item.business.imageUrl,
    }));
  }
}
