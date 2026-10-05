import { Product } from '../types';

/**
 * High-accuracy Telugu subtitles and transliterations for Sivakasi Green Crackers & Fireworks.
 * Tailored for Visakhapatnam / Andhra Pradesh customers.
 */

// Explicit product-code or product-name dictionary
const EXACT_TELUGU_MAP: Record<string, { telugu: string; transliteration: string }> = {
  // Maroons & Sound Crackers
  '0801': { telugu: 'గణేష్ టపాసులు', transliteration: 'Ganesh Tapasulu' },
  '0803': { telugu: 'లక్ష్మీ టపాసులు', transliteration: 'Lakshmi Tapasulu' },
  '0802': { telugu: 'బెంగాల్ ప్రిన్స్ టపాసులు', transliteration: 'Bengal Prince Crackers' },
  '0805': { telugu: 'హైడ్రో బాంబులు', transliteration: 'Hydro Bombs' },
  '0806': { telugu: 'ఆటం బాంబులు', transliteration: 'Atom Bombs' },
  '0807': { telugu: 'మెగా డిజిటల్ బాంబు', transliteration: 'Mega Digital Bomb' },
  '0808': { telugu: 'బుల్లెట్ బాంబులు', transliteration: 'Bullet Bombs' },
  '0809': { telugu: 'కురువి 2 సౌండ్ టపాసులు', transliteration: 'Kuruvi 2-Sound Crackers' },
  '0810': { telugu: 'రైఫిల్ క్లాసిక్ టపాసులు', transliteration: 'Rifle Classic Crackers' },

  // Sparklers
  '0101': { telugu: '10 సెం.మీ ఎలక్ట్రిక్ కాకరపువ్వొత్తులు', transliteration: '10cm Electric Sparklers' },
  '0102': { telugu: '10 సెం.మీ రంగుల మతాబులు', transliteration: '10cm Colour Sparklers' },
  '0103': { telugu: '10 సెం.మీ ఆకుపచ్చ రంగు మతాబులు', transliteration: '10cm Green Sparklers' },
  '0104': { telugu: '10 సెం.మీ ఎరుపు రంగు మతాబులు', transliteration: '10cm Red Sparklers' },
  '0105': { telugu: '15 సెం.మీ ఎలక్ట్రిక్ కాకరపువ్వొత్తులు', transliteration: '15cm Electric Sparklers' },
  '0106': { telugu: '15 సెం.మీ రంగుల మతాబులు', transliteration: '15cm Colour Sparklers' },
  '0107': { telugu: '15 సెం.మీ ఆకుపచ్చ రంగు మతాబులు', transliteration: '15cm Green Sparklers' },
  '0108': { telugu: '15 సెం.మీ ఎరుపు రంగు మతాబులు', transliteration: '15cm Red Sparklers' },
  '0109': { telugu: '30 సెం.మీ ఎలక్ట్రిక్ కాకరపువ్వొత్తులు', transliteration: '30cm Electric Sparklers' },
  '0110': { telugu: '30 సెం.మీ రంగుల మతాబులు', transliteration: '30cm Colour Sparklers' },
  '0111': { telugu: '30 సెం.మీ ఆకుపచ్చ రంగు మతాబులు', transliteration: '30cm Green Sparklers' },
  '0112': { telugu: '30 సెం.మీ ఎరుపు రంగు మతాబులు', transliteration: '30cm Red Sparklers' },
  '0113': { telugu: '50 సెం.మీ మెగా జంబో కాకరపువ్వొత్తులు', transliteration: '50cm Mega Jumbo Sparklers' },
  '0114': { telugu: '50 సెం.మీ మెగా రంగుల మతాబులు', transliteration: '50cm Mega Colour Sparklers' },

  // Chakkars & Ground Spinners
  '0201': { telugu: 'స్పెషల్ భూచక్రాలు', transliteration: 'Special Bhuchakralu' },
  '0202': { telugu: 'డీలక్స్ భూచక్రాలు', transliteration: 'Deluxe Bhuchakralu' },
  '0203': { telugu: 'అశోక భూచక్రాలు', transliteration: 'Asoka Bhuchakralu' },
  '0204': { telugu: 'పెద్ద భూచక్రాలు (బిగ్)', transliteration: 'Big Bhuchakralu' },
  '0205': { telugu: 'విష్ణు చక్రాలు (స్పిన్నింగ్ వీల్)', transliteration: 'Vishnu Chakralu' },
  '0206': { telugu: 'ప్లాస్టిక్ వీల్ చక్రాలు', transliteration: 'Plastic Wheel Spinners' },
  '0207': { telugu: 'రెడ్ & గ్రీన్ వీల్ చక్రాలు', transliteration: 'Red & Green Wheels' },

  // Flower Pots & Fountains
  '0301': { telugu: 'స్పెషల్ చిచ్చుబుడ్లు', transliteration: 'Special Chichubudlu' },
  '0302': { telugu: 'అశోక చిచ్చుబుడ్లు', transliteration: 'Asoka Chichubudlu' },
  '0303': { telugu: 'పెద్ద చిచ్చుబుడ్లు (బిగ్)', transliteration: 'Big Chichubudlu' },
  '0304': { telugu: 'జెయింట్ చిచ్చుబుడ్లు', transliteration: 'Giant Chichubudlu' },
  '0305': { telugu: 'డీలక్స్ చిచ్చుబుడ్లు', transliteration: 'Deluxe Chichubudlu' },
  '0306': { telugu: 'కలర్ కోటి చిచ్చుబుడ్లు', transliteration: 'Color Koti Pots' },
  '0307': { telugu: 'రంగుల ఫౌంటెన్ (కలర్ ఫౌంటెన్)', transliteration: 'Colour Fountain' },
  '0308': { telugu: 'మయూరి పీకాక్ ఫౌంటెన్', transliteration: 'Peacock Colour Fountain' },
  '0309': { telugu: 'ట్రిపుల్ కలర్ ఫౌంటెన్', transliteration: 'Triple Colour Fountain' },
  '0310': { telugu: 'జాదుగర్ స్పార్క్లర్ ఫౌంటెన్', transliteration: 'Jadugar Fountain' },

  // Rockets & Missiles
  '0401': { telugu: 'బేబీ రాకెట్లు', transliteration: 'Baby Rockets' },
  '0402': { telugu: 'విజిలింగ్ రాకెట్లు', transliteration: 'Whistling Rockets' },
  '0403': { telugu: 'బాంబ్ రాకెట్లు', transliteration: 'Bomb Rockets' },
  '0404': { telugu: 'లూనార్ స్పేస్ రాకెట్లు', transliteration: 'Lunar Space Rockets' },

  // Aerial Multi-Shots & Cakes
  '0501': { telugu: '12 షాట్స్ ఆకాశ కలర్ బాణసంచా', transliteration: '12 Shots Aerial Cake' },
  '0502': { telugu: '30 షాట్స్ మల్టీ-కలర్ బాణసంచా', transliteration: '30 Shots Multi-Colour Cake' },
  '0503': { telugu: '60 షాట్స్ గ్రాండ్ ఏరియల్ కేక్', transliteration: '60 Shots Grand Aerial Cake' },
  '0504': { telugu: '120 షాట్స్ రాయల్ స్కై స్పెక్టాకిల్', transliteration: '120 Shots Royal Sky Display' },
  '0505': { telugu: '240 షాట్స్ మెగా ఏరియల్ డిస్ప్లే', transliteration: '240 Shots Mega Display Cake' },
  '0506': { telugu: '500 షాట్స్ కింగ్ ఏరియల్ షో', transliteration: '500 Shots King Aerial Cake' },
  '0507': { telugu: '1000 షాట్స్ గ్రాండ్ ఫినాలే డిస్ప్లే', transliteration: '1000 Shots Grand Finale Cake' },

  // Safety Matches & Novelties
  '0601': { telugu: 'సేఫ్టీ మ్యాచ్ బాక్స్', transliteration: 'Safety Match Box' },
  '0602': { telugu: 'కలర్ పాప్-పాప్ నిప్పులు', transliteration: 'Color Pop-Pops' },
  '0603': { telugu: 'ట్వింక్లింగ్ స్టార్స్ పెన్సిల్స్', transliteration: 'Twinkling Stars' },
  '0604': { telugu: 'హెలికాప్టర్ & డ్రోన్ ఫ్యాన్సీ', transliteration: 'Helicopter & Drone Novelties' },
  '0605': { telugu: 'పాము బిళ్ళలు (స్నేక్ ఎగ్స్)', transliteration: 'Snake Eggs (Paamu Billalu)' },

  // Gift Boxes
  '0701': { telugu: 'దీపావళి ఫ్యామిలీ గిఫ్ట్ బాక్స్ (స్టాండర్డ్)', transliteration: 'Diwali Standard Gift Box' },
  '0702': { telugu: 'ప్రీమియం రాయల్ గిఫ్ట్ హ్యాంపర్', transliteration: 'Premium Royal Gift Hamper' },
  '0703': { telugu: 'కిడ్స్ స్పెషల్ గిఫ్ట్ బాక్స్', transliteration: 'Kids Special Gift Box' },
  '0704': { telugu: 'మెగా సెలబ్రేషన్ గిఫ్ట్ బాక్స్', transliteration: 'Mega Celebration Gift Hamper' },
};

