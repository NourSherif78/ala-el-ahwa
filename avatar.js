/* نظام الشخصيات الكرتونية المطور (أجسام منحنية + وشوش كرتونية حقيقية + طواقي مرسومة) */
const CHARACTER_PARTS = {
  outfit: [
    {
      id: 'karak_cup',
      name: 'كوب الكرك الذهبي',
      shape: 'mug',
      bodyTop: '#F3C68F',
      bodyBot: '#B87B43',
      rimColor: '#FFFDF7',
      liquidColor: '#9C5A25',
      bandColor: '#7F4F24',
      shoeColor: '#8C4A27',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'sahlab_mug',
      name: 'مج السحلب الكريمي',
      shape: 'chubby',
      bodyTop: '#FFFDF9',
      bodyBot: '#E6D3B8',
      rimColor: '#FFFFFF',
      liquidColor: '#F3E5AB',
      bandColor: '#C6925B',
      shoeColor: '#8D5B4C',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'tamar_glass',
      name: 'كاس العناب المثلج',
      shape: 'goblet',
      bodyTop: '#B52B38',
      bodyBot: '#540B0E',
      rimColor: '#FCEEEF',
      liquidColor: '#780000',
      bandColor: '#E09F3E',
      shoeColor: '#7A1C24',
      handleSide: 'none',
      hasSleeve: false
    },
    {
      id: 'mint_tea',
      name: 'شاي كشري بالنعناع',
      shape: 'waisted',
      bodyTop: '#E75A3C',
      bodyBot: '#8F210E',
      rimColor: '#FFF5F2',
      liquidColor: '#A82910',
      bandColor: '#2A9D8F',
      shoeColor: '#2A9D8F',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'gold_kanaka',
      name: 'كنكة القهوة النحاس',
      shape: 'kanaka',
      bodyTop: '#E5A95C',
      bodyBot: '#8C531E',
      rimColor: '#FFF8E7',
      liquidColor: '#4A2C11',
      bandColor: '#5C3409',
      shoeColor: '#5C3409',
      handleSide: 'left',
      hasSleeve: true
    },
    {
      id: 'espresso_suit',
      name: 'فنجان إسبريسو دارك',
      shape: 'tapered',
      bodyTop: '#6A4E42',
      bodyBot: '#302019',
      rimColor: '#EDE0D4',
      liquidColor: '#29170E',
      bandColor: '#DDA843',
      shoeColor: '#DDA843',
      handleSide: 'right',
      hasSleeve: true
    },
    {
      id: 'arabic_dallah',
      name: 'الدلة العربية الذهبية',
      shape: 'dallah',
      bodyTop: '#F7D154',
      bodyBot: '#A87905',
      rimColor: '#FFFBEB',
      liquidColor: '#7D5A4F',
      bandColor: '#9E2A2B',
      shoeColor: '#9E2A2B',
      handleSide: 'both',
      hasSleeve: true
    },
    {
      id: 'moroccan_teapot',
      name: 'ليمون بالنعناع المنعش',
      shape: 'curved',
      bodyTop: '#52B788',
      bodyBot: '#1B4332',
      rimColor: '#E9FCEF',
      liquidColor: '#2D6A4F',
      bandColor: '#F4D35E',
      shoeColor: '#D97724',
      handleSide: 'right',
      hasSleeve: false
    },
    {
      id: 'yansoon_cup',
      name: 'كوب اليانسون العشبي الذهبي',
      shape: 'yansoon',
      bodyTop: '#FDE68A',
      bodyBot: '#D97706',
      rimColor: '#FFFDF0',
      liquidColor: '#F59E0B',
      bandColor: '#92400E',
      shoeColor: '#78350F',
      handleSide: 'right',
      hasSleeve: false
    }
  ],

  face: [
    { id: 'laugh_joy', name: 'ضحكة القهوة' },
    { id: 'mustache_boss', name: 'شنب العمدة' },
    { id: 'cool_shades', name: 'نظارة شمس رايقة' },
    { id: 'cry_laugh', name: 'دموع الضحك' },
    { id: 'wink_smart', name: 'غمزة ذكية' },
    { id: 'sly_smirk', name: 'ابتسامة الخداع' },
    { id: 'heart_eyes', name: 'عيون القلوب' },
    { id: 'monocle_judge', name: 'عدسة المحقق' },
    { id: 'shocked_eyes', name: 'مصدوم من الهينت' },
    { id: 'angry_fierce', name: 'نظرة التحدي' },
    { id: 'crying_river', name: 'شلال دموع' },
    { id: 'sleepy_yawn', name: 'نعسان قبل القهوة' },
    { id: 'cigar_boss', name: 'سيجار المعلم' },
    { id: 'side_eye', name: 'نظرة الشك' },
    { id: 'nerd_glasses', name: 'نظارة العبقري' },
    { id: 'wink_mustache', name: 'غمزة بشنب' },
    { id: 'pirate_patch', name: 'ربطة القرصان' },
    { id: 'happy_smile', name: 'ابتسامة الخدود' },
    { id: 'starry_eyes', name: 'عيون النجوم' },
    { id: 'detective_pipe', name: 'غليون المحقق' },
    { id: 'pixel_shades', name: 'نظارة البكسل' },
    { id: 'royal_goatee', name: 'سكسوكة الباشا' },
    { id: 'whistle_cute', name: 'صفارة البراءة' },
    { id: 'handlebar_twirl', name: 'شنب مبروم' },
    { id: 'aviator_gold', name: 'نظارة طيار' },
    { id: 'cat_whiskers', name: 'شوارب القطة' },
    { id: 'laser_eyes', name: 'عيون الليزر' },
    { id: 'dizzy_spiral', name: 'دايخ من الأسئلة' },
    { id: 'money_eyes', name: 'عيون الجائزة' },
    { id: 'bandit_mask', name: 'قناع اللص' },
    { id: 'blush_shy', name: 'خجول ومكسوف' },
    { id: 'vampire_fangs', name: 'أنياب الكونت' },
    { id: 'robot_visor', name: 'شاشة الروبوت' },
    { id: 'kiss_face', name: 'قبلة النصر' },
    { id: 'zen_calm', name: 'هدوء الفيلسوف' },
    { id: 'clown_nose', name: 'أنف المهرج' },
    { id: 'scar_warrior', name: 'ندبة المحارب' },
    { id: 'bubblegum_pop', name: 'فقاعة اللبان' },
    { id: 'unibrow_funny', name: 'الحاجب المتصل' },
    { id: 'scared_tears', name: 'مرعوب ودموعه نازلة' },
    { id: 'nerd_teeth', name: 'الدحيح بالنظارة' },
    { id: 'nervous_sweat', name: 'متوتر وعرقان' },
    { id: 'evil_goatee', name: 'الشرير بالسكسوكة' },
    { id: 'ski_goggles', name: 'نظارة التزلج' },
    { id: 'yummy_tongue', name: 'طعمها حلو' },
    { id: 'puffy_cheeks', name: 'خدود منفوخة' },
    { id: 'wailing_cry', name: 'عياط بصوت عالي' },
    { id: 'dizzy_tongue', name: 'دايخ ولسانه برا' },
    { id: 'sick_thermo', name: 'عيان بالترمومتر' },
    { id: 'nauseous_green', name: 'مقلوبة معدته' },
    { id: 'frozen_cold', name: 'متلج من البرد' },
    { id: 'bearded_wink', name: 'غمزة باللحية' },
    { id: 'money_tongue', name: 'عيون الدولار' },
    { id: 'blushing_red', name: 'وشه احمر' },
    { id: 'smug_lids', name: 'نظرة الواثق' },
    { id: 'zipper_mouth', name: 'بقه مقفول بسوستة' },
    { id: 'fire_angry', name: 'غضبان نار' },
    { id: 'whistle_note', name: 'بيصفر ورايق' },
    { id: 'black_eye', name: 'عينه مزرقة' },
    { id: 'ninja_headband', name: 'عصابة المقاتل' },
    { id: 'surprised_o', name: 'مندهش' },
    { id: 'meh_yawn', name: 'زهقان وبيتاوب' },
    { id: 'pipe_relaxed', name: 'البايب الرايق' },
    { id: 'unimpressed', name: 'مش مقتنع' },
    { id: 'musketeer', name: 'شنب الفارس' },
    { id: 'king_beard', name: 'لحية الحكيم' }
  ],

  hat: [
    { id: 'fez_tarboush', name: 'طربوش الباشا' },
    { id: 'straw_hat', name: 'قبعة قش صيفية' },
    { id: 'chef_toque', name: 'طقية الشيف' },
    { id: 'sultan_crown', name: 'تاج السلطان' },
    { id: 'royal_turban', name: 'عمامة شهريار' },
    { id: 'pirate_hat', name: 'قبعة القبطان' },
    { id: 'detective_hat', name: 'قبعة شارلوك' },
    { id: 'viking_helmet', name: 'خوذة الفايكنج' },
    { id: 'ghutra_agal', name: 'غترة وعقال' },
    { id: 'winter_beanie', name: 'آيس كاب شتوي' },
    { id: 'cowboy_hat', name: 'كاب كاجوال' },
    { id: 'Graduation_cap', name: 'قبعة الفيلسوف' },
    { id: 'pharaoh_nemes', name: 'التاج الفرعوني' },
    { id: 'french_beret', name: 'بيريه الفنان' },
    { id: 'top_hat', name: 'قبعة الساحر' },
    { id: 'dj_headphones', name: 'سماعات الدي جي' },
    { id: 'propeller_cap', name: 'طقية المروحة' },
    { id: 'knight_helmet', name: 'خوذة الفارس' },
    { id: 'whipped_cherry', name: 'كتكوت القهوة' },
    { id: 'jester_hat', name: 'طوق الورد الملكي' },
    { id: 'anise_star', name: 'نجمة اليانسون العطرية' }
  ]
};

