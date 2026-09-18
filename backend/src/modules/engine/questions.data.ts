export interface QuestionOption {
  id: string;
  label: string;
  labelSw: string;
  subtitle?: string;
  subtitleSw?: string;
}

export interface QuestionDefinition {
  id: string;
  number: number;
  sectionId: number;
  sectionTitle: string;
  sectionTitleSw: string;
  text: string;
  textSw: string;
  type: 'single' | 'multi' | 'text';
  maxSelect?: number;
  options?: QuestionOption[];
  optional?: boolean;
}

export const CANONICAL_SECTIONS = [
  { id: 1, title: 'Your Current Situation', titleSw: 'Hali Yako ya Sasa' },
  { id: 2, title: 'Your Strengths', titleSw: 'Nguvu Zako' },
  { id: 3, title: 'Your Work Style', titleSw: 'Mtindo Wako wa Kazi' },
  { id: 4, title: 'Your Goals', titleSw: 'Malengo Yako' },
  { id: 5, title: 'Risk & Decision Making', titleSw: 'Uthubutu na Ufanyaji Maamuzi' },
  { id: 6, title: 'Local Opportunities', titleSw: 'Fursa za Karibu Nawe' },
];

export const CANONICAL_QUESTIONS: QuestionDefinition[] = [
  // SECTION 1: SITUATION
  {
    id: 'q1',
    number: 1,
    sectionId: 1,
    sectionTitle: 'Your Current Situation',
    sectionTitleSw: 'Hali Yako ya Sasa',
    text: 'Which country are you living in?',
    textSw: 'Unaishi nchi gani?',
    type: 'single',
    options: [
      { id: 'kenya', label: 'Kenya', labelSw: 'Kenya' },
      { id: 'uganda', label: 'Uganda', labelSw: 'Uganda' },
      { id: 'tanzania', label: 'Tanzania', labelSw: 'Tanzania' },
      { id: 'rwanda', label: 'Rwanda', labelSw: 'Rwanda' },
      { id: 'nigeria', label: 'Nigeria', labelSw: 'Nigeria' },
      { id: 'ghana', label: 'Ghana', labelSw: 'Ghana' },
      { id: 'south_africa', label: 'South Africa', labelSw: 'Afrika Kusini' },
      { id: 'other', label: 'Other African Country', labelSw: 'Nchi Nyingine ya Kiafrika' },
    ]
  },
  {
    id: 'q2',
    number: 2,
    sectionId: 1,
    sectionTitle: 'Your Current Situation',
    sectionTitleSw: 'Hali Yako ya Sasa',
    text: 'Where are you based?',
    textSw: 'Unaishi wapi hasa?',
    type: 'single',
    options: [
      { id: 'urban', label: 'Major City', labelSw: 'Jiji Kuu (mfano Nairobi, Mombasa)' },
      { id: 'town', label: 'Town / Municipality', labelSw: 'Mji / Manispaa (mfano Nakuru, Kisumu)' },
      { id: 'rural', label: 'Rural Area', labelSw: 'Eneo la Vijijini' },
    ]
  },
  {
    id: 'q3',
    number: 3,
    sectionId: 1,
    sectionTitle: 'Your Current Situation',
    sectionTitleSw: 'Hali Yako ya Sasa',
    text: 'How much capital do you currently have available to invest?',
    textSw: 'Una mtaji kiasi gani uliopo sasa wa kuwekeza?',
    type: 'single',
    options: [
      { id: 'under_10k', label: 'Under KES 10,000', labelSw: 'Chini ya KES 10,000' },
      { id: '10k_50k', label: 'KES 10,000 – 50,000', labelSw: 'KES 10,000 – 50,000' },
      { id: '50k_100k', label: 'KES 50,000 – 100,000', labelSw: 'KES 50,000 – 100,000' },
      { id: '100k_500k', label: 'KES 100,000 – 500,000', labelSw: 'KES 100,000 – 500,000' },
      { id: '500k_1m', label: 'KES 500,000 – 1 Million', labelSw: 'KES 500,000 – Milioni 1' },
      { id: 'above_1m', label: 'Above KES 1 Million', labelSw: 'Zaidi ya KES Milioni 1' },
    ]
  },
  {
    id: 'q4',
    number: 4,
    sectionId: 1,
    sectionTitle: 'Your Current Situation',
    sectionTitleSw: 'Hali Yako ya Sasa',
    text: 'How much time can you realistically dedicate each week?',
    textSw: 'Unaweza kutumia muda gani kwa uhalisia kila wiki?',
    type: 'single',
    options: [
      { id: 'lt_10h', label: 'Less than 10 hours', labelSw: 'Chini ya masaa 10' },
      { id: '10_20h', label: '10 – 20 hours', labelSw: 'Masaa 10 – 20' },
      { id: '20_40h', label: '20 – 40 hours', labelSw: 'Masaa 20 – 40' },
      { id: 'full_time', label: 'Full-Time (40+ hours)', labelSw: 'Muda kamili (masaa 40+)' },
    ]
  },
  {
    id: 'q5',
    number: 5,
    sectionId: 1,
    sectionTitle: 'Your Current Situation',
    sectionTitleSw: 'Hali Yako ya Sasa',
    text: 'What is your current situation?',
    textSw: 'Hali yako ya kikazi sasa ni ipi?',
    type: 'single',
    options: [
      { id: 'student', label: 'Student', labelSw: 'Mwanafunzi' },
      { id: 'employed', label: 'Employed', labelSw: 'Nimeajiriwa' },
      { id: 'self_employed', label: 'Self-Employed / Freelancer', labelSw: 'Kujiajiri / Mfanyakazi huru' },
      { id: 'business_owner', label: 'Business Owner', labelSw: 'Mmiliki wa Biashara' },
      { id: 'unemployed', label: 'Unemployed', labelSw: 'Sina ajira kwa sasa' },
      { id: 'retired', label: 'Retired', labelSw: 'Nimestaafu' },
    ]
  },

  // SECTION 2: STRENGTHS
  {
    id: 'q6',
    number: 6,
    sectionId: 2,
    sectionTitle: 'Your Strengths',
    sectionTitleSw: 'Nguvu Zako',
    text: 'Which activity gives you the most energy?',
    textSw: 'Ni shughuli ipi inayokupa nguvu na ari zaidi?',
    type: 'single',
    options: [
      { id: 'talking_people', label: 'Talking to people & building relationships', labelSw: 'Kuzungumza na watu na kujenga mahusiano' },
      { id: 'creating_things', label: 'Creating things & artistic design', labelSw: 'Kubuni na kutengeneza vitu vya ubunifu' },
      { id: 'solving_problems', label: 'Solving difficult problems & analyzing challenges', labelSw: 'Kutatua matatizo magumu na kuchanganua changamoto' },
      { id: 'teaching_people', label: 'Teaching people & mentoring others', labelSw: 'Kufundisha watu na kuelekeza wengine' },
      { id: 'organizing_things', label: 'Organizing things, systems & details', labelSw: 'Kupanga mifumo, maelezo na ratiba' },
      { id: 'building_over_time', label: 'Building long-term projects with persistence', labelSw: 'Kujenga miradi ya muda mrefu kwa uthabiti' },
      { id: 'creating_content', label: 'Creating content & sharing ideas online', labelSw: 'Kutengeneza maudhui mtandaoni na kushiriki mawazo' },
    ]
  },
  {
    id: 'q7',
    number: 7,
    sectionId: 2,
    sectionTitle: 'Your Strengths',
    sectionTitleSw: 'Nguvu Zako',
    text: 'People usually come to me for:',
    textSw: 'Watu kwa kawaida hunijia kwa ajili ya:',
    type: 'single',
    options: [
      { id: 'advice', label: 'Advice, guidance and encouragement', labelSw: 'Ushauri, mwelekeo na kutia moyo' },
      { id: 'creativity', label: 'Creative ideas and visual concepts', labelSw: 'Mawazo ya kibunifu na mtindo' },
      { id: 'leadership', label: 'Leadership and decisive direction', labelSw: 'Uongozi na uamuzi thabiti' },
      { id: 'technical_help', label: 'Technical help and practical fixes', labelSw: 'Msaada wa kiufundi na kurekebisha vifaa/mifumo' },
      { id: 'organization', label: 'Organization, planning and logistics', labelSw: 'Mipango, mpangilio na usimamizi wa kazi' },
      { id: 'selling', label: 'Selling, connecting and closing deals', labelSw: 'Kuuza, kuunganisha watu na kukamilisha mikataba' },
    ]
  },
  {
    id: 'q8',
    number: 8,
    sectionId: 2,
    sectionTitle: 'Your Strengths',
    sectionTitleSw: 'Nguvu Zako',
    text: 'Which statement sounds most like you?',
    textSw: 'Ni kauli ipi inayofanana zaidi na wewe?',
    type: 'single',
    options: [
      { id: 'sell_anything', label: 'I can sell almost anything to anyone', labelSw: 'Ninaweza kuuza karibu chochote kwa yeyote' },
      { id: 'help_learn', label: 'I enjoy helping people learn and develop', labelSw: 'Ninafurahia kusaidia watu kujifunza na kukua' },
      { id: 'enjoy_creating', label: 'I enjoy creating original things and bringing ideas to life', labelSw: 'Ninafurahia kutengeneza vitu halisi na kutimiza mawazo' },
      { id: 'solve_difficult', label: 'I enjoy solving complex and difficult puzzles', labelSw: 'Ninafurahia kutatua mafumbo magumu' },
      { id: 'systems_org', label: 'I enjoy systems, structure and flawless organization', labelSw: 'Ninafurahia mifumo, mpangilio thabiti na muundo' },
      { id: 'build_lasts', label: 'I enjoy building something substantial that lasts', labelSw: 'Ninafurahia kujenga kitu thabiti kitakachodumu' },
    ]
  },
  {
    id: 'q9',
    number: 9,
    sectionId: 2,
    sectionTitle: 'Your Strengths',
    sectionTitleSw: 'Nguvu Zako',
    text: 'Which word best describes your natural personality?',
    textSw: 'Ni neno gani linaloelezea vizuri utu wako wa asili?',
    type: 'single',
    options: [
      { id: 'outgoing', label: 'Outgoing & Expressive', labelSw: 'Mchangamfu na Mwenye kuwasiliana kwa urahisi' },
      { id: 'reserved', label: 'Reserved & Detail-Focused', labelSw: 'Mtulivu na Makini na maelezo madogo' },
      { id: 'analytical', label: 'Analytical & Objective', labelSw: 'Mchambuzi wa hoja na takwimu' },
      { id: 'creative', label: 'Creative & Visionary', labelSw: 'Mbunifu na Mwenye maono mapya' },
      { id: 'practical', label: 'Practical & Grounded', labelSw: 'Vitendo na Halisi' },
      { id: 'adaptable', label: 'Adaptable & Flexible', labelSw: 'Mwenye kubadilika haraka na mazingira' },
    ]
  },
  {
    id: 'q10',
    number: 10,
    sectionId: 2,
    sectionTitle: 'Your Strengths',
    sectionTitleSw: 'Nguvu Zako',
    text: 'How comfortable are you being visible online or putting yourself out there publicly?',
    textSw: 'Unajisikia huru kiasi gani kuonekana mtandaoni au kujitangaza hadharani?',
    type: 'single',
    options: [
      { id: 'opt_a', label: 'Very comfortable — I love video, photos and public speaking', labelSw: 'Huru sana — Ninapenda video, picha na kuongea hadharani' },
      { id: 'opt_b', label: 'Somewhat comfortable — I can do it when necessary', labelSw: 'Kiasi fulani — Ninaweza kufanya inapobidi' },
      { id: 'opt_c', label: 'Neutral — Neither excited nor opposed', labelSw: 'Wastani — Sina wasiwasi wala hamasa kubwa' },
      { id: 'opt_d', label: 'Uncomfortable — I prefer operating behind the scenes', labelSw: 'Sijisikii vizuri — Ninapendelea kufanya kazi faragha/nyuma ya pazia' },
      { id: 'opt_e', label: 'Very uncomfortable — I strictly want anonymous or offline work', labelSw: 'Sipendi kabisa — Ninataka kazi bila kuonekana hadharani' },
    ]
  },

  // SECTION 3: WORK STYLE
  {
    id: 'q11',
    number: 11,
    sectionId: 3,
    sectionTitle: 'Your Work Style',
    sectionTitleSw: 'Mtindo Wako wa Kazi',
    text: 'Do you enjoy interacting with customers face-to-face every day?',
    textSw: 'Je, unafurahia kukutana na wateja ana kwa ana kila siku?',
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes, it energizes me', labelSw: 'Ndio, inanipa nguvu na motisha' },
      { id: 'sometimes', label: 'Sometimes, in balanced amounts', labelSw: 'Wakati mwingine, kwa kiasi cha wastani' },
      { id: 'no', label: 'No, I prefer behind-the-scenes or independent work', labelSw: 'Hapana, napendelea kazi ya kujitegemea au ya ndani' },
    ]
  },
  {
    id: 'q12',
    number: 12,
    sectionId: 3,
    sectionTitle: 'Your Work Style',
    sectionTitleSw: 'Mtindo Wako wa Kazi',
    text: 'How would you prefer to work?',
    textSw: 'Je, ungependelea kufanya kazi kwa njia gani?',
    type: 'single',
    options: [
      { id: 'online', label: 'Mostly online (laptop, phone, remote)', labelSw: 'Mtandaoni zaidi (laptop, simu, popote)' },
      { id: 'physical', label: 'Mostly physical / on the ground (shop, farm, field)', labelSw: 'Ana kwa ana / uwanjani (duka, shamba, ofisi)' },
      { id: 'mix', label: 'A hybrid mix of both physical and digital', labelSw: 'Mchanganyiko wa mtandaoni na ana kwa ana' },
    ]
  },
  {
    id: 'q13',
    number: 13,
    sectionId: 3,
    sectionTitle: 'Your Work Style',
    sectionTitleSw: 'Mtindo Wako wa Kazi',
    text: 'Which working environment sounds most exciting to you?',
    textSw: 'Mazingira yapi ya kazi yanakuvutia zaidi?',
    type: 'single',
    options: [
      { id: 'shop', label: 'Running a physical shop / retail spot', labelSw: 'Kusimamia duka la bidhaa halisi' },
      { id: 'service', label: 'Running a hands-on service business', labelSw: 'Kuendesha biashara ya kutoa huduma' },
      { id: 'online_biz', label: 'Running a digital / online agency or e-commerce', labelSw: 'Biashara ya kidijitali / mtandaoni' },
      { id: 'creative_brand', label: 'Running a creative brand or media studio', labelSw: 'Kujenga chapa ya kibunifu au studio ya maudhui' },
      { id: 'training', label: 'Running a training, coaching or education hub', labelSw: 'Kituo cha mafunzo, ushauri na elimu' },
      { id: 'larger_co', label: 'Running a larger enterprise with staff & physical operations', labelSw: 'Kampuni kubwa yenye wafanyakazi na mifumo' },
    ]
  },
  {
    id: 'q14',
    number: 14,
    sectionId: 3,
    sectionTitle: 'Your Work Style',
    sectionTitleSw: 'Mtindo Wako wa Kazi',
    text: 'Would you like to manage employees or staff?',
    textSw: 'Je, ungependa kusimamia wafanyakazi?',
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes, I want to lead a team from day one', labelSw: 'Ndio, nataka kuongoza timu tangu mwanzo' },
      { id: 'no', label: 'No, I prefer solo operations or automated setups', labelSw: 'Hapana, napendelea kufanya kazi peke yangu au kiotomatiki' },
      { id: 'eventually', label: 'Eventually, as the business scales', labelSw: 'Hapo baadaye, biashara ikikua' },
    ]
  },

  // SECTION 4: GOALS
  {
    id: 'q15',
    number: 15,
    sectionId: 4,
    sectionTitle: 'Your Goals',
    sectionTitleSw: 'Malengo Yako',
    text: 'Why do you want to start or run a business?',
    textSw: 'Kwanini unataka kuanzisha au kuendesha biashara?',
    type: 'single',
    options: [
      { id: 'extra_income', label: 'Extra income (side hustle alongside daily commitments)', labelSw: 'Kipato cha ziada (kazi ya pembeni)' },
      { id: 'replace_job', label: 'Replace my 9-to-5 job and be my own boss', labelSw: 'Kupata mbadala wa ajira yangu ya sasa' },
      { id: 'financial_freedom', label: 'Financial freedom and autonomy over my time', labelSw: 'Uhuru wa kifedha na kumiliki muda wangu' },
      { id: 'build_wealth', label: 'Build significant wealth and assets for the future', labelSw: 'Kujenga utajiri mkubwa na rasilimali kwa siku zijazo' },
      { id: 'create_impact', label: 'Create positive social impact in my community', labelSw: 'Kuletea jamii yangu manufaa na maendeleo' },
      { id: 'build_legacy', label: 'Build a lasting multi-generational family legacy', labelSw: 'Kujenga urithi thabiti kwa vizazi vijavyo' },
    ]
  },
  {
    id: 'q16',
    number: 16,
    sectionId: 4,
    sectionTitle: 'Your Goals',
    sectionTitleSw: 'Malengo Yako',
    text: 'What matters most to you right now?',
    textSw: 'Ni nini cha muhimu zaidi kwako kwa sasa?',
    type: 'single',
    options: [
      { id: 'flexibility', label: 'Flexibility & control over schedule', labelSw: 'Nafasi na uhuru wa ratiba yangu' },
      { id: 'stability', label: 'Stability & predictable monthly cash flow', labelSw: 'Uthabiti na mtiririko wa uhakika wa fedha' },
      { id: 'growth', label: 'High growth potential and scalability', labelSw: 'Uwezo wa kukua kwa haraka na kupanuka' },
      { id: 'profitability', label: 'High profit margins per sale', labelSw: 'Faida kubwa kwa kila mauzo' },
      { id: 'creativity', label: 'Creative expression and autonomy', labelSw: 'Kujieleza kwa ubunifu na uhuru wa maamuzi' },
      { id: 'purpose', label: 'Meaningful purpose and community uplifting', labelSw: 'Kazi yenye maana na kuinua wengine' },
    ]
  },
  {
    id: 'q17',
    number: 17,
    sectionId: 4,
    sectionTitle: 'Your Goals',
    sectionTitleSw: 'Malengo Yako',
    text: 'How much monthly income would make you feel successful in the next 12 months?',
    textSw: 'Ni kipato kipi cha kila mwezi kitakachokufanya ujisikie umefanikiwa ndani ya miezi 12 ijayo?',
    type: 'single',
    options: [
      { id: 'under_20k', label: 'Under KES 20,000', labelSw: 'Chini ya KES 20,000' },
      { id: '20k_50k', label: 'KES 20,000 – 50,000', labelSw: 'KES 20,000 – 50,000' },
      { id: '50k_100k', label: 'KES 50,000 – 100,000', labelSw: 'KES 50,000 – 100,000' },
      { id: '100k_300k', label: 'KES 100,000 – 300,000', labelSw: 'KES 100,000 – 300,000' },
      { id: 'above_300k', label: 'Above KES 300,000', labelSw: 'Zaidi ya KES 300,000' },
    ]
  },

  // SECTION 5: RISK & DECISION MAKING
  {
    id: 'q18',
    number: 18,
    sectionId: 5,
    sectionTitle: 'Risk & Decision Making',
    sectionTitleSw: 'Uthubutu na Ufanyaji Maamuzi',
    text: 'Which risk statement sounds most like you?',
    textSw: 'Ni kauli ipi ya uthubutu inayofanana na mtazamo wako?',
    type: 'single',
    options: [
      { id: 'conservative', label: 'I prefer smaller, predictable, low-risk profits', labelSw: 'Napendelea faida ndogo ya uhakika na hatari ndogo (Conservative)' },
      { id: 'moderate', label: 'I am comfortable taking calculated, moderate risks', labelSw: 'Niko tayari kuchukua tahadhari na hatari za wastani (Moderate)' },
      { id: 'aggressive', label: 'I am willing to take bigger risks for much bigger rewards', labelSw: 'Niko tayari kuchukua hatari kubwa kwa manufaa makubwa (Aggressive)' },
    ]
  },
  {
    id: 'q19',
    number: 19,
    sectionId: 5,
    sectionTitle: 'Risk & Decision Making',
    sectionTitleSw: 'Uthubutu na Ufanyaji Maamuzi',
    text: 'If your first business failed, what would you most likely do?',
    textSw: 'Kama biashara yako ya kwanza ikikwama, utafanya nini?',
    type: 'single',
    options: [
      { id: 'try_again', label: 'Try again immediately with high persistence', labelSw: 'Kujaribu tena mara moja kwa uvumilivu mkubwa' },
      { id: 'learn_pivot', label: 'Learn from the feedback and pivot into something different', labelSw: 'Kujifunza kutokana na makosa na kubadilisha mwelekeo' },
      { id: 'job_regroup', label: 'Get a stable job first, save up and regroup', labelSw: 'Kutafuta kazi kwanza, kuweka akiba na kupanga upya' },
      { id: 'pause_reflect', label: 'Pause, study the market carefully before trying again', labelSw: 'Kupumzika kidogo na kutafiti soko kwa uangalifu kabla ya kuanza tena' },
    ]
  },
  {
    id: 'q20',
    number: 20,
    sectionId: 5,
    sectionTitle: 'Risk & Decision Making',
    sectionTitleSw: 'Uthubutu na Ufanyaji Maamuzi',
    text: 'When making important decisions, do you:',
    textSw: 'Unapofanya maamuzi muhimu, wewe:',
    type: 'single',
    options: [
      { id: 'act_quickly', label: 'Act quickly based on intuition and immediate opportunity', labelSw: 'Hufanya uamuzi haraka kwa hisia na fursa iliyopo mbele' },
      { id: 'gather_info', label: 'Gather some key facts then move decisively', labelSw: 'Hukusanya taarifa za msingi kisha huchukua hatua' },
      { id: 'research_extensively', label: 'Research extensively, analyze numbers and evaluate every detail', labelSw: 'Hutafiti kwa kina, kuchambua namba na kutathmini kila undani' },
    ]
  },

  // SECTION 6: LOCAL OPPORTUNITIES
  {
    id: 'q21',
    number: 21,
    sectionId: 6,
    sectionTitle: 'Local Opportunities',
    sectionTitleSw: 'Fursa za Karibu Nawe',
    text: 'Which products or services are difficult to access near you? (Choose up to 3)',
    textSw: 'Ni bidhaa au huduma zipi ambazo ni ngumu kupata karibu na eneo lako? (Chagua hadi 3)',
    type: 'multi',
    maxSelect: 3,
    options: [
      { id: 'clean_water', label: 'Clean drinking water & refills', labelSw: 'Maji safi ya kunywa na kujaza tena' },
      { id: 'affordable_food', label: 'Affordable, clean & nutritious food / fast meals', labelSw: 'Chakula safi cha bei nafuu / mikahawa' },
      { id: 'reliable_transport', label: 'Reliable transport / delivery logistics', labelSw: 'Usafiri wa uhakika / huduma za bodaboda na utoaji' },
      { id: 'childcare', label: 'Quality childcare & early learning', labelSw: 'Huduma bora ya kulelea watoto' },
      { id: 'beauty_services', label: 'Quality beauty, barbershop & styling services', labelSw: 'Saluni bora ya kike au kiume / urembo' },
      { id: 'farming_inputs', label: 'Affordable farming inputs & vet supplies', labelSw: 'Pembejeo za kilimo na mifugo za bei nafuu' },
      { id: 'business_services', label: 'Business services (printing, cyber, branding, accounting)', labelSw: 'Huduma za biashara (uchapishaji, cyber, hesabu)' },
      { id: 'internet_services', label: 'Reliable Wi-Fi & IT repairs', labelSw: 'Mtandao wa kuaminika na matengenezo ya vifaa' },
      { id: 'household_supplies', label: 'Affordable household essentials & retail variety', labelSw: 'Bidhaa muhimu za nyumbani na maduka' },
      { id: 'building_materials', label: 'Hardware & building materials', labelSw: 'Vifaa vya ujenzi na hardware' },
      { id: 'healthcare', label: 'Accessible healthcare clinics & chemist services', labelSw: 'Huduma za afya na maduka ya dawa (chemist)' },
      { id: 'other', label: 'Other missing service', labelSw: 'Huduma nyingine inayokosekana' },
    ]
  },
  {
    id: 'q22',
    number: 22,
    sectionId: 6,
    sectionTitle: 'Local Opportunities',
    sectionTitleSw: 'Fursa za Karibu Nawe',
    text: 'What do people complain about most around your neighborhood? (Choose up to 3)',
    textSw: 'Watu wanalalamikia nini zaidi katika mtaa au eneo lako? (Chagua hadi 3)',
    type: 'multi',
    maxSelect: 3,
    options: [
      { id: 'high_prices', label: 'High prices and inflation', labelSw: 'Bei za juu za bidhaa na gharama ya maisha' },
      { id: 'unemployment', label: 'Youth unemployment & lack of income opportunities', labelSw: 'Ukosefu wa ajira kwa vijana' },
      { id: 'poor_customer_service', label: 'Rude staff & poor customer care in shops', labelSw: 'Huduma mbaya kwa wateja madukani' },
      { id: 'limited_shopping', label: 'Limited shopping choices / low stock quality', labelSw: 'Uchaguzi mdogo wa maduka / bidhaa duni' },
      { id: 'transport_hassle', label: 'Transport delays and commuter struggles', labelSw: 'Usumbufu na changamoto za usafiri' },
      { id: 'access_to_finance', label: 'Lack of working capital / mobile money agency queues', labelSw: 'Foleni za M-Pesa / ukosefu wa mikopo midogo' },
      { id: 'housing_issues', label: 'Substandard housing or rental agents', labelSw: 'Upangaji wa nyumba duni na mawakala wasioaminika' },
      { id: 'education_struggles', label: 'Expensive coaching and lack of practical skill classes', labelSw: 'Gharama za masomo ya ziada na ukosefu wa ujuzi' },
      { id: 'waste_cleanliness', label: 'Dirty surroundings & poor trash collection', labelSw: 'Uchafu na ukosefu wa uzoaji taka' },
      { id: 'other_complaints', label: 'Other common frustrations', labelSw: 'Malalamiko mengine ya kawaida' },
    ]
  },

  // BONUS CLOSER (OPTIONAL)
  {
    id: 'q23_passion',
    number: 23,
    sectionId: 6,
    sectionTitle: 'Local Opportunities',
    sectionTitleSw: 'Fursa za Karibu Nawe',
    text: "If money wasn't a concern, what would you enjoy building or creating?",
    textSw: 'Kama pesa isingekuwa tatizo, ni kitu gani ungependa kukijenga au kukianzisha?',
    type: 'text',
    optional: true
  }
];
