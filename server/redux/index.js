const { createStore } = require("redux");
const reducer = require("./reducer");
const actions = require("./actions");

const store = createStore(reducer);

module.exports = {
  actions,
  store,
};