/**
 * مساعد رسم العيون الكرتونية الحقيقية (بياض العين + القزحية الملونة + البؤبؤ + لمعتين نور + الجفون)
 */
function cEye(cx, cy, opts = {}) {
  const rx = opts.rx || 13.5;
  const ry = opts.ry || 15.5;
  const px = opts.px || 0;
  const py = opts.py || 0;
  const iris = opts.iris || '#5C3A21';
  const stroke = '#231710';
  let lid = '';
  if (opts.lid === 'half') {
    lid = `<path d="M${cx - rx - 1} ${cy - 1} Q${cx} ${cy - 4} ${cx + rx + 1} ${cy - 1} A${rx} ${ry} 0 0 0 ${cx - rx - 1} ${cy - 1} Z" fill="#D4A373" stroke="${stroke}" stroke-width="3.2"/>`;
  } else if (opts.lid === 'angry_l') {
    lid = `<path d="M${cx - rx - 2} ${cy - ry + 2} L${cx + rx + 2} ${cy - 2}" stroke="${stroke}" stroke-width="5.5" stroke-linecap="round"/>`;
  } else if (opts.lid === 'angry_r') {
    lid = `<path d="M${cx + rx + 2} ${cy - ry + 2} L${cx - rx - 2} ${cy - 2}" stroke="${stroke}" stroke-width="5.5" stroke-linecap="round"/>`;
  } else if (opts.lid === 'sad_l') {
    lid = `<path d="M${cx - rx - 2} ${cy - 2} L${cx + rx + 2} ${cy - ry + 2}" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>`;
  } else if (opts.lid === 'sad_r') {
    lid = `<path d="M${cx + rx + 2} ${cy - 2} L${cx - rx - 2} ${cy - ry + 2}" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>`;
  }
  return `
    <g>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF" stroke="${stroke}" stroke-width="3.8"/>
      <circle cx="${cx + px}" cy="${cy + py}" r="${Math.min(rx, ry) * 0.64}" fill="${iris}"/>
      <circle cx="${cx + px}" cy="${cy + py}" r="${Math.min(rx, ry) * 0.38}" fill="#160E0A"/>
      <circle cx="${cx + px - 3.2}" cy="${cy + py - 3.6}" r="3.2" fill="#FFFFFF"/>
      <circle cx="${cx + px + 2.6}" cy="${cy + py + 2.6}" r="1.5" fill="#FFFFFF"/>
      ${lid}
    </g>
  `;
}

/**
 * مساعد رسم الفم الكرتوني متعدد الطبقات (حلق + أسنان + لسان)
 */
function cMouth(type) {
  const stroke = '#231710';
  switch (type) {
    case 'big_laugh':
      return `
        <path d="M98 160 Q130 165 162 160 C162 192, 98 192, 98 160 Z" fill="#6B141A" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M103 161 Q130 165 157 161 L154 169 Q130 172 106 169 Z" fill="#FFFFFF"/>
        <path d="M109 178 Q130 167 151 178 Q130 190 109 178 Z" fill="#FF758F"/>
      `;
    case 'evil_grin':
      return `
        <path d="M96 160 Q130 170 164 160 C160 190, 100 190, 96 160 Z" fill="#FFFFFF" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M112 163 L112 181 M130 165 L130 184 M148 163 L148 181" stroke="${stroke}" stroke-width="2.8"/>
      `;
    case 'tongue_out':
      return `
        <path d="M104 164 Q130 180 156 164" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M121 170 Q130 169 139 170 C142 188, 118 188, 121 170 Z" fill="#FF6B8B" stroke="${stroke}" stroke-width="3.2"/>
        <line x1="130" y1="171" x2="130" y2="181" stroke="#D6336C" stroke-width="2" stroke-linecap="round"/>
      `;
    case 'open_o':
      return `
        <ellipse cx="130" cy="175" rx="11" ry="13.5" fill="#6B141A" stroke="${stroke}" stroke-width="3.8"/>
        <path d="M122 181 Q130 174 138 181 Q130 188 122 181 Z" fill="#FF758F"/>
      `;
    case 'smirk':
      return `
        <path d="M108 171 Q134 176 156 160" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M152 156 Q160 158 158 166" fill="none" stroke="${stroke}" stroke-width="3.4" stroke-linecap="round"/>
      `;
    case 'sad':
      return `
        <path d="M108 179 Q130 163 152 179" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
      `;
    case 'clench':
      return `
        <rect x="102" y="165" width="56" height="17" rx="8" fill="#FFFFFF" stroke="${stroke}" stroke-width="3.8"/>
        <line x1="104" y1="173.5" x2="156" y2="173.5" stroke="${stroke}" stroke-width="2.5"/>
        <line x1="118" y1="165" x2="118" y2="182" stroke="${stroke}" stroke-width="2.5"/>
        <line x1="130" y1="165" x2="130" y2="182" stroke="${stroke}" stroke-width="2.5"/>
        <line x1="142" y1="165" x2="142" y2="182" stroke="${stroke}" stroke-width="2.5"/>
      `;
    case 'cute_smile':
    default:
      return `
        <path d="M108 166 Q130 184 152 166" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
      `;
  }
}

/**
 * رسم الـ 66 وش كرتوني بعيون كرتونية حقيقية وتفاصيل مرسومة (X: 74..186, Y: 112..196)
 */
