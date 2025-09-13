async function loadMessages() {
      const res = await fetch("/api/messages");
      const data = await res.json();
      const chat = document.getElementById("chat");
      chat.innerHTML = data.messages.map(m => 
        `<li><b class="${m.sender === 'Kunde' ? 'kunde' : 'bot'}">${m.sender}:</b> ${m.text}</li>`
      ).join("");
    }

    document.getElementById("chatForm").addEventListener("submit", async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const res = await fetch("/api/messages", {
        method: "POST",
        body: new URLSearchParams(formData)
      });
      const data = await res.json();

      if (data.error) {
        document.getElementById("error").textContent = data.error;
      } else {
        document.getElementById("error").textContent = "";
      }

      loadMessages();
      e.target.reset();
    });

    loadMessages();