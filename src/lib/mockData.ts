import { Article, Photo, Profile, SocialLinks } from '@/types';

export const initialProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Roohi',
  tagline: 'Photographer • Traveller • Storyteller',
  badge_title: 'Visual Diarist',
  bio: 'Photographer, writer, and visual diarist. Exploring the timeless soul of India through the mist-shrouded tea slopes of Darjeeling, sacred ghats of the Hooghly, and the ancient red sandstone shadows of Old Delhi. Dedicated to slow travel, quiet mornings, and atmospheric light.',
  philosophy: 'My philosophy centers on slow travel — lingering long after the tour buses depart, waiting for the shadows to lengthen across ancient cobblestones, and capturing landscapes not as static vistas, but as breathing, evolving emotions.',
  quote: 'Photography is the practice of noticing the quiet poetry that the world whispers when no one is shouting.',
  technical_summary: 'Every story in this journal is paired with high-fidelity imagery captured on prime lenses with minimal post-processing, preserving the authentic color palette and ambient light of each location.',
  highlight_1_title: 'Medium',
  highlight_1_desc: 'Natural light & environmental portraiture',
  highlight_2_title: 'Passage',
  highlight_2_desc: 'Heritage trails, misty tea gardens & sacred river ghats',
  highlight_3_title: 'Ethos',
  highlight_3_desc: 'Quiet presence, leave no trace',
  profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  created_at: new Date('2026-01-01').toISOString(),
  updated_at: new Date().toISOString(),
};

export const initialSocialLinks: SocialLinks = {
  id: '00000000-0000-0000-0000-000000000001',
  instagram: 'https://www.instagram.com/roohi.lens/',
  youtube: 'https://youtube.com/@roohiphotography',
  pinterest: 'https://pinterest.com/roohijournal',
  facebook: null,
  linkedin: null,
  x: null,
  snapchat: null,
  custom_links: [
    {
      id: 'sl-1',
      platform: 'instagram',
      title: 'Instagram',
      url: 'https://www.instagram.com/roohi.lens/',
    },
    {
      id: 'sl-2',
      platform: 'youtube',
      title: 'YouTube',
      url: 'https://youtube.com/@roohiphotography',
    },
    {
      id: 'sl-3',
      platform: 'pinterest',
      title: 'Pinterest',
      url: 'https://pinterest.com/roohijournal',
    },
  ],
  updated_at: new Date().toISOString(),
};

