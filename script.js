import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const loginDiv = document.getElementById("loginDiv");
const chatDiv = document.getElementById("chatDiv");
const loginTokenInput = document.getElementById("loginToken");
const loginButton = document.getElementById("loginButton");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const logoutButton = document.getElementById("logoutButton");
const chatContainer = document.getElementById("chat");

// Tokens for login
const validTokens = ["Cheems", "Ax3l", "Carros", "Lui"];
let currentUser = "";

// Login functionality
loginButton.addEventListener("click", () => {
  const token = loginTokenInput.value;
  if (validTokens.includes(token)) {
    currentUser = token;
    loginDiv.classList.add("hidden");
    chatDiv.classList.remove("hidden");
    displayMessages();
  } else {
    alert("Invalid Token");
  }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
  currentUser = "";
  loginDiv.classList.remove("hidden");
  chatDiv.classList.add("hidden");
});

// Send message functionality
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message && currentUser) {
    if (message === '/clear') {
      handleClearCommand(); // Clear the chat if /clear is typed
    } else {
      sendMessage(message); // Otherwise, send the normal message
    }
  }
});

// Display messages from Firebase
function displayMessages() {
  const messagesRef = ref(db, 'messages/');
  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.username}: ${message.text}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
  });
}

// Send a normal message to Firebase
function sendMessage(message) {
  const messagesRef = ref(db, 'messages/');
  const newMessageRef = push(messagesRef);
  newMessageRef.set({
    username: currentUser,
    text: message,
  });
  messageInput.value = ''; // Clear the input field
}

// Handle /clear command
function handleClearCommand() {
  const messagesRef = ref(db, 'messages/');
  remove(messagesRef);  // Clear messages from Firebase
  chatContainer.innerHTML = '';  // Clear chat in UI
}

