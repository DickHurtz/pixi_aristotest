import * as PIXI from "pixi.js";

let app;
let playButton;
let chestText;
let chests = [];
let openedChests = 0;
let bonusPopup;
const CHEST_TEXTURE_PATH = "src/sprites/closed.png"; // Replace with the actual path to the chest sprite image
const CHEST_OPENED_TEXTURE_PATH = "src/sprites/opened.png"; // Replace with the actual path to the win sprite image
const loseColor = 0xff0000;
const winColor = 0xffd700;
const bonusColor = 0x00ff00;

function init() {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });
  document.body.appendChild(app.view);

  bonusPopup = document.getElementById("bonusPopup");

  createPlayButton();
  disableChests();
}

function createPlayButton() {
  playButton = new PIXI.Text("Play", { fill: "#ffffff" });
  playButton.interactive = true;
  playButton.buttonMode = true;
  playButton.x = app.view.width / 2 - playButton.width / 2;
  playButton.y = 50;
  playButton.on("pointerdown", startGame);

  app.stage.addChild(playButton);
}

function createChestText(chestprops, message, color) {
  chestText = new PIXI.Text("You " + message, { fill: color });
  chestText.x = chestprops.x - chestprops.width / 3;
  chestText.y = chestprops.y - chestprops.height / 3;
  app.stage.addChild(chestText);
}

function createChests() {
  chests.forEach((chest) => app.stage.removeChild(chest)); // Remove old chests
  chests = []; // Clear the chests array

  for (let i = 0; i < 6; i++) {
    const chest = PIXI.Sprite.from(CHEST_TEXTURE_PATH);
    // chest.x = 100 + i * 120;
    // chest.y = app.view.height / 2;
    if (i < 3) {
      chest.y = app.view.height / 3;
      chest.x = (app.view.width / 3 / 2) * (i + 2);
    } else {
      chest.y = app.view.height / 3 + 100;
      chest.x = (app.view.width / 3 / 2) * (i - 1);
    }
    chest.width = 75;
    chest.height = 100;
    chest.interactive = true;
    chest.buttonMode = true;
    chest.on("pointerdown", () => openChest(chest));
    app.stage.addChild(chest);
    chests.push(chest);
  }
}

function startGame() {
  playButton.interactive = false;
  disablePlayButton();
  createChests(); // Recreate chests each time the game starts
  enableChests();
  openedChests = 0; // Reset the opened chests count
}

function disablePlayButton() {
  playButton.alpha = 0.5;
}

function enablePlayButton() {
  playButton.alpha = 1;
  playButton.interactive = true;
}

function enableChests() {
  chests.forEach((chest) => {
    if (!chest.clicked) {
      chest.interactive = true;
      // chest.alpha = 1;
    }
  });
}

function disableChests() {
  chests.forEach((chest) => {
    chest.interactive = false;
    // chest.alpha = 0.5;
  });
}

function openChest(chest) {
  disableChests();
  const isWinner = Math.random() < 0.5; // Random winner determination
  if (isWinner) {
    const isBonus = Math.random() < 0.5;
    if (isBonus) {
      chest.tint = bonusColor;
      chest.texture = PIXI.Texture.from(CHEST_OPENED_TEXTURE_PATH); // Change to bonus texture
      showBonusWin();
    } else {
      chest.tint = winColor;
      chest.texture = PIXI.Texture.from(CHEST_OPENED_TEXTURE_PATH); // Change to win texture
      createChestText(chest, showRegularWin(), winColor);
    }
  } else {
    chest.tint = loseColor;
    chest.texture = PIXI.Texture.from(CHEST_OPENED_TEXTURE_PATH); // Change to lose texture
    createChestText(chest, showLose(), loseColor);
  }
  chest.clicked = true; // Mark this chest as clicked

  setTimeout(() => {
    app.stage.removeChild(chestText);

    if (openedChests < chests.length) {
      enableChests(); // Enable chests after a second
    }
  }, 1000); // Adjust the timeout based on the animation length

  openedChests++; // Increment the count of opened chests
  if (openedChests === chests.length) {
    setTimeout(enablePlayButton, 1000); // Enable play button after all chests are opened
  }
}

function showRegularWin() {
  return "Win!";
}

function showLose() {
  return "Lose!";
}

function showBonusWin() {
  console.log("Bonus Win!");
  // Display bonus win animation
  bonusPopup.style.display = "block";
  setTimeout(() => {
    bonusPopup.style.display = "none";
  }, 2000); // Adjust the timeout based on the popup display length
}

init();