export const initialArticles: Article[] = [
  // Published Stories (Delhi & West Bengal)
  {
    id: 'art-1',
    title: 'Monsoon Reverie Along the Hooghly: The Ghats of North Kolkata',
    slug: 'monsoon-reverie-along-the-hooghly',
    excerpt: 'Watching the swollen monsoon currents of the Hooghly river at dusk, where clay artisans sculpt deities in Kumartuli and wooden country boats drift beneath the Howrah Bridge.',
    location: 'Kumartuli & Bagbazar Ghat, Kolkata, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Monsoon mist and traditional wooden boats along the Hooghly river in North Kolkata',
    published: true,
    published_at: new Date('2026-09-28T06:30:00Z').toISOString(),
    created_at: new Date('2026-09-27T10:00:00Z').toISOString(),
    updated_at: new Date('2026-09-28T07:15:00Z').toISOString(),
    content: `<h2>The Scent of Wet Silt and Old Timber</h2>
<p>There is an unspoken reverence in the air along the northern banks of the Hooghly river during the monsoon. The sky hangs low in shades of bruised charcoal, and the river flows thick and relentless with mountain silt carried thousands of kilometers from the glaciers of the north.</p>
<p>At Bagbazar Ghat, wooden country boats creak in rhythm with the swell. Across the narrow paved lanes, the sculptors of Kumartuli work diligently in their open straw-roofed studios, shaping clay gathered directly from the riverbed into majestic forms of Durga and Saraswati.</p>
<blockquote>"In Kolkata, the river is not merely a boundary of water; it is a repository of memories, prayer, and timeless poetry."</blockquote>
<h2>Chasing the Twilight Light</h2>
<p>Photography here requires moving with the rhythm of the city. Waiting beneath dripping colonial porticos with a 35mm prime lens, watching amber incandescent bulbs glow inside antique tea stalls as the evening rain begins its soft crescendo.</p>
<p>The interplay of river mist, vintage iron architecture, and the warm reflections on wet basalt stone creates an intimate cinematic mood found nowhere else in the world.</p>`,
  },
  {
    id: 'art-2',
    title: 'Shadows of the Red Sandstone: Dawn at Jama Masjid & Chandni Chowk',
    slug: 'shadows-of-red-sandstone-old-delhi',
    excerpt: 'Wandering through the waking lanes of Old Delhi at 5:30 AM as pigeon flocks soar over red minarets and steam rises from giant brass chai kettles.',
    location: 'Old Delhi (Shahjahanabad), Delhi',
    cover_image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Morning sunlight illuminating the sandstone arches and soaring minarets of Jama Masjid',
    published: true,
    published_at: new Date('2026-09-22T08:15:00Z').toISOString(),
    created_at: new Date('2026-09-20T14:00:00Z').toISOString(),
    updated_at: new Date('2026-09-22T09:00:00Z').toISOString(),
    content: `<h2>The City Wakes Before Dawn</h2>
<p>Before the cacophony of motorized rickshaws and street vendors engulfs Chandni Chowk, Shahjahanabad belongs to the birds and the bread makers. At 5:00 AM, the massive red sandstone gates of Jama Masjid stand quietly against a pale turquoise sky.</p>
<p>As the first beams of dawn break over the eastern horizon, thousands of pigeons take flight in unison, their wings catching the morning golden hour against the soaring minarets.</p>
<blockquote>"Old Delhi does not whisper its history; it breathes it through every sandstone arch, spice grain, and narrow cobblestone lane."</blockquote>
<h2>The Labyrinths of Khari Baoli</h2>
<p>Stepping down into Asia's largest spice market at sunrise is an overwhelming sensory journey. Gunny sacks overflowing with dried Kashmiri chillies, whole cinnamon bark, and green cardamom pods release essential oils that perfume the morning breeze.</p>
<p>Using a slow shutter, I captured the silhouette of hand-cart pullers navigating shafts of sunlight cutting through decades of historic dust.</p>`,
  },
  {
    id: 'art-3',
    title: 'Terracotta Dreams: The 17th-Century Temples of Bishnupur',
    slug: 'terracotta-dreams-bishnupur',
    excerpt: 'Exploring the intricately carved terracotta temples of the Malla kings glowing under the warm golden afternoon sun across the red soil of Rarh Bengal.',
    location: 'Bishnupur, Bankura, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1600100397608-f010f421a9a1?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Intricately carved terracotta panels depicting epic mythological motifs on the walls of Rasmancha',
    published: true,
    published_at: new Date('2026-09-14T11:45:00Z').toISOString(),
    created_at: new Date('2026-09-13T09:20:00Z').toISOString(),
    updated_at: new Date('2026-09-14T12:00:00Z').toISOString(),
    content: `<h2>Masterpieces in Burnt Clay</h2>
<p>In a region devoid of natural stone, the 17th-century architects of the Malla dynasty turned to the earth beneath their feet. They baked local red clay into thousands of intricate terracotta tiles, each panel depicting battle scenes from the Ramayana, celestial dancers, and rustic village life.</p>
<p>Standing before the pyramidal majesty of Rasmancha and the curved curved-roof elegance of Jor-Bangla, one witnesses an architectural idiom completely unique to Bengal.</p>
<blockquote>"The soil of Bengal was baked by fire and shaped by devotion, creating monuments that feel as alive as the land itself."</blockquote>
<h2>The Golden Hour on Red Clay</h2>
<p>As late afternoon sun strikes the porous terracotta surfaces, the burnt orange tiles transform into deep, radiant amber. The intricate detailing of musicians and lotus medallions comes alive under harsh raking light, creating profound sculptural depth.</p>`,
  },
  {
    id: 'art-4',
    title: 'The Whispering Pines of Darjeeling: Tea Trails & Kanchenjunga Sunrise',
    slug: 'whispering-pines-darjeeling-kanchenjunga',
    excerpt: 'Chasing the first golden light striking the icy summit of Kanchenjunga over sea-of-clouds tea estates along the Himalayan foothills.',
    location: 'Darjeeling & Tiger Hill, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Emerald green tea gardens sloping down misty Himalayan hillsides in Darjeeling',
    published: true,
    published_at: new Date('2026-09-05T16:00:00Z').toISOString(),
    created_at: new Date('2026-09-04T12:00:00Z').toISOString(),
    updated_at: new Date('2026-09-05T16:30:00Z').toISOString(),
    content: `<h2>Alpenglow Above the Clouds</h2>
<p>At 4:00 AM on Tiger Hill, the mountain air cuts like crystal. Hundreds of travelers stand in hushed anticipation as the eastern horizon shifts from deep indigo to blazing magenta.</p>
<p>Suddenly, the towering summit of Mount Kanchenjunga — third highest peak in the world — catches the first ray of direct sunlight, bursting into a brilliant beacon of liquid gold high above an unbroken sea of fluffy valley clouds.</p>
<blockquote>"High in the Himalayas, the mountains teach you humility before you even set up your tripod."</blockquote>
<h2>The Rhythms of the Tea Slopes</h2>
<p>Later in the morning, wandering down the steep terraces of Happy Valley Tea Estate, the gentle clinking of wicker baskets and the deft fingers of tea pluckers harvest the famous first flush leaves. The scent of fresh pine needles and crushed green tea leaves fills every breath.</p>`,
  },
  {
    id: 'art-5',
    title: 'Echoes of Empires: Twilight at Lodhi Gardens & Humayun\'s Tomb',
    slug: 'echoes-of-empires-lodhi-humayun',
    excerpt: 'Silhouetted 15th-century Sayyid domes, peacocks calling across lush lawns, and ancient stone lattice jaali windows capturing amber dusk light.',
    location: 'Lodhi Gardens & Nizamuddin, New Delhi',
    cover_image_url: 'https://images.unsplash.com/photo-1585136917195-236b33418197?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Red sandstone and marble dome of Humayun\'s Tomb reflected in serene garden waterways',
    published: true,
    published_at: new Date('2026-08-26T14:10:00Z').toISOString(),
    created_at: new Date('2026-08-25T11:00:00Z').toISOString(),
    updated_at: new Date('2026-08-26T15:00:00Z').toISOString(),
    content: `<h2>Symmetry in Stone and Water</h2>
<p>Humayun's Tomb represents the zenith of early Mughal architecture in the subcontinent. Set within a classical Charbagh garden divided into four quadrants by tranquil stone water channels, the monument is a triumph of geometric harmony.</p>
<p>As the intense Delhi sun begins to dip below the neem trees, the white marble dome reflects the soft lilac tones of the dusk sky while the red sandstone facade retains its daytime warmth.</p>
<blockquote>"Lattice windows do not merely filter light; they sculpt shadow into geometry."</blockquote>
<h2>The Serenity of Lodhi</h2>
<p>Just a few kilometers away, Lodhi Gardens offers a peaceful sanctuary amidst the capital’s bustle. Elderly residents walk around the 500-year-old tombs of Sikandar Lodi and Muhammad Shah while peacocks strut across manicured lawns in the waning evening glow.</p>`,
  },

  // 6 Rich Drafts for Testing & Publishing (Delhi & West Bengal)
  {
    id: 'art-draft-1',
    title: 'Tides of the Mangrove Kingdom: Deep in the Sundarbans',
    slug: 'tides-mangrove-kingdom-sundarbans',
    excerpt: 'Navigating narrow saltwater creeks where tidal mangrove roots weave labyrinths and kingfishers dart across emerald water.',
    location: 'Sundarbans National Park, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Dense tidal mangrove waterways and tangled root forests of the Sundarbans',
    published: false,
    published_at: null,
    created_at: new Date('2026-09-29T14:20:00Z').toISOString(),
    updated_at: new Date('2026-09-30T05:10:00Z').toISOString(),
    content: `<h2>The World of Rising Waters</h2>
<p>The Sundarbans delta is a living, breathing landscape governed purely by lunar tides. Twice each day, immense tidal surges submerge the mudflats, only to reveal intricate aerial root systems known as pneumatophores when the water retreats.</p>
<p>Aboard a slow wooden motorboat navigating the silent Matla river, the primeval wilderness feels untamed and enigmatic.</p>`,
  },
  {
    id: 'art-draft-2',
    title: 'Yellow Cabs and Stately Mansions: The Heritage Lanes of North Calcutta',
    slug: 'yellow-cabs-mansions-north-calcutta',
    excerpt: 'Bookstalls piled high along Boi Para, iconic yellow Ambassador taxis reflecting neon lights on rain-slicked streets, and ornate wrought-iron balconies.',
    location: 'College Street & Sovabazar, Kolkata, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Classic vintage yellow taxi parked before an ornate heritage mansion in North Kolkata',
    published: false,
    published_at: null,
    created_at: new Date('2026-09-29T16:00:00Z').toISOString(),
    updated_at: new Date('2026-09-30T06:00:00Z').toISOString(),
    content: `<h2>Boi Para and the Intellectual Heart</h2>
<p>College Street is the largest second-hand book market in the world. Stalls made of weathered wood line the sidewalks for nearly a mile, filled to the brim with rare manuscripts, poetry folios, and academic volumes.</p>
<p>Stepping inside the historic Indian Coffee House on Bankim Chatterjee Street, the lively hum of intellectual debate under whirling ceiling fans remains unchanged since the 1950s.</p>`,
  },
  {
    id: 'art-draft-3',
    title: 'Sufi Nights & Rose Petals: Nizamuddin Dargah at Dusk',
    slug: 'sufi-nights-rose-petals-nizamuddin',
    excerpt: 'The haunting cadence of evening qawwalis, burning incense, and courtyard lamps reflecting off marble floors.',
    location: 'Hazrat Nizamuddin Basti, Delhi',
    cover_image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Marble shrine courtyard illuminated by oil lamps and fragrant rose petals in Nizamuddin',
    published: false,
    published_at: null,
    created_at: new Date('2026-09-29T17:30:00Z').toISOString(),
    updated_at: new Date('2026-09-30T07:15:00Z').toISOString(),
    content: `<h2>Devotion in Melody</h2>
<p>On Thursday evenings, the narrow alleys of Nizamuddin Basti fill with the intoxicating scent of attar, burning agarbatti, and fresh red rose petals. Pilgrims gather in the marble courtyard of Sufi saint Nizamuddin Auliya.</p>
<p>When the qawwali singers strike the harmonium and raise their voices in passionate devotion, the collective resonance transcends physical space.</p>`,
  },
  {
    id: 'art-draft-4',
    title: 'Autumn Grass & Red Soil: The Chhatim Groves of Santiniketan',
    slug: 'autumn-grass-santiniketan-kash-phool',
    excerpt: 'Fields of blooming white Kash flowers swaying in the autumnal breeze and red mud roads leading to Baul singer gatherings.',
    location: 'Santiniketan, Birbhum, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Vast field of white Kash flowers swaying under autumn sunshine in Santiniketan',
    published: false,
    published_at: null,
    created_at: new Date('2026-09-29T18:45:00Z').toISOString(),
    updated_at: new Date('2026-09-30T08:00:00Z').toISOString(),
    content: `<h2>Tagore’s Open-Air Sanctuary</h2>
<p>Santiniketan was envisioned by Rabindranath Tagore as an ashram where education and creativity flourish in direct communion with nature. Open-air classrooms beneath sprawling banyan and chhatim trees still foster artistic freedom.</p>
<p>During autumn (Sharad), fields of feathery white Kash flowers (Saccharum spontaneum) cover the landscape like rolling snow, heralding the arrival of Durga Puja.</p>`,
  },
  {
    id: 'art-draft-5',
    title: 'Stepwells of Silence: The Hidden Geometry of Agrasen ki Baoli',
    slug: 'stepwells-of-silence-agrasen-ki-baoli',
    excerpt: 'Descending 108 stone steps into Delhi\'s 14th-century stepwell, where architectural symmetry creates mesmerizing shadows in the heart of the capital.',
    location: 'Hailey Road, Connaught Place, New Delhi',
    cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Dramatic downward stone steps and arched recesses of Agrasen ki Baoli in Delhi',
    published: false,
    published_at: null,
    created_at: new Date('2026-09-29T20:10:00Z').toISOString(),
    updated_at: new Date('2026-09-30T08:45:00Z').toISOString(),
    content: `<h2>Subterranean Sanctuary</h2>
<p>Hidden behind modern high-rise buildings near Connaught Place lies Agrasen ki Baoli, an ancient 60-meter-long stepwell. As you descend the steep 108 stone stairs, the traffic noise of modern Delhi dissipates into total acoustic tranquility.</p>
<p>The three levels of vaulted arched niches cast dramatic geometric shadows across the weathered stone walls.</p>`,
  },
  {
    id: 'art-draft-6',
    title: 'Mist and Rhododendrons: Sandakphu Ridge Trek',
    slug: 'mist-rhododendrons-sandakphu-ridge',
    excerpt: 'Standing on the highest peak of West Bengal with uninterrupted panoramic views of Mount Everest and the Sleeping Buddha range.',
    location: 'Singalila National Park, West Bengal',
    cover_image_url: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=2400&q=85',
    cover_image_alt: 'Himalayan mountain ridge trail shrouded in cloud and blooming rhododendron trees',
    published: false,
    published_at: null,
    created_at: new Date('2026-09-29T18:00:00Z').toISOString(),
    updated_at: new Date('2026-09-29T19:30:00Z').toISOString(),
    content: `<h2>The Crown of Bengal</h2>
<p>At 3,636 meters, Sandakphu is the highest point in West Bengal. The ridge offers the extraordinary privilege of viewing four of the world's five highest mountains simultaneously: Everest, Kanchenjunga, Lhotse, and Makalu.</p>
<p>In spring, the Singalila forest explodes with crimson and pink rhododendron blossoms veiled in swirling mountain fog.</p>`,
  },
];

