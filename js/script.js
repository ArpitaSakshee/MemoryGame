// Boards size (even) 2*3, 3*4, 4*4, 4*5, 5*6
// Level
//      Easy: different looking emoji and flip slowly (1200)
//      Hard: similar looking emoji  and flip fast (800)
// Copied emoji symbols from https://www.w3schools.com/charsets/ref_emoji.asp
// We want to support three board  2*3, 3*4, 4*4, 4*5, 5*6 hence minimum 15 emoji in both the array is required.

// Easy: Symbols looks different hence easy to remember
var easyEmojiSymbols = ["⌛", "⏰", "⛄", "⛵", "🌲",
                        "🍁", "🍄", "🍉", "🍒", "🍩",
                        "🎁", "🎲", "🏀", "🐝", "🐬"];
var easyTimeOut = 1200;

// Hard: Symbols looks similar hence difficult to remember
var hardEmojiSymbols = ["🏚", "🏠", "🏘", "🏡", "💒",
                        "🏈", "🏉", "⚽", "⚾", "🏀",
                        "🚐", "🚒", "🚚", "🚗", "🚑"];
var hardTimeOut = 800;

// Default game level and timeout
var gameLevel = "easy";
var cardDisplayTimeout = easyTimeOut;

// Global variable
var uniqueEmojiGenerated;
var revealedCardSet;

// Flag to control console log, enable for debugging
var enableLog = false; // true;
 
//document ready
$(document).ready(setupMemoryGame);

// Function to setupMemoryGame
function setupMemoryGame() {
    Log("setupMemoryGame");
    $("#restart-button").click(newGame);
    $("#2_3").click(function() {
        startGame(2, 3);
      });
    $("#3_4").click(function() {
        startGame(3, 4);
      });
    $("#4_4").click(function() {
        startGame(4, 4);
      });
    $("#4_5").click(function() {
        startGame(4, 5);
      });
    $("#5_6").click(function() {
        startGame(5, 6);
      });
}

// Function to log message on console
// Params:
//      msg: msg to console log
function Log(msg){
    if (enableLog === true) {
        console.log(msg);
    }
}

// Function to shuffle an array
// Params:
//     array: Array which needs to be shuffled.
// Returns: Shuffled array
function shuffle(array) {
    Log("shuffle array " + array);
    for (var i = array.length - 1; i > 0; i--) {
        var index = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[index];
        array[index] = temp;
    }
    Log("Array after shuffle " + array);
    return array;
}

// Function to return emoji array
// Params:
//     row : Memory board row count
//     col : Memory board col count
function getEmojiArray(row, col) {
    uniqueEmojiGenerated = (row * col) / 2;
    // Get difficulty (i.e. game level) and based on game level use the correct
    // emojiSymbols and cardDisplayTimeout
    gameLevel = $("#game-level" ).val();
    Log("Game level "+ gameLevel);
    var emojiArray = [];
    for(var i = 0; i < uniqueEmojiGenerated; i++) {
        if (gameLevel === "easy") {
            cardDisplayTimeout = easyTimeOut;
            // Each symbols needs to be pushed twice
            emojiArray.push(easyEmojiSymbols[i]);
            emojiArray.push(easyEmojiSymbols[i]);
        } else {
            cardDisplayTimeout = hardTimeOut;
            // Each symbols needs to be pushed twice
            emojiArray.push(hardEmojiSymbols[i]);
            emojiArray.push(hardEmojiSymbols[i]);
        }
    }
    return shuffle(emojiArray);
}

var hour = 0;
var minute = 0;
var second = 0;
var timeElapsed;
// Function to update Time Elapsed
function updateTimer(){
    second++;
    Log("updateTimer called")
    if (second == 60) {
        second = 0;
        minute++;
    }
    if (minute == 60) {
        minute = 0;
        hour++;
    }
    var secondStr = second >= 10 ? second : "0" + second;
    var minuteStr = minute >= 10 ? minute : "0" + minute;
    var hourStr = hour >= 10 ? hour : "0" + hour;
    timeElapsed = "Time Elapsed: " + hourStr + ":" + minuteStr + ":" + secondStr;
    Log(timeElapsed);
    $("#timer").html(timeElapsed);
}

var movesPlayed = 0;
// Function to update movesPlayed
function updateMoves() {
    Log("updateMoves called");
    movesPlayed += 1;
    $("#moves").html("Moves: " + movesPlayed);
}

var missedPlayed = 0;
// Function to update missedPlayed
function updateMissed(i) {
    Log("updateMissed called index " + i);
    // If the card is revealed only then update missedPlayed
    if(revealedCardSet.has(i)){
        missedPlayed += 1;
        $("#missed").html("Missed: "+ missedPlayed);
    } else {
        revealedCardSet.add(i);
    }
}

var elapsedTimer;
// Function to start stats
function startStats(){
    Log("startStats called");

    $("#timer").show();
    $("#timer").html("Time Elapsed: 00:00:00");
    elapsedTimer = setInterval(updateTimer, 1000);

    $("#moves").show();
    $("#moves").html("Moves: 0");

    $("#missed").show();
    $("#missed").html("Missed: 0");
}

