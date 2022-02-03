const { Server } = require("socket.io");
const { store, actions } = require("./redux");
const io = new Server({
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

store.subscribe(() => {
  const state = store.getState();
  console.log({ state });
});

const supportNamespace = io.of("/support");
const clientsNamespace = io.of("/clients");

let clientQueue = [];

const clientSupportPairs = {};

function getClientsStatus() {
  return {
    clientsTotal: clientsNamespace.sockets.size,
    clientsWaiting: clientQueue.length,
  };
}

// server-side
supportNamespace.on("connection", (socket) => {
  store.dispatch(actions.addSupport(socket.id));

  const count = supportNamespace.sockets.size;
  console.log("Number of support", count);
  console.log("Support connected", socket.id);
  supportNamespace.emit("hello", "Welcome support" + socket.id);
  socket.emit("status", getClientsStatus());

  socket.on("pair", () => {
    const nextClientId = clientQueue.pop();
    console.log({ nextClientId });
    clientSupportPairs[nextClientId] = socket.id;
    clientsNamespace.to(nextClientId).emit("chat_start");
    clientsNamespace
      .to(nextClientId)
      .emit("chat_message", "Hi, how can i help?");
    socket.emit("status", getClientsStatus());
  });
});

// server-side
clientsNamespace.on("connection", (socket) => {
  store.dispatch(actions.addClient(socket.id));
  const count = clientsNamespace.sockets.size;
  console.log("Number of clients", count);
  console.log("Client connected", socket.id);
  clientsNamespace.emit("hello", "Welcome client" + socket.id);
  clientQueue.push(socket.id);
  supportNamespace.emit("status", getClientsStatus());

  socket.on("disconnect", (...args) => {
    console.log("client socket disconnect", { args });
    clientQueue = clientQueue.filter((id) => id !== socket.id);
    supportNamespace.emit("status", getClientsStatus());
  });
});

clientsNamespace.on("disconnect", (...args) => {
  console.log("client disconnect", { args });
});

clientsNamespace.on("chat_message", (args) => {
  console.log(args);
});

io.on("connection_error", (err) => {
  console.log(err.req);
  // the request object
  console.log(err.code);
  // the error code, for example 1
  console.log(err.message);
  // the error message, for example "Session ID unknown"
  console.log(err.context);
  // some additional error context
});

// client-sidesocket.on("connect", () => {  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL});
io.listen(3000);
