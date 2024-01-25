const randomizeBtn = document.querySelector("#randomizeBtn");
const divMain = document.querySelector("#main");

// Function to create new character objects
function Character(name, category, possibleSlots, imageURL) {
  this.name = name;
  this.category = category;
  this.possibleSlots = possibleSlots;
  this.imageURL = imageURL;
  characters.push(this);
}

// Character database
const characters = [];

new Character("Magnus", "Warrior", [], "./portraits/magnus.jpg");
new Character("Heiner", "Warrior", [], "./portraits/heiner.jpg");
new Character("Grukli", "Warrior", [], "./portraits/grukli.jpg");
new Character("Bree", "Warrior", [], "./portraits/bree.jpg");

new Character("Andrin", "Scout", [], "./portraits/andrin.jpg");
new Character("Thuls", "Scout", [], "./portraits/thuls.jpg");
new Character("Sylvie", "Scout", [], "./portraits/sylvie.jpg");
new Character("Gustav", "Scout", [], "./portraits/gustav.jpg");

new Character("Evelyn", "Mage", [], "./portraits/evelyn.jpg");
new Character("Cornelius", "Mage", [], "./portraits/cornelius.jpg");
new Character("Wilbur", "Mage", [], "./portraits/wilbur.jpg");
new Character("Zek", "Mage", [], "./portraits/zek.jpg");

new Character("Reginald", "Healer", [], "./portraits/reginald.jpg");
new Character("Ottis", "Healer", [], "./portraits/ottis.jpg");
new Character("Malukah", "Healer", [], "./portraits/malukah.jpg");
new Character("Nezglekt", "Healer", [], "./portraits/nezglekt.jpg");

new Character("Yogger", "DLC", [], "./portraits/yogger.jpg");
new Character("Laia", "DLC", [], "./portraits/laia.jpg");
new Character("Navalea", "DLC", [], "./portraits/navalea.jpg");
new Character("Amelia", "DLC", [], "./portraits/amelia.jpg");

// Randomize team
let newTeam = [];

function randomizeTeam() {
  newTeam.length = 0;
  for (let i = 0; i < 4; i++) {
    let randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    // Check for duplicate character
    if (newTeam.some((e) => e.name === randomCharacter.name)) {
      i--;
      continue;
    }
    newTeam.push(randomCharacter);
  }
}

// Click the randomize button
randomizeBtn.addEventListener("click", () => {
  divMain.textContent = "";
  randomizeTeam();
  for (let i = 0; i < 4; i++) {
    const teamDisplay = divMain.appendChild(document.createElement("p"));
    teamDisplay.textContent = newTeam[i].name + " - " + newTeam[i].category;
  }
});

// TESTER