function renderFaceVector(faceId) {
  const stroke = '#231710';
  switch (faceId) {
    case 'laugh_joy':
      return `<g>
        <path d="M84 121 Q100 111 116 121 M144 121 Q160 111 176 121" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 140)}
        ${cEye(158, 140)}
        <ellipse cx="82" cy="156" rx="9" ry="5.5" fill="#FF758F" opacity="0.55"/>
        <ellipse cx="178" cy="156" rx="9" ry="5.5" fill="#FF758F" opacity="0.55"/>
        ${cMouth('big_laugh')}
      </g>`;

    case 'mustache_boss':
      return `<g>
        <path d="M84 119 Q100 110 116 118 M144 118 Q160 110 176 119" fill="none" stroke="${stroke}" stroke-width="4.8" stroke-linecap="round"/>
        ${cEye(102, 139)}
        ${cEye(158, 139)}
        ${cMouth('big_laugh')}
        <path d="M130 158 C112 146, 80 154, 72 170 C90 179, 116 173, 130 165 C144 173, 170 179, 188 170 C180 154, 148 146, 130 158 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
      </g>`;

    case 'cool_shades':
      return `<g>
        <path d="M86 120 Q102 113 116 120 M144 118 Q160 109 176 118" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M72 134 L188 134" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
        <path d="M78 131 H124 L118 156 Q100 160 82 154 Z" fill="#181210" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M136 131 H182 L178 154 Q160 160 142 156 Z" fill="#181210" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <line x1="88" y1="136" x2="98" y2="151" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>
        <line x1="98" y1="136" x2="104" y2="145" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="146" y1="136" x2="156" y2="151" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>
        ${cMouth('smirk')}
      </g>`;

    case 'cry_laugh':
      return `<g>
        <path d="M84 122 Q102 112 116 122 M144 122 Q158 112 176 122" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        <path d="M86 142 Q102 126 118 142" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
        <path d="M142 142 Q158 126 174 142" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
        ${cMouth('big_laugh')}
        <path d="M82 144 C70 156, 74 172, 84 170 C92 168, 90 154, 82 144 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="3"/>
        <path d="M178 144 C190 156, 186 172, 176 170 C168 168, 170 154, 178 144 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="3"/>
      </g>`;

    case 'wink_smart':
      return `<g>
        <path d="M84 120 Q100 111 116 120 M144 117 Q160 107 176 119" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 140, { px: 2 })}
        <path d="M142 142 Q158 126 174 142" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
        <path d="M166 135 L176 129" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="82" cy="156" rx="9" ry="5.5" fill="#FF758F" opacity="0.55"/>
        <ellipse cx="178" cy="156" rx="9" ry="5.5" fill="#FF758F" opacity="0.55"/>
        ${cMouth('tongue_out')}
      </g>`;

    case 'sly_smirk':
      return `<g>
        ${cEye(102, 141, { px: 2, py: 2, lid: 'angry_l' })}
        ${cEye(158, 141, { px: -2, py: 2, lid: 'angry_r' })}
        ${cMouth('evil_grin')}
      </g>`;

    case 'heart_eyes':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M102 155 C102 155 80 140 80 128 C80 119 92 116 102 126 C112 116 124 119 124 128 C124 140 102 155 102 155 Z" fill="#FF3366" stroke="${stroke}" stroke-width="3.6" stroke-linejoin="round"/>
        <circle cx="92" cy="126" r="3" fill="#FFFFFF"/>
        <path d="M158 155 C158 155 136 140 136 128 C136 119 148 116 158 126 C168 116 180 119 180 128 C180 140 158 155 158 155 Z" fill="#FF3366" stroke="${stroke}" stroke-width="3.6" stroke-linejoin="round"/>
        <circle cx="148" cy="126" r="3" fill="#FFFFFF"/>
        ${cMouth('big_laugh')}
      </g>`;

    case 'monocle_judge':
      return `<g>
        <path d="M84 122 Q100 115 116 122 M142 114 Q158 104 176 114" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 140)}
        ${cEye(158, 140, { rx: 15, ry: 17 })}
        <circle cx="158" cy="140" r="19" fill="rgba(255,248,220,0.28)" stroke="#F4B942" stroke-width="4.5"/>
        <path d="M177 145 Q185 168 178 190" fill="none" stroke="#F4B942" stroke-width="3.2" stroke-dasharray="4,3"/>
        <path d="M130 161 C116 153, 94 159, 88 169 C102 173, 120 169, 130 165 C140 169, 158 173, 172 169 C166 159, 144 153, 130 161 Z" fill="#5C3A21" stroke="${stroke}" stroke-width="3.2"/>
      </g>`;

    case 'shocked_eyes':
      return `<g>
        <path d="M82 114 Q100 102 118 114 M142 114 Q160 102 178 114" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        ${cEye(102, 140, { rx: 16, ry: 18 })}
        ${cEye(158, 140, { rx: 16, ry: 18 })}
        ${cMouth('open_o')}
      </g>`;

    case 'angry_fierce':
      return `<g>
        ${cEye(102, 141, { iris: '#C1121F', lid: 'angry_l' })}
        ${cEye(158, 141, { iris: '#C1121F', lid: 'angry_r' })}
        ${cMouth('clench')}
      </g>`;

    case 'crying_river':
      return `<g>
        ${cEye(102, 140, { lid: 'sad_l' })}
        ${cEye(158, 140, { lid: 'sad_r' })}
        <path d="M92 152 L90 192 L108 192 L106 152 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.8"/>
        <path d="M154 152 L152 192 L170 192 L168 152 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.8"/>
        ${cMouth('sad')}
      </g>`;

    case 'sleepy_yawn':
      return `<g>
        ${cEye(102, 141, { lid: 'half', py: 3 })}
        ${cEye(158, 141, { lid: 'half', py: 3 })}
        ${cMouth('open_o')}
      </g>`;

    case 'cigar_boss':
      return `<g>
        ${cEye(102, 140, { lid: 'half', px: 2 })}
        ${cEye(158, 140, { lid: 'half', px: 2 })}
        ${cMouth('smirk')}
        <g transform="rotate(14 148 168)">
          <rect x="138" y="164" width="38" height="10" rx="4" fill="#8C5A2B" stroke="${stroke}" stroke-width="3.2"/>
          <rect x="148" y="164" width="6" height="10" fill="#F4B942"/>
          <circle cx="176" cy="169" r="4.5" fill="#FF4D4D"/>
        </g>
      </g>`;

    case 'side_eye':
      return `<g>
        <path d="M84 124 L118 124 M142 118 Q160 108 176 120" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        ${cEye(102, 141, { px: 5, lid: 'half' })}
        ${cEye(158, 141, { px: 5, lid: 'half' })}
        <path d="M110 172 Q130 168 150 173" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
      </g>`;

    case 'nerd_glasses':
      return `<g>
        ${cEye(102, 141, { rx: 14, ry: 15, iris: '#2A6F97' })}
        ${cEye(158, 141, { rx: 14, ry: 15, iris: '#2A6F97' })}
        <circle cx="102" cy="141" r="19" fill="rgba(255,255,255,0.2)" stroke="${stroke}" stroke-width="4.5"/>
        <circle cx="158" cy="141" r="19" fill="rgba(255,255,255,0.2)" stroke="${stroke}" stroke-width="4.5"/>
        <path d="M121 141 Q130 135 139 141" fill="none" stroke="${stroke}" stroke-width="4.5"/>
        <path d="M106 167 Q130 182 154 167" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        <rect x="121" y="170" width="9" height="10" rx="2" fill="#FFFFFF" stroke="${stroke}" stroke-width="2.6"/>
        <rect x="130" y="170" width="9" height="10" rx="2" fill="#FFFFFF" stroke="${stroke}" stroke-width="2.6"/>
      </g>`;

    case 'wink_mustache':
      return `<g>
        <path d="M84 119 Q100 110 116 119 M144 119 Q160 110 176 119" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        ${cEye(102, 139, { px: 2 })}
        <path d="M144 140 Q158 126 172 140" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
        <path d="M130 160 C110 148, 82 158, 76 172 C94 178, 118 173, 130 166 C142 173, 166 178, 184 172 C178 158, 150 148, 130 160 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
      </g>`;

    case 'pirate_patch':
      return `<g>
        <line x1="74" y1="124" x2="186" y2="150" stroke="${stroke}" stroke-width="4.5"/>
        <circle cx="102" cy="141" r="16" fill="#1F1916" stroke="${stroke}" stroke-width="4"/>
        <path d="M94 135 Q102 130 110 135" fill="none" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
        ${cEye(158, 141, { lid: 'angry_r' })}
        ${cMouth('smirk')}
      </g>`;

    case 'happy_smile':
      return `<g>
        <path d="M84 120 Q100 110 116 120 M144 120 Q160 110 176 120" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 140, { iris: '#2E7D32' })}
        ${cEye(158, 140, { iris: '#2E7D32' })}
        <ellipse cx="82" cy="156" rx="11" ry="6.5" fill="#FF758F" opacity="0.65"/>
        <ellipse cx="178" cy="156" rx="11" ry="6.5" fill="#FF758F" opacity="0.65"/>
        ${cMouth('cute_smile')}
      </g>`;

    case 'starry_eyes':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 140, { rx: 15, ry: 16, iris: '#1D3557' })}
        ${cEye(158, 140, { rx: 15, ry: 16, iris: '#1D3557' })}
        <polygon points="102,126 106,136 117,136 108,143 112,154 102,147 92,154 96,143 87,136 98,136" fill="#FFD166" stroke="${stroke}" stroke-width="2.5"/>
        <polygon points="158,126 162,136 173,136 164,143 168,154 158,147 148,154 152,143 143,136 154,136" fill="#FFD166" stroke="${stroke}" stroke-width="2.5"/>
        ${cMouth('big_laugh')}
      </g>`;

    case 'detective_pipe':
      return `<g>
        <path d="M84 122 L116 124 M144 118 Q160 108 176 120" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        ${cEye(102, 140, { lid: 'half', px: 3 })}
        ${cEye(158, 140, { px: 3 })}
        ${cMouth('smirk')}
        <path d="M138 171 L174 182 L182 166 L168 164 L165 173 Z" fill="#6F4E37" stroke="${stroke}" stroke-width="3.2" stroke-linejoin="round"/>
        <circle cx="180" cy="152" r="5.5" fill="#FFF" opacity="0.75"/>
        <circle cx="188" cy="140" r="8" fill="#FFF" opacity="0.55"/>
      </g>`;

    case 'pixel_shades':
      return `<g>
        <path d="M84 120 Q100 112 116 120 M144 116 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        <rect x="76" y="130" width="108" height="8" fill="#111" stroke="${stroke}" stroke-width="2"/>
        <rect x="82" y="138" width="40" height="19" fill="#111" stroke="${stroke}" stroke-width="2.5"/>
        <rect x="138" y="138" width="40" height="19" fill="#111" stroke="${stroke}" stroke-width="2.5"/>
        <rect x="88" y="141" width="8" height="6" fill="#FFF"/>
        <rect x="96" y="147" width="8" height="6" fill="#FFF"/>
        <rect x="144" y="141" width="8" height="6" fill="#FFF"/>
        <rect x="152" y="147" width="8" height="6" fill="#FFF"/>
        ${cMouth('smirk')}
      </g>`;

    case 'royal_goatee':
      return `<g>
        <path d="M84 120 Q100 110 116 120 M144 120 Q160 110 176 120" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        ${cEye(102, 139)}
        ${cEye(158, 139)}
        <path d="M102 162 Q130 153 158 162" fill="none" stroke="#3B2314" stroke-width="5.5" stroke-linecap="round"/>
        ${cMouth('cute_smile')}
        <path d="M118 178 Q130 182 142 178 L130 198 Z" fill="#3B2314" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
      </g>`;

    case 'whistle_cute':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 139, { px: 4, py: -3 })}
        ${cEye(158, 139, { px: 4, py: -3 })}
        <circle cx="136" cy="172" r="7.5" fill="#6B141A" stroke="${stroke}" stroke-width="3.8"/>
        <path d="M154 164 Q166 156 174 164" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round"/>
      </g>`;

    case 'handlebar_twirl':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        ${cEye(102, 138)}
        ${cEye(158, 138)}
        ${cMouth('cute_smile')}
        <path d="M130 162 C110 150, 82 168, 75 155 C71 146, 84 142, 86 151 M130 162 C150 150, 178 168, 185 155 C189 146, 176 142, 174 151" fill="none" stroke="#3B2314" stroke-width="6.5" stroke-linecap="round"/>
      </g>`;

    case 'aviator_gold':
      return `<g>
        <line x1="74" y1="130" x2="186" y2="130" stroke="#F4B942" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M80 130 H122 C122 156 108 160 96 158 C82 156 80 144 80 130 Z" fill="#1D3557" stroke="#F4B942" stroke-width="3.8"/>
        <path d="M138 130 H180 C180 156 166 160 154 158 C140 156 138 144 138 130 Z" fill="#1D3557" stroke="#F4B942" stroke-width="3.8"/>
        <line x1="90" y1="136" x2="100" y2="150" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
        <line x1="148" y1="136" x2="158" y2="150" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
        ${cMouth('smirk')}
      </g>`;

    case 'cat_whiskers':
      return `<g>
        ${cEye(102, 139, { iris: '#2A9D8F' })}
        ${cEye(158, 139, { iris: '#2A9D8F' })}
        <polygon points="123,153 137,153 130,162" fill="#FF758F" stroke="${stroke}" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M112 168 Q121 177 130 163 Q139 177 148 168" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        <path d="M74 153 L92 157 M74 163 L92 163 M186 153 L168 157 M186 163 L168 163" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round"/>
      </g>`;

    case 'laser_eyes':
      return `<g>
        ${cEye(102, 141, { iris: '#EF233C', lid: 'angry_l' })}
        ${cEye(158, 141, { iris: '#EF233C', lid: 'angry_r' })}
        <ellipse cx="102" cy="141" rx="14" ry="8" fill="#EF233C" stroke="#FFD166" stroke-width="3"/>
        <ellipse cx="158" cy="141" rx="14" ry="8" fill="#EF233C" stroke="#FFD166" stroke-width="3"/>
        <circle cx="102" cy="141" r="4.5" fill="#FFF"/>
        <circle cx="158" cy="141" r="4.5" fill="#FFF"/>
        ${cMouth('clench')}
      </g>`;

    case 'dizzy_spiral':
      return `<g>
        <circle cx="102" cy="141" r="14" fill="#FFF" stroke="${stroke}" stroke-width="3.8"/>
        <path d="M102 141 m-7 0 a7 7 0 1 0 14 0 a4.5 4.5 0 1 0 -9 0" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="158" cy="141" r="14" fill="#FFF" stroke="${stroke}" stroke-width="3.8"/>
        <path d="M158 141 m-7 0 a7 7 0 1 0 14 0 a4.5 4.5 0 1 0 -9 0" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M104 174 Q116 164 130 174 Q144 184 156 174" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
      </g>`;

    case 'money_eyes':
      return `<g>
        <circle cx="102" cy="140" r="15" fill="#FFD166" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="158" cy="140" r="15" fill="#FFD166" stroke="${stroke}" stroke-width="3.8"/>
        <text x="102" y="148" text-anchor="middle" font-size="22" font-weight="900" fill="#1B4332">$</text>
        <text x="158" y="148" text-anchor="middle" font-size="22" font-weight="900" fill="#1B4332">$</text>
        ${cMouth('big_laugh')}
      </g>`;

    case 'bandit_mask':
      return `<g>
        <path d="M72 126 Q130 118 188 126 L184 157 Q155 164 130 149 Q105 164 76 157 Z" fill="#1F1916" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        ${cEye(102, 141, { rx: 11, ry: 9, lid: 'angry_l' })}
        ${cEye(158, 141, { rx: 11, ry: 9, lid: 'angry_r' })}
        ${cMouth('smirk')}
      </g>`;

    case 'blush_shy':
      return `<g>
        <path d="M84 122 Q100 114 116 122 M144 122 Q160 114 176 122" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        ${cEye(102, 140, { px: -2, py: -2 })}
        ${cEye(158, 140, { px: -2, py: -2 })}
        <ellipse cx="82" cy="158" rx="13" ry="8" fill="#FF4D6D" opacity="0.65"/>
        <ellipse cx="178" cy="158" rx="13" ry="8" fill="#FF4D6D" opacity="0.65"/>
        <path d="M116 170 Q123 177 130 170 Q137 177 144 170" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
      </g>`;

    case 'vampire_fangs':
      return `<g>
        ${cEye(102, 140, { iris: '#E63946', lid: 'angry_l' })}
        ${cEye(158, 140, { iris: '#E63946', lid: 'angry_r' })}
        <path d="M102 165 Q130 176 158 165" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        <polygon points="110,167 120,169 115,184" fill="#FFF" stroke="${stroke}" stroke-width="2.8" stroke-linejoin="round"/>
        <polygon points="140,169 150,167 145,184" fill="#FFF" stroke="${stroke}" stroke-width="2.8" stroke-linejoin="round"/>
      </g>`;

    case 'robot_visor':
      return `<g>
        <rect x="76" y="126" width="108" height="28" rx="9" fill="#1D3557" stroke="${stroke}" stroke-width="4"/>
        <rect x="88" y="134" width="26" height="12" rx="4" fill="#00F5D4"/>
        <rect x="146" y="134" width="26" height="12" rx="4" fill="#00F5D4"/>
        ${cMouth('clench')}
      </g>`;

    case 'kiss_face':
      return `<g>
        <path d="M86 141 Q102 127 118 141" fill="none" stroke="${stroke}" stroke-width="4.8" stroke-linecap="round"/>
        ${cEye(158, 140)}
        <path d="M124 163 C116 159, 116 170, 128 172 C116 174, 116 185, 124 181" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M158 172 C158 172 146 163 146 156 C146 151 153 149 158 155 C163 149 170 151 170 156 C170 163 158 172 158 172 Z" fill="#FF3366" stroke="${stroke}" stroke-width="2.5"/>
      </g>`;

    case 'zen_calm':
      return `<g>
        <path d="M86 142 Q102 154 118 142" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M142 142 Q158 154 174 142" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="130" cy="125" r="4.5" fill="#E63946" stroke="${stroke}" stroke-width="2"/>
        ${cMouth('cute_smile')}
      </g>`;

    case 'clown_nose':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 137, { rx: 12, ry: 14 })}
        ${cEye(158, 137, { rx: 12, ry: 14 })}
        ${cMouth('big_laugh')}
        <circle cx="130" cy="153" r="13" fill="#E63946" stroke="${stroke}" stroke-width="3.6"/>
        <circle cx="125" cy="148" r="3.8" fill="#FFF"/>
      </g>`;

    case 'scar_warrior':
      return `<g>
        <line x1="96" y1="118" x2="108" y2="162" stroke="#9E2A2B" stroke-width="4" stroke-linecap="round"/>
        <line x1="94" y1="126" x2="108" y2="124" stroke="#9E2A2B" stroke-width="2.8"/>
        ${cEye(102, 141, { lid: 'angry_l' })}
        ${cEye(158, 141, { lid: 'angry_r' })}
        <path d="M108 172 L152 167" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
      </g>`;

    case 'bubblegum_pop':
      return `<g>
        <path d="M84 120 Q100 110 116 120 M144 120 Q160 110 176 120" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 139, { px: 2, py: 3 })}
        ${cEye(158, 139, { px: -2, py: 3 })}
        <circle cx="142" cy="172" r="18" fill="#FF8FA3" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="136" cy="165" r="4.5" fill="#FFF" opacity="0.85"/>
      </g>`;

    case 'unibrow_funny':
      return `<g>
        <path d="M78 125 Q105 114 130 127 Q155 114 182 125" fill="none" stroke="${stroke}" stroke-width="6.5" stroke-linecap="round"/>
        ${cEye(102, 142)}
        ${cEye(158, 142)}
        ${cMouth('big_laugh')}
      </g>`;

    case 'scared_tears':
      return `<g>
        ${cEye(102, 141, { rx: 15, ry: 17, lid: 'sad_l' })}
        ${cEye(158, 141, { rx: 15, ry: 17, lid: 'sad_r' })}
        <path d="M82 152 Q76 164 82 170 Q88 164 82 152 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
        <path d="M178 152 Q172 164 178 170 Q184 164 178 152 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
        <path d="M108 184 Q108 164 130 164 Q152 164 152 184 Z" fill="#6B141A" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M116 184 Q130 175 144 184" fill="#FF758F"/>
      </g>`;

    case 'nerd_teeth':
      return `<g>
        <path d="M84 118 Q100 110 116 118 M144 118 Q160 110 176 118" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/>
        ${cEye(102, 141, { iris: '#2A6F97' })}
        ${cEye(158, 141, { iris: '#2A6F97' })}
        <circle cx="102" cy="141" r="18" fill="rgba(232,244,248,0.25)" stroke="${stroke}" stroke-width="4.5"/>
        <circle cx="158" cy="141" r="18" fill="rgba(232,244,248,0.25)" stroke="${stroke}" stroke-width="4.5"/>
        <path d="M120 140 Q130 134 140 140" fill="none" stroke="${stroke}" stroke-width="4.2"/>
        ${cMouth('big_laugh')}
        <rect x="120" y="162" width="9" height="12" rx="2" fill="#FFF" stroke="${stroke}" stroke-width="2.5"/>
        <rect x="131" y="162" width="9" height="12" rx="2" fill="#FFF" stroke="${stroke}" stroke-width="2.5"/>
      </g>`;

    case 'nervous_sweat':
      return `<g>
        ${cEye(102, 142, { lid: 'sad_l' })}
        ${cEye(158, 142, { lid: 'sad_r' })}
        <path d="M104 174 L114 167 L122 176 L130 167 L138 176 L146 167 L156 174 L146 182 L114 182 Z" fill="#FFF" stroke="${stroke}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M178 116 Q170 132 178 138 Q186 132 178 116 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.6"/>
      </g>`;

    case 'evil_goatee':
      return `<g>
        ${cEye(102, 141, { iris: '#C1121F', lid: 'angry_l' })}
        ${cEye(158, 141, { iris: '#C1121F', lid: 'angry_r' })}
        ${cMouth('smirk')}
        <path d="M118 180 Q130 186 142 180 L130 200 Z" fill="#3B2314" stroke="${stroke}" stroke-width="3.2" stroke-linejoin="round"/>
      </g>`;

    case 'ski_goggles':
      return `<g>
        <rect x="72" y="135" width="116" height="9" rx="4" fill="#3B3B3B" stroke="${stroke}" stroke-width="2.5"/>
        <path d="M80 126 Q130 118 180 126 Q186 140 180 155 Q154 162 130 150 Q106 162 80 155 Q74 140 80 126 Z" fill="#1D3557" stroke="#E0E1DD" stroke-width="5"/>
        <path d="M92 132 L104 148 M148 132 L160 148" stroke="#FFF" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>
        ${cMouth('big_laugh')}
      </g>`;

    case 'yummy_tongue':
      return `<g>
        <path d="M84 120 Q100 110 116 120 M144 120 Q160 110 176 120" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 140)}
        ${cEye(158, 140)}
        ${cMouth('tongue_out')}
      </g>`;

    case 'puffy_cheeks':
      return `<g>
        ${cEye(102, 139)}
        ${cEye(158, 139)}
        <ellipse cx="88" cy="166" rx="12" ry="8.5" fill="#FF8FA3" opacity=".6"/>
        <ellipse cx="172" cy="166" rx="12" ry="8.5" fill="#FF8FA3" opacity=".6"/>
        <path d="M82 152 Q68 166 82 180 M178 152 Q192 166 178 180" fill="none" stroke="${stroke}" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M118 170 Q130 164 142 170 Q130 178 118 170 Z" fill="#6B141A" stroke="${stroke}" stroke-width="3.2"/>
      </g>`;

    case 'wailing_cry':
      return `<g>
        <path d="M86 142 Q102 128 118 142 M142 142 Q158 128 174 142" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/>
        <path d="M84 146 Q74 162 84 170 Q92 162 84 146 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
        <path d="M176 146 Q186 162 176 170 Q168 162 176 146 Z" fill="#4CC9F0" stroke="${stroke}" stroke-width="2.5"/>
        <path d="M104 190 Q104 160 130 160 Q156 160 156 190 Z" fill="#6B141A" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <rect x="116" y="162" width="28" height="6" rx="2" fill="#FFF"/>
        <path d="M112 190 Q130 178 148 190" fill="#FF758F"/>
      </g>`;

    case 'dizzy_tongue':
      return `<g>
        <circle cx="102" cy="141" r="14" fill="#FFF" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="158" cy="141" r="14" fill="#FFF" stroke="${stroke}" stroke-width="3.8"/>
        <path d="M102 141 m-7 0 a7 7 0 1 0 14 0 a4.5 4.5 0 1 0 -9 0" fill="none" stroke="${stroke}" stroke-width="3"/>
        <path d="M158 141 m-7 0 a7 7 0 1 0 14 0 a4.5 4.5 0 1 0 -9 0" fill="none" stroke="${stroke}" stroke-width="3"/>
        ${cMouth('tongue_out')}
      </g>`;

    case 'sick_thermo':
      return `<g>
        ${cEye(102, 141, { lid: 'half', iris: '#6C757D' })}
        ${cEye(158, 141, { lid: 'half', iris: '#6C757D' })}
        <ellipse cx="84" cy="158" rx="11" ry="6.5" fill="#FF4D6D" opacity=".6"/>
        <ellipse cx="176" cy="158" rx="11" ry="6.5" fill="#FF4D6D" opacity=".6"/>
        ${cMouth('sad')}
        <g transform="rotate(-18 140 170)">
          <rect x="138" y="167" width="34" height="8" rx="4" fill="#FFF" stroke="${stroke}" stroke-width="2.8"/>
          <circle cx="172" cy="171" r="5.5" fill="#E63946" stroke="${stroke}" stroke-width="2.2"/>
        </g>
      </g>`;

    case 'nauseous_green':
      return `<g>
        ${cEye(102, 141, { lid: 'sad_l', iris: '#2D6A4F' })}
        ${cEye(158, 141, { lid: 'sad_r', iris: '#2D6A4F' })}
        <ellipse cx="86" cy="158" rx="10" ry="6" fill="#74C69D" opacity=".6"/>
        <ellipse cx="174" cy="158" rx="10" ry="6" fill="#74C69D" opacity=".6"/>
        <path d="M106 176 Q116 168 124 176 Q132 184 140 176 Q148 168 156 176" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
      </g>`;

    case 'frozen_cold':
      return `<g>
        ${cEye(102, 141, { iris: '#0077B6', lid: 'sad_l' })}
        ${cEye(158, 141, { iris: '#0077B6', lid: 'sad_r' })}
        ${cMouth('clench')}
      </g>`;

    case 'bearded_wink':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="#3B2314" stroke-width="6" stroke-linecap="round"/>
        <path d="M86 140 Q102 126 118 140" fill="none" stroke="${stroke}" stroke-width="4.8" stroke-linecap="round"/>
        ${cEye(158, 139)}
        <path d="M80 152 Q84 196 130 200 Q176 196 180 152 Q170 166 154 162 Q130 176 106 162 Q90 166 80 152 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M114 172 Q130 184 146 172 Z" fill="#FFF" stroke="${stroke}" stroke-width="2.8"/>
      </g>`;

    case 'money_tongue':
      return `<g>
        <circle cx="102" cy="140" r="15" fill="#FFD166" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="158" cy="140" r="15" fill="#FFD166" stroke="${stroke}" stroke-width="3.8"/>
        <text x="102" y="148" text-anchor="middle" font-size="22" font-weight="900" fill="#1B4332">$</text>
        <text x="158" y="148" text-anchor="middle" font-size="22" font-weight="900" fill="#1B4332">$</text>
        ${cMouth('tongue_out')}
      </g>`;

    case 'blushing_red':
      return `<g>
        <path d="M86 141 Q102 127 118 141 M142 141 Q158 127 174 141" fill="none" stroke="${stroke}" stroke-width="4.8" stroke-linecap="round"/>
        <ellipse cx="86" cy="158" rx="13" ry="7.5" fill="#E63946" opacity=".6"/>
        <ellipse cx="174" cy="158" rx="13" ry="7.5" fill="#E63946" opacity=".6"/>
        ${cMouth('cute_smile')}
      </g>`;

    case 'smug_lids':
      return `<g>
        <path d="M84 122 Q100 114 116 124 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        ${cEye(102, 141, { lid: 'half', px: 3 })}
        ${cEye(158, 141, { lid: 'half', px: 3 })}
        ${cMouth('smirk')}
      </g>`;

    case 'zipper_mouth':
      return `<g>
        <path d="M84 120 Q100 112 116 120 M144 120 Q160 112 176 120" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 141)}
        ${cEye(158, 141)}
        <rect x="100" y="168" width="60" height="11" rx="4" fill="#ADB5BD" stroke="${stroke}" stroke-width="3.2"/>
        <path d="M108 168 v11 M118 168 v11 M128 168 v11 M138 168 v11 M148 168 v11" stroke="${stroke}" stroke-width="2.2"/>
      </g>`;

    case 'fire_angry':
      return `<g>
        <path d="M84 130 Q88 110 96 120 Q100 104 108 118 Q114 108 118 134 Z" fill="#FB8500" stroke="#C1121F" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M176 130 Q172 110 164 120 Q160 104 152 118 Q146 108 142 134 Z" fill="#FB8500" stroke="#C1121F" stroke-width="2.5" stroke-linejoin="round"/>
        ${cEye(102, 142, { iris: '#E63946', lid: 'angry_l' })}
        ${cEye(158, 142, { iris: '#E63946', lid: 'angry_r' })}
        ${cMouth('clench')}
      </g>`;

    case 'whistle_note':
      return `<g>
        <path d="M86 141 Q102 128 118 141 M142 141 Q158 128 174 141" fill="none" stroke="${stroke}" stroke-width="4.6" stroke-linecap="round"/>
        <ellipse cx="126" cy="172" rx="8.5" ry="7.5" fill="#6B141A" stroke="${stroke}" stroke-width="3.6"/>
        <path d="M162 175 L162 155 L176 151 L176 169" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linejoin="round"/>
        <ellipse cx="158" cy="176" rx="5" ry="4" fill="${stroke}"/>
        <ellipse cx="172" cy="170" rx="5" ry="4" fill="${stroke}"/>
      </g>`;

    case 'black_eye':
      return `<g>
        ${cEye(102, 141)}
        <ellipse cx="158" cy="142" rx="18" ry="15" fill="#6C4E9B" opacity=".55"/>
        ${cEye(158, 141, { lid: 'half' })}
        <rect x="114" y="150" width="32" height="11" rx="4" transform="rotate(-12 130 155)" fill="#F4C095" stroke="${stroke}" stroke-width="2.6"/>
        ${cMouth('clench')}
      </g>`;

    case 'ninja_headband':
      return `<g>
        <path d="M70 112 Q130 104 190 112 L190 126 Q130 118 70 126 Z" fill="#1D3557" stroke="${stroke}" stroke-width="3.4"/>
        <rect x="114" y="111" width="32" height="12" rx="3" fill="#ADB5BD" stroke="${stroke}" stroke-width="2.5"/>
        ${cEye(102, 143, { lid: 'angry_l' })}
        ${cEye(158, 143, { lid: 'angry_r' })}
        ${cMouth('smirk')}
      </g>`;

    case 'surprised_o':
      return `<g>
        <path d="M84 116 Q100 106 116 116 M144 116 Q160 106 176 116" fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round"/>
        ${cEye(102, 141, { rx: 15, ry: 17 })}
        ${cEye(158, 141, { rx: 15, ry: 17 })}
        ${cMouth('open_o')}
      </g>`;

    case 'meh_yawn':
      return `<g>
        ${cEye(102, 141, { lid: 'half' })}
        ${cEye(158, 141, { lid: 'half' })}
        ${cMouth('open_o')}
      </g>`;

    case 'pipe_relaxed':
      return `<g>
        ${cEye(102, 141, { lid: 'half', px: 2 })}
        ${cEye(158, 141, { lid: 'half', px: 2 })}
        ${cMouth('cute_smile')}
        <path d="M136 173 Q152 181 166 177" fill="none" stroke="#6F4E37" stroke-width="5" stroke-linecap="round"/>
        <path d="M160 168 L178 168 L176 186 Q170 192 164 186 Z" fill="#8C5A2B" stroke="${stroke}" stroke-width="3.2" stroke-linejoin="round"/>
      </g>`;

    case 'unimpressed':
      return `<g>
        <path d="M84 125 L118 125 M142 120 Q160 112 176 120" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
        ${cEye(102, 142, { lid: 'half', px: 4 })}
        ${cEye(158, 142, { lid: 'half', px: 4 })}
        <path d="M110 174 L150 174" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
      </g>`;

    case 'musketeer':
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="${stroke}" stroke-width="4.4" stroke-linecap="round"/>
        ${cEye(102, 139)}
        ${cEye(158, 139)}
        <path d="M130 162 C116 154 100 166 90 158 C86 154 90 148 95 152 M130 162 C144 154 160 166 170 158 C174 154 170 148 165 152" fill="none" stroke="#3B2314" stroke-width="6" stroke-linecap="round"/>
        ${cMouth('cute_smile')}
        <path d="M122 182 L138 182 L130 198 Z" fill="#3B2314" stroke="${stroke}" stroke-width="2.8" stroke-linejoin="round"/>
      </g>`;

    case 'king_beard':
    default:
      return `<g>
        <path d="M84 118 Q100 108 116 118 M144 118 Q160 108 176 118" fill="none" stroke="#4A2C18" stroke-width="5.5" stroke-linecap="round"/>
        ${cEye(102, 138)}
        ${cEye(158, 138)}
        <path d="M82 156 Q130 148 178 156 Q174 198 130 198 Q86 198 82 156 Z" fill="#4A2C18" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M112 166 Q130 180 148 166 Z" fill="#FFF" stroke="${stroke}" stroke-width="2.8"/>
      </g>`;
  }
}

/**
 * رسم الـ 20 طاقية وتاج بستايل كرتوني منحني بظلال ولمعة يركب على حافة الكوباية (X: 66..194, Y: 86)
 */
function renderHatVector(hatId) {
  const stroke = '#231710';
  switch (hatId) {
    case 'fez_tarboush':
      return `<g>
        <path d="M90 86 C92 60, 98 32, 106 26 Q130 22 154 26 C162 32, 168 60, 170 86 Q130 92 90 86 Z" fill="#C1121F" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M102 78 C104 56, 108 36, 113 32" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="5" stroke-linecap="round"/>
        <path d="M132 25 Q166 26 176 66" fill="none" stroke="#1D1A17" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M176 66 L171 80 M176 66 L181 79 M176 66 L176 81" stroke="#1D1A17" stroke-width="3.5" stroke-linecap="round"/>
      </g>`;

    case 'straw_hat':
      return `<g>
        <ellipse cx="130" cy="84" rx="82" ry="14" fill="#F4D35E" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M80 82 C82 32, 178 32, 180 82 Z" fill="#F4D35E" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M96 52 Q115 38 140 42" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="5" stroke-linecap="round"/>
        <path d="M81 68 Q130 76 179 68 L180 80 Q130 88 80 80 Z" fill="#D62828" stroke="${stroke}" stroke-width="3.6"/>
        <path d="M156 73 L170 66 L168 82 Z" fill="#D62828" stroke="${stroke}" stroke-width="3"/>
      </g>`;

    case 'chef_toque':
      return `<g>
        <path d="M82 74 C56 62, 66 24, 98 32 C110 8, 150 8, 162 32 C194 24, 204 62, 178 74 Z" fill="#FFFFFF" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M104 42 Q108 58 106 70 M130 36 L130 70 M156 42 Q152 58 154 70" stroke="#D8E2DC" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M82 68 Q130 76 178 68 L176 87 Q130 94 84 87 Z" fill="#F8F9FA" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
      </g>`;

    case 'sultan_crown':
      return `<g>
        <path d="M78 86 L68 38 L102 58 L130 22 L158 58 L192 38 L182 86 Z" fill="#FFD166" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <circle cx="68" cy="34" r="5" fill="#FFF" stroke="${stroke}" stroke-width="3"/>
        <circle cx="130" cy="18" r="6" fill="#FFF" stroke="${stroke}" stroke-width="3"/>
        <circle cx="192" cy="34" r="5" fill="#FFF" stroke="${stroke}" stroke-width="3"/>
        <path d="M76 74 Q130 82 184 74 L182 88 Q130 95 78 88 Z" fill="#F4A261" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="130" cy="56" r="7" fill="#E63946" stroke="${stroke}" stroke-width="3"/>
        <circle cx="102" cy="65" r="5" fill="#2A9D8F" stroke="${stroke}" stroke-width="2.5"/>
        <circle cx="158" cy="65" r="5" fill="#2A9D8F" stroke="${stroke}" stroke-width="2.5"/>
      </g>`;

    case 'royal_turban':
      return `<g>
        <path d="M68 74 C60 32, 110 18, 130 24 C150 18, 200 32, 192 74 C184 90, 76 90, 68 74 Z" fill="#FFFDF9" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M78 66 Q130 36 182 66 M84 44 Q130 74 176 44" fill="none" stroke="#E2D5C1" stroke-width="4" stroke-linecap="round"/>
        <path d="M130 44 C134 16, 154 12, 158 26 C148 30, 140 38, 134 46 Z" fill="#FFD166" stroke="${stroke}" stroke-width="3.2"/>
        <circle cx="130" cy="54" r="10" fill="#E63946" stroke="#FFD166" stroke-width="4"/>
      </g>`;

    case 'pirate_hat':
      return `<g>
        <path d="M48 84 C68 20, 192 20, 212 84 Q130 76 48 84 Z" fill="#1F1D1B" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M54 80 C72 26, 188 26, 206 80" fill="none" stroke="#F4B942" stroke-width="3.5"/>
        <path d="M74 76 Q130 84 186 76 L184 88 Q130 96 76 88 Z" fill="#D62828" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="130" cy="54" r="9" fill="#FFFFFF" stroke="${stroke}" stroke-width="2.5"/>
        <circle cx="127" cy="53" r="2" fill="#1F1D1B"/><circle cx="133" cy="53" r="2" fill="#1F1D1B"/>
      </g>`;

    case 'detective_hat':
      return `<g>
        <ellipse cx="130" cy="84" rx="76" ry="12" fill="#7F5539" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M80 82 C82 32, 114 28, 130 36 C146 28, 178 32, 180 82 Z" fill="#9C6644" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M82 68 Q130 75 178 68 L179 80 Q130 87 81 80 Z" fill="#3D2618" stroke="${stroke}" stroke-width="3.5"/>
      </g>`;

    case 'viking_helmet':
      return `<g>
        <path d="M78 66 C42 52, 42 18, 58 20 C60 40, 72 48, 86 52 Z" fill="#FFF3B0" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M182 66 C218 52, 218 18, 202 20 C200 40, 188 48, 174 52 Z" fill="#FFF3B0" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M74 84 C74 28, 186 28, 186 84 Z" fill="#8D99AE" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M72 72 Q130 80 188 72 L186 86 Q130 94 74 86 Z" fill="#5C677D" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="96" cy="79" r="3" fill="#FFF"/><circle cx="130" cy="81" r="3" fill="#FFF"/><circle cx="164" cy="79" r="3" fill="#FFF"/>
      </g>`;

    case 'ghutra_agal':
      return `<g>
        <path d="M60 102 C60 28, 200 28, 200 102 L184 102 C180 64, 80 64, 76 102 Z" fill="#FFFFFF" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <rect x="74" y="44" width="112" height="11" rx="5.5" fill="#1D1A17" stroke="${stroke}" stroke-width="3.2"/>
        <rect x="76" y="56" width="108" height="10" rx="5" fill="#1D1A17" stroke="${stroke}" stroke-width="3.2"/>
      </g>`;

    case 'winter_beanie':
      return `<g>
        <circle cx="130" cy="22" r="14" fill="#FFFDF7" stroke="${stroke}" stroke-width="4"/>
        <path d="M76 82 C76 28, 184 28, 184 82 Z" fill="#E76F51" stroke="${stroke}" stroke-width="4.2"/>
        <rect x="70" y="68" width="120" height="20" rx="9" fill="#F4A261" stroke="${stroke}" stroke-width="4"/>
        <line x1="95" y1="68" x2="95" y2="88" stroke="${stroke}" stroke-width="3.2"/>
        <line x1="118" y1="68" x2="118" y2="88" stroke="${stroke}" stroke-width="3.2"/>
        <line x1="142" y1="68" x2="142" y2="88" stroke="${stroke}" stroke-width="3.2"/>
        <line x1="165" y1="68" x2="165" y2="88" stroke="${stroke}" stroke-width="3.2"/>
      </g>`;

    case 'cowboy_hat':
      return `<g>
        <path d="M78 84 C78 32, 182 32, 182 84 Z" fill="#2A9D8F" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M98 48 Q120 36 146 42" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M50 84 Q84 64 142 82 L78 86 Z" fill="#1D3557" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <circle cx="130" cy="34" r="5" fill="#F4A261" stroke="${stroke}" stroke-width="3"/>
      </g>`;

    case 'Graduation_cap':
      return `<g>
        <path d="M84 64 L84 86 Q130 94 176 86 L176 64 Z" fill="#2B2D42" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
        <polygon points="130,28 206,52 130,74 54,52" fill="#2B2D42" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M130 52 L184 66 L184 94" fill="none" stroke="#FFD166" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="184" cy="94" r="5.5" fill="#FFD166" stroke="${stroke}" stroke-width="2.5"/>
      </g>`;

    case 'pharaoh_nemes':
      return `<g>
        <path d="M62 96 C66 36, 82 26, 130 26 C178 26, 194 36, 198 96 L180 96 L176 78 L84 78 L80 96 Z" fill="#1D3557" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M84 32 L74 90 M106 28 L100 78 M154 28 L160 78 M176 32 L186 90" stroke="#FFD166" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M74 72 Q130 80 186 72 L184 86 Q130 94 76 86 Z" fill="#FFD166" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="130" cy="50" r="9" fill="#FFD166" stroke="${stroke}" stroke-width="3.2"/>
        <circle cx="130" cy="50" r="4" fill="#E63946"/>
      </g>`;

    case 'french_beret':
      return `<g>
        <path d="M68 82 C58 42, 118 22, 188 46 C204 54, 192 82, 174 84 Z" fill="#D62828" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M92 48 Q128 34 162 46" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="5" stroke-linecap="round"/>
        <path d="M76 76 Q130 84 180 76 L178 86 Q130 94 78 86 Z" fill="#1D1A17" stroke="${stroke}" stroke-width="3.6"/>
        <path d="M130 36 Q134 22 140 24" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round"/>
      </g>`;

    case 'top_hat':
      return `<g>
        <ellipse cx="130" cy="84" rx="72" ry="12" fill="#212529" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M86 82 L82 22 Q130 16 178 22 L174 82 Z" fill="#343A40" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
        <path d="M96 30 L98 64" stroke="rgba(255,255,255,0.28)" stroke-width="5" stroke-linecap="round"/>
        <path d="M85 66 Q130 73 175 66 L174 80 Q130 87 86 80 Z" fill="#D62828" stroke="${stroke}" stroke-width="3.6"/>
      </g>`;

    case 'dj_headphones':
      return `<g>
        <path d="M58 128 C58 24, 202 24, 202 128" fill="none" stroke="#2B2D42" stroke-width="11" stroke-linecap="round"/>
        <path d="M90 42 Q130 28 170 42" fill="none" stroke="#8D99AE" stroke-width="5" stroke-linecap="round"/>
        <rect x="44" y="102" width="24" height="46" rx="11" fill="#EF233C" stroke="${stroke}" stroke-width="4"/>
        <rect x="192" y="102" width="24" height="46" rx="11" fill="#EF233C" stroke="${stroke}" stroke-width="4"/>
        <circle cx="56" cy="125" r="5" fill="#FFD166"/>
        <circle cx="204" cy="125" r="5" fill="#FFD166"/>
      </g>`;

    case 'propeller_cap':
      return `<g>
        <path d="M76 84 C76 34, 184 34, 184 84 Z" fill="#FFB703" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M104 84 C104 34, 156 34, 156 84 Z" fill="#219EBC" stroke="${stroke}" stroke-width="3.8"/>
        <line x1="130" y1="36" x2="130" y2="20" stroke="${stroke}" stroke-width="4.5"/>
        <ellipse cx="130" cy="20" rx="36" ry="6.5" fill="#FB8500" stroke="${stroke}" stroke-width="3.4"/>
        <circle cx="130" cy="20" r="5" fill="#FFD166" stroke="${stroke}" stroke-width="2.5"/>
      </g>`;

    case 'knight_helmet':
      return `<g>
        <path d="M130 32 C164 8, 192 22, 186 44 C162 46, 144 40, 130 36 Z" fill="#E63946" stroke="${stroke}" stroke-width="3.6" stroke-linejoin="round"/>
        <path d="M76 86 C76 30, 184 30, 184 86 Z" fill="#ADB5BD" stroke="${stroke}" stroke-width="4.2"/>
        <path d="M72 70 Q130 80 188 70 L186 86 Q130 94 74 86 Z" fill="#6C757D" stroke="${stroke}" stroke-width="3.8"/>
        <line x1="106" y1="54" x2="106" y2="66" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="130" y1="52" x2="130" y2="66" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="154" y1="54" x2="154" y2="66" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>
      </g>`;

    case 'whipped_cherry':
      return `<g>
        <path d="M126 38 Q130 24 138 36" fill="none" stroke="#FFD166" stroke-width="4.5" stroke-linecap="round"/>
        <ellipse cx="130" cy="62" rx="30" ry="25" fill="#FFD166" stroke="${stroke}" stroke-width="4.2"/>
        <circle cx="118" cy="58" r="5" fill="${stroke}"/><circle cx="116" cy="56" r="1.8" fill="#FFF"/>
        <circle cx="142" cy="58" r="5" fill="${stroke}"/><circle cx="140" cy="56" r="1.8" fill="#FFF"/>
        <polygon points="124,64 136,64 130,73" fill="#FB8500" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
      </g>`;

    case 'anise_star':
      return `<g>
        <g transform="translate(130, 48) scale(1.15)">
          <path d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" fill="#92400E" stroke="${stroke}" stroke-width="3.8" stroke-linejoin="round"/>
          <path d="M-15 -15 L0 -5 L15 -15 L5 0 L15 15 L0 5 L-15 15 L-5 0 Z" fill="#B45309" stroke="${stroke}" stroke-width="3.2" stroke-linejoin="round"/>
          <circle cx="0" cy="0" r="4.5" fill="#FDE68A" stroke="${stroke}" stroke-width="2"/>
          <ellipse cx="-2" cy="-2" rx="1.5" ry="1.2" fill="#FFFFFF"/>
        </g>
      </g>`;

    case 'jester_hat':
    default:
      return `<g>
        <path d="M72 74 Q130 84 188 74 L186 86 Q130 95 74 86 Z" fill="#52B788" stroke="${stroke}" stroke-width="3.8"/>
        <circle cx="94" cy="76" r="12" fill="#FF4D6D" stroke="${stroke}" stroke-width="3.4"/>
        <circle cx="94" cy="76" r="4.5" fill="#FFD166"/>
        <circle cx="130" cy="73" r="14" fill="#FFB703" stroke="${stroke}" stroke-width="3.4"/>
        <circle cx="130" cy="73" r="5" fill="#FFF"/>
        <circle cx="166" cy="76" r="12" fill="#FF4D6D" stroke="${stroke}" stroke-width="3.4"/>
        <circle cx="166" cy="76" r="4.5" fill="#FFD166"/>
      </g>`;
  }
}

/**
 * رسم مسار الجسم المنحني المميز لكل كوباية مع الحفاظ على حافة الكوباية العلوية الموحدة (X: 68..192, Y: 86)
 */
function renderBodyShape(outfitObj, gradId) {
  const stroke = '#231710';
  let bodyPath = '';
  let extra = '';

  switch (outfitObj.shape) {
    case 'yansoon':
      bodyPath = 'M68 88 C56 142, 64 220, 130 226 C196 220, 204 142, 192 88 Z';
      extra = `
        <ellipse cx="130" cy="226" rx="42" ry="6" fill="${outfitObj.bandColor}" stroke="${stroke}" stroke-width="4"/>
        <!-- نجمة يانسون خشبية عطرية مرسومة على الكوباية -->
        <g transform="translate(130, 206) scale(0.72)">
          <path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z" fill="#92400E" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M-10 -10 L0 -3 L10 -10 L3 0 L10 10 L0 3 L-10 10 L-3 0 Z" fill="#B45309" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="0" cy="0" r="3" fill="#FDE68A"/>
        </g>
      `;
      break;
    case 'chubby':
      bodyPath = 'M68 88 C52 145, 62 226, 130 226 C198 226, 208 145, 192 88 Z';
      extra = `<ellipse cx="130" cy="225" rx="44" ry="6" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4"/>`;
      break;
    case 'waisted':
      bodyPath = 'M68 88 C80 132, 60 175, 76 212 C84 224, 176 224, 184 212 C200 175, 180 132, 192 88 Z';
      extra = `<path d="M150 83 C158 68, 176 72, 168 86 Z" fill="#2A9D8F" stroke="${stroke}" stroke-width="3"/>`;
      break;
    case 'kanaka':
      bodyPath = 'M72 88 C74 128, 56 176, 68 210 C76 226, 184 226, 192 210 C204 176, 186 128, 188 88 Z';
      break;
    case 'goblet':
      bodyPath = 'M68 88 C66 156, 92 198, 130 198 C168 198, 194 156, 192 88 Z';
      extra = `
        <rect x="122" y="196" width="16" height="24" rx="4" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4"/>
        <ellipse cx="130" cy="222" rx="38" ry="6.5" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4"/>
      `;
      break;
    case 'dallah':
      bodyPath = 'M74 88 C82 128, 58 172, 72 210 C82 226, 178 226, 188 210 C202 172, 178 128, 186 88 Z';
      break;
    case 'tapered':
      bodyPath = 'M68 88 C70 154, 84 222, 130 222 C176 222, 190 154, 192 88 Z';
      break;
    case 'curved':
      bodyPath = 'M68 88 C62 146, 72 222, 130 224 C188 222, 198 146, 192 88 Z';
      break;
    case 'mug':
    default:
      bodyPath = 'M68 88 C60 150, 74 224, 130 224 C186 224, 200 150, 192 88 Z';
      extra = `<ellipse cx="130" cy="224" rx="40" ry="5.5" fill="${outfitObj.bandColor}" stroke="${stroke}" stroke-width="3.8"/>`;
      break;
  }

  return `
    ${extra}
    <path d="${bodyPath}" fill="url(#${gradId})" stroke="${stroke}" stroke-width="4.8" stroke-linejoin="round"/>
    <!-- لمعة كرتونية ثلاثية الأبعاد على جانب الكوباية -->
    <path d="M80 112 C74 146, 78 182, 88 202" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="7" stroke-linecap="round"/>
    <!-- ظل سفلي خفيف يعطي عمق كرتوني -->
    <path d="M94 214 Q130 222 166 214" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="6" stroke-linecap="round"/>
  `;
}

