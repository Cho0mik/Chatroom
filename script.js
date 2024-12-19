// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyAQ-Af3PlYxDo5ggsC4TqPol-UiOUa-rVM",
  authDomain: "chatrom-c7094.firebaseapp.com",
  projectId: "chatrom-c7094",
  storageBucket: "chatrom-c7094.firebasestorage.app",
  messagingSenderId: "233306897624",
  appId: "1:233306897624:web:8b04343bf2f019952c2bad"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

// Send message to Firebase
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message && currentUser) {
    const messagesRef = db.ref('messages/');
    const newMessageRef = messagesRef.push();
    newMessageRef.set({
      username: currentUser,
      text: message
    });
    messageInput.value = ''; // Clear the input
  }
});

// Display messages from Firebase
function displayMessages() {
  const messagesRef = db.ref('messages/');
  messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.username}: ${message.text}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
  });
}
