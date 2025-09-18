//Server.js - Express server setup with EJS templating
import express from "express";
//import response from "response.js";

// Here the port is defined
const PORT = 3000;

// Express app setup
const app = express();
app.set("view engine", "ejs",);
app.use(express.urlencoded({ extended: true }));

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;
  const botResponse = response(userMessage);
  messages.push({ user: userMessage, bot: botResponse });
  res.redirect("/");
});
app.get("/", (req, res) => {
  res.render("index", { messages });
});

const messages = [];
const response = (message) => {
  // Simple keyword-based responses
  if (message.includes("hello")) {
    return "Hello! How can I assist you today?";
  }
  return "I'm sorry, I didn't understand that.";
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});