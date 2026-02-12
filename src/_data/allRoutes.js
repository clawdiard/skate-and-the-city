const fs = require('fs');
const path = require('path');

module.exports = function() {
  const routesFile = path.resolve(__dirname, '../../data/routes.json');
  const routes = JSON.parse(fs.readFileSync(routesFile, 'utf8'));

  // Load spots for cross-referencing
  const spotsFile = path.resolve(__dirname, '../../data/spots.json');
  const spotsBase = JSON.parse(fs.readFileSync(spotsFile, 'utf8'));
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
  const spotsMap = {};
  spotsBase.forEach(s => {
    spotsMap[s.id] = { ...s, ...(detailed[s.id] || {}) };
  });

  // Enrich each route's stops with spot data
  return routes.map(route => {
    route.stops = route.stops.map(stop => {
      stop.spot = spotsMap[stop.spotId] || { id: stop.spotId, name: stop.spotId };
      return stop;
    });
    return route;
  });
};
