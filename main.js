import { MlKem1024 } from "https://esm.sh/mlkem";

const kyber = new MlKem1024();
const peer = new Peer();

const yourIdElement = document.getElementById('your-id');
const connectBtn = document.getElementById('connect-btn');
const peerIdInput = document.getElementById('peer-id');
const messagesList = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

let conn;
let isInitiator = false;
let sharedSecret; // shared secret - will be set after connection setup. Uses kyber KEM (key encapsulation mechanism)
let initializationPhase = 0; // keep track of initialization phase for KEM

// create id for current client
peer.on('open', (id) => {
  yourIdElement.value = id;
});

// setup operations on a new connection
peer.on('connection', (connection) => {
  conn = connection;
  setupConnection(conn);
});

// initialize connection to given peer
connectBtn.addEventListener('click', () => {
  const peerId = peerIdInput.value.trim();
  if (peerId) {
    isInitiator = true;
    conn = peer.connect(peerId);
    setupConnection(conn);
  }
});

// send the message from input box
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message && conn) {
    conn.send(encryptMessage(message));
    addMessage(`You: ${message}`, "green");
    messageInput.value = '';
  }
});


function setupConnection(connection) {
  connection.on('open', () => {
    addMessage('-------------------------------', 'red');
    addMessage('Connected to ' + connection.peer, 'red');
    addMessage('-------------------------------', 'red');
    initiateKeyExchange(isInitiator);
    enableMessageInput();
  });

  connection.on('close', () => {
    addMessage('-------------------------------', 'red');
    addMessage('Connection closed.', 'red');
    addMessage('-------------------------------', 'red');
    disableMessageInput();
    sharedSecret = null;
    initializationPhase = 0;
  });

  connection.on('error', (err) => {
    addMessage('-------------------------------', 'red');
    addMessage('Error occurred: ' + err, 'red');
    addMessage('Connection closed.', 'red');
    addMessage('-------------------------------', 'red');
    disableMessageInput();
    sharedSecret = null;
    initializationPhase = 0;
  });

  connection.on('data', (data) => {
    handleData(data);
  });
}

function addMessage(message, color) {
  const li = document.createElement('li');
  li.style.color = color;
  li.textContent = message;
  messagesList.appendChild(li);
}

function disableMessageInput() {
  messageInput.disabled=true;
  messageInput.placeholder="Waiting for connection...";
}

function enableMessageInput() {
  messageInput.disabled=false;
  messageInput.placeholder="Enter Message";
}

// initiate key exchange by generating a key pair and sending the public key to the peer
async function initiateKeyExchange(isInitiator) {
  if (isInitiator) {
    let [publicKey, secretKey] = await kyber.generateKeyPair();
    conn.send(publicKey);
    initializationPhase++;
    sharedSecret = secretKey;
  }
}

// handle incoming data. makes key exchange on startup, after that decrypts and shows message
async function handleData(data) {
  // if data has come in the phase 0 this is a client
  if (initializationPhase == 0) {
    const [ct, ssS] = await kyber.encap(new Uint8Array(data));
    sharedSecret = ssS;
    console.log("ssS: ", ssS);
    conn.send(ct);
    initializationPhase = initializationPhase + 2;
  } else if (initializationPhase == 1) {
    const ssR = await kyber.decap(new Uint8Array(data), sharedSecret);
    sharedSecret = ssR;
    console.log("ssR: ", ssR);
    initializationPhase++;
  } else {
    // if not in the initialization pahse 
    console.log("Unencrypted data: ", data);
    addMessage('Peer: ' + decryptMessage(data), 'black');
  }
}

function encryptMessage(message) {
  if (!sharedSecret) {
    console.error("No shared key established!");
  }
  return CryptoJS.AES.encrypt(message, CryptoJS.SHA256(sharedSecret).toString()).toString();
}

function decryptMessage(message) {
  if (!sharedSecret) {
    console.error("No shared key established!");
  }
  return CryptoJS.AES.decrypt(message, CryptoJS.SHA256(sharedSecret).toString()).toString(CryptoJS.enc.Utf8);
}
