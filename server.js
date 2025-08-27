// Importerer nødvendige moduler
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Funktion der renser/saniterer input (mod XSS og uønsket HTML)
function sanitizeInput(input) {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "")       // Fjerner < og > (så ingen HTML-tags kan bruges)
    .replace(/javascript:/gi, "") // Fjerner javascript: i links
    .replace(/on\w+=/gi, "")      // Fjerner event handlers (fx onclick=)
    .trim();                      // Fjerner mellemrum i starten/slutningen
}

// Alternativ strengere sanitization-funktion
function sanitizeInputAdvanced(input) {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>'"]/g, "")   // Fjerner tegn < > ' "
    .replace(/script/gi, "")  // Fjerner ordet "script"
    .slice(0, 500)            // Begrænser længden til max 500 tegn
    .trim();
}

// Mulige svar fra botten
const responses = [
  {
    keywords: ["hej", "hello", "hi"],
    answers: ["Hej med dig!", "Hello there!", "Hej! Hvordan går det?"]
  },
  {
    keywords: ["hvordan går det", "hvordan har du det"],
    answers: ["Jeg har det fint, tak!", "Det går godt med mig!"]
  },
  {
    keywords: ["farvel", "bye", "ses"],
    answers: ["Farvel!", "Vi ses!", "Tak for snakken!"]
  },
  {
    keywords: ["hjælp", "help"],
    answers: [
      "Jeg kan hjælpe dig med at chatte!",
      "Spørg mig om hvad som helst!"
    ]
  }
];

// Laver __dirname og __filename (da de ikke findes i ES modules som standard)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Opretter Express app
const app = express();

// Array til at gemme alle beskeder under sessionen
const messages = [];

// Fortæller Express at vi bruger EJS som view engine
app.set("view engine", "ejs");

// Gør "public"-mappen tilgængelig for statiske filer (fx CSS og billeder)
// Eksempel: /public/css/styles.css kan hentes i browseren som /css/styles.css
app.use(express.static(path.join(__dirname, "public")));

// Middleware til at læse POST-data fra formularer (req.body)
app.use(express.urlencoded({ extended: true }));

// ROUTE: Forsiden (GET)
// Når brugeren går til "/" vises index.ejs
app.get("/", (req, res) => {
  res.render("index", { messages, botReply: "", name: "", error: null });
});

// ROUTE: Chat (POST)
// Når brugeren sender en formular, fanges beskeden her
app.post("/chat", (req, res) => {
  const userName = req.body.name;      // Navn fra inputfeltet
  let userMessage = req.body.message;  // Beskeden fra inputfeltet

  // Sanitér beskeden for at undgå skadeligt indhold
  userMessage = sanitizeInput(userMessage);

  let botReply = ""; // Her gemmes botten's svar
  let error = "";    // Her gemmes evt. fejlbesked (fx hvis feltet er tomt)

  // Valider brugerens besked
  if (!userMessage || userMessage.trim() === "") {
    error = "Du skal skrive en besked!";
    botReply = "Skriv en besked for at chatte!";
  } else if (userMessage.length < 2) {
    error = "Beskeden skal være mindst 2 tegn lang!";
    botReply = "Din besked er for kort. Prøv igen!";
  } else if (userMessage.length > 500) {
    error = "Beskeden er for lang (max 500 tegn)!";
    botReply = "Din besked er for lang. Prøv at gøre den kortere!";
  } else {
    // Konverter beskeden til små bogstaver for lettere matching
    const lowerMessage = userMessage.toLowerCase();
    let foundResponse = false;

    // Loop gennem bot-svarene og find en der matcher
    for (let response of responses) {
      for (let keyword of response.keywords) {
        if (lowerMessage.includes(keyword)) {
          // Vælg et tilfældigt svar fra listen
          const randomIndex = Math.floor(Math.random() * response.answers.length);
          botReply = response.answers[randomIndex];
          foundResponse = true;
          break;
        }
      }
      if (foundResponse) break;
    }

    // Hvis ingen match findes, giv et fallback-svar
    if (!foundResponse) {
      botReply = `Du skrev: "${userMessage}". Prøv at skrive "hej" eller "hjælp"!`;
    }

    // Gem kun beskederne hvis der ikke er fejl
    if (!error) {
      messages.push({ sender: userName || "Bruger", text: userMessage }); // Brugerens besked
      messages.push({ sender: "Bot", text: botReply });                   // Bot'ens svar
    }
  }

  // Send data til EJS-skabelonen
  // -> messages = alle beskeder i chatten
  // -> botReply = seneste svar fra botten
  // -> error    = fejlbesked (hvis nogen)
  // -> name     = brugernavn (fra formen)
  res.render("index", { messages, botReply, error, name: userName });
});

// Starter serveren på port 3000
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
