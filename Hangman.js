//The list of words that can be chosen. Short = max 7 letters, Medium = max 12 letters, Long = everything above 12 letters, Any = anything.
const wordBank = ["Apple", "House", "Tree", "Squirrel", "Microphone", "Computer", "Aircraft carrier", "Graphics card", "Cable management", "Hangman", "Mouse", "Keyboard", "Screen", "Monitor", "Grass", "Telephone", "Table", "Desk", "Cable", "Charger", "Photograph", "Virtual reality", "Wall", "Floor", "Ceiling", "Window", "Airplane", "Headset", "Speaker", "Carpet", "Europe", "North America", "South America", "Africa", "Asia", "Oceania", "Day", "Night", "Sunset", "Sunrise", "Human", "Fox", "Wolf", "Cat", "Lion", "Dog", "Axolotl", "Dragon", "Bear", "Alligator", "Dinosaur", "Motherboard", "Harddrive", "Printer", "Dust", "Crowbar", "Power supply", "Book", "Shadow", "Statue", "Nuclear warhead", "Fridge", "Temple", "Movie", "Skull", "Skeleton", "Web development", "Microsoft", "Google", "Valve", "Steam", "Subway", "Coffin", "Seagull", "Crow", "Vocabulary", "Car", "Truck", "Boat", "Ship", "Container", "Rocket", "Space shuttle", "Moon", "Planet", "Advertisement", "Piano", "Shelf", "Star", "Factory", "Shield", "Library", "Gallery", "Museum", "Castle", "Fortress", "Bastion", "Fur", "Eagle", "Sparrow", "Raven", "Gold", "Silver", "Bronze", "Iron", "Coal", "Titanium", "Diamond", "Sulfur", "Emerald", "Ruby", "Cardboard", "Pickaxe", "Sword", "Axe", "Shovel", "Fishing rod", "Trident", "Mace", "Brush", "Weapon", "Salary"];

//Other variables, defined here to prevent any possible scope issues
let mainWord;
let guessingWord;
let guessedLetters = [];
let inputRegex = /^[a-z]{1}$/i;
let wrongAttemptCount;
let maxDeletions;
let perfectGame = true;

//Select a longer or shorter word depending on player chosen word length
function wordChooser (difficulty){

    let possibleWords;

    checkForDuplicates(wordBank);
    
    switch (difficulty.toLowerCase()){
        case "short":
            possibleWords = wordBank.filter((word) => word.length <= 7);
            break;
        case "medium":
            possibleWords = wordBank.filter((word) => word.length <= 12 && word.length > 7);
            break;
        case "long":
            possibleWords = wordBank.filter((word) => word.length > 12);
            break;
        case "any":
            possibleWords = wordBank;
            break;
        default:
            //revert to 'any' word length if input is somehow invalid
            console.log("Invalid word length detected, selecting 'any'..");
            possibleWords = wordBank;
            break;
    }

    let chosenWord = possibleWords[Math.floor(Math.random() * possibleWords.length)].toLowerCase();    

    return chosenWord;
}

function wordConverter (wordToConvert){
    let convertedWord = wordToConvert.replace(/[a-z]/gi, '-');
    return convertedWord;
}

//notify in the console in case the wordbank has any duplicate values
function checkForDuplicates (arrayToCheck){
    let tempArray = [];
    arrayToCheck.forEach((element) => {
        if(tempArray.includes(element)){
            console.log(`Duplicate word ${element} detected.`);
        }else{
            tempArray.push(element);
        }
    }) 
}

//delete a specific amount of elements on the page, or every single one if it's the last attempt
function removeElement (){
    let allElements = document.querySelectorAll('*:not(.hangmanItem):not(body):not(head):not(html):not(div):not(table):not(tbody)');
    maxDeletions = Math.floor(allElements.length / wrongAttemptCount);

    if(wrongAttemptCount == 1){
        allElements = document.querySelectorAll('*:not(.hangmanItem):not(body):not(head):not(html)');
        for(i=0;i<allElements.length;i++){
            allElements[i].remove();
        }
        //End the game since attempts have run out and all elements are deleted
        console.log('All elements deleted, game is over.');
        document.querySelector('.hangmanMainForm').classList.add('hangmanHidden');
        document.querySelector('.hangmanLossContainer').classList.remove('hangmanHidden');
        document.querySelector('.hangmanLossAttemptDisplay').innerText = guessedLetters.length;
    
        setTimeout(() => {
            document.querySelector('div.hangmanBox').style.animation = '0.8s slide-up';
            document.querySelector('div.hangmanOverlay').style.animation = '0.8s fade-out ';
        }, 6000);
    }else{
        let randomNumber;
        for(i=0;i<maxDeletions;i++){
            randomNumber = Math.floor(Math.random() * allElements.length);
            allElements[randomNumber].remove();
        }
        wrongAttemptCount--;
    }
}

