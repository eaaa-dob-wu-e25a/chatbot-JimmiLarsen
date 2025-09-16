// Dette er serverens hovedfil, der sætter en simpel Express-server op
// til at håndtere chatbeskeder via et REST API.


// her importerer vi nødvendige moduler

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import responses from "./responses.js";

// her definerer vi nogle konstanter til at hjælpe med filstier
// __filename og __dirname er ikke tilgængelige i ES-moduler som standard,
// så vi bruger fileURLToPath og path.dirname til at oprette dem

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// her opretter vi en Express-applikation og en tom array til at gemme beskeder
// app er vores Express applikation
// messages er en array der holder alle chatbeskeder

const app = express();
const messages = [];

// Middleware til logging af alle indkommende requests
// Dette middleware logger hver request med metode og URL

// toISOString() er en metode der konverterer datoen til en standardiseret streng
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Body parsers (urlencoded til form submissions, json hvis du vil bruge JSON senere)
// express.urlencoded og express.json er middleware der parser indkommende request bodies
// så vi kan tilgå dataen via req.body

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files fra /public
app.use(express.static(path.join(__dirname, "public")));

// Her henter vi beskederne skrevet i chatten
// og sender dem som JSON til klienten

app.get("/api/messages", (req, res) => {
  return res.json({ messages });
});

// Her håndterer vi nye beskeder sendt fra klienten
// Vi validerer beskeden og genererer et svar baseret på nøgleord

// Et nøgleord er et ord eller en sætning der udløser et bestemt svar fra botten

app.post("/api/messages", (req, res) => {
  const userName = req.body.name || "Kunde";
  const userMessage = typeof req.body.message === "string" ? req.body.message.replace(/[<>]/g, "").trim() : "";

  let botReply = "";
  let error = null;

// Her tjekker vi om beskeden er tom, for kort eller for lang
// Hvis beskeden er gyldig, søger vi efter nøgleord i responses.js
// og vælger et tilfældigt svar fra de matchende svarmuligheder

  if (!userMessage) {
    error = "Du skal skrive en besked!";
    botReply = error;
  } else if (userMessage.length < 2) {
    error = "Beskeden er for kort.";
    botReply = error;
  } else if (userMessage.length > 500) {
    error = "Beskeden er for lang.";
    botReply = error;
  } else {
    const lowerMessage = userMessage.toLowerCase();
    let found = false;
    for (const r of responses) {
      if (r.keywords.some(k => lowerMessage.includes(k))) {
        botReply = r.answers[Math.floor(Math.random() * r.answers.length)];
        found = true;
        break;
      }
    }

// Hvis ingen nøgleord blev fundet, bruger vi et standard svar
// Det er også her vi navngiver botten "NPC"

    if (!found) botReply = `Du skrev: "${userMessage}".`;
    messages.push({ sender: userName, text: userMessage });
    messages.push({ sender: "NPC", text: botReply });
  }

  return res.json({ messages, error });
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
