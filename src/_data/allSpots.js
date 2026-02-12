const fs = require('fs');
const path = require('path');

module.exports = function() {
  // Load base spots from data/spots.json
  const spotsBase = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/spots.json'), 'utf8'));
  
  // Enrich with detailed data from individual files if they exist
  const spotsDir = path.resolve(__dirname, '../../data/spots');
  const detailed = {};
  if (fs.existsSync(spotsDir)) {
    for (const file of fs.readdirSync(spotsDir)) {
      if (file.endsWith('.json')) {
        const d = JSON.parse(fs.readFileSync(path.join(spotsDir, file), 'utf8'));
        detailed[d.id] = d;
      }
    }
  }

  // Merge: detailed overrides base, add index for prev/next
  const spots = spotsBase.map((spot, i) => {
    const merged = { ...spot, ...(detailed[spot.id] || {}) };
    merged._index = i;
    return merged;
  });

  return spots;
};