function colorFlash (element, color, defaultColor){
    element.style.transition = 'none';
    element.style.backgroundColor = color;

    //Force-apply the previous styles, in order to have a transition to the following styles
    void element.offsetWidth;
    
    element.style.transition = 'background-color 1s ease-out';
    element.style.backgroundColor = defaultColor;
}

//Main method called on execution, generates the game itself
function generateHTML(){
    let html = `<div class="hangmanOverlay hangmanItem" style="position: absolute;z-index: 1000; padding: 10px;text-align: center;width: 100%;height: 100%;">
    <style class="hangmanItem">
        .hangmanOverlay{
            background-color: rgb(0, 0, 0, 25%);
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            align-items: baseline;
            animation: 0.7s fade-in;
        }

        @keyframes fade-in {
            from{
                background-color: rgb(0, 0, 0, 0%);
            }
            to{
                background-color: rgb(0, 0, 0, 25%);
            }
        }

        @keyframes fade-out {
            from{
                background-color: rgb(0, 0, 0, 25%);
            }
            to{
                background-color: rgb(0, 0, 0, 0%);
            }
        }
        
        .hangmanBox{
            width: 550px;
            display: block;
            padding: 10px;
            font-size: 20px !important;
            border-radius: 10px;
            border: 3px solid black;
            box-shadow: 12px 12px 9px black;
            font-family: Arial, Helvetica, sans-serif;
            animation: 0.7s slide-down;
        }

        @keyframes slide-down {
            /*from {
                margin-top: -150vh;
            }
            to {
                margin-top: 0%;
            }*/

            0%{margin-top: -150vh}
            80%{margin-top: 20px}
            100%{margin-top: 0%}
        }

        @keyframes slide-up {
            /*from {
                margin-top: 0%;
            }
            to {
                margin-top: -150vh;
            }*/
            
            0%{margin-top: 0%}
            20%{margin-top: 20px}
            100%{margin-top: -150vh}
        }
        
        
        .hangmanBox form{
            display: inline;
            padding: 20px;
        }

        .hangmanHeader{
            color: black;
            padding: 5px;
            margin: 10px;
            font-size: 25px;
        }

        .hangmanText{
            color: black;
            padding: 5px;
            margin: 10px;
        }

        .hangmanVictoryContainer h1{
            color: green;
        }

        .hangmanLossContainer h1{
            color: red;
        }

        .hangmanFailedAttempts{
            word-break: break-all;
        }

        .hangmanInput{
            background: white;
            color: black;
            width: 75%;
            border-radius: 5px;
            border: 2px solid black;
            padding: 8px;
            font-size: 20px;
        }

        button.hangmanButton{
            width: 96px;
            background: rgb(214, 49, 49);
            color: white;
            border-radius: 5px;
            padding: 8px;
            border: 2px solid black;
            font-size: 20px;
            margin: 0px 5px;
            display: inline;
        }

        .hangmanButton:hover{
            background: rgb(128, 29, 29);
            cursor: pointer;
        }

        .hangmanButton:active{
            background: rgb(56, 13, 13);
        }
        
        .hangmanErrorText, .hangmanDifficultyErrorText{
            color: red;
            font-size: 15px;
        }


        .hangmanHidden{
            display: none !important;
        }
        .hangmanSoftHidden{
            content-visibility: hidden !important;
        }

    </style>
    <div class="hangmanBox hangmanItem" style="background-color: white;">
        <form class="hangmanDifficultyForm hangmanItem">
            <label class="hangmanText hangmanItem">Please select the desired word length to start:</label>
            <div class="hangmanItem" style="margin: 10px;">
                <button type="submit" onsubmit="event.preventDefault();" class="hangmanButton hangmanItem">Short</button>
                <button type="submit" onsubmit="event.preventDefault();" class="hangmanButton hangmanItem">Medium</button>
                <button type="submit" onsubmit="event.preventDefault();" class="hangmanButton hangmanItem">Long</button>
                <button type="submit" onsubmit="event.preventDefault();" class="hangmanButton hangmanItem">Any</button>
            </div>
            <p class="hangmanDifficultyErrorText hangmanItem hangmanSoftHidden">Errortext</p>
        </form>
        <form class="hangmanMainForm hangmanHidden hangmanItem">
            <label class="hangmanMainText hangmanText hangmanItem">Type a letter to guess.</label>
            <p class="hangmanProgressTracker hangmanText hangmanItem">Current progress: <span class="hangmanItem"></span></p>
            <input class="hangmanMainInput hangmanInput hangmanItem" type="text" maxLength="1" placeholder="Type your guess here">
            <button type="submit" onsubmit="event.preventDefault();" class="hangmanButton hangmanItem">Submit</button>
            <p class="hangmanErrorText hangmanItem hangmanSoftHidden">Errortext</p>
            <p class="hangmanFailedAttempts hangmanText hangmanItem">Previous guesses: <span class="hangmanItem"></span></p>
        </form>
        <div class="hangmanItem hangmanVictoryContainer hangmanHidden">
            <h1 class="hangmanHeader hangmanItem">Congratulations!</h1>
            <p class="hangmanItem hangmanVictoryText hangmanText">You guessed the word <span class="hangmanMainwordDisplay hangmanItem"></span> after <span class="hangmanAttemptDisplay hangmanItem"></span> attempts.</p>
        </div>
        <div class="hangmanItem hangmanLossContainer hangmanHidden">
            <h1 class="hangmanHeader hangmanItem">Game over!</h1>
            <p class="hangmanItem hangmanText">You failed to guess the word after <span class="hangmanItem hangmanLossAttemptDisplay"></span> attempts. Refresh to get the website back.</p>
        </div>
    </div>
</div>`;
    
    document.body.insertAdjacentHTML('afterbegin', html);
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    document.querySelector('.hangmanDifficultyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let difficulty = e.submitter.innerText.toLowerCase();
        startup(difficulty);
    })

    document.querySelector('.hangmanMainForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let letter = document.querySelector('.hangmanMainInput').value.toLowerCase();
        document.querySelector('.hangmanMainInput').value = '';
        gameloop(letter);
    })

    document.querySelector('div.hangmanBox').addEventListener('animationend', (e) => {
        if(e.animationName == 'slide-up'){
            document.querySelector('div.hangmanOverlay').remove();
            document.body.style.removeProperty('overflow');
        }
    })
}

