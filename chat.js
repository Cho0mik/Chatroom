// Firebase configuration and imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

// DOM Elements
const loginDiv = document.getElementById("loginDiv");
const channelDiv = document.getElementById("channelDiv");
const chatDiv = document.getElementById("chatDiv");
const loginTokenInput = document.getElementById("loginToken");
const loginButton = document.getElementById("loginButton");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const imageInput = document.getElementById("imageInput");
const logoutButton = document.getElementById("logoutButton");
const backButton = document.getElementById("backButton");
const chatContainer = document.getElementById("chat");
const notificationContainer = document.getElementById("notificationContainer"); // Container for notifications

const channelButtons = document.querySelectorAll(".channelButton");

// Default profile pictures
const defaultProfilePics = {
  Cheems: "https://preview.redd.it/msn-avatars-of-all-colors-v0-i19z4jwd5uha1.png?width=1024&format=png&auto=webp&s=3c7433ca602ffbf815e65c46a889bafb85134534",
  Ax3l: "https://preview.redd.it/msn-avatars-of-all-colors-v0-wpe4viwd5uha1.png?width=1024&format=png&auto=webp&s=56ab2a2b048c8841b6ba83b76f756b695d7a1eec",
  Carros: "https://preview.redd.it/msn-avatars-of-all-colors-v0-4k4l1oxd5uha1.png?width=1024&format=png&auto=webp&s=9363652eb05af6dcbfa606e30923fed24af1b65d",
  Lui: "https://preview.redd.it/msn-avatars-of-all-colors-v0-kdmrknxd5uha1.png?width=1024&format=png&auto=webp&s=7706fc01bdb28170610d79fa7104e3ecf8b40866"
};

// Tokens for login
const validTokens = ["Cheems", "Ax3l", "Carros", "Lui"];
let currentUser = "";
let profilePicUrl = "";
let currentChannel = "";

// Track the timestamp of the last message processed
let lastMessageTimestamp = 0;

// Login functionality
loginButton.addEventListener("click", () => {
  const token = loginTokenInput.value;
  if (validTokens.includes(token)) {
    signInAnonymously(auth)
      .then(() => {
        currentUser = token;
        profilePicUrl = defaultProfilePics[token];
        loginDiv.classList.add("hidden");
        channelDiv.classList.remove("hidden");
        showNotification(`${currentUser} logged in successfully!`, 'success');
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  } else {
    alert("Invalid Token");
  }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
  currentUser = "";
  currentChannel = "";
  loginDiv.classList.remove("hidden");
  channelDiv.classList.add("hidden");
  chatDiv.classList.add("hidden");
  chatContainer.innerHTML = ""; // Clear messages
  showNotification(`Logged out successfully.`, 'info');
});

// Channel selection functionality
channelButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentChannel = button.getAttribute("data-channel");
    channelDiv.classList.add("hidden");
    chatDiv.classList.remove("hidden");
    chatContainer.innerHTML = ""; // Clear messages
    displayMessages();  // Load messages from the selected channel
    showNotification(`Joined ${currentChannel} channel.`, 'success');
  });
});

// Back to channel selection
backButton.addEventListener("click", () => {
  chatDiv.classList.add("hidden");
  channelDiv.classList.remove("hidden");
  chatContainer.innerHTML = ""; // Clear messages
});

// Send message (Text + Image)
sendButton.addEventListener("click", () => {
  const text = messageInput.value;
  const imageUrl = imageInput.value;
  const uniqueId = Math.random().toString(36).substr(2, 9);  // Random unique ID for each message
  const timestamp = Date.now();  // Current timestamp in milliseconds
  
  if (text || imageUrl) {
    const messagesRef = ref(db, `channels/${currentChannel}/messages/`);
    const newMessageRef = push(messagesRef);
    
    set(newMessageRef, {
      messageId: uniqueId,
      username: currentUser,
      text: text || null,
      imageUrl: imageUrl || null,
      profilePic: profilePicUrl,
      timestamp: timestamp // Add timestamp to each message
    });
    
    messageInput.value = ''; // Clear the input
    imageInput.value = '';  // Clear image URL input
    showNotification(`Message sent to ${currentChannel}`, 'info');
  }
});

// Display messages from Firebase
function displayMessages() {
  if (!currentChannel) return;

  const messagesRef = ref(db, `channels/${currentChannel}/messages/`);

  // Fetch the messages and only trigger the rendering once for existing ones
  get(messagesRef).then((snapshot) => {
    const messages = snapshot.val();
    if (messages) {
      Object.keys(messages).forEach(messageId => {
        const message = messages[messageId];
        displayMessage(message);
      });
    }
  });

  // Now listen for new messages
  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();

    // If the message timestamp is newer than the last processed timestamp, display it
    if (message.timestamp > lastMessageTimestamp) {
      displayMessage(message);
      showNotification(`${message.username} sent a new message`, 'info');
      lastMessageTimestamp = message.timestamp;  // Update the last message timestamp
    }
  });
}

// Helper function to display a single message
function displayMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message-container");

  const profilePicElement = document.createElement("img");
  profilePicElement.src = message.profilePic;
  profilePicElement.className = "profile-pic";
  messageElement.appendChild(profilePicElement);
  
  // Display image if available
  if (message.imageUrl) {
    const imageElement = document.createElement("img");
    imageElement.src = message.imageUrl;
    imageElement.style.maxWidth = "300px";
    messageElement.appendChild(imageElement);
  }

  // Display text message
  if (message.text) {
    const messageText = document.createElement("div");
    messageText.classList.add("message-content");
    messageText.textContent = `${message.username}: ${message.text}`;
    messageElement.appendChild(messageText);
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.classList.add("notification", type);
  notification.textContent = message;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 1000);
}
