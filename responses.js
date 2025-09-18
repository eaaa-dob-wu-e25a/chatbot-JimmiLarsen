// Mulige svar fra botten
const responses = [
  {
    keywords: ["hej", "goddag",
      "hey", "greetings", "yo",
      "morn", "godmorgen", "godaften",
      "godnat", "halløj", "hallo",
      "hejsa", "hey"],

    answers: ["Hej hvad kan jeg hjælpe dig med i dag!",
      "Goddag! Hvordan kan jeg hjælpe?",
      "Hey! Hvad vil du gerne vide?",
      "Halløj! Hvad kan jeg gøre for dig?"],
  },
  {
    keywords: ["Kan du hjælpe mig", "Hjælp mig", "Hjælp"],
    answers: ["Du kan åbne listen over alt jeg kan hjælpe med ved at skrive hjælp"],
  },
  {
    keywords: ["Tak for", "Kan du have",],
    answers: ["Farvel!", "Vi ses!", "Tak for snakken!"]
  },
];

export default responses;