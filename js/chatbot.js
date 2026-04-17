(function () {
  "use strict";

  var API_URL = "/api/chat";
  var messages = [];
  var isOpen = false;
  var isLoading = false;

  // --- Create DOM ---
  function createWidget() {
    // Chat toggle button
    var btn = document.createElement("button");
    btn.id = "chatbot-toggle";
    btn.setAttribute("aria-label", "Ouvrir le chat ECS75");
    btn.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
      "</svg>";

    // Chat window
    var win = document.createElement("div");
    win.id = "chatbot-window";
    win.innerHTML =
      '<div id="chatbot-header">' +
      '  <span id="chatbot-title">Assistant ECS75</span>' +
      '  <button id="chatbot-close" aria-label="Fermer le chat">&times;</button>' +
      "</div>" +
      '<div id="chatbot-messages"></div>' +
      '<div id="chatbot-input-area">' +
      '  <input id="chatbot-input" type="text" placeholder="Posez votre question..." autocomplete="off" />' +
      '  <button id="chatbot-send" aria-label="Envoyer">' +
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '      <line x1="22" y1="2" x2="11" y2="13"></line>' +
      '      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
      "    </svg>" +
      "  </button>" +
      "</div>";

    document.body.appendChild(win);
    document.body.appendChild(btn);

    // Event listeners
    btn.addEventListener("click", toggleChat);
    document.getElementById("chatbot-close").addEventListener("click", toggleChat);
    document.getElementById("chatbot-send").addEventListener("click", sendMessage);
    document.getElementById("chatbot-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Welcome message
    appendMessage(
      "assistant",
      "Bonjour ! Je suis l'assistant virtuel d'ECS75. Comment puis-je vous aider ?"
    );
  }

  function toggleChat() {
    isOpen = !isOpen;
    var win = document.getElementById("chatbot-window");
    var btn = document.getElementById("chatbot-toggle");
    if (isOpen) {
      win.classList.add("open");
      btn.classList.add("open");
      document.getElementById("chatbot-input").focus();
    } else {
      win.classList.remove("open");
      btn.classList.remove("open");
    }
  }

  function appendMessage(role, text) {
    var container = document.getElementById("chatbot-messages");
    var div = document.createElement("div");
    div.className = "chatbot-msg chatbot-msg-" + role;

    // Simple markdown-like formatting: **bold**, newlines
    var html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
    div.innerHTML = html;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showLoading() {
    var container = document.getElementById("chatbot-messages");
    var div = document.createElement("div");
    div.className = "chatbot-msg chatbot-msg-assistant chatbot-loading";
    div.innerHTML =
      '<span class="chatbot-dot"></span>' +
      '<span class="chatbot-dot"></span>' +
      '<span class="chatbot-dot"></span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeLoading() {
    var el = document.querySelector(".chatbot-loading");
    if (el) el.remove();
  }

  function sendMessage() {
    if (isLoading) return;
    var input = document.getElementById("chatbot-input");
    var text = input.value.trim();
    if (!text) return;

    input.value = "";
    appendMessage("user", text);
    messages.push({ role: "user", content: text });

    isLoading = true;
    showLoading();
    document.getElementById("chatbot-send").disabled = true;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        removeLoading();
        var reply = data.reply || data.error || "Erreur inattendue.";
        appendMessage("assistant", reply);
        messages.push({ role: "assistant", content: reply });
      })
      .catch(function () {
        removeLoading();
        appendMessage(
          "assistant",
          "Désolé, une erreur est survenue. Vous pouvez nous contacter au **01 70 03 60 00** ou par WhatsApp."
        );
      })
      .finally(function () {
        isLoading = false;
        document.getElementById("chatbot-send").disabled = false;
        document.getElementById("chatbot-input").focus();
      });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
