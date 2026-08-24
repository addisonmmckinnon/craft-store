/* ──────────────────────────────────────────────
   COUSINS-ONLY TEXT THREAD (private.html)
   A real, live, two-way chat between Addy and her cousin, synced with
   Firebase Realtime Database — same project as the site's hosting, so
   no separate setup needed. Anyone with the passcode ("ae" in app.js)
   can read/write it, so this is only as private as that passcode is.
   ────────────────────────────────────────────── */
const CHAT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCQdpy8NRBYE47eQ2VDRmjEOaLdROkI6q8",
  databaseURL: "https://craft-store-addy-default-rtdb.firebaseio.com",
  projectId: "craft-store-addy",
};

const whoamiGate = document.getElementById("whoami-gate");
const chatSection = document.getElementById("chat-section");

if (whoamiGate && chatSection) {
  const chatWhoamiLabel = document.getElementById("chat-whoami-label");
  const chatThread = document.getElementById("chat-thread");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  let chatDb = null;
  function getChatDb() {
    if (!chatDb) {
      firebase.initializeApp(CHAT_FIREBASE_CONFIG);
      chatDb = firebase.database();
    }
    return chatDb;
  }

  function getMyName() {
    return localStorage.getItem("craftChatName");
  }

  function renderMessage(msg) {
    const bubble = document.createElement("div");
    const mine = msg.sender === getMyName();
    bubble.className = "chat-message " + (mine ? "mine" : "theirs");

    const senderLabel = document.createElement("div");
    senderLabel.className = "chat-sender";
    senderLabel.textContent = mine ? "You" : msg.sender;
    bubble.appendChild(senderLabel);

    const text = document.createElement("div");
    text.textContent = msg.text;
    bubble.appendChild(text);

    chatThread.appendChild(bubble);
    chatThread.scrollTop = chatThread.scrollHeight;
  }

  function startChat() {
    whoamiGate.classList.add("hidden");
    chatSection.classList.remove("hidden");
    chatWhoamiLabel.textContent = `Texting as ${getMyName()}`;

    const db = getChatDb();
    const messagesRef = db.ref("privateChat/messages").limitToLast(200);
    messagesRef.on("child_added", (snapshot) => {
      renderMessage(snapshot.val());
    });

    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      db.ref("privateChat/messages").push({
        sender: getMyName(),
        text: text,
        timestamp: Date.now(),
      });
      chatInput.value = "";
    });

    document.querySelectorAll(".emoji-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        chatInput.value += btn.textContent;
        chatInput.focus();
      });
    });
  }

  window.afterPasscodeUnlock = function () {
    if (getMyName()) {
      startChat();
    } else {
      whoamiGate.classList.remove("hidden");
    }
  };

  document.querySelectorAll(".whoami-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("craftChatName", btn.dataset.name);
      startChat();
    });
  });

  if (sessionStorage.getItem("craftPrivateUnlocked") === "true") {
    document.getElementById("passcode-gate").classList.add("hidden");
    afterPasscodeUnlock();
  }
}
