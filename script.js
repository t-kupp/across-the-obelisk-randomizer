const randomizeBtn = document.querySelector("#randomizeBtn");
const teamDisplay = document.querySelector("#teamDisplay");
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


// preload images
function preloadImage(url) {
  let img = new Image();
  img.src = url;
}


for (Character of characters) {
  preloadImage(Character.imageURL);
}


// Function to create player objects
function Player(name) {
  this.name = name;
  this.bannedChars = [];
  this.preferredCharCount = 0 //0 means the player does not care and it will be random
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
  //Check if preferred player counts of players are even possible and end the function if they are not
  if (players.length != 0) {
    let totalNeededChars = 0;
    let flexibilityExists = false; //Will be true if atleast someone has "?" selected
    for (player of players) {
      if (player.preferredCharCount == 0) {
        flexibilityExists = true
        totalNeededChars += 1
      }
      else {
        totalNeededChars += player.preferredCharCount
      }
    }
    if (totalNeededChars > 4 || (totalNeededChars < 4 && !flexibilityExists)) {
      return // Function ends if people selected too many or too few characters. Later you can insert some feedback code here
    }
  }

  //Start actual function
  let validParty = false;
  let loopCounter = 0; //Counter to prevent infinite loops just in case
  while (!validParty && loopCounter < 100000) {
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
    if (players.length != 0) {
      for (player of players) {
        if (!playerOrder.includes(player)) {
          validParty = false;
          break; //Happens if a player didn't get a slot
        }
        if (player.preferredCharCount < 0 && countElementInArray(player, playerOrder) != player.preferredCharCount) {
          validParty = false;
          break; //Happens if someones preferred character amount doesn't match how many they got assigned. Note: 0 means the player doesn't care
        }
      }
      for (let i = 0; i < 4; i++) {
        if (playerOrder[i].bannedChars.includes(newTeam[i])) {
          validParty = false;
          break; //Happens if a player got a character they have banned
        }
      }
    }
  } //Loop stops if a valid party was made or the loop repeated 100.000 times without a valid party
}


// Click the randomize button
randomizeBtn.addEventListener("click", () => {
  teamDisplay.innerHTML = "";
  randomizeTeam();
  drawCharacterPortraits();
});


function drawCharacterPortraits() {
  for (let i = 0; i < 4; i++) {
    // add a wrapper for the image and the player name
    const portraitWrapper = teamDisplay.appendChild(document.createElement("div"));
    portraitWrapper.classList.add("portraitWrapper");

    // add the portrait image
    const characterPortrait = portraitWrapper.appendChild(document.createElement("img"));
    characterPortrait.src = newTeam[i].imageURL;
    characterPortrait.classList.add("characterPortrait");

    // add the player name
    const portraitPlayerName = portraitWrapper.appendChild(document.createElement("p"));
    portraitPlayerName.classList.add("portraitPlayerName");
    if (players.length != 0) {
      portraitPlayerName.textContent = playerOrder[i].name;
    }
  }
}


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


//Counts how often something exists in an array
function countElementInArray(element, array) {
  let counter = 0;
  for (i of array) {
    if (i == element) {
      counter++;
    }
    return counter
  }
}