//The startup function of the game
function startup (difficulty){

    mainWord = wordChooser(difficulty);
    
    if(mainWord == null || mainWord == "" || mainWord == undefined){
        console.error(`No word recieved from wordChooser, returned word was ${mainWord}.`);
        return;
    }

    let uniqueLettersRaw = [];
    let alphabetLength = 26; //a-z alphabet, change this if support is added for more letters/languages
    for(i = 0; i < mainWord.length; i++){
        if(!uniqueLettersRaw.includes(mainWord[i])){
            uniqueLettersRaw.push(mainWord[i])
        }
    }
    let uniqueLetters = uniqueLettersRaw.filter((letter) => letter != ' ');
    let allElements = document.querySelectorAll('*:not(.hangmanItem):not(body):not(head):not(html)');
    wrongAttemptCount = alphabetLength - uniqueLetters.length;
    
    //console.log(`The chosen word is ${mainWord}`); //uncomment to display the chosen word in the console for debugging purposes
    
    guessingWord = wordConverter(mainWord);
    
    document.querySelector('.hangmanDifficultyForm').classList.add('hangmanHidden');
    document.querySelector('.hangmanMainForm').classList.remove('hangmanHidden');
    document.querySelector('.hangmanProgressTracker span').innerText = guessingWord;
}

function gameloop (letter){

    document.querySelector('p.hangmanErrorText').classList.add('hangmanSoftHidden');
    
    if(inputRegex.test(letter)){

        if(guessedLetters.includes(letter)){
            document.querySelector('p.hangmanErrorText').innerText = 'Letter already guessed';
            document.querySelector('p.hangmanErrorText').classList.remove('hangmanSoftHidden');
        }else{
            let occurences = [];
            guessedLetters.push(letter);
            document.querySelector('.hangmanFailedAttempts span').innerText = guessedLetters;
            
            for(let i = 0; i < guessingWord.length; i++){
                if(mainWord[i] === letter) occurences.push(i);
            }
            
            if(occurences.length > 0){
                occurences.forEach((occurence) => {
                    guessingWord = guessingWord.substring(0, occurence) + letter + guessingWord.substring(occurence + letter.length);
                })
                let progressTracker = document.querySelector('.hangmanProgressTracker span');
                progressTracker.innerText = guessingWord;
                colorFlash(progressTracker, 'limegreen', 'transparent');
            }else{
                removeElement();
                let box = document.querySelector('.hangmanBox');
                colorFlash(box, 'red', 'white');
                perfectGame = false;
            }
        }
        
    }else{
        document.querySelector('p.hangmanErrorText').innerText = 'Invalid letter, try again';
        document.querySelector('p.hangmanErrorText').classList.remove('hangmanSoftHidden');
    }

    if(mainWord == guessingWord){
        if(perfectGame){
            document.querySelector('.hangmanVictoryContainer h1').innerText = 'Perfect game!';
        }
        document.querySelector('.hangmanMainForm').classList.add('hangmanHidden');
        document.querySelector('.hangmanVictoryContainer').classList.remove('hangmanHidden');
        document.querySelector('.hangmanMainwordDisplay').innerText = mainWord;
        document.querySelector('.hangmanAttemptDisplay').innerText = guessedLetters.length;

        setTimeout(() => {
            document.querySelector('div.hangmanBox').style.animation = '0.8s slide-up';
            document.querySelector('div.hangmanOverlay').style.animation = '0.8s fade-out ';
        }, 5000);
    }
}

//generate the HTML on execution
generateHTML();