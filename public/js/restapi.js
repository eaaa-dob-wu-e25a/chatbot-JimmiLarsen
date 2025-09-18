//Dette Script håndterer interaktionen med REST API'et
// og opdaterer chat-grænsefladen dynamisk.


async function loadMessages() {
  const response = await fetch("/api/messages");
  const responseData = await response.json();
  const chatList = document.getElementById("chat");


  // Her opdateres chat-listen med beskeder fra serveren
  // ved brug af map for at formatere hver besked som en listepost

  // Map er en metode der er indbygget i JS og
  // fungerer som en loop der går igennem hver besked i responseData.messages
  // og returnerer en HTML-streng for hver besked.
  // join("") samler alle disse strenge til én stor streng uden ekstra mellemrum.


  chatList.innerHTML = responseData.messages.map(message =>
    `<li>
      <b class="${message.sender === 'Kunde' ? 'kunde' : 'bot'}">${message.sender}:</b>
      ${message.text}
    </li>`
  ).join("");
}

// Her starter vi med at lytte efter formularens submit-begivenhed
// og håndterer den asynkront

//vi bruger getElementById til at finde formularen med id "chatForm"
// og tilføjer en event listener der lytter efter "submit" begivenheden


document.getElementById("chatForm").addEventListener("submit", async event => {
  event.preventDefault();

  // dataen fra formularen hentes ved hjælp af FormData objektetet
  // event.target refererer til den formular der blev sendt

  const formData = new FormData(event.target);

  // Her sender vi en POST-anmodning til /api/messages endpointet
  // med formularens data som URLSearchParams

  //URLSearchParams er en indbygget JavaScript-funktion
  // der konverterer FormData til et format der kan sendes i en HTTP-anmodning

  const response = await fetch("/api/messages", {
    method: "POST",
    body: new URLSearchParams(formData)
  });
  const responseData = await response.json();

  // Hvis der er en fejl i svaret, vises den i et element med id "error"
  // Ellers ryddes fejlmeddelelsen
  
  if (responseData.error) {
    document.getElementById("error").textContent = responseData.error;
  } else {
    document.getElementById("error").textContent = "";
  }

  // Opdater chatten og nulstil formularen
  loadMessages();
  event.target.reset();
});

// Hent beskeder når siden indlæses
loadMessages();