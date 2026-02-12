const fs = require('fs');
const path = require('path');

module.exports = function() {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/affiliates.json'), 'utf8'));
};
