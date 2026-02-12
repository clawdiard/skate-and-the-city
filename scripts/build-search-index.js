/**
 * Build a pre-computed search index from spots and routes data.
 * Output: src/_data/searchIndex.json — consumed client-side by Fuse.js
 */
const fs = require('fs');
const path = require('path');

// Load spots
const spotsBase = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/spots.json'), 'utf8'));
const spotsDir = path.resolve(__dirname, '../data/spots');
const detailed = {};
if (fs.existsSync(spotsDir)) {
  for (const file of fs.readdirSync(spotsDir)) {
    if (file.endsWith('.json')) {
      const d = JSON.parse(fs.readFileSync(path.join(spotsDir, file), 'utf8'));
      detailed[d.id] = d;
    }
  }
}
const spots = spotsBase.map(s => ({ ...s, ...(detailed[s.id] || {}) }));

// Load routes
const routes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/routes.json'), 'utf8'));

// Build search documents
const docs = [];

for (const spot of spots) {
  docs.push({
    type: 'spot',
    id: spot.id,
    name: spot.name,
    description: spot.description || '',
    neighborhood: spot.neighborhood || '',
    borough: spot.borough || '',
    features: (spot.features || []).join(', '),
    url: `/spots/${spot.id}/`
  });
}

for (const route of routes) {
  docs.push({
    type: 'route',
    id: route.id,
    name: route.name,
    description: route.description || '',
    neighborhood: route.borough || '',
    borough: route.borough || '',
    features: (route.stops || []).map(s => s.spotId).join(', '),
    url: `/routes/${route.id}/`
  });
}

const outPath = path.resolve(__dirname, '../src/_data/searchIndex.json');
fs.writeFileSync(outPath, JSON.stringify(docs, null, 2));
console.log(`Built search index: ${docs.length} documents → ${outPath}`);
