import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import responses from "./responses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const messages = [];

// Logger til fejlsøgning
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Body parsers (urlencoded til form submissions, json hvis du vil bruge JSON senere)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files fra /public
app.use(express.static(path.join(__dirname, "public")));

// Hent alle beskeder
app.get("/api/messages", (req, res) => {
  return res.json({ messages });
});

// Send en ny besked (forvent body som urlencoded eller json)
app.post("/api/messages", (req, res) => {
  const userName = req.body.name || "Kunde";
  const userMessage = typeof req.body.message === "string" ? req.body.message.replace(/[<>]/g, "").trim() : "";

  let botReply = "";
  let error = null;

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
    if (!found) botReply = `Du skrev: "${userMessage}".`;
    messages.push({ sender: userName, text: userMessage });
    messages.push({ sender: "NPC", text: botReply });
  }

  return res.json({ messages, error });
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
