const randomizeBtn = document.querySelector("#randomizeBtn");
const divTeamDisplay = document.querySelector("#teamDisplay");
const defaultBtn = document.querySelector("#defaultBtn");
const freeForAllBtn = document.querySelector("#freeForAllBtn");
const playerList = document.querySelector("#playerList");
const addPlayerBtn = document.querySelector("#addPlayerBtn");
const playerNameInput = document.querySelector("#playerNameInput");

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
function addCharactersToDatabase() {
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
}
addCharactersToDatabase();

// Function to create player objects
function Player(name, bannedChars) {
  this.name = name;
  this.bannedChars = bannedChars;
  players.push(this);
}

let players = [];

// add players to player list button
addPlayerBtn.addEventListener("click", () => {
  if (players.length === 4 || playerNameInput.value.trim() === "") return;

  let newPlayerName = playerNameInput.value;
  playerNameInput.value = ""; // empty text input field
  new Player(newPlayerName.trim(), "");

  //create new list entry
  let newListEntry = playerList.appendChild(document.createElement("p"));
  newListEntry.textContent = newPlayerName;
  newListEntry.classList.add("playerListEntry");
});

// press Enter to add player to list
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && document.activeElement === playerNameInput) {
    addPlayerBtn.click();
  }
});

// Randomize team
let newTeam = []; //Stores the chosen characters
let playerOrder = []; //Stores which player will play which slot

function randomizeTeam() {
  let validParty = false;
  let loopCounter = 0; //Counter to prevent infinite loops just in case
  do {
    loopCounter++;
    newTeam.length = 0;
    playerOrder.length = 0;

    //Player order randomization
    if (players.length != 0) {
      for (let i = 0; i < 4; i++) {
        let randomPlayer = players[Math.floor(Math.random() * players.length)];
        playerOrder.push(randomPlayer);
      }
    }

    //Character randomization
    for (let i = 0; i < 4; i++) {
      let randomCharacter = characters[Math.floor(Math.random() * characters.length)];
      // Check for duplicate character
      if (newTeam.includes(randomCharacter)) {
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

    //Check if party is valid. Party is assumed valid until something proves it's not
    validParty = true;
    for (i in players) {
      if (!playerOrder.includes(players[i])) {
        validParty = false;
        break; //Happens if a player didn't get a slot
      }
    }
    for (let i = 0; i < 4; i++) {
      if (playerOrder[i].bannedChars.includes(newTeam[i])) {
        validParty = false;
        break; //Happens if a player got a character they have banned
      }
    }
  } while(!validParty && loopCounter < 100000); //Loop stops if a valid party was made or the loop repeated 100.000 times without a valid party
}

// Click the randomize button
randomizeBtn.addEventListener("click", () => {
  divTeamDisplay.innerHTML = "";
  randomizeTeam();
  for (let i = 0; i < 4; i++) {
    const characterPortrait = divTeamDisplay.appendChild(document.createElement("img"));
    characterPortrait.src = newTeam[i].imageURL;
    characterPortrait.classList.add("characterPortrait");
  }
});

// default button
defaultBtn.addEventListener("click", () => {
  characters.length = 0;
  addCharactersToDatabase();
});

// free for all button
freeForAllBtn.addEventListener("click", () => {
  for (let i = 0; i < characters.length; i++) {
    characters[i].possibleSlots = [0, 1, 2, 3];
  }
});

//Function that lets you find a character by name instead of array index (useful for later(maybe))
function getCharacterByName(name) {
  for (let i = 0; i < characters.length; i++) {
    if (characters[i].name == name) {
      return characters[i];
    }
  }
}
