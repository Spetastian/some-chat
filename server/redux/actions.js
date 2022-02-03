module.exports.addClient = (clientId) => ({ type: "ADD_CLIENT", clientId });
module.exports.addSupport = (supportId) => ({
  type: "ADD_VOLUNTEER",
  supportId,
});
module.exports.pairClientWithSupport = (clientId, supportId) => ({
  type: "PAIR",
  clientId,
  supportId,
});
