// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ-Af3PlYxDo5ggsC4TqPol-UiOUa-rVM",
  authDomain: "chatrom-c7094.firebaseapp.com",
  projectId: "chatrom-c7094",
  storageBucket: "chatrom-c7094.firebasestorage.app",
  messagingSenderId: "233306897624",
  appId: "1:233306897624:web:8b04343bf2f019952c2bad"
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

// Send message to Firebase
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message && currentUser) {
    if (message === "/clear") {
      // Clear the chat view locally (only the user's screen)
      chatContainer.innerHTML = '';  // This clears the chat window on the current user's screen
    } else {
      // Otherwise, send the message to Firebase
      const messagesRef = ref(db, 'messages/');
      const newMessageRef = push(messagesRef);
      newMessageRef.set({
        username: currentUser,
        text: message,
      }).catch(error => console.error("Error sending message: ", error)); // Handle any errors
    }
    messageInput.value = ''; // Clear the input field after sending
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