// Function to reset stats
function resetStats() {
    Log("resetStats called");

    $("#timer").hide();
    hour = 0;
    minute = 0;
    second = 0;
    clearInterval(elapsedTimer);
    $("#timer").html("Time Elapsed: 00:00:00");

    $("#moves").hide();
    movesPlayed=0;
    $("#moves").html("Moves: 0");

    $("#missed").hide();
    missedPlayed = 0;
    $("#missed").html("Missed: 0");
}

var isRunning = false;
// Function to reset Board
function resetBoard() {
    Log("resetBoard called");
    $("table").html("");
    revealedCardSet = new Set();
    $("footer").show();
    isRunning = true;
}

var isRunning = false;
// Function to create new Game
function newGame() {
    Log("newGame called");

    $("#menu").fadeIn(100);
    resetBoard();
    $("#restart").hide();
    resetStats();

    $("#restart-button").html("New Game");

    $("#game-msg").html("&nbsp;");
    $("footer").hide();
}

// Function to end Game
function endGame(){
    Log("endGame called");
    isRunning = false;
    $("#restart-button").html("Restart");

    $("#game-msg").html("Congratulations! You won");
    clearInterval(elapsedTimer);
}

// Function to start game
// Params:
//     row : Memory board row count
//     col : Memory board col count
function startGame(row, col){
    Log("startGame called with row=" + row + " col=" + col);
    resetBoard();
    $("#restart").show();
    var emojiArray = getEmojiArray(row, col);
    // Create board dynamically
    var board = "";
    var counter=1;
    for (var i = 0; i < row; i++) {
        board+="<tr>";
        for (var j = 0; j < col; j++) {
            board += "<td id='b"+counter+"' >";
                // A tile can contains both back and front.
                board += "<div class='card'>";
                    // front class contains number and is visible by default
                    board += "<div class='front'>"+counter+"</div>";
                    // back class contains emoji and hidden by default
                    board += "<div class='back'>"+ emojiArray[counter-1]+"</div>";
                board += "</div>";
            board += "</td>";
            counter++;
        }
        board+="</tr>";
    }
    // Log(board);
    $("table").append(board);
    Log("Successfully created new board");
    // Register card handler for each card.
    counter = 1;
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            registerCardHandler(counter);
            counter++;
        }
    }
    // hide header
    $("#menu").fadeOut(100);
    startStats();
}

// Function to register click handler for card
// Params:
//     i: card index
function registerCardHandler(i) {
    Log("registerCardHandler called for "+ i);
    $("#b"+i).click(function() {
        Log("registerCardHandler click invoked"+ i);
        processCard(i);
    });
}

// Function to remove click handler for card
// Params:
//     i: First card index
//     j: Second card index
function removeCardHandler(i,j) {
    Log("removeCardHandler called for " + i + ","+ j);
    $("#b"+i).unbind("click");
    $("#b"+j).unbind("click");
}

// Function to show card
// Params:
//     i: card index to show
function showCard(i) {
    Log("Show card "+ i);
    // Flip card to 180 degree to reveal
    $("#b"+i + " .card").css("transform", "rotateY(180deg)");
}

// Function to hide card
// Params:
//     i: card index to hide
function hideCard(i) {
    Log("Hide card "+ i);
    $("#b"+i + " .card").css("transform", "rotateY(0deg)");
}

// Function to hide pairs
// Params:
//     i: First card index to hide
//     j: Second card index to hide
function hidePairs(i,j) {
    Log("Hide pairs "+ i + ","+ j);
    setTimeout(function() {
        hideCard(i);
        hideCard(j);
    }, cardDisplayTimeout);
}

// Function to get card emoji
// Params:
//     i: card index to hide
// Returns card emoji
function GetCardEmoji(i) {
    Log("Get Emojii for "+ i);
    return  $("#b"+ i + " .card .back").text();
}

var processing = false;
// Function to process card
// Params:
//     index: card index
function processCard(index) {
    Log("processCard for index "+ index);
    // process one at a time
    if ((processing === false) && (isRunning === true)) {
        processing = true;
        processingCard(index);
        processing = false;
    }
}

// Initialize prevIndex negative to make sure its not present on the board.
var prevIndex = -1;
var firstMove = true;
// Function to process actual login on carcard
// Params:
//     curIndex: card index current
function processingCard(curIndex) {
    Log("processingCard called with index "+ curIndex);
    if (firstMove === true) {
        firstMove = false;
        Log("This is first move");
        showCard(curIndex);
        // Card revealed invoke updateMissed
        updateMissed(curIndex);
        prevIndex = curIndex;
    } else {
        Log("This is second move");
        // We can't select same card for second move
        if (prevIndex != curIndex) {
            firstMove = true;
            // Update Moves since we complete both first and second move
            updateMoves();
            if (GetCardEmoji(curIndex) == GetCardEmoji(prevIndex)) {
                showCard(curIndex);
                removeCardHandler(curIndex, prevIndex)
                uniqueEmojiGenerated--;
            } else {
                showCard(curIndex);
                 // Card revealed invoke updateMissed
                updateMissed(curIndex);
                // hide pairs after some time based on difficulty.
                hidePairs(curIndex, prevIndex);
            }
            // if we have consumed all unique generated emoji game end
            if (uniqueEmojiGenerated <= 0){
                endGame();
            }
            prevIndex = curIndex;
        }
    }
}