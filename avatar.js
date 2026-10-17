/* نظام الشخصيات الكرتونية (أجسام + وشوش + طواقي) - منقول من v13 */
const CHARACTER_PARTS = {
  outfit: [
    {
      id: 'karak_cup',
      name: 'كوب الكرك الذهبي',
      bodyTop: '#E6B98A',
      bodyBot: '#C48F5A',
      rimColor: '#FFFDF7',
      liquidColor: '#B5743A',
      bandColor: '#7F4F24',
      shoeColor: '#FFFDF7',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'sahlab_mug',
      name: 'مج السحلب الكريمي',
      bodyTop: '#FFFDF7',
      bodyBot: '#E8D8C0',
      rimColor: '#FFFFFF',
      liquidColor: '#F3E5AB',
      bandColor: '#D4A373',
      shoeColor: '#A67C52',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'tamar_glass',
      name: 'كاس التمر هندي',
      bodyTop: '#9E2A2B',
      bodyBot: '#540B0E',
      rimColor: '#F8EDEB',
      liquidColor: '#780000',
      bandColor: '#E09F3E',
      shoeColor: '#9E2A2B',
      handleSide: 'none',
      hasSleeve: false
    },
    {
      id: 'mint_tea',
      name: 'كباية الشاي بالنعناع',
      bodyTop: '#E76F51',
      bodyBot: '#9C2C13',
      rimColor: '#FAE1DD',
      liquidColor: '#B5381A',
      bandColor: '#2A9D8F',
      shoeColor: '#2A9D8F',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'gold_kanaka',
      name: 'فنجان القهوة التركي',
      bodyTop: '#DDA15E',
      bodyBot: '#8C5A2B',
      rimColor: '#FEFAE0',
      liquidColor: '#4A2C11',
      bandColor: '#603808',
      shoeColor: '#603808',
      handleSide: 'left',
      hasSleeve: true
    },
    {
      id: 'espresso_suit',
      name: 'كوب الإسبريسو الدارك',
      bodyTop: '#5C4438',
      bodyBot: '#36261E',
      rimColor: '#E6CCB2',
      liquidColor: '#3B2314',
      bandColor: '#DDA843',
      shoeColor: '#3B2A20',
      handleSide: 'right',
      hasSleeve: true
    },
    {
      id: 'arabic_dallah',
      name: 'شخصية الدلة الذهبية',
      bodyTop: '#F2C94C',
      bodyBot: '#B8860B',
      rimColor: '#FFF9DB',
      liquidColor: '#8D6E63',
      bandColor: '#9E2A2B',
      shoeColor: '#B8860B',
      handleSide: 'both',
      hasSleeve: true
    },
    {
      id: 'moroccan_teapot',
      name: 'كاس الليمون بالنعناع',
      bodyTop: '#52B788',
      bodyBot: '#1B4332',
      rimColor: '#D8F3DC',
      liquidColor: '#40916C',
      bandColor: '#F4D35E',
      shoeColor: '#2D6A4F',
      handleSide: 'none',
      hasSleeve: false
    }
  ],

  // 40 وش كرتوني معبر (تظهر بوضوح في الشبكة وتركب فوراً على الشخصية)
  face: [
    { id: 'mustache_boss', name: 'شنب العمدة' },
    { id: 'nerd_glasses', name: 'نظارة العبقري' },
    { id: 'cool_shades', name: 'نظارة شمس رايقة' },
    { id: 'wink_mustache', name: 'غمزة بشنب' },
    { id: 'wink_smart', name: 'غمزة ذكية' },
    { id: 'laugh_joy', name: 'ضحكة القهوة' },
    { id: 'monocle_judge', name: 'عدسة المحقق' },
    { id: 'pirate_patch', name: 'ربطة القرصان' },
    { id: 'shocked_eyes', name: 'مصدوم من الهينت' },
    { id: 'happy_smile', name: 'ابتسامة الخدود' },
    { id: 'angry_fierce', name: 'نظرة التحدي' },
    { id: 'starry_eyes', name: 'عيون النجوم' },
    { id: 'sleepy_yawn', name: 'نعسان قبل القهوة' },
    { id: 'sly_smirk', name: 'ابتسامة الخداع' },
    { id: 'cry_laugh', name: 'دموع الضحك' },
    { id: 'heart_eyes', name: 'عيون القلوب' },
    { id: 'detective_pipe', name: 'غليون المحقق' },
    { id: 'pixel_shades', name: 'نظارة البكسل' },
    { id: 'royal_goatee', name: 'سكسوكة الباشا' },
    { id: 'whistle_cute', name: 'صفارة البراءة' },
    { id: 'side_eye', name: 'نظرة الشك' },
    { id: 'handlebar_twirl', name: 'شنب مبروم' },
    { id: 'aviator_gold', name: 'نظارة طيار' },
    { id: 'cat_whiskers', name: 'شوارب القطة' },
    { id: 'laser_eyes', name: 'عيون الليزر' },
    { id: 'dizzy_spiral', name: 'دايخ من الأسئلة' },
    { id: 'money_eyes', name: 'عيون الجائزة' },
    { id: 'bandit_mask', name: 'قناع اللص' },
    { id: 'cigar_boss', name: 'سيجار المعلم' },
    { id: 'blush_shy', name: 'خجول ومكسوف' },
    { id: 'vampire_fangs', name: 'أنياب الكونت' },
    { id: 'robot_visor', name: 'شاشة الروبوت' },
    { id: 'crying_river', name: 'شلال دموع' },
    { id: 'kiss_face', name: 'قبلة النصر' },
    { id: 'zen_calm', name: 'هدوء الفيلسوف' },
    { id: 'clown_nose', name: 'أنف المهرج' },
    { id: 'scar_warrior', name: 'ندبة المحارب' },
    { id: 'bubblegum_pop', name: 'فقاعة اللبان' },
    { id: 'unibrow_funny', name: 'الحاجب المتصل' },
    { id: 'king_beard', name: 'لحية الحكيم' }
  ],

  hat: [
    { id: 'fez_tarboush', name: 'طربوش الباشا' },
    { id: 'winter_beanie', name: 'آيس كاب شتوي' },
    { id: 'cowboy_hat', name: 'كاب كاجوال' },
    { id: 'sultan_crown', name: 'تاج السلطان' },
    { id: 'chef_toque', name: 'طقية الشيف' },
    { id: 'ghutra_agal', name: 'غترة وعقال' },
    { id: 'detective_hat', name: 'قبعة شارلوك' },
    { id: 'straw_hat', name: 'قبعة قش صيفية' },
    { id: 'pirate_hat', name: 'قبعة القبطان' },
    { id: 'Graduation_cap', name: 'قبعة الفيلسوف' },
    { id: 'royal_turban', name: 'عمامة شهريار' },
    { id: 'pharaoh_nemes', name: 'التاج الفرعوني' },
    { id: 'french_beret', name: 'بيريه الفنان' },
    { id: 'top_hat', name: 'قبعة الساحر' },
    { id: 'viking_helmet', name: 'خوذة الفايكنج' },
    { id: 'dj_headphones', name: 'سماعات الدي جي' },
    { id: 'propeller_cap', name: 'طقية المروحة' },
    { id: 'knight_helmet', name: 'خوذة الفارس' },
    { id: 'whipped_cherry', name: 'كتكوت القهوة' },
    { id: 'jester_hat', name: 'طوق الورد الملكي' }
  ]
};

