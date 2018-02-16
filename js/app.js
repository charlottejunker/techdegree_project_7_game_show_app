// *** VARIABLES ***

//counter for wrong guesses
let missed = 0;
let letterArray = "";

//phrases array
const phrases = [
  'october third',
  'stop trying to make fetch happen',
  'sorry that people are so jealous of me',
  'on wednesdays we wear pink',
  'grool',
  'you go glen coco',
  'is butter a carb',
  'why are you so obsessed with me',
  'sometimes older people make jokes'
];
//ul which will contain the phrase
const phraseUl = document.getElementById('phraseUl');


//get the overlay
const overlay = document.getElementById('overlay');


// *** FUNCTIONS ***


// -- 1 -- choose the phrase

function getRandomPhraseAsArray(arr) {
  //randomise the selection (times by length of phrase array to get integer)
  const randomise = Math.floor(Math.random() * (arr.length));
  const phrase = arr[randomise];
  //split the chosen phrase into characters inc spaces
  const characters = phrase.split("");
  //return so they can be used outside the function
  return characters;
}

// 2 -- add to display

function addPhraseToDisplay(arr) {
  //loop over the array
  for (i = 0; i < arr.length; i += 1) {
    //create an li
    let phraseLi = document.createElement('li');
    //if i isn't a space...
    if (arr[i] != " ") {
      //... give it the class 'letter'
      phraseLi.className = 'letter';
    } else {
      //give it the class 'space' (added to CSS to create spaces between words in the display)
      phraseLi.className = 'space';
    }
    //add the character to the list item
    phraseLi.appendChild(document.createTextNode(arr[i]));
    //add the li to the ul
    phraseUl.appendChild(phraseLi);
  }
}


// 3 -- check the letter that was chosen from keyboard

function checkLetter(chosenLetter) {
  //default to null
  let letterFound = null;

  //loop over the letter characters in the phrase
  for (i = 0; i < letterArray.length; i += 1) {
    //if there is a match between the letter clicked and one or more letters in the phrase...
    if (letterArray[i].innerHTML == chosenLetter) {
      // ... add the class 'show'
      letterArray[i].classList.add("show");
      //change letterFound to the chosen letter
      letterFound = chosenLetter;
    }
  }
  //return the found letter for use in -10-
  return letterFound;
}

// 4 -- check if player has won or lost

function win() {
  //change overlay class name from 'start' to 'win'
  overlay.className = 'win';
  //change the message
  document.querySelector('.title').innerHTML = 'You Win';
  // show overlay
  overlay.style.display = 'flex';
}

function lose() {
  //change its class name from 'start' to 'lose'
  overlay.className = 'lose';
  //change the message
  document.querySelector('.title').innerHTML = 'You Lose';
  // show overlay
  overlay.style.display = 'flex';

}

function checkWin() {
  //get all lis with class 'show'
  const showArray = document.querySelectorAll('.show');
  //change the reset button for when overlay is activated
  document.querySelector('.btn__reset').innerHTML = 'Play Again?';
    //if the length of the phrase matches the revealed letters the player has won...
    if (letterArray.length == showArray.length) {
      //pause briefly so that player can see the final letter displayed
      setTimeout(win, 1000);
    // but if they miss 5 guesses...
    } else if (missed === 5) {
      lose();
    }
}


// 5 -- reset the game

function resetGame() {
  //return 'missed' to 0
  missed = 0;
  //select all the hearts with class 'lost heart'
  const hearts = document.querySelectorAll('.lostHeart');
  // loop over hearts
  for (i = 0; i < hearts.length; i += 1) {
    //remove class 'lost heart and replace with 'tries
    hearts[i].className = 'tries';
  }
  //get all the buttons on the page
  const buttons = document.getElementsByTagName('button');
  //loop over them
  for (i = 0; i < buttons.length; i += 1) {
    //if they are in the 'keyrow' divs
    if (buttons[i].parentNode.className == 'keyrow') {
      //remove their disabled and class attributes to rest them
      buttons[i].removeAttribute('disabled');
      buttons[i].removeAttribute('class');
    }
  }
  // To remove prev phrase - as long as phraseUl has a child node, remove it,
  while (phraseUl.hasChildNodes()) {
    phraseUl.removeChild(phraseUl.firstChild);
  }
  //choose a new phrase
  const phraseArray = getRandomPhraseAsArray(phrases);
  addPhraseToDisplay(phraseArray);
  //update letterArray
  letterArray = document.querySelectorAll('.letter');
}


// *** INTERACTION WITH THE GAME ***

//listen for clicks
document.addEventListener('click', function(e) {

  //if target is the start/reset buttons
  if (e.target.className == 'btn__reset') {
    //hide overlay
    e.target.parentNode.style.display = 'none';
    //reset the board
    resetGame();
  }

  //if the target's parent had class 'keyrow'...
  if (e.target.parentElement.className == 'keyrow' ) {
    // set its class to 'chosen'
    e.target.className = 'chosen';
    // disable the button
    e.target.setAttribute('disabled', true);
    // get its letter
    const letter = e.target.innerHTML;
    //pass the letter into checkLetter and store the returned value (letterFound)
    const check = checkLetter(letter);
    //if the returned value was null (a space)
    if (check === null) {
      //remove try from scoreboard
      const nextTry = document.querySelector('.tries');
      nextTry.className = 'lostHeart';
      //add one to the 'missed' count
      missed += 1;
    }
    //run checkWin()
    checkWin();
  }
});
