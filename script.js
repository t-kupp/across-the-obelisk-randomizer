const randomizeBtn = document.querySelector("#randomizeBtn");
const teamDisplay = document.querySelector("#teamDisplay");
const defaultBtn = document.querySelector("#defaultBtn");
const freeForAllBtn = document.querySelector("#freeForAllBtn");
const playerList = document.querySelector("#playerList");
const addPlayerBtn = document.querySelector("#addPlayerBtn");
const playerNameInput = document.querySelector("#playerNameInput");
const characterSelection = document.querySelector("#characterSelection");
const selectionPortraitWrapper = document.querySelector("#selectionPortraitWrapper");
const selectionButtonWrapper = document.querySelector("#selectionButtonWrapper");
const selectionSaveBtn = document.querySelector("#selectionSaveBtn");
const darkenWrapper = document.querySelector("#darkenWrapper");
const preloadWrapper = document.querySelector("#preloadWrapper");

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
for (char of characters) {
  let image = document.createElement("img");
  image.src = char.imageURL;
  preloadWrapper.appendChild(image);
}

// Function to create player objects
function Player(name, bannedChars, preferredCharCount) {
  this.name = name;
  this.bannedChars = bannedChars;
  this.preferredCharCount = preferredCharCount;
  players.push(this);
}

let players = [];

// press Enter to add player to list
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && document.activeElement === playerNameInput) {
    addPlayerBtn.click();
  }
});

// add players to player list button
addPlayerBtn.addEventListener("click", () => {
  if (
    players.length === 4 ||
    playerNameInput.value.trim() === "" ||
    players.some((player) => player.name === playerNameInput.value.trim())
  )
    return;

  let newPlayerName = playerNameInput.value;
  playerNameInput.value = ""; // empty text input field
  new Player(newPlayerName.trim(), [], 0);

  for (let i = 0; i < players.length; i++) {
    // only draw the last added player
    if (players.length - 1 !== i) continue;

    // create new list entry wrapper
    let newWrapper = playerList.appendChild(document.createElement("div"));
    newWrapper.classList.add("listEntryWrapper");

    //create new list entry
    let newListEntry = newWrapper.appendChild(document.createElement("p"));
    newListEntry.textContent = newPlayerName;
    newListEntry.classList.add("playerListEntry");

    // create add button
    let newAddBtn = newWrapper.appendChild(document.createElement("button"));
    newAddBtn.classList.add("addBtn");
    newAddBtn.textContent = "+";
    newAddBtn.addEventListener("click", () => {
      if (players[i].preferredCharCount < 3) players[i].preferredCharCount += 1;
      newValueDisplay.textContent = players[i].preferredCharCount;
      if (players[i].preferredCharCount === 0) {
        newValueDisplay.textContent = "?";
      }
      setRandomizeButtonState();
    });

    // create value display
    let newValueDisplay = newWrapper.appendChild(document.createElement("p"));
    newValueDisplay.classList.add("valueDisplay");
    newValueDisplay.textContent = players[i].preferredCharCount;
    if (players[i].preferredCharCount === 0) {
      newValueDisplay.textContent = "?";
    }

    // create subtract button
    let newSubtractBtn = newWrapper.appendChild(document.createElement("button"));
    newSubtractBtn.classList.add("subtractBtn");
    newSubtractBtn.textContent = "-";
    newSubtractBtn.addEventListener("click", () => {
      if (players[i].preferredCharCount > 0) players[i].preferredCharCount -= 1;
      newValueDisplay.textContent = players[i].preferredCharCount;
      if (players[i].preferredCharCount === 0) {
        newValueDisplay.textContent = "?";
      }
      setRandomizeButtonState();
    });

    // create choose character button
    let newChooseCharBtn = newWrapper.appendChild(document.createElement("button"));
    newChooseCharBtn.classList.add("chooseCharBtn");
    newChooseCharBtn.innerHTML = '<i class="fa-solid fa-gear"></i>';
    newChooseCharBtn.addEventListener("click", () => {
      openCharacterSelection(players[i]);
    });
  }
  setRandomizeButtonState();
});