/**
 * رسم الـ 40 وش كرتوني داخل إحداثيات موحدة (X: 74..186, Y: 116..196)
 */
function renderFaceVector(faceId) {
  const stroke = '#231710';
  switch (faceId) {
    case 'mustache_boss':
      return `
        <g>
          <path d="M90 136 Q102 124 114 136" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M146 136 Q158 124 170 136" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M130 158 C112 148, 86 158, 80 170 C96 175, 118 170, 130 164 C142 170, 164 175, 180 170 C174 158, 148 148, 130 158 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M120 170 Q130 180 140 170" fill="#C84B31" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'nerd_glasses':
      return `
        <g>
          <path d="M76 136 L184 136" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <rect x="82" y="130" width="40" height="26" rx="8" fill="#D8E2DC" stroke="${stroke}" stroke-width="4"/>
          <rect x="138" y="130" width="40" height="26" rx="8" fill="#D8E2DC" stroke="${stroke}" stroke-width="4"/>
          <circle cx="102" cy="143" r="5" fill="${stroke}"/>
          <circle cx="158" cy="143" r="5" fill="${stroke}"/>
          <line x1="90" y1="135" x2="98" y2="148" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="146" y1="135" x2="154" y2="148" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M114 170 Q130 182 146 170" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'cool_shades':
      return `
        <g>
          <path d="M76 136 L184 136" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <rect x="82" y="131" width="42" height="25" rx="7" fill="#1E1612" stroke="${stroke}" stroke-width="3.8"/>
          <rect x="136" y="131" width="42" height="25" rx="7" fill="#1E1612" stroke="${stroke}" stroke-width="3.8"/>
          <line x1="90" y1="137" x2="102" y2="149" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
          <line x1="144" y1="137" x2="156" y2="149" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
          <path d="M112 172 Q130 184 148 172" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'wink_mustache':
      return `
        <g>
          <circle cx="102" cy="140" r="8" fill="${stroke}"/>
          <circle cx="99" cy="137" r="2.8" fill="#FFF"/>
          <path d="M146 140 Q158 128 170 140" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M130 162 C110 152, 84 162, 78 174 C96 178, 118 173, 130 167 C142 173, 164 178, 182 174 C176 162, 150 152, 130 162 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/>
        </g>`;
    case 'wink_smart':
      return `
        <g>
          <path d="M88 142 Q102 130 116 142" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="158" cy="142" r="8" fill="${stroke}"/>
          <circle cx="155" cy="139" r="3" fill="#FFF"/>
          <circle cx="88" cy="158" r="8" fill="#FF8FA3" opacity="0.55"/>
          <circle cx="172" cy="158" r="8" fill="#FF8FA3" opacity="0.55"/>
          <path d="M108 168 Q130 186 154 168" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M134 176 Q142 190 150 174" fill="#FF6B8B" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'laugh_joy':
      return `
        <g>
          <path d="M88 142 Q102 128 116 142" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M144 142 Q158 128 172 142" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M102 162 L158 162 Q158 192 130 192 Q102 192 102 162 Z" fill="#9E2A2B" stroke="${stroke}" stroke-width="4"/>
          <path d="M116 182 Q130 172 144 182" fill="#FF8FA3"/>
        </g>`;
    case 'monocle_judge':
      return `
        <g>
          <circle cx="102" cy="144" r="7" fill="${stroke}"/>
          <circle cx="156" cy="144" r="16" fill="rgba(255,255,255,0.45)" stroke="#DDA843" stroke-width="4"/>
          <circle cx="156" cy="144" r="6.5" fill="${stroke}"/>
          <path d="M172 148 Q180 172 174 190" fill="none" stroke="#DDA843" stroke-width="3" stroke-dasharray="3,3"/>
          <path d="M140 124 Q156 116 172 124" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <path d="M114 174 Q130 168 148 174" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'pirate_patch':
      return `
        <g>
          <line x1="76" y1="126" x2="184" y2="152" stroke="${stroke}" stroke-width="4"/>
          <circle cx="104" cy="142" r="14" fill="#1F1916" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="158" cy="144" r="7.5" fill="${stroke}"/>
          <circle cx="155" cy="141" r="2.5" fill="#FFF"/>
          <path d="M108 174 Q132 184 152 168" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'shocked_eyes':
      return `
        <g>
          <circle cx="102" cy="142" r="13" fill="#FFF" stroke="${stroke}" stroke-width="4"/>
          <circle cx="158" cy="142" r="13" fill="#FFF" stroke="${stroke}" stroke-width="4"/>
          <circle cx="102" cy="142" r="5" fill="${stroke}"/>
          <circle cx="158" cy="142" r="5" fill="${stroke}"/>
          <ellipse cx="130" cy="176" rx="12" ry="15" fill="#9E2A2B" stroke="${stroke}" stroke-width="4"/>
        </g>`;
    case 'happy_smile':
      return `
        <g>
          <circle cx="102" cy="142" r="8" fill="${stroke}"/>
          <circle cx="158" cy="142" r="8" fill="${stroke}"/>
          <circle cx="99" cy="139" r="3" fill="#FFF"/>
          <circle cx="155" cy="139" r="3" fill="#FFF"/>
          <ellipse cx="86" cy="156" rx="10" ry="6" fill="#FF758F" opacity="0.65"/>
          <ellipse cx="174" cy="156" rx="10" ry="6" fill="#FF758F" opacity="0.65"/>
          <path d="M106 166 Q130 188 154 166" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'angry_fierce':
      return `
        <g>
          <path d="M84 126 L118 138 M176 126 L142 138" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
          <circle cx="104" cy="145" r="7.5" fill="${stroke}"/>
          <circle cx="156" cy="145" r="7.5" fill="${stroke}"/>
          <rect x="104" y="168" width="52" height="16" rx="6" fill="#FFF" stroke="${stroke}" stroke-width="3.5"/>
          <line x1="120" y1="168" x2="120" y2="184" stroke="${stroke}" stroke-width="3"/>
          <line x1="140" y1="168" x2="140" y2="184" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'starry_eyes':
      return `
        <g>
          <polygon points="102,126 106,136 117,136 108,143 112,154 102,147 92,154 96,143 87,136 98,136" fill="#FFD166" stroke="${stroke}" stroke-width="3"/>
          <polygon points="158,126 162,136 173,136 164,143 168,154 158,147 148,154 152,143 143,136 154,136" fill="#FFD166" stroke="${stroke}" stroke-width="3"/>
          <path d="M108 168 Q130 186 152 168" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'sleepy_yawn':
      return `
        <g>
          <path d="M88 144 Q102 154 116 144" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M144 144 Q158 154 172 144" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="130" cy="174" r="10" fill="#9E2A2B" stroke="${stroke}" stroke-width="3.5"/>
          <text x="164" y="130" font-size="15" font-weight="900" fill="${stroke}">Zzz</text>
        </g>`;
    case 'sly_smirk':
      return `
        <g>
          <path d="M88 134 L116 130 M144 126 Q158 118 172 128" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="104" cy="144" rx="8" ry="6" fill="${stroke}"/>
          <ellipse cx="158" cy="144" rx="8" ry="6" fill="${stroke}"/>
          <path d="M106 174 Q136 178 158 162" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'cry_laugh':
      return `
        <g>
          <path d="M88 140 Q102 128 116 140" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M144 140 Q158 128 172 140" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M84 146 Q76 160 84 166 Q92 160 84 146 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
          <path d="M176 146 Q168 160 176 166 Q184 160 176 146 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
          <path d="M104 164 L156 164 Q156 190 130 190 Q104 190 104 164 Z" fill="#9E2A2B" stroke="${stroke}" stroke-width="4"/>
        </g>`;
    case 'heart_eyes':
      return `
        <g>
          <path d="M102 154 C102 154 84 142 84 132 C84 125 94 122 102 130 C110 122 120 125 120 132 C120 142 102 154 102 154 Z" fill="#E63946" stroke="${stroke}" stroke-width="3"/>
          <path d="M158 154 C158 154 140 142 140 132 C140 125 150 122 158 130 C166 122 176 125 176 132 C176 142 158 154 158 154 Z" fill="#E63946" stroke="${stroke}" stroke-width="3"/>
          <path d="M108 168 Q130 186 152 168" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'detective_pipe':
      return `
        <g>
          <circle cx="102" cy="142" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="142" r="7.5" fill="${stroke}"/>
          <path d="M112 172 Q130 178 148 172" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <path d="M138 173 L176 184 L182 170 L168 168 L166 176 Z" fill="#6F4E37" stroke="${stroke}" stroke-width="3"/>
          <circle cx="182" cy="156" r="5" fill="#FFF" opacity="0.7"/>
        </g>`;
    case 'pixel_shades':
      return `
        <g>
          <rect x="78" y="132" width="104" height="8" fill="#111"/>
          <rect x="84" y="140" width="38" height="18" fill="#111"/>
          <rect x="138" y="140" width="38" height="18" fill="#111"/>
          <rect x="90" y="142" width="8" height="6" fill="#FFF"/>
          <rect x="144" y="142" width="8" height="6" fill="#FFF"/>
          <path d="M112 174 Q130 184 150 172" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'royal_goatee':
      return `
        <g>
          <circle cx="102" cy="140" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="140" r="7.5" fill="${stroke}"/>
          <path d="M104 166 Q130 158 156 166" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <polygon points="120,176 140,176 130,196" fill="${stroke}"/>
        </g>`;
    case 'whistle_cute':
      return `
        <g>
          <circle cx="100" cy="138" r="7.5" fill="${stroke}"/>
          <circle cx="156" cy="138" r="7.5" fill="${stroke}"/>
          <circle cx="97" cy="135" r="2.5" fill="#FFF"/>
          <circle cx="153" cy="135" r="2.5" fill="#FFF"/>
          <circle cx="134" cy="172" r="6.5" fill="${stroke}"/>
          <path d="M152 164 Q162 158 168 164" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
        </g>`;
    case 'side_eye':
      return `
        <g>
          <ellipse cx="102" cy="142" rx="12" ry="9" fill="#FFF" stroke="${stroke}" stroke-width="3.5"/>
          <ellipse cx="158" cy="142" rx="12" ry="9" fill="#FFF" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="108" cy="142" r="5.5" fill="${stroke}"/>
          <circle cx="164" cy="142" r="5.5" fill="${stroke}"/>
          <line x1="112" y1="172" x2="148" y2="170" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'handlebar_twirl':
      return `
        <g>
          <circle cx="102" cy="138" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="138" r="7.5" fill="${stroke}"/>
          <path d="M130 162 C110 152, 82 168, 76 156 C72 148, 84 144, 86 152 M130 162 C150 152, 178 168, 184 156 C188 148, 176 144, 174 152" fill="none" stroke="${stroke}" stroke-width="6" stroke-linecap="round"/>
        </g>`;
    case 'aviator_gold':
      return `
        <g>
          <line x1="76" y1="132" x2="184" y2="132" stroke="#DDA843" stroke-width="4"/>
          <path d="M82 132 H122 C122 156 108 160 98 158 C84 156 82 144 82 132 Z" fill="#2B2D42" stroke="#DDA843" stroke-width="3.5"/>
          <path d="M138 132 H178 C178 156 164 160 154 158 C140 156 138 144 138 132 Z" fill="#2B2D42" stroke="#DDA843" stroke-width="3.5"/>
          <path d="M112 174 Q130 184 148 174" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'cat_whiskers':
      return `
        <g>
          <circle cx="102" cy="140" r="8" fill="${stroke}"/>
          <circle cx="158" cy="140" r="8" fill="${stroke}"/>
          <polygon points="124,154 136,154 130,162" fill="#FF758F" stroke="${stroke}" stroke-width="2.5"/>
          <path d="M114 168 Q122 176 130 164 Q138 176 146 168" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <path d="M76 154 L94 158 M76 164 L94 164 M184 154 L166 158 M184 164 L166 164" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
        </g>`;
    case 'laser_eyes':
      return `
        <g>
          <ellipse cx="102" cy="142" rx="13" ry="8" fill="#EF233C" stroke="#FFD166" stroke-width="3"/>
          <ellipse cx="158" cy="142" rx="13" ry="8" fill="#EF233C" stroke="#FFD166" stroke-width="3"/>
          <circle cx="102" cy="142" r="4" fill="#FFF"/>
          <circle cx="158" cy="142" r="4" fill="#FFF"/>
          <path d="M108 172 L152 172" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'dizzy_spiral':
      return `
        <g>
          <circle cx="102" cy="142" r="12" fill="#FFF" stroke="${stroke}" stroke-width="3.5"/>
          <path d="M102 142 m-6 0 a6 6 0 1 0 12 0 a4 4 0 1 0 -8 0" fill="none" stroke="${stroke}" stroke-width="3"/>
          <circle cx="158" cy="142" r="12" fill="#FFF" stroke="${stroke}" stroke-width="3.5"/>
          <path d="M158 142 m-6 0 a6 6 0 1 0 12 0 a4 4 0 1 0 -8 0" fill="none" stroke="${stroke}" stroke-width="3"/>
          <path d="M104 174 Q116 164 130 174 Q144 184 156 174" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'money_eyes':
      return `
        <g>
          <circle cx="102" cy="142" r="13" fill="#FFD166" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="158" cy="142" r="13" fill="#FFD166" stroke="${stroke}" stroke-width="3.5"/>
          <rect x="98" y="135" width="8" height="14" rx="2" fill="#2E7D32"/>
          <rect x="154" y="135" width="8" height="14" rx="2" fill="#2E7D32"/>
          <path d="M106 168 Q130 188 154 168" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'bandit_mask':
      return `
        <g>
          <path d="M74 128 Q130 120 186 128 L182 156 Q155 162 130 148 Q105 162 78 156 Z" fill="#222" stroke="${stroke}" stroke-width="3.5"/>
          <ellipse cx="102" cy="142" rx="9" ry="6" fill="#FFF"/>
          <ellipse cx="158" cy="142" rx="9" ry="6" fill="#FFF"/>
          <path d="M112 172 Q134 182 152 168" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'cigar_boss':
      return `
        <g>
          <path d="M86 128 L116 134 M174 128 L144 134" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="102" cy="142" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="142" r="7.5" fill="${stroke}"/>
          <path d="M108 172 H148" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <rect x="138" y="168" width="36" height="10" rx="4" transform="rotate(12 138 168)" fill="#8C5A2B" stroke="${stroke}" stroke-width="3"/>
          <circle cx="174" cy="176" r="4" fill="#E63946"/>
        </g>`;
    case 'blush_shy':
      return `
        <g>
          <circle cx="102" cy="142" r="9" fill="${stroke}"/>
          <circle cx="158" cy="142" r="9" fill="${stroke}"/>
          <circle cx="99" cy="138" r="3.5" fill="#FFF"/>
          <circle cx="155" cy="138" r="3.5" fill="#FFF"/>
          <ellipse cx="84" cy="158" rx="13" ry="8" fill="#FF4D6D" opacity="0.65"/>
          <ellipse cx="176" cy="158" rx="13" ry="8" fill="#FF4D6D" opacity="0.65"/>
          <path d="M118 170 Q124 176 130 170 Q136 176 142 170" fill="none" stroke="${stroke}" stroke-width="3.8" stroke-linecap="round"/>
        </g>`;
    case 'vampire_fangs':
      return `
        <g>
          <path d="M86 130 L114 138 M174 130 L146 138" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="102" cy="144" r="7.5" fill="#E63946" stroke="${stroke}" stroke-width="2.5"/>
          <circle cx="158" cy="144" r="7.5" fill="#E63946" stroke="${stroke}" stroke-width="2.5"/>
          <path d="M104 166 Q130 176 156 166" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <polygon points="112,168 120,169 116,182" fill="#FFF" stroke="${stroke}" stroke-width="2.5"/>
          <polygon points="140,169 148,168 144,182" fill="#FFF" stroke="${stroke}" stroke-width="2.5"/>
        </g>`;
    case 'robot_visor':
      return `
        <g>
          <rect x="78" y="128" width="104" height="26" rx="8" fill="#1D3557" stroke="${stroke}" stroke-width="4"/>
          <rect x="90" y="135" width="24" height="12" rx="3" fill="#00F5D4"/>
          <rect x="146" y="135" width="24" height="12" rx="3" fill="#00F5D4"/>
          <rect x="106" y="168" width="48" height="12" rx="4" fill="#E0E1DD" stroke="${stroke}" stroke-width="3"/>
          <line x1="122" y1="168" x2="122" y2="180" stroke="${stroke}" stroke-width="2.5"/>
          <line x1="138" y1="168" x2="138" y2="180" stroke="${stroke}" stroke-width="2.5"/>
        </g>`;
    case 'crying_river':
      return `
        <g>
          <circle cx="102" cy="140" r="8" fill="${stroke}"/>
          <circle cx="158" cy="140" r="8" fill="${stroke}"/>
          <rect x="94" y="148" width="14" height="38" rx="6" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
          <rect x="152" y="148" width="14" height="38" rx="6" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
          <path d="M114 178 Q130 164 146 178" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'kiss_face':
      return `
        <g>
          <path d="M88 142 Q102 130 116 142" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="158" cy="142" r="8" fill="${stroke}"/>
          <path d="M124 164 C118 160, 118 170, 128 172 C118 174, 118 184, 124 180" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <path d="M156 168 C156 168 146 160 146 154 C146 150 152 148 156 153 C160 148 166 150 166 154 C166 160 156 168 156 168 Z" fill="#E63946" stroke="${stroke}" stroke-width="2"/>
        </g>`;
    case 'zen_calm':
      return `
        <g>
          <path d="M88 142 Q102 152 116 142" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <path d="M144 142 Q158 152 172 142" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="130" cy="126" r="4" fill="#E63946"/>
          <path d="M110 170 Q130 182 150 170" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'clown_nose':
      return `
        <g>
          <path d="M88 136 Q102 124 116 136" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <path d="M144 136 Q158 124 172 136" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="130" cy="154" r="13" fill="#E63946" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="125" cy="149" r="3.5" fill="#FFF"/>
          <path d="M104 172 Q130 190 156 172" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'scar_warrior':
      return `
        <g>
          <line x1="96" y1="122" x2="108" y2="162" stroke="#9E2A2B" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="94" y1="130" x2="106" y2="128" stroke="#9E2A2B" stroke-width="2.5"/>
          <circle cx="102" cy="142" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="142" r="7.5" fill="${stroke}"/>
          <path d="M110 172 L150 168" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'bubblegum_pop':
      return `
        <g>
          <circle cx="102" cy="140" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="140" r="7.5" fill="${stroke}"/>
          <circle cx="144" cy="172" r="18" fill="#FF8FA3" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="138" cy="165" r="4" fill="#FFF" opacity="0.8"/>
        </g>`;
    case 'unibrow_funny':
      return `
        <g>
          <path d="M80 128 Q105 118 130 130 Q155 118 180 128" fill="none" stroke="${stroke}" stroke-width="6" stroke-linecap="round"/>
          <circle cx="102" cy="144" r="8" fill="${stroke}"/>
          <circle cx="158" cy="144" r="8" fill="${stroke}"/>
          <path d="M108 170 Q130 184 152 170" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'king_beard':
    default:
      return `
        <g>
          <circle cx="102" cy="138" r="7.5" fill="${stroke}"/>
          <circle cx="158" cy="138" r="7.5" fill="${stroke}"/>
          <path d="M84 158 Q130 150 176 158 Q172 196 130 196 Q88 196 84 158 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.5"/>
          <path d="M114 168 Q130 178 146 168" fill="#FFF" stroke="${stroke}" stroke-width="2.5"/>
        </g>`;
  }
}

/**
 * رسم الـ 20 طاقية وتاج بحيث تركب قاعدتها مباشرة على حافة الرأس الموحدة (X: 64..196, Y: 88)
 */
function renderHatVector(hatId) {
  const stroke = '#231710';
  switch (hatId) {
    case 'fez_tarboush':
      return `
        <g>
          <polygon points="92,88 168,88 156,28 104,28" fill="#C1121F" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M130 28 Q162 26 170 62" fill="none" stroke="#1D1A17" stroke-width="5" stroke-linecap="round"/>
          <circle cx="170" cy="64" r="5" fill="#1D1A17"/>
        </g>`;
    case 'sultan_crown':
      return `
        <g>
          <polygon points="78,88 182,88 190,38 158,60 130,26 102,60 70,38" fill="#FFD166" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <rect x="76" y="76" width="108" height="14" rx="5" fill="#F4A261" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="130" cy="56" r="6" fill="#E63946" stroke="${stroke}" stroke-width="2.5"/>
          <circle cx="102" cy="66" r="4.5" fill="#2A9D8F" stroke="${stroke}" stroke-width="2"/>
          <circle cx="158" cy="66" r="4.5" fill="#2A9D8F" stroke="${stroke}" stroke-width="2"/>
        </g>`;
    case 'chef_toque':
      return `
        <g>
          <path d="M84 74 C64 62, 72 28, 102 34 C114 14, 146 14, 158 34 C188 28, 196 62, 176 74 Z" fill="#FFFFFF" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <rect x="82" y="70" width="96" height="20" rx="5" fill="#F8F9FA" stroke="${stroke}" stroke-width="4"/>
        </g>`;
    case 'ghutra_agal':
      return `
        <g>
          <path d="M62 96 Q64 32 130 32 Q196 32 198 96 L184 96 Q178 62 130 62 Q82 62 76 96 Z" fill="#FFFFFF" stroke="${stroke}" stroke-width="4"/>
          <rect x="74" y="48" width="112" height="11" rx="5.5" fill="#1D1A17" stroke="${stroke}" stroke-width="3"/>
          <rect x="76" y="60" width="108" height="10" rx="5" fill="#1D1A17" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'detective_hat':
      return `
        <g>
          <ellipse cx="130" cy="86" rx="74" ry="12" fill="#8D6E63" stroke="${stroke}" stroke-width="4"/>
          <path d="M82 84 Q88 32 130 32 Q172 32 178 84 Z" fill="#A1887F" stroke="${stroke}" stroke-width="4"/>
          <rect x="83" y="70" width="94" height="12" fill="#4E342E" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'straw_hat':
      return `
        <g>
          <ellipse cx="130" cy="86" rx="80" ry="13" fill="#F4D35E" stroke="${stroke}" stroke-width="4"/>
          <path d="M82 84 Q86 38 130 38 Q174 38 178 84 Z" fill="#F4D35E" stroke="${stroke}" stroke-width="4"/>
          <rect x="82" y="70" width="96" height="12" fill="#E63946" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'pirate_hat':
      return `
        <g>
          <path d="M52 88 Q82 28 130 28 Q178 28 208 88 Z" fill="#222222" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <rect x="74" y="78" width="112" height="12" rx="5" fill="#E63946" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="130" cy="56" r="9" fill="#FFF"/>
          <path d="M116 68 L144 46 M116 46 L144 68" stroke="#FFF" stroke-width="3.5" stroke-linecap="round"/>
        </g>`;
    case 'Graduation_cap':
      return `
        <g>
          <rect x="86" y="64" width="88" height="24" rx="4" fill="#2B2D42" stroke="${stroke}" stroke-width="4"/>
          <polygon points="130,30 204,54 130,76 56,54" fill="#2B2D42" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M130 54 L182 68 L182 92" fill="none" stroke="#FFD166" stroke-width="4" stroke-linecap="round"/>
          <circle cx="182" cy="92" r="5" fill="#FFD166"/>
        </g>`;
    case 'royal_turban':
      return `
        <g>
          <ellipse cx="130" cy="60" rx="60" ry="34" fill="#F8F9FA" stroke="${stroke}" stroke-width="4"/>
          <path d="M82 70 Q130 40 178 70 M86 48 Q130 78 174 48" fill="none" stroke="#DEE2E6" stroke-width="4"/>
          <circle cx="130" cy="52" r="10" fill="#E63946" stroke="#FFD166" stroke-width="3.5"/>
          <path d="M130 40 Q136 18 148 22" fill="none" stroke="#FFD166" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'pharaoh_nemes':
      return `
        <g>
          <path d="M64 94 L78 30 L182 30 L196 94 Z" fill="#1D3557" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M84 30 L76 90 M106 30 L102 90 M154 30 L158 90 M176 30 L184 90" stroke="#FFD166" stroke-width="5"/>
          <rect x="74" y="74" width="112" height="14" rx="4" fill="#FFD166" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="130" cy="52" r="9" fill="#FFD166" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'cowboy_hat':
      return `
        <g>
          <path d="M80 86 Q82 36 134 36 Q182 36 184 86 Z" fill="#C48F5A" stroke="${stroke}" stroke-width="4"/>
          <path d="M54 86 Q82 68 134 84 L80 86 Z" fill="#8C5A2B" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="134" cy="34" r="5" fill="${stroke}"/>
        </g>`;
    case 'french_beret':
      return `
        <g>
          <path d="M68 84 C62 46, 118 26, 186 48 C202 56, 192 84, 174 86 Z" fill="#D62828" stroke="${stroke}" stroke-width="4"/>
          <rect x="78" y="78" width="104" height="10" rx="4" fill="#1D1A17" stroke="${stroke}" stroke-width="3"/>
          <line x1="130" y1="38" x2="134" y2="24" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        </g>`;
    case 'top_hat':
      return `
        <g>
          <ellipse cx="130" cy="86" rx="70" ry="11" fill="#212529" stroke="${stroke}" stroke-width="4"/>
          <rect x="90" y="20" width="80" height="66" rx="6" fill="#343A40" stroke="${stroke}" stroke-width="4"/>
          <rect x="90" y="68" width="80" height="14" fill="#D62828" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'winter_beanie':
      return `
        <g>
          <path d="M76 86 Q76 32 130 32 Q184 32 184 86 Z" fill="#5B8EB2" stroke="${stroke}" stroke-width="4"/>
          <rect x="72" y="72" width="116" height="18" rx="8" fill="#A8DADC" stroke="${stroke}" stroke-width="4"/>
          <line x1="96" y1="72" x2="96" y2="90" stroke="${stroke}" stroke-width="3"/>
          <line x1="130" y1="72" x2="130" y2="90" stroke="${stroke}" stroke-width="3"/>
          <line x1="164" y1="72" x2="164" y2="90" stroke="${stroke}" stroke-width="3"/>
          <circle cx="130" cy="24" r="13" fill="#F1FAEE" stroke="${stroke}" stroke-width="3.5"/>
        </g>`;
    case 'viking_helmet':
      return `
        <g>
          <path d="M76 68 Q44 48 54 22 Q68 44 86 54" fill="#FFF3B0" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M184 68 Q216 48 206 22 Q192 44 174 54" fill="#FFF3B0" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M76 86 Q76 36 130 36 Q184 36 184 86 Z" fill="#8D99AE" stroke="${stroke}" stroke-width="4"/>
          <rect x="72" y="74" width="116" height="14" rx="5" fill="#6C757D" stroke="${stroke}" stroke-width="3.5"/>
        </g>`;
    case 'dj_headphones':
      return `
        <g>
          <path d="M62 128 Q62 32 130 32 Q198 32 198 128" fill="none" stroke="#2B2D42" stroke-width="10" stroke-linecap="round"/>
          <rect x="46" y="104" width="22" height="44" rx="10" fill="#EF233C" stroke="${stroke}" stroke-width="4"/>
          <rect x="192" y="104" width="22" height="44" rx="10" fill="#EF233C" stroke="${stroke}" stroke-width="4"/>
        </g>`;
    case 'propeller_cap':
      return `
        <g>
          <path d="M76 86 Q76 38 130 38 Q184 38 184 86 Z" fill="#FFB703" stroke="${stroke}" stroke-width="4"/>
          <path d="M106 86 Q106 38 130 38 Q154 38 154 86 Z" fill="#219EBC" stroke="${stroke}" stroke-width="3.5"/>
          <line x1="130" y1="38" x2="130" y2="22" stroke="${stroke}" stroke-width="4"/>
          <ellipse cx="130" cy="22" rx="34" ry="6" fill="#FB8500" stroke="${stroke}" stroke-width="3"/>
        </g>`;
    case 'knight_helmet':
      return `
        <g>
          <path d="M130 34 Q168 12 184 40 Q154 44 130 38" fill="#E63946" stroke="${stroke}" stroke-width="3.5"/>
          <path d="M76 88 Q76 34 130 34 Q184 34 184 88 Z" fill="#ADB5BD" stroke="${stroke}" stroke-width="4"/>
          <rect x="74" y="72" width="112" height="16" rx="5" fill="#6C757D" stroke="${stroke}" stroke-width="3.5"/>
        </g>`;
    case 'whipped_cherry':
      return `
        <g>
          <ellipse cx="130" cy="64" rx="28" ry="24" fill="#FFD166" stroke="${stroke}" stroke-width="4"/>
          <circle cx="120" cy="60" r="3.5" fill="${stroke}"/>
          <circle cx="140" cy="60" r="3.5" fill="${stroke}"/>
          <polygon points="126,66 134,66 130,73" fill="#FB8500" stroke="${stroke}" stroke-width="2"/>
          <path d="M126 40 Q130 28 136 38" fill="none" stroke="#FFD166" stroke-width="4" stroke-linecap="round"/>
        </g>`;
    case 'jester_hat':
    default:
      return `
        <g>
          <rect x="74" y="74" width="112" height="14" rx="7" fill="#52B788" stroke="${stroke}" stroke-width="3.5"/>
          <circle cx="96" cy="78" r="11" fill="#FF4D6D" stroke="${stroke}" stroke-width="3"/>
          <circle cx="130" cy="76" r="13" fill="#FFB703" stroke="${stroke}" stroke-width="3"/>
          <circle cx="164" cy="78" r="11" fill="#FF4D6D" stroke="${stroke}" stroke-width="3"/>
        </g>`;
  }
}

/**
 * بناء الشخصية الكرتونية الموحدة (Unified Character Rig — مطابقة للصورة المرجعية الثالثة)
 */
function buildCharacterSVG(cfg) {
  const safeCfg = cfg || {};
  const outfitObj = CHARACTER_PARTS.outfit.find(o => o.id === safeCfg.outfit) || CHARACTER_PARTS.outfit[0];
  const faceId = safeCfg.face || 'mustache_boss';
  const hatId = safeCfg.hat || 'fez_tarboush';
  const gradId = `cupGrad_${outfitObj.id}`;
  const stroke = '#231710';

  let sideHandlesSVG = '';
  if (outfitObj.handleSide === 'right' || outfitObj.handleSide === 'both') {
    sideHandlesSVG += `<path d="M188 124 C220 124, 220 176, 184 176" fill="none" stroke="${outfitObj.rimColor}" stroke-width="15" stroke-linecap="round"/>`;
    sideHandlesSVG += `<path d="M188 124 C220 124, 220 176, 184 176" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
  if (outfitObj.handleSide === 'left') {
    sideHandlesSVG += `<path d="M72 138 L30 122 L26 134 L70 152 Z" fill="${outfitObj.bandColor}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
  }
  if (outfitObj.handleSide === 'both') {
    sideHandlesSVG += `<path d="M74 126 C42 120, 38 98, 52 96 C58 108, 64 114, 74 116 Z" fill="${outfitObj.bodyTop}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
  }

  const sleeveSVG = outfitObj.hasSleeve
    ? `<path d="M75 184 L185 184 L181 208 L79 208 Z" fill="${outfitObj.bandColor}" opacity="0.28"/>`
    : '';

  return `
    <svg viewBox="0 0 260 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="${outfitObj.name}">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${outfitObj.bodyTop}"/>
          <stop offset="100%" stop-color="${outfitObj.bodyBot}"/>
        </linearGradient>
      </defs>

      <!-- ظل الأرضية -->
      <ellipse cx="130" cy="260" rx="58" ry="9" fill="rgba(35, 23, 16, 0.18)"/>

      <!-- الأرجل والأحذية الكرتونية اللطيفة كما في الصورة المرفقة -->
      <path d="M108 220 L106 246" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>
      <path d="M152 220 L154 246" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="102" cy="250" rx="14" ry="8" fill="${outfitObj.shoeColor}" stroke="${stroke}" stroke-width="3.8"/>
      <ellipse cx="158" cy="250" rx="14" ry="8" fill="${outfitObj.shoeColor}" stroke="${stroke}" stroke-width="3.8"/>

      <!-- الأذرع الكرتونية -->
      <path d="M72 162 Q48 176 56 196" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="56" cy="198" r="8" fill="#FFFDF9" stroke="${stroke}" stroke-width="3.8"/>
      <path d="M188 162 Q212 176 204 196" fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="204" cy="198" r="8" fill="#FFFDF9" stroke="${stroke}" stroke-width="3.8"/>

      <!-- المقابض الجانبية -->
      ${sideHandlesSVG}

      <!-- جسم فنجان القهوة المستدير اللطيف مثل الصورة المرجعية الثالثة -->
      <path d="M68 88 L192 88 L184 188 C182 216 160 226 130 226 C100 226 78 216 76 188 Z" fill="url(#${gradId})" stroke="${stroke}" stroke-width="5" stroke-linejoin="round"/>

      <!-- الحافة الكريمية العلوية الموحدة للفنجان -->
      <path d="M66 86 Q130 98 194 86 L192 108 Q130 120 68 108 Z" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4.5" stroke-linejoin="round"/>
      <ellipse cx="130" cy="86" rx="64" ry="11" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4.5"/>
      <ellipse cx="130" cy="87" rx="54" ry="6.5" fill="${outfitObj.liquidColor}"/>

      ${sleeveSVG}

      <!-- ملامح الوجه الكرتوني -->
      ${renderFaceVector(faceId)}

      <!-- الطاقية / التاج فوق الفنجان مباشرة -->
      ${renderHatVector(hatId)}
    </svg>
  `;
}
