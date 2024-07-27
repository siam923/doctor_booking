
const mongoose = require('mongoose');

module.exports = async function globalTeardown() {
  await mongoose.disconnect();
  await global.__MONGOINSTANCE.stop();
};