const fs = require('fs');
const path = require('path');

module.exports = function() {
  const shops = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/shops.json'), 'utf8'));
  return shops;
};
