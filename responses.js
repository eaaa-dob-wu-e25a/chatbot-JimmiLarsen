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
    keywords: ["kan du hjælpe mig", "hjælp mig", "hjælp"],
    answers: ["Du kan åbne listen over alt jeg kan hjælpe med ved at skrive hjælp"],
  },
  {
    keywords: ["tak for hjælpen", "kan du have en god dag"],
    answers: ["Farvel!", "Vi ses!", "Tak for snakken!"]
  },
];

export default responses;