function openCharacterSelection(currentPlayer) {
  selectionPortraitWrapper.innerHTML = "";
  darkenWrapper.classList.add("visible");
  // drawing each characters portrait
  for (let i = 0; i < characters.length; i++) {
    let portrait = selectionPortraitWrapper.appendChild(document.createElement("img"));
    portrait.classList.add("selectionPortrait");
    portrait.src = characters[i].imageURL;

    // gives portraits the unselected class if they are banned
    if (currentPlayer.bannedChars.includes(characters[i])) {
      portrait.classList.add("unselected");
    }

    portrait.addEventListener("click", () => {
      //Make it so that player cant have less available players than they want to play
      let minCharsNeeded = currentPlayer.preferredCharCount;
      if (minCharsNeeded == 0) minCharsNeeded = 1;

      if (
        !portrait.classList.contains("unselected") &&
        currentPlayer.bannedChars.length < 20 - minCharsNeeded
      ) {
        portrait.classList.toggle("unselected");
      } else if (portrait.classList.contains("unselected")) {
        portrait.classList.toggle("unselected");
      }
      // toggle function to activate a banned character again
      // basically you click on a character portrait and the character gets added to bannedChars
      // click on it again and the function will find and remove it
      let index = currentPlayer.bannedChars.indexOf(characters[i]); // returns -1 if character not found
      if (index == -1 && currentPlayer.bannedChars.length < 20 - minCharsNeeded) {
        currentPlayer.bannedChars.push(characters[i]);
      } else if (index != -1) {
        currentPlayer.bannedChars.splice(index, 1); // at index, removes 1 character from bannedChars
      } //Reversed this check to test something
      setRandomizeButtonState();
    });
  }

  // Event listeners for the save button
  selectionSaveBtn.addEventListener("click", () => {
    //
    // insert code to update bannedChars here
    //
    darkenWrapper.classList.remove("visible");
  });

  // close the selection screen when clicked outside of it
  darkenWrapper.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target == darkenWrapper) {
      darkenWrapper.classList.remove("visible");
    }
  });
}

// Randomize team
let newTeam = []; //Stores the chosen characters
let playerOrder = []; //Stores which player will play which slot

function randomizeTeam() {
  //Start actual function
  let validParty = false;
  let loopCounter = 0; //Counter to prevent infinite loops just in case
  while (!validParty && loopCounter < 1000000) {
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
        if (
          player.preferredCharCount > 0 &&
          countElementInArray(player, playerOrder) != player.preferredCharCount
        ) {
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
  if (!validParty) {
    newTeam.length = 0;
    playerOrder.length = 0;
  } //Makes sure no result happens instead of a random one if it can't generate a valid result
}

// Click the randomize button
randomizeBtn.addEventListener("click", () => {
  teamDisplay.innerHTML = "";
  randomizeTeam();
  if (newTeam.length == 0 || playerOrder.length == 0) {
    alert("The randomizer couldn't find a valid party in 100.000 iterations. Your settings might not be able to generate a valid party.");
  }
  else {
    drawCharacterPortraits();
  }
});

function drawCharacterPortraits() {
  for (let i = 0; i < 4; i++) {
    // add a wrapper for the image and the player name
    const portraitWrapper = teamDisplay.appendChild(document.createElement("div"));
    portraitWrapper.classList.add("portraitWrapper");

    // add the portrait image
    const characterPortrait = portraitWrapper.appendChild(document.createElement("img"));
    //check for failed team generation and display background placeholder
    if (newTeam.length !== 0) {
      characterPortrait.src = newTeam[i].imageURL;
    } else {
      characterPortrait.src = "./portraits/placeholder.jpg";
    }
    characterPortrait.classList.add("characterPortrait");
    // add the player name
    const portraitPlayerName = portraitWrapper.appendChild(document.createElement("p"));
    portraitPlayerName.classList.add("portraitPlayerName");
    if (players.length != 0 && newTeam.length != 0) {
      portraitPlayerName.classList.add("visible");
      portraitPlayerName.textContent = playerOrder[i].name;
    }
  }
}

//Counts how often something exists in an array
function countElementInArray(element, array) {
  let counter = 0;
  for (i of array) {
    if (i == element) {
      counter++;
    }
  }
  return counter;
}

//Check if the randomize button should be active and set its state
function setRandomizeButtonState() {
  let conditionMet = true; //This is the condition for the button to be active. Gets set to false if there is a reason it shouldn't be active

  //Check if anyone has less chars available than they want to play
  for (player of players) {
    if (
      20 - player.bannedChars.length < player.preferredCharCount ||
      player.bannedChars.length == 20
    ) {
      conditionMet = false;
    }
  }

  //Valid character amount check
  let totalNeededChars = 0;
  let flexibilityExists = false; //Will be true if at least someone has "?" selected
  for (player of players) {
    if (player.preferredCharCount == 0) {
      flexibilityExists = true;
      totalNeededChars += 1;
    } else {
      totalNeededChars += player.preferredCharCount;
    }
  }
  if (totalNeededChars > 4 || (totalNeededChars < 4 && !flexibilityExists)) {
    conditionMet = false;
  }
  //---------------------

  if (conditionMet) {
    //Insert code here that activates the button
    randomizeBtn.classList.remove("disabled");
  } else {
    //Insert code here that deactivates the button and greys it out
    randomizeBtn.classList.add("disabled");
  }
}