export const initialPhotos: Photo[] = [
  // Photos for Kolkata Hooghly story (art-1)
  {
    id: 'p-1-1',
    article_id: 'art-1',
    image_url: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-1/photo-01.webp',
    caption: 'Monsoon mist rising over the sacred waters of Bagbazar Ghat at dawn.',
    sort_order: 1,
    created_at: new Date('2026-09-28T06:35:00Z').toISOString(),
  },
  {
    id: 'p-1-2',
    article_id: 'art-1',
    image_url: 'https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-1/photo-02.webp',
    caption: 'Artisans in Kumartuli shaping sacred clay deities from the silt of the Ganges.',
    sort_order: 2,
    created_at: new Date('2026-09-28T06:36:00Z').toISOString(),
  },
  {
    id: 'p-1-3',
    article_id: 'art-1',
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-1/photo-03.webp',
    caption: 'A wooden country boat cutting across the twilight reflections of the river.',
    sort_order: 3,
    created_at: new Date('2026-09-28T06:37:00Z').toISOString(),
  },
  {
    id: 'p-1-4',
    article_id: 'art-1',
    image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-1/photo-04.webp',
    caption: 'Colonial wrought-iron balconies glowing under warm amber street lamps.',
    sort_order: 4,
    created_at: new Date('2026-09-28T06:38:00Z').toISOString(),
  },

  // Photos for Old Delhi story (art-2)
  {
    id: 'p-2-1',
    article_id: 'art-2',
    image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-2/photo-01.webp',
    caption: 'First sunlight striking the red sandstone domes and marble minarets of Jama Masjid.',
    sort_order: 1,
    created_at: new Date('2026-09-22T08:20:00Z').toISOString(),
  },
  {
    id: 'p-2-2',
    article_id: 'art-2',
    image_url: 'https://images.unsplash.com/photo-1597040663248-2616235b3ce9?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-2/photo-02.webp',
    caption: 'Hundreds of pigeons taking flight across the vast sandstone courtyard.',
    sort_order: 2,
    created_at: new Date('2026-09-22T08:21:00Z').toISOString(),
  },
  {
    id: 'p-2-3',
    article_id: 'art-2',
    image_url: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-2/photo-03.webp',
    caption: 'Morning light slicing through the spice market alleys of Khari Baoli.',
    sort_order: 3,
    created_at: new Date('2026-09-22T08:22:00Z').toISOString(),
  },

  // Photos for Bishnupur story (art-3)
  {
    id: 'p-3-1',
    article_id: 'art-3',
    image_url: 'https://images.unsplash.com/photo-1600100397608-f010f421a9a1?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-3/photo-01.webp',
    caption: 'Intricate terracotta tiles detailing celestial dancers and epic chronicles.',
    sort_order: 1,
    created_at: new Date('2026-09-14T11:50:00Z').toISOString(),
  },
  {
    id: 'p-3-2',
    article_id: 'art-3',
    image_url: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-3/photo-02.webp',
    caption: 'The distinctive curved rooflines of Jor-Bangla temple at sunset.',
    sort_order: 2,
    created_at: new Date('2026-09-14T11:51:00Z').toISOString(),
  },

  // Photos for Darjeeling story (art-4)
  {
    id: 'p-4-1',
    article_id: 'art-4',
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-4/photo-01.webp',
    caption: 'Lush tea terraces cascading down the steep ridges of Happy Valley.',
    sort_order: 1,
    created_at: new Date('2026-09-05T16:05:00Z').toISOString(),
  },
  {
    id: 'p-4-2',
    article_id: 'art-4',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-4/photo-02.webp',
    caption: 'First alpenglow illuminating the twin summits of Mount Kanchenjunga.',
    sort_order: 2,
    created_at: new Date('2026-09-05T16:06:00Z').toISOString(),
  },

  // Photos for Lodhi Gardens & Humayun\'s Tomb story (art-5)
  {
    id: 'p-5-1',
    article_id: 'art-5',
    image_url: 'https://images.unsplash.com/photo-1585136917195-236b33418197?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-5/photo-01.webp',
    caption: 'The grand symmetry of Humayun’s Tomb framed by evening cypress trees.',
    sort_order: 1,
    created_at: new Date('2026-08-26T14:15:00Z').toISOString(),
  },
  {
    id: 'p-5-2',
    article_id: 'art-5',
    image_url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-5/photo-01.webp',
    caption: 'Mughal dome silhouetted against a lilac sunset sky in Lodhi Gardens.',
    sort_order: 2,
    created_at: new Date('2026-08-26T14:16:00Z').toISOString(),
  },

  // Photos for Draft 1 (Sundarbans)
  {
    id: 'p-d1-1',
    article_id: 'art-draft-1',
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-draft-1/photo-01.webp',
    caption: 'Tangled mangrove root labyrinths reflecting the morning river mist.',
    sort_order: 1,
    created_at: new Date('2026-09-29T14:25:00Z').toISOString(),
  },

  // Photos for Draft 2 (North Calcutta)
  {
    id: 'p-d2-1',
    article_id: 'art-draft-2',
    image_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-draft-2/photo-01.webp',
    caption: 'Yellow Ambassador cab passing by a grand colonial courtyard in Sovabazar.',
    sort_order: 1,
    created_at: new Date('2026-09-29T16:05:00Z').toISOString(),
  },

  // Photos for Draft 3 (Nizamuddin)
  {
    id: 'p-d3-1',
    article_id: 'art-draft-3',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-draft-3/photo-01.webp',
    caption: 'Devotees lighting clay lamps in the marble courtyard of the dargah.',
    sort_order: 1,
    created_at: new Date('2026-09-29T17:35:00Z').toISOString(),
  },

  // Photos for Draft 4 (Santiniketan)
  {
    id: 'p-d4-1',
    article_id: 'art-draft-4',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-draft-4/photo-01.webp',
    caption: 'Fields of white Kash flowers blooming across the red soil of Birbhum.',
    sort_order: 1,
    created_at: new Date('2026-09-29T18:50:00Z').toISOString(),
  },

  // Photos for Draft 5 (Agrasen ki Baoli)
  {
    id: 'p-d5-1',
    article_id: 'art-draft-5',
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=85',
    storage_path: 'articles/art-draft-5/photo-01.webp',
    caption: 'Geometric shadow lines falling across 108 stone steps at Agrasen ki Baoli.',
    sort_order: 1,
    created_at: new Date('2026-09-29T20:15:00Z').toISOString(),
  },
];
