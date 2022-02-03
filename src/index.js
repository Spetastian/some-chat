import { io } from "socket.io-client";

const supportBtn = document.getElementById("supportBtn");
const clientBtn = document.getElementById("clientBtn");
const titleH1 = document.getElementById("title");
const buttonsContainer = document.getElementById("buttons");

const supportAppContainer = document.getElementById("supportApp");
const clientAppContainer = document.getElementById("clientApp");
const pairWithClientBtn = document.getElementById("pairWithClientBtn");
const numberOfClientsInQueue = document.getElementById(
  "numberOfClientsInQueue"
);
const numberOfTotalClients = document.getElementById("numberOfTotalClients");

let socket;

supportBtn.addEventListener("click", (event) => {
  console.log("support click");
  connect("support");
  titleH1.innerText = "Support";
  buttonsContainer.style.display = "none";
  supportAppContainer.style.display = "block";
});

clientBtn.addEventListener("click", (event) => {
  console.log("clientBtn click");
  connect("clients");
  titleH1.innerText = "Client";
  buttonsContainer.style.display = "none";
  clientAppContainer.style.display = "block";
});

pairWithClientBtn.addEventListener("click", (event) => {
  console.log("Trying to pair with client....");
  socket.emit("pair");
  // with acknowledgement
  socket.emit("pair");
});

function connect(namespace) {
  socket = io("http://localhost:3000/" + namespace);

  socket.on("hello", (arg) => {
    console.log({ arg });
  });

  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("status", ({ clientsTotal, clientsWaiting }) => {
    numberOfClientsInQueue.innerText = clientsWaiting;
    numberOfTotalClients.innerText = clientsTotal;

    if (clientsWaiting > 0) {
      pairWithClientBtn.style.display = "initial";
    } else {
      pairWithClientBtn.style.display = "none";
    }
  });

  socket.on("chat_start", () => {
    console.log("You are connected to a chat now!");
  });

  socket.on("chat_message", (mesage) => {
    console.log(mesage);
  });
}
