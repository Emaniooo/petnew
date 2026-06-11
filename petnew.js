// ==========================
// HÄMTAR HTML-ELEMENT
// ==========================

let petNameInput = document.querySelector("#petName");
let animalTypeSelect = document.querySelector("#animalType");
let createBtn = document.querySelector("#createPet");
let randomNameBtn = document.querySelector("#randomName");

let napBtn = document.querySelector("#nap");
let playBtn = document.querySelector("#play");
let eatBtn = document.querySelector("#eat");

let petContainer = document.querySelector("#petContainer");
let historyDiv = document.querySelector("#history");

// Array som lagrar alla husdjur (max 4)
let pets = [];

let currentPet = null; // Det djur vi klickar på


// ==========================
// KLASS FÖR HUSDJUR
// ==========================

class Pet {

  constructor(name, animalType) {

    this.name = name;
    this.animalType = animalType;

    // Startvärden
    this.energy = 50;
    this.fullness = 50;
    this.happiness = 50;

    // Skapar ett eget HTML-element för varje pet
    this.petDiv = document.createElement("div");
    this.petDiv.style.border = "2px solid black";
    this.petDiv.style.margin = "10px";
    this.petDiv.style.padding = "10px";

    petContainer.append(this.petDiv);

    // Startar timer direkt när djuret skapas
    this.startTimer();

    this.render();
  }


  // ==========================
  // VISAR INFO I DOM
  // ==========================

  render() {
let imgSrc = "";

  if (this.animalType === "Dog") imgSrc = "images/dog.png";
  if (this.animalType === "Cat") imgSrc = "images/cat.png";
  if (this.animalType === "Rabbit") imgSrc = "images/rabbit.png";
  if (this.animalType === "Hamster") imgSrc = "images/hamster.png";

    this.petDiv.innerHTML = `
      <h3>${this.name} (${this.animalType})</h3>
      <img src="${imgSrc}" style="width:120px; display:block; margin-bottom:10px;">
      <p>Energy: ${this.energy}</p>
      <p>Fullness: ${this.fullness}</p>
      <p>Happiness: ${this.happiness}</p>
      <button class="selectBtn">Select</button>
    `;

    // När man klickar på Select väljer man aktivt djur
    this.petDiv.querySelector(".selectBtn")
      .addEventListener("click", () => {
        currentPet = this;
      });
  }


  // ==========================
  // TIMER (VAR 10:E SEKUND)
  // ==========================

  startTimer() {

    this.timer = setInterval(() => {

      this.energy -= 10;
      this.fullness -= 10;
      this.happiness -= 10;

      this.limitStats();
      this.checkIfAlive();
      this.render();

    }, 10000); // 10 sekunder

  }


  // ==========================
  // AKTIVITETER
  // ==========================

  nap() {

    this.energy += 40;
    this.happiness -= 10;
    this.fullness -= 10;

    this.limitStats();
    this.checkIfAlive();

    addHistory(`You took a nap with ${this.name}`);
    this.render();
  }

  play() {

    this.happiness += 30;
    this.fullness -= 10;
    this.energy -= 10;

    this.limitStats();
    this.checkIfAlive();

    addHistory(`You played with ${this.name}`);
    this.render();
  }

  eat() {

    this.fullness += 30;
    this.happiness += 5;
    this.energy -= 15;

    this.limitStats();
    this.checkIfAlive();

    addHistory(`${this.name} is eating`);
    this.render();
  }


  // ==========================
  // BEGRÄNSAR 0–100
  // ==========================

  limitStats() {

    if (this.energy > 100) this.energy = 100;
    if (this.energy < 0) this.energy = 0;

    if (this.fullness > 100) this.fullness = 100;
    if (this.fullness < 0) this.fullness = 0;

    if (this.happiness > 100) this.happiness = 100;
    if (this.happiness < 0) this.happiness = 0;
  }


  // ==========================
  // KOLLAR OM DJURET LEVER
  // ==========================

  checkIfAlive() {

    if (this.energy === 0 || this.fullness === 0 || this.happiness === 0) {

      clearInterval(this.timer); // Stoppar timern

      addHistory(`${this.name} ran away because of neglect!`);

      // Tar bort från DOM
      this.petDiv.remove();

      // Tar bort från arrayen
      pets = pets.filter(pet => pet !== this);

      // Om det var valt djur, nollställ
      if (currentPet === this) {
        currentPet = null;
      }
    }
  }

}


// ==========================
// HISTORIK
// ==========================

function addHistory(text) {

  let p = document.createElement("p");
  p.innerText = text;
  historyDiv.append(p);
}


// ==========================
// SKAPA HUSDJUR (MAX 4)
// ==========================

createBtn.addEventListener("click", () => {

  if (pets.length >= 4) {
    alert("You can only have 4 pets!");
    return;
  }

  let name = petNameInput.value;
  let type = animalTypeSelect.value;

  if (name === "") {
    alert("Please enter a name or get a random name!");
    return;
  }

  let newPet = new Pet(name, type);

  pets.push(newPet);

  petNameInput.value = "";
});


// ==========================
// AKTIVITETSKNAPPAR
// ==========================

napBtn.addEventListener("click", () => {
  if (currentPet) {
    currentPet.nap();
  }
});

playBtn.addEventListener("click", () => {
  if (currentPet) {
    currentPet.play();
  }
});

eatBtn.addEventListener("click", () => {
  if (currentPet) {
    currentPet.eat();
  }
});


// ==========================
// FETCH RANDOM NAME
// ==========================

randomNameBtn.addEventListener("click", async () => {

  try {

    let response = await fetch("https://randomuser.me/api");

    if (response.status !== 200) {
      throw new Error("API error");
    }

    let data = await response.json();

    let randomName = data.results[0].name.first;

    petNameInput.value = randomName;

  } catch (error) {

    alert("Could not fetch name from API");
    console.log(error);
  }

});