/**
 * بناء الشخصية الكرتونية الموحدة (Modular Cartoon SVG Rig)
 */
function buildCharacterSVG(cfg) {
  const safeCfg = cfg || {};
  const outfitObj = CHARACTER_PARTS.outfit.find(o => o.id === safeCfg.outfit) || CHARACTER_PARTS.outfit[0];
  const faceId = safeCfg.face || 'laugh_joy';
  const hatId = safeCfg.hat || 'fez_tarboush';
  const gradId = `cupGrad_${outfitObj.id}`;
  const stroke = '#231710';

  let sideHandlesSVG = '';
  if (outfitObj.handleSide === 'right' || outfitObj.handleSide === 'both') {
    sideHandlesSVG += `
      <path d="M186 122 C222 120, 222 178, 182 176" fill="none" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>
      <path d="M186 122 C222 120, 222 178, 182 176" fill="none" stroke="${outfitObj.rimColor}" stroke-width="10" stroke-linecap="round"/>
    `;
  }
  if (outfitObj.handleSide === 'left') {
    sideHandlesSVG += `
      <path d="M76 132 L28 110 C22 108, 18 118, 24 122 L72 146 Z" fill="${outfitObj.bandColor}" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
      <circle cx="28" cy="116" r="4" fill="#FFD166"/>
    `;
  }
  if (outfitObj.handleSide === 'both') {
    sideHandlesSVG += `
      <path d="M78 134 C46 128, 38 102, 48 94 C54 106, 64 116, 78 118 Z" fill="${outfitObj.bodyTop}" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
    `;
  }

  return `
    <svg viewBox="0 0 260 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="${outfitObj.name}">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="12%" y2="100%">
          <stop offset="0%" stop-color="${outfitObj.bodyTop}"/>
          <stop offset="100%" stop-color="${outfitObj.bodyBot}"/>
        </linearGradient>
      </defs>

      <!-- ظل الأرضية -->
      <ellipse cx="130" cy="260" rx="60" ry="9" fill="rgba(35, 23, 16, 0.2)"/>

      <!-- الأرجل والأحذية الكرتونية -->
      <path d="M108 218 Q105 234 104 246" fill="none" stroke="${stroke}" stroke-width="7.5" stroke-linecap="round"/>
      <path d="M152 218 Q155 234 156 246" fill="none" stroke="${stroke}" stroke-width="7.5" stroke-linecap="round"/>
      <path d="M84 252 C84 238, 116 238, 118 252 Z" fill="${outfitObj.shoeColor}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M142 252 C144 238, 176 238, 176 252 Z" fill="${outfitObj.shoeColor}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>

      <!-- المقابض الجانبية -->
      ${sideHandlesSVG}

      <!-- الأذرع والجوانتيات الكرتونية -->
      <path d="M72 158 C44 166, 44 190, 56 198" fill="none" stroke="${stroke}" stroke-width="7.5" stroke-linecap="round"/>
      <circle cx="58" cy="200" r="9.5" fill="#FFFDF9" stroke="${stroke}" stroke-width="4"/>
      <path d="M188 158 C216 166, 216 190, 204 198" fill="none" stroke="${stroke}" stroke-width="7.5" stroke-linecap="round"/>
      <circle cx="202" cy="200" r="9.5" fill="#FFFDF9" stroke="${stroke}" stroke-width="4"/>

      <!-- جسم الكوباية الكرتوني المنحني -->
      ${renderBodyShape(outfitObj, gradId)}

      <!-- الحافة الكريمية العلوية الموحدة والمشروب -->
      <path d="M65 86 Q130 98 195 86 L192 104 Q130 116 68 104 Z" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4.2" stroke-linejoin="round"/>
      <ellipse cx="130" cy="86" rx="64" ry="11" fill="${outfitObj.rimColor}" stroke="${stroke}" stroke-width="4.2"/>
      <ellipse cx="130" cy="87" rx="54" ry="6.5" fill="${outfitObj.liquidColor}"/>

      <!-- ملامح الوجه الكرتوني -->
      ${renderFaceVector(faceId)}

      <!-- الطاقية / الإكسسوار الكرتوني فوق الكوباية -->
      ${renderHatVector(hatId)}
    </svg>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHARACTER_PARTS,
    buildCharacterSVG,
    renderBodyShape,
    renderFaceVector,
    renderHatVector
  };
}
