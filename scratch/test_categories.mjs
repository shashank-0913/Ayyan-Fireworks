import { initialProducts } from '../src/lib/initialData.js';

const TABS = [
  'All',
  'Marrons',
  'Sparklers',
  'Chakkars',
  'Fountains',
  'Novelty Fireworks',
  'Atom Bombs',
  'Combination Fireworks',
  'Chorsa Fireworks',
  'Rockets',
  'Fancy Novelties',
  'Aerial Shells',
  'Cake Items',
  'Assorted Gift Packs'
];

function matchesCategoryTab(product, tab) {
  if (tab === 'All') return true;
  const cat = (product.category || '').toLowerCase().trim();
  const t = tab.toLowerCase().trim();

  if (cat === t) return true;

  switch (t) {
    case 'marrons':
      return cat.includes('marron');
    case 'sparklers':
      return cat.includes('sparkler');
    case 'chakkars':
    case 'ground chakkars':
      return cat.includes('chakkar') || cat.includes('wheel');
    case 'fountains':
    case 'colourful fountains':
      return cat.includes('fountain') || cat.includes('pot');
    case 'novelty fireworks':
      return cat === 'novelty fireworks';
    case 'atom bombs':
      return cat === 'atom bombs' || cat.includes('bomb');
    case 'chorsa fireworks':
      return cat === 'chorsa fireworks' || cat.includes('chorsa');
    case 'rockets':
    case 'sky rockets':
      return cat === 'rockets' || cat.includes('rocket');
    case 'fancy novelties':
      return cat === 'fancy novelties';
    case 'aerial shells':
    case 'shells':
      return cat.includes('shell') || cat.includes('cell') || cat === 'all new 2';
    case 'combination fireworks':
      return cat === 'combination fireworks' || cat.includes('combination');
    case 'cake items':
    case 'aerial multi-shots':
      return cat === 'cake items' || cat.includes('cake');
    case 'assorted gift packs':
    case 'gift boxes':
      return cat === 'assorted gift packs' || cat.includes('gift');
    case 'novelties':
      return cat.includes('novelty');
    default:
      return cat === t || cat.includes(t);
  }
}

console.log('Testing category coverage for', initialProducts.length, 'items:');
for (const tab of TABS) {
  const matched = initialProducts.filter(p => matchesCategoryTab(p, tab));
  console.log(`- Tab "${tab}": ${matched.length} items`);
}

const unmatched = initialProducts.filter(p => {
  return !TABS.filter(t => t !== 'All').some(t => matchesCategoryTab(p, t));
});
console.log('Unmatched by any specific tab:', unmatched.length);
if (unmatched.length > 0) {
  console.log('Unmatched items:', unmatched.map(u => `${u.item_code}: ${u.name} [${u.category}]`));
}
