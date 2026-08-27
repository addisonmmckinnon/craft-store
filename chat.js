/* ──────────────────────────────────────────────
   COUSINS-ONLY TEXT THREAD (private.html)
   A real, live, two-way chat between Addy and her cousin, synced with
   Firebase Realtime Database — same project as the site's hosting, so
   no separate setup needed. Anyone with the passcode (in app.js) can
   read/write it, so this is only as private as that passcode is.

   Three features live here:
   - Text messages with emoji
   - Tap a message to heart it (shared on/off toggle, not per-person)
   - Simple 2-option polls you can both vote on, tallied live
   - A 1-on-1 audio call over WebRTC, using the database purely to swap
     connection info (offer/answer/ICE candidates) between the two of
     you — the actual audio goes peer-to-peer, not through Firebase.
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
  const togglePollBtn = document.getElementById("toggle-poll-btn");
  const pollForm = document.getElementById("poll-form");
  const pollQuestionInput = document.getElementById("poll-question");
  const pollOptionAInput = document.getElementById("poll-option-a");
  const pollOptionBInput = document.getElementById("poll-option-b");
  const startCallBtn = document.getElementById("start-call-btn");
  const callBar = document.getElementById("call-bar");
  const callDebug = document.getElementById("call-debug");
  const remoteAudio = document.getElementById("remote-audio");

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

  function otherName() {
    return getMyName() === "Addy" ? "Cousin" : "Addy";
  }

  /* ── Messages: text bubbles, hearts, polls ── */
  const bubbleEls = {};

  function addDeleteButton(el, key) {
    const del = document.createElement("button");
    del.type = "button";
    del.className = "chat-delete-btn";
    del.textContent = "✕";
    del.title = "Delete message";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      getChatDb().ref(`privateChat/messages/${key}`).remove();
    });
    el.appendChild(del);
  }

  function renderTextBubble(el, msg, key) {
    el.innerHTML = "";
    const senderLabel = document.createElement("div");
    senderLabel.className = "chat-sender";
    senderLabel.textContent = msg.sender === getMyName() ? "You" : msg.sender;
    el.appendChild(senderLabel);

    const text = document.createElement("div");
    text.textContent = msg.text;
    el.appendChild(text);

    if (msg.liked) {
      const heart = document.createElement("div");
      heart.className = "chat-heart";
      heart.textContent = "❤️";
      el.appendChild(heart);
    }

    if (msg.sender === getMyName()) addDeleteButton(el, key);
  }

  function renderPollBubble(el, msg, key) {
    el.innerHTML = "";
    const senderLabel = document.createElement("div");
    senderLabel.className = "chat-sender";
    senderLabel.textContent = msg.sender === getMyName() ? "You" : msg.sender;
    el.appendChild(senderLabel);

    const question = document.createElement("div");
    question.style.fontWeight = "700";
    question.textContent = "📊 " + msg.question;
    el.appendChild(question);

    const votes = msg.votes || {};
    const myVote = votes[getMyName()];
    const counts = [0, 0];
    Object.values(votes).forEach((v) => {
      if (v === 0 || v === 1) counts[v]++;
    });

    [msg.optionA, msg.optionB].forEach((optionText, i) => {
      const optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.className = "poll-option" + (myVote === i ? " picked" : "");
      optionBtn.textContent = `${optionText} (${counts[i]})`;
      optionBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        getChatDb().ref(`privateChat/messages/${key}/votes/${getMyName()}`).set(i);
      });
      el.appendChild(optionBtn);
    });

    if (msg.sender === getMyName()) addDeleteButton(el, key);
  }

  function renderBubble(key, msg) {
    let el = bubbleEls[key];
    if (!el) {
      el = document.createElement("div");
      const mine = msg.sender === getMyName();
      el.className = "chat-message " + (mine ? "mine" : "theirs");
      el.addEventListener("click", () => {
        if (el._msg.type === "poll") return;
        getChatDb().ref(`privateChat/messages/${key}/liked`).set(!el._msg.liked);
      });
      chatThread.appendChild(el);
      bubbleEls[key] = el;
    }

    el._msg = msg;

    if (msg.type === "poll") {
      renderPollBubble(el, msg, key);
    } else {
      renderTextBubble(el, msg, key);
    }

    chatThread.scrollTop = chatThread.scrollHeight;
  }

  function removeBubble(key) {
    const el = bubbleEls[key];
    if (el) {
      el.remove();
      delete bubbleEls[key];
    }
  }

  function startChat() {
    whoamiGate.classList.add("hidden");
    chatSection.classList.remove("hidden");
    chatWhoamiLabel.textContent = `Texting as ${getMyName()}`;

    const db = getChatDb();
    const messagesRef = db.ref("privateChat/messages").limitToLast(200);
    messagesRef.on("child_added", (snapshot) => {
      const key = snapshot.key;
      renderBubble(key, snapshot.val());
      db.ref(`privateChat/messages/${key}`).on("value", (snap2) => {
        if (snap2.exists()) {
          renderBubble(key, snap2.val());
        } else {
          removeBubble(key);
        }
      });
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

    togglePollBtn.addEventListener("click", () => {
      pollForm.classList.toggle("hidden");
    });

    pollForm.addEventListener("submit", function (event) {
      event.preventDefault();
      db.ref("privateChat/messages").push({
        sender: getMyName(),
        type: "poll",
        question: pollQuestionInput.value.trim(),
        optionA: pollOptionAInput.value.trim(),
        optionB: pollOptionBInput.value.trim(),
        votes: {},
        timestamp: Date.now(),
      });
      pollForm.reset();
      pollForm.classList.add("hidden");
    });

    setupCalling(db);
  }

  /* ── Audio call over WebRTC, signaled through Firebase ──
     STUN alone (just the Google server) often can't connect two phones/
     computers on two different home WiFi networks — it only helps find
     each device's public address, but a lot of home routers still block
     the direct connection after that. A TURN server relays the audio
     through a middle server when a direct connection fails, which is
     what actually makes calls across two different houses work. The
     TURN server below (Open Relay Project) is a free public one made
     for exactly this — no account needed. */
  function setupCalling(db) {
    const ICE_SERVERS = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    };
    const callRef = db.ref("privateChat/call");
    let pc = null;
    let localStream = null;
    let inCall = false;
    let myRole = null; // "caller" or "callee" once a call starts
    let answerListenerRef = null;
    let candidateListener = null; // { ref, handler } for the currently-watched candidate path
    let pendingCandidates = []; // candidates that arrive before we have a remote description yet
    let ringInterval = null;
    let ringAudioCtx = null;

    // Ask permission (once) to show a popup notification outside the tab,
    // so an incoming call gets noticed even if this tab isn't the one
    // you're looking at. If denied, calls still work — you just won't
    // get the popup, only the ringtone sound and on-page banner.
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }

    function notifyIncomingCall(callerName) {
      if (window.Notification && Notification.permission === "granted") {
        try {
          new Notification(`📞 ${callerName} is calling you!`, {
            body: "Tap to open Craft Co. and answer.",
          });
        } catch (err) {
          // Some browsers (mobile Safari) don't support this — ringtone still plays.
        }
      }
    }

    // A simple two-tone beep made with the Web Audio API (no sound file
    // needed), repeated every 1.5s like a phone ringing, until answered,
    // declined, or the caller hangs up.
    function playRingtone() {
      if (ringInterval) return;
      const beep = () => {
        try {
          if (!ringAudioCtx) ringAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ringAudioCtx.createOscillator();
          const gain = ringAudioCtx.createGain();
          osc.type = "sine";
          osc.frequency.value = 880;
          gain.gain.value = 0.15;
          osc.connect(gain);
          gain.connect(ringAudioCtx.destination);
          osc.start();
          osc.stop(ringAudioCtx.currentTime + 0.4);
        } catch (err) {
          // Ignore if audio can't start yet (e.g. no user interaction on this page yet).
        }
      };
      beep();
      ringInterval = setInterval(beep, 1500);
    }

    function stopRingtone() {
      if (ringInterval) {
        clearInterval(ringInterval);
        ringInterval = null;
      }
    }

    function showCallBar(html) {
      callBar.classList.remove("call-bar-error");
      callBar.innerHTML = html;
      callBar.classList.remove("hidden");
    }
    function showCallError(message) {
      callBar.classList.add("call-bar-error");
      callBar.innerHTML = `<span>⚠️ ${message}</span>`;
      callBar.classList.remove("hidden");
      setTimeout(() => {
        if (!inCall) hideCallBar();
      }, 4000);
    }
    function hideCallBar() {
      callBar.classList.add("hidden");
      callBar.classList.remove("call-bar-error");
      callBar.innerHTML = "";
      callDebug.textContent = "";
    }

    function setDebugStatus(text) {
      callDebug.textContent = text;
    }

    function cleanupCall() {
      inCall = false;
      myRole = null;
      pendingCandidates = [];
      stopRingtone();
      if (answerListenerRef) {
        answerListenerRef.off();
        answerListenerRef = null;
      }
      if (candidateListener) {
        candidateListener.ref.off("child_added", candidateListener.handler);
        candidateListener = null;
      }
      if (pc) {
        pc.close();
        pc = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
        localStream = null;
      }
      remoteAudio.srcObject = null;
      startCallBtn.classList.remove("hidden");
      hideCallBar();
    }

    function makePeerConnection(myCandidatePath) {
      const connection = new RTCPeerConnection(ICE_SERVERS);
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          callRef.child(myCandidatePath).push(event.candidate.toJSON());
        }
      };
      connection.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        // Browsers (especially on phones) often silently block audio from
        // playing automatically, even with the "autoplay" attribute, if it
        // starts a moment after the button tap instead of during it. If
        // that happens, this fails quietly with no error — that's why a
        // call can look "connected" but stay completely silent. The
        // "🔊 Enable Sound" button below is a manual backup for exactly
        // that case.
        remoteAudio.play().catch(() => {});
      };
      connection.oniceconnectionstatechange = () => {
        const state = connection.iceConnectionState;
        if (state === "checking") setDebugStatus("Connecting your call…");
        else if (state === "connected" || state === "completed") setDebugStatus("Connected — if you can't hear anything, tap 🔊 Enable Sound above.");
        else if (state === "failed") setDebugStatus("Connection failed.");
        if (["failed", "disconnected", "closed"].includes(state) && inCall) {
          callRef.remove();
          cleanupCall();
          showCallError("Call disconnected.");
        }
      };
      return connection;
    }

    // A candidate can arrive over Firebase before setRemoteDescription()
    // has finished (the other person answers slower than their connection
    // info arrives). Queue it and add it later instead of dropping it —
    // dropping candidates was the reason calls connected but had no audio.
    function addRemoteCandidate(data) {
      if (pc.remoteDescription && pc.remoteDescription.type) {
        pc.addIceCandidate(new RTCIceCandidate(data)).catch(() => {});
      } else {
        pendingCandidates.push(data);
      }
    }

    function flushPendingCandidates() {
      pendingCandidates.forEach((data) => {
        pc.addIceCandidate(new RTCIceCandidate(data)).catch(() => {});
      });
      pendingCandidates = [];
    }

    // Firebase replays every already-existing item under theirPath the
    // moment we attach this listener, so candidates sent before we
    // answered/were answered still get delivered, not just future ones.
    function listenForCandidates(theirPath) {
      const ref = callRef.child(theirPath);
      const handler = (snap) => addRemoteCandidate(snap.val());
      ref.on("child_added", handler);
      candidateListener = { ref, handler };
    }

    async function startCall() {
      startCallBtn.classList.add("hidden");
      showCallBar(`<span>📞 Calling ${otherName()}...</span>`);
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        showCallError("Couldn't access your microphone. Check your browser's mic permission for this site.");
        startCallBtn.classList.remove("hidden");
        return;
      }
      inCall = true;
      myRole = "caller";
      pc = makePeerConnection("callerCandidates");
      listenForCandidates("calleeCandidates");
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await callRef.set({
        status: "ringing",
        caller: getMyName(),
        offer: { type: offer.type, sdp: offer.sdp },
      });

      showCallBar(`<span>📞 Calling ${otherName()}...</span> <button id="end-call-btn" class="btn btn-primary btn-small">End</button>`);
      document.getElementById("end-call-btn").addEventListener("click", endCall);

      answerListenerRef = callRef.child("answer");
      answerListenerRef.on("value", async (snap) => {
        const answer = snap.val();
        if (answer && pc && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          flushPendingCandidates();
          showCallBar(`<span>📞 On call with ${otherName()}</span> <button id="sound-btn" class="btn btn-secondary btn-small">🔊 Enable Sound</button> <button id="end-call-btn" class="btn btn-primary btn-small">End</button>`);
          document.getElementById("sound-btn").addEventListener("click", () => remoteAudio.play().catch(() => {}));
          document.getElementById("end-call-btn").addEventListener("click", endCall);
        }
      });
    }

    async function answerCall(offer) {
      startCallBtn.classList.add("hidden");
      showCallBar(`<span>📞 Connecting to ${otherName()}...</span>`);
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        showCallError("Couldn't access your microphone. Check your browser's mic permission for this site.");
        startCallBtn.classList.remove("hidden");
        callRef.remove();
        return;
      }
      inCall = true;
      myRole = "callee";
      pc = makePeerConnection("calleeCandidates");
      listenForCandidates("callerCandidates");
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      flushPendingCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await callRef.update({ status: "active", answer: { type: answer.type, sdp: answer.sdp } });

      showCallBar(`<span>📞 On call with ${otherName()}</span> <button id="end-call-btn" class="btn btn-primary btn-small">End</button>`);
      document.getElementById("end-call-btn").addEventListener("click", endCall);
    }

    function endCall() {
      callRef.remove();
      cleanupCall();
    }

    // Watch for incoming call ring, and hang up if the other side ends the call.
    callRef.on("value", (snap) => {
      const call = snap.val();
      if (!call) {
        if (inCall) cleanupCall();
        return;
      }
      if (call.status === "ringing" && call.caller !== getMyName() && !inCall) {
        if (!ringInterval) {
          playRingtone();
          notifyIncomingCall(call.caller);
        }
        showCallBar(`
          <span>📞 ${call.caller} is calling...</span>
          <button id="answer-call-btn" class="btn btn-secondary btn-small">Answer</button>
          <button id="decline-call-btn" class="btn btn-primary btn-small">Decline</button>
        `);
        document.getElementById("answer-call-btn").addEventListener("click", () => {
          stopRingtone();
          answerCall(call.offer);
        });
        document.getElementById("decline-call-btn").addEventListener("click", () => {
          stopRingtone();
          callRef.remove();
        });
      }
    });

    startCallBtn.addEventListener("click", startCall);
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
    window.afterPasscodeUnlock();
  }
}
