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

new Character("Magnus", "Warrior", [0, 1, 2], "./portraits/magnus.jpg");
new Character("Heiner", "Warrior", [0], "./portraits/heiner.jpg");
new Character("Grukli", "Warrior", [0, 1, 2], "./portraits/grukli.jpg");
new Character("Bree", "Warrior", [0, 1], "./portraits/bree.jpg");

new Character("Andrin", "Scout", [1, 2], "./portraits/andrin.jpg");
new Character("Thuls", "Scout", [1, 2], "./portraits/thuls.jpg");
new Character("Sylvie", "Scout", [1, 2], "./portraits/sylvie.jpg");
new Character("Gustav", "Scout", [1, 2, 3], "./portraits/gustav.jpg");

new Character("Evelyn", "Mage", [1, 2], "./portraits/evelyn.jpg");
new Character("Cornelius", "Mage", [1, 2], "./portraits/cornelius.jpg");
new Character("Wilbur", "Mage", [1, 2], "./portraits/wilbur.jpg");
new Character("Zek", "Mage", [1, 2], "./portraits/zek.jpg");

new Character("Reginald", "Healer", [1, 2, 3], "./portraits/reginald.jpg");
new Character("Ottis", "Healer", [1, 2, 3], "./portraits/ottis.jpg");
new Character("Malukah", "Healer", [1, 2, 3], "./portraits/malukah.jpg");
new Character("Nezglekt", "Healer", [1, 2, 3], "./portraits/nezglekt.jpg");

new Character("Yogger", "DLC", [0, 1, 2], "./portraits/yogger.jpg");
new Character("Laia", "DLC", [1, 2], "./portraits/laia.jpg");
new Character("Navalea", "DLC", [1, 2], "./portraits/navalea.jpg");
new Character("Amelia", "DLC", [1, 2], "./portraits/amelia.jpg");

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
    // Check for available slot
    if (!randomCharacter.possibleSlots.includes(i)) {
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
