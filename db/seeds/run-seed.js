/*
Here you will need to require in:

- the seed function, 
- the dev data,
*/
const devData = require("../data/development-data/index-dev");

const { seed } = require("./seed");

const runSeed = async () => {
  return seed(devData);
};

runSeed();
