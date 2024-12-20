// Import the functions you need from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ-Af3PlYxDo5ggsC4TqPol-UiOUa-rVM",
  authDomain: "chatrom-c7094.firebaseapp.com",
  projectId: "chatrom-c7094",
  storageBucket: "chatrom-c7094.appspot.com",
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

// Tokens for login and profile pictures
const users = {
  "Cheems": "https://i.redd.it/i19z4jwd5uha1.png",
  "Ax3l": "https://i.redd.it/wpe4viwd5uha1.png",
  "Carros": "https://i.redd.it/4k4l1oxd5uha1.png",
  "Lui": "https://i.redd.it/kdmrknxd5uha1.png"
};

let currentUser = "";

// Login functionality
loginButton.addEventListener("click", () => {
  const token = loginTokenInput.value;
  if (Object.keys(users).includes(token)) {
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
    const messagesRef = ref(db, 'messages/');
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      username: currentUser,
      text: message,
      pfp: users[currentUser]
    });
    messageInput.value = ''; // Clear the input
  }
});

// Display messages from Firebase
function displayMessages() {
  const messagesRef = ref(db, 'messages/');
  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const pfpElement = document.createElement("img");
    pfpElement.src = message.pfp;
    pfpElement.alt = `${message.username}'s profile picture`;

    const textElement = document.createElement("div");
    textElement.textContent = `${message.username}: ${message.text}`;

    messageElement.appendChild(pfpElement);
    messageElement.appendChild(textElement);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom

    // Debugging log to check if images are being loaded correctly
    console.log("Profile picture URL: ", message.pfp);
  });
}
