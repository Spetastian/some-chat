const initialState = {
  clientsWaiting: [],
  clientsTotal: [],
  support: {
    //[supportId]: { clients: [] }
  },
};

module.exports = function chatReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_CLIENT":
      return {
        ...state,
        clientsWaiting: [...state.clientsWaiting, action.clientId],
        clientsTotal: [...state.clientsTotal, action.clientId],
      };
      break;
    case "ADD_VOLUNTEER":
      return {
        ...state,
        support: {
          ...state.support,
          [action.supportId]: { clients: [] },
        },
      };
      break;
    case "PAIR":
      return {
        ...state,
        support: {
          ...state.support,
          [action.supportId]: {
            clients: new Map([
              ...((state.support[action.supportId] &&
                state.support[action.supportId].clients) ||
                []),
              action.clientId,
            ]),
          },
        },
      };
      break;
  }
  return state;
};