/**
 * Resolves a high-quality Telugu subtitle for any Product.
 */
export function getTeluguSubtitle(product: Partial<Product>): string {
  if (!product) return 'హరిత బాణసంచా (Green Cracker)';

  // 1. Check exact code match
  if (product.code && EXACT_TELUGU_MAP[product.code]) {
    return EXACT_TELUGU_MAP[product.code].telugu;
  }

  const name = (product.name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  // 2. Exact / Fuzzy keyword matching on Product Name
  if (name.includes('ganesh')) return 'గణేష్ టపాసులు (Ganesh Crackers)';
  if (name.includes('lakshmi') || name.includes('laxmi')) return 'లక్ష్మీ టపాసులు (Lakshmi Crackers)';
  if (name.includes('bengal prince')) return 'బెంగాల్ ప్రిన్స్ టపాసులు';
  if (name.includes('hydro bomb') || name.includes('hydrogen')) return 'హైడ్రో బాంబులు (Hydro Bomb)';
  if (name.includes('atom bomb')) return 'ఆటం బాంబులు (Atom Bomb)';
  if (name.includes('digital bomb')) return 'డిజిటల్ బాంబు (Digital Bomb)';
  if (name.includes('bullet bomb')) return 'బుల్లెట్ బాంబులు (Bullet Bomb)';
  if (name.includes('kuruvi')) return 'కురువి టపాసులు (Kuruvi Crackers)';

  // Sparklers by Size & Type
  if (name.includes('sparkler') || category.includes('sparkler')) {
    const size = name.match(/(\d+)\s*(cm|\")/i)?.[1] || '';
    const isColor = name.includes('colour') || name.includes('color') || name.includes('red') || name.includes('green');
    
    if (size) {
      if (isColor) return `${size} సెం.మీ రంగుల మతాబులు (${size}cm Colour Sparklers)`;
      return `${size} సెం.మీ ఎలక్ట్రిక్ కాకరపువ్వొత్తులు (${size}cm Electric Sparklers)`;
    }
    if (isColor) return 'రంగుల మతాబులు (Colour Sparklers)';
    return 'ఎలక్ట్రిక్ కాకరపువ్వొత్తులు (Electric Sparklers)';
  }

  // Chakkars & Wheels
  if (name.includes('chakkar') || category.includes('chakkar') || name.includes('wheel') || category.includes('wheel') || name.includes('spinner')) {
    if (name.includes('vishnu')) return 'విష్ణు చక్రాలు (Vishnu Chakralu)';
    if (name.includes('deluxe')) return 'డీలక్స్ భూచక్రాలు (Deluxe Bhuchakralu)';
    if (name.includes('asoka') || name.includes('ashoka')) return 'అశోక భూచక్రాలు (Ashoka Bhuchakralu)';
    if (name.includes('special')) return 'స్పెషల్ భూచక్రాలు (Special Bhuchakralu)';
    if (name.includes('big') || name.includes('giant')) return 'పెద్ద భూచక్రాలు (Big Bhuchakralu)';
    if (name.includes('wheel')) return 'స్పిన్నింగ్ వీల్ చక్రాలు (Spinning Wheel)';
    return 'భూచక్రాలు (Ground Chakkars)';
  }

  // Flower Pots & Fountains
  if (name.includes('flower pot') || name.includes('pot') || category.includes('flower pot')) {
    if (name.includes('asoka') || name.includes('ashoka')) return 'అశోక చిచ్చుబుడ్లు (Asoka Chichubudlu)';
    if (name.includes('deluxe')) return 'డీలక్స్ చిచ్చుబుడ్లు (Deluxe Chichubudlu)';
    if (name.includes('giant')) return 'జెయింట్ చిచ్చుబుడ్లు (Giant Chichubudlu)';
    if (name.includes('big')) return 'పెద్ద చిచ్చుబుడ్లు (Big Chichubudlu)';
    if (name.includes('special')) return 'స్పెషల్ చిచ్చుబుడ్లు (Special Chichubudlu)';
    if (name.includes('colour') || name.includes('color') || name.includes('koti')) return 'రంగుల చిచ్చుబుడ్లు (Colour Pots)';
    return 'చిచ్చుబుడ్లు (Flower Pots)';
  }

  // Colour Fountains
  if (name.includes('fountain') || category.includes('fountain') || name.includes('jadugar') || name.includes('peacock')) {
    if (name.includes('peacock') || name.includes('mayuri')) return 'మయూరి పీకాక్ ఫౌంటెన్ (Peacock Fountain)';
    if (name.includes('jadugar')) return 'జాదుగర్ కలర్ ఫౌంటెన్ (Jadugar Fountain)';
    if (name.includes('triple')) return 'ట్రిపుల్ కలర్ ఫౌంటెన్ (Triple Colour Fountain)';
    return 'రంగుల ఫౌంటెన్ (Colour Fountain)';
  }

  // Rockets & Missiles
  if (name.includes('rocket') || category.includes('rocket') || name.includes('missile')) {
    if (name.includes('baby')) return 'బేబీ రాకెట్లు (Baby Rockets)';
    if (name.includes('whistle') || name.includes('whistling')) return 'విజిలింగ్ రాకెట్లు (Whistling Rockets)';
    if (name.includes('bomb')) return 'బాంబ్ రాకెట్లు (Bomb Rockets)';
    if (name.includes('lunar') || name.includes('space')) return 'స్పేస్ రాకెట్లు (Space Rockets)';
    return 'ఆకాశ రాకెట్లు (Sky Rockets)';
  }

  // Aerial Multi-Shots / Cakes
  if (name.includes('shot') || name.includes('cake') || category.includes('cake') || category.includes('aerial') || name.includes('aerial')) {
    const shotsMatch = name.match(/(\d+)\s*(shot|shots)/i);
    const shots = shotsMatch ? shotsMatch[1] : '';
    if (shots) {
      return `${shots} షాట్స్ ఆకాశ బాణసంచా (${shots} Shots Aerial Cake)`;
    }
    return 'మల్టీ-షాట్ ఆకాశ బాణసంచా (Aerial Multi-Shot Cake)';
  }

  // Safety Matches
  if (name.includes('match') || category.includes('match')) {
    return 'సేఫ్టీ మ్యాచ్ బాక్స్ (Safety Matches)';
  }

  // Novelties / Kids Specials
  if (name.includes('pop') || name.includes('drone') || name.includes('helicopter') || name.includes('star') || name.includes('snake') || category.includes('novelt')) {
    if (name.includes('drone') || name.includes('helicopter')) return 'డ్రోన్ & హెలికాప్టర్ ఫ్యాన్సీ (Drone Novelty)';
    if (name.includes('snake')) return 'పాము బిళ్ళలు (Snake Eggs)';
    if (name.includes('star')) return 'మినుకు తారలు (Twinkling Stars)';
    if (name.includes('pop')) return 'పాప్-పాప్ నిప్పులు (Color Pops)';
    return 'పిల్లల ఫ్యాన్సీ బాణసంచా (Kids Fancy Novelty)';
  }

  // Gift Boxes
  if (name.includes('gift') || name.includes('box') || name.includes('hamper') || category.includes('gift')) {
    if (name.includes('royal') || name.includes('premium')) return 'ప్రీమియం రాయల్ గిఫ్ట్ హ్యాంపర్ (Royal Gift Hamper)';
    if (name.includes('standard') || name.includes('classic')) return 'దీపావళి ఫ్యామిలీ గిఫ్ట్ బాక్స్ (Diwali Gift Box)';
    return 'దీపావళి సెలబ్రేషన్ గిఫ్ట్ బాక్స్ (Diwali Gift Box)';
  }

  // Maroons & Sound Crackers General
  if (category.includes('maroon') || name.includes('cracker') || name.includes('sound')) {
    return 'సాంప్రదాయ టపాసులు (Traditional Crackers)';
  }

  return 'గ్రీన్ క్రాకర్స్ (CSIR-NEERI Green Cracker)';
}
