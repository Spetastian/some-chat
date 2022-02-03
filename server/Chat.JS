const { Server } = require("socket.io");

class ClientsNamespace {
  constructor(io) {
    this.io = io.of("/clients");
  }
}

class supportNamespace {
  constructor(io) {
    this.io = io.of("/support");
  }
}

class Chat {
  constructor() {
    this.io = new Server({
      cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
      },
    });
    this.clients = new ClientsNamespace(this.io);
    this.support = new supportNamespace(this.io);
  }
}
