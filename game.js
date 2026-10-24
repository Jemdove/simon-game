// ----- Game data -----

// The four button colours; these match the button ids in the HTML
var buttonColours = ["red", "blue", "green", "yellow"];

// The sequence the game generates (grows by one colour each level)
var gamePattern = [];

// The sequence the player has clicked so far in the current level
var userClickedPattern = [];

// ----- Game state -----

// Tracks whether the game has begun, so extra key presses are ignored
var started = false;

// Current level number
var level = 0;

// ----- Start the game -----

// Detect the first key press anywhere on the page to start the game
$(document).keypress(function() {
  if (!started) {
    // Show the level in the heading (note: nextSequence() increments it to 1)
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// ----- Handle player clicks -----

// Runs whenever the player clicks one of the coloured buttons
$(".btn").click(function() {

  // The button's id is its colour (e.g. "red")
  var userChosenColour = $(this).attr("id");

  // Record the player's choice
  userClickedPattern.push(userChosenColour);

  // Give feedback: play the button's sound and flash it
  playSound(userChosenColour);
  animatePress(userChosenColour);

  // Check the latest click against the game pattern
  // (length - 1 is the index of the click just made)
  checkAnswer(userClickedPattern.length - 1);
});

// ----- Check the player's answer -----

// Compares the player's most recent click with the matching step of the pattern
function checkAnswer(currentLevel) {

  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

    // Correct click. If the player has now entered the whole sequence,
    // wait 1 second and move on to the next level
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }

  } else {

    // Wrong click: play the "wrong" sound and flash the screen red
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    // Remove the red flash after 200 milliseconds
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);

    // Reset everything so a key press can start a new game
    startOver();
  }
}

// ----- Generate the next step -----

// Moves to the next level and adds a new random colour to the pattern
function nextSequence() {

  // Clear the player's clicks ready for the new level
  userClickedPattern = [];

  // Increase the level and update the heading
  level++;
  $("#level-title").text("Level " + level);

  // Pick a random colour (random integer from 0 to 3)
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];

  // Add it to the end of the game pattern
  gamePattern.push(randomChosenColour);

  // Flash the chosen button so the player sees it, and play its sound
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

// ----- Helper functions -----

// Briefly adds the "pressed" CSS class to a button to show it was clicked
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");

  // Remove the class after 100 milliseconds
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// Plays the sound file that matches the given name (a colour, or "wrong")
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// Resets the game state after a wrong answer
function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}