/*
Author: Eoghan Clancy - 20365423
Date: 04/03/23

Start button begins game
Follow prompts at top of screen
Player can only enter sequence when "Your Turn" is displayed
Player's turn ends once number of buttons they clicked == number of buttons Simon flashed,
or 5 seconds after they last pressed a coloured button,
or 5 seconds after their turn began if they dont press any coloured buttons
Once the players turn ends the next round will begin in 3 seconds (ie 3 seconds until Simon starts flashing next sequence) (when "get ready" is shown)
Interval between flashes decreases by 400ms after the 5th, 9th	
and	13th rounds
*/
var circleIdArray = ['greenCircle','redCircle','blueCircle','yellowCircle'];
var sequenceList = [];
var playerSequenceList= [];
var cScore = 0;
var hScore = 0;
const lights = document.getElementsByClassName('lights'); //lights refers to the colored buttons

let checkSeqTimeout; //used to time the step described on line 8

let flashTime = 500; //how long a colored button flashes for
let delayBetweenFlashes = flashTime + 1000; //the number is the interval bewteen end of and start of next flash


function startGame(){
    document.getElementById("startBTN").disabled = true; //prevent multiple games being started at once
    On();
    //wait 3 secs then begin round 1
    setTimeout(nextRound, 3000);
}

function nextRound(){
    prepNextRound();
    CPUplayNextRound();
    setTimeout(function() {
        playerTurn();
        checkSeqTimeout = setTimeout(checkSeqsEqualiy,5000); //This is reset every time player clicks a light
    }, ((flashTime + (cScore-1)*delayBetweenFlashes)));//time here = how long CPUplayNextRound() takes to run
    
}


function On() {  
    document.getElementById("prompt").innerHTML = "Game Beginning";
    document.getElementById("dbf").innerHTML = "Interval Between Signals = " + (delayBetweenFlashes-500) + "ms";
    document.getElementById("on_off").style.backgroundColor = "green"
    sequenceList = [];
    playerSequenceList = [];
    document.getElementById("cScoreLBL").innerHTML = "00";
}

function prepNextRound(){ //speeds up intervals if needed, increases the current round (cScore) and adds a new random coloured button to be flashed
    if(cScore == 6 || cScore == 10 || cScore == 14){
        delayBetweenFlashes -= 400;
    }
    document.getElementById("dbf").innerHTML = "Interval Between Signals = " + (delayBetweenFlashes-500) + "ms";

    cScore++;
    sequenceList.push(getRandomCircleId());
}

function CPUplayNextRound(){ //Simon flashes the next colored button sequence
    document.getElementById("prompt").innerHTML = "Flashing Sequence";
    flashSeqList();
}

function playerTurn(){
    document.getElementById("prompt").innerHTML = "Your Turn";
    playerSequenceList = [];
    enableLightClickability();//make circles clickable
}

function endGame(){ //ends game in manner required and resets gamestate for next game
    document.getElementById("prompt").innerHTML = "Game Over";
    document.getElementById("on_off").style.backgroundColor = "red";

    setTimeout(() => {
        flashAll();
        setTimeout(() => {
            flashAll();
            setTimeout(() => {
            flashAll();
            setTimeout(() => {
                flashAll();
                setTimeout(() => {
                    flashAll();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);

    sequenceList = [];
    playerSequenceList = [];
    cScore = 0;
    delayBetweenFlashes = 1500;
    document.getElementById("dbf").innerHTML = "Interval Between Signals = " + (delayBetweenFlashes-500) + "ms";
    document.getElementById("cScoreLBL").innerHTML = "0" + cScore;
    setTimeout(function() { //allow it to be clicked again as its okay to start another game now since the previous one is over
        document.getElementById("startBTN").disabled = false;
    }, 6000);} //6000 = time taken to flash buttons simultaneously x5

function checkSeqsEqualiy() { //compares sequence entered by player vs Simon's sequence
    disableLightClickability();
    document.getElementById("prompt").innerHTML = "Get Ready";
    if(playerSequenceList.length != sequenceList.length){
        endGame();
        return false;
    }
    else{
        for (let index = 0; index < sequenceList.length; index++) {
            if(playerSequenceList[index] != sequenceList[index]){
                endGame();
                return false;
            }
        }
        updateScore();
        setTimeout(nextRound,3000);
    }
}

function updateScore(){
    document.getElementById("cScoreLBL").innerHTML = "0"+cScore;
    if(cScore > hScore){
        hScore = cScore;
        document.getElementById("hScoreLBL").innerHTML = "0"+hScore;
    }
}


function circleClicked(circleId){ //for when user clicks circle (handler)
    flashCircle(circleId);
    playerSequenceList.push(circleId);
    clearTimeout(checkSeqTimeout);
    checkSeqTimeout = setTimeout(checkSeqsEqualiy, 5000);
    if(playerSequenceList.length == sequenceList.length){
        clearTimeout(checkSeqTimeout);
        checkSeqTimeout = setTimeout(checkSeqsEqualiy, 0);
    }
}

function flashAll(){
    flashCircle("greenCircle");
    flashCircle("redCircle");
    flashCircle("yellowCircle");
    flashCircle("blueCircle");
}

function flashCircle(circleId) {
    var circleElem = document.getElementById(circleId);
    var originalColor = circleId.substring(0,circleId.indexOf('C'))
    circleElem.style.backgroundColor = "white";
    setTimeout(function() {
        circleElem.style.backgroundColor = originalColor;
    }, flashTime); // Flash for 0.5 seconds 
}

function flashSeqList() {
    let delay = 0;
    for (let index = 0; index < sequenceList.length; index++) {
        setTimeout(function() {
            flashCircle(sequenceList[index]);
        }, delay);
        delay += delayBetweenFlashes; //time light takes to flash = time between end of last flash and start of next flash
    } 
}

function getRandomCircleId(){
    return circleIdArray[Math.floor(Math.random() * circleIdArray.length)];
}

function disableLightClickability(){
    for (let i = 0; i < lights.length; i++) {
        lights[i].disabled = true;
    }
}
function enableLightClickability(){
    for (let i = 0; i < lights.length; i++) {
        lights[i].disabled = false;
    }
}
