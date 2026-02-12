#!/usr/bin/env node
/**
 * Pre-generate GPX 1.1 files for each route at build time.
 * Output: src/assets/gpx/<route-id>.gpx
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../data');
const outDir = path.resolve(__dirname, '../src/assets/gpx');

const routes = JSON.parse(fs.readFileSync(path.join(dataDir, 'routes.json'), 'utf8'));
const spotsBase = JSON.parse(fs.readFileSync(path.join(dataDir, 'spots.json'), 'utf8'));
const spotsDir = path.join(dataDir, 'spots');

// Build spots map
const spotsMap = {};
spotsBase.forEach(s => { spotsMap[s.id] = { ...s }; });
if (fs.existsSync(spotsDir)) {
  for (const file of fs.readdirSync(spotsDir)) {
    if (file.endsWith('.json')) {
      const d = JSON.parse(fs.readFileSync(path.join(spotsDir, file), 'utf8'));
      spotsMap[d.id] = { ...spotsMap[d.id], ...d };
    }
  }
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spotCoords(spot) {
  if (spot.lat && spot.lng) return { lat: spot.lat, lng: spot.lng };
  if (spot.coordinates) return { lat: spot.coordinates.lat, lng: spot.coordinates.lng };
  return null;
}

fs.mkdirSync(outDir, { recursive: true });

for (const route of routes) {
  const stops = route.stops.map(stop => {
    const spot = spotsMap[stop.spotId] || { id: stop.spotId, name: stop.spotId };
    return { ...stop, spot };
  });

  const waypoints = [];
  const trackPoints = [];

  for (const stop of stops) {
    const c = spotCoords(stop.spot);
    if (!c) continue;
    waypoints.push(
      `  <wpt lat="${c.lat}" lon="${c.lng}">` +
      `\n    <name>${escapeXml(stop.spot.name)}</name>` +
      `\n    <desc>${escapeXml(stop.activity || '')}</desc>` +
      `\n    <type>skate-stop</type>` +
      `\n  </wpt>`
    );
    trackPoints.push(`      <trkpt lat="${c.lat}" lon="${c.lng}"><name>${escapeXml(stop.spot.name)}</name></trkpt>`);
  }

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Skate And the City"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(route.name)}</name>
    <desc>${escapeXml(route.description)}</desc>
    <author><name>Skate And the City</name></author>
    <time>${new Date().toISOString()}</time>
  </metadata>
${waypoints.join('\n')}
  <trk>
    <name>${escapeXml(route.name)}</name>
    <trkseg>
${trackPoints.join('\n')}
    </trkseg>
  </trk>
</gpx>`;

  const outFile = path.join(outDir, `${route.id}.gpx`);
  fs.writeFileSync(outFile, gpx, 'utf8');
  console.log(`Generated: ${outFile}`);
}

console.log(`Done — ${routes.length} GPX files generated.`);
