import express from "express";
// Import express frameworkconst app = express();
// Create an instance of express// Listen on port 3000

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index", { name: "", error: "" });
});

// POST - handle form submission
app.post("/submit", (req, res) => {
  const name = req.body.name;
  let error = "";
  if (!name || name.trim() === "") {
    error = "Du skal indtaste et navn!";
  }
  res.render("index", { name, error });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
