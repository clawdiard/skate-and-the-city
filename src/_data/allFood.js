const fs = require('fs');
const path = require('path');

module.exports = function() {
  const food = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/food.json'), 'utf8'));
  return food;
};
