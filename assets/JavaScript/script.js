$(document).ready(function() {
});

// ------------SETTING VARIABLES------------ 
var quizBody = $('#quiz')[0];
var resultsEl = $('#result')[0];
var finalScoreEl = $('#finalScore')[0];
var gameoverDiv = $('#gameover')[0];
var questionsEl = $('#questions')[0];
var quizTimer = $('#timer')[0];
var startQuizButton = $('#startbtn')[0];
var viewScoreBtn = $('#startPageHighscore')[0];
var startQuizDiv = $('#startpage')[0];
var highscoreContainer = $('#highscoreContainer')[0];
var highscoreDiv = $('#high-scorePage')[0];
var highscoreInputName = $('#initials')[0];
var highscoreDisplayName = $('#highscore-initials')[0];
var endGameBtns = $('#endGameBtns')[0];
var submitScoreBtn = $('#submitScore')[0];
var clearHighScore = $('#clearHighscore')[0];
var replay = $('playAgain')[0];
var highscoreDisplayScore = $('#highscore-score')[0];
var buttonA = $('#a')[0];
var buttonB = $('#b')[0];
var buttonC = $('#c')[0];
var buttonD = $('#d')[0];
var finalQuestionIndex = quizQuestions.length;
var currentQuestionIndex = 0;
var timeLeft = 76;
var deduction = 10;
var timerInterval;
var score = 0;
var correct;

//FUNCTION TO SHOW HIGH SCORES------------------------------------
$(viewScoreBtn).click(function showHighscore(){
// function showHighscore(){
    $(startQuizDiv).hide();
    $(gameoverDiv).hide();
    $(highscoreContainer).css("display", "flex");
    $(highscoreDiv).show();
    $(endGameBtns).css("display", "flex");

    generateHighscores();
});

//----ON CLICK OF START BUTTON HIDES THE START AND GAME OVER DIVS, ALSO STARTS TIMER--------
$(startQuizButton).click(function startQuiz(){
    $(gameoverDiv).hide();
    $(startQuizDiv).hide();
    generateQuizQuestion();

    //-----TIMER-------------
    timerInterval = setInterval(function() {
        timeLeft--;
        quizTimer.textContent = "Time left: " + timeLeft;
    
        if(timeLeft === 0 || timeLeft < 0) {
          clearInterval(timerInterval);
          showScore();
        }
      }, 1000);
    $(quizBody).show();
    
});

//--------HERE WE CYCLE THROUGH QUESTIONS STORED IN QUESTIONS.JS------------
function generateQuizQuestion(){
    $(gameoverDiv).hide();
    if (currentQuestionIndex === finalQuestionIndex){
        return showScore();
    } 
    var currentQuestion = quizQuestions[currentQuestionIndex];
    questionsEl.innerHTML = "<p>" + currentQuestion.question + "</p>";
    buttonA.innerHTML = currentQuestion.choiceA;
    buttonB.innerHTML = currentQuestion.choiceB;
    buttonC.innerHTML = currentQuestion.choiceC;
    buttonD.innerHTML = currentQuestion.choiceD;
};

//-----HERE WE CHECK OUR ANSWERS AND GENERATE ALERTS FOR RIGHT AND WRONG ANSWERS-----
function checkAnswer(answer){
    correct = quizQuestions[currentQuestionIndex].correctAnswer;
    if (answer === correct && currentQuestionIndex !== finalQuestionIndex){
        score++;
        alert("Thats Right!");
        currentQuestionIndex++;
        generateQuizQuestion();
    }else if (answer !== correct && currentQuestionIndex !== finalQuestionIndex){
        alert("WRONG!");
        //-----DEDUCT TIME FOR WRONG ANSWERS------
        timeLeft = timeLeft - deduction;
        currentQuestionIndex++;
        generateQuizQuestion();
    }else{
        showScore();
    }
}

//--SHOW FINAL SCORE
function showScore(){
    $(quizBody).hide();
    $(gameoverDiv).css("display", "flex");
    clearInterval(timerInterval);
    highscoreInputName.value = "";
    finalScoreEl.innerHTML = "You got " + score + " of " + quizQuestions.length + " right!";
}

//USING JSON TO SAVE OUR SCORE IN LOCAL STORAGE AS WELL AS GET ANY PREVIOUSLY SAVED SCORES----
$(submitScoreBtn).click (function highscore(){
    if(highscoreInputName.value === "") {
        alert("Please enter your initials!");
        return false;
    }else{
        var savedHighscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
        var currentUser = highscoreInputName.value.trim();
        var currentHighscore = {
            name : currentUser,
            score : score
        };
    
        $(gameoverDiv).hide();
        $(highscoreContainer).css("display", "flex");
        $(highscoreDiv).show();
        $(endGameBtns).css("display", "flex");
        
        savedHighscores.push(currentHighscore);
        localStorage.setItem("savedHighscores", JSON.stringify(savedHighscores));
        generateHighscores();

    }
    
});

// CREATE OR REMOVE LINES FROM THE SCORE DISPLAY
function generateHighscores(){
    highscoreDisplayName.innerHTML = "";
    highscoreDisplayScore.innerHTML = "";
    var highscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
    for (i=0; i<highscores.length; i++){
        var newNameSpan = document.createElement("li");
        var newScoreSpan = document.createElement("li");
        newNameSpan.textContent = highscores[i].name;
        newScoreSpan.textContent = highscores[i].score;
        $(highscoreDisplayName).append(newNameSpan);
        $(highscoreDisplayScore).append(newScoreSpan);
    }
}


// CLEAR THE SCORES
$(clearHighScore).click (function clearScore(){
    window.localStorage.clear();
    $(highscoreDisplayName).text("");
    $(highscoreDisplayScore).text("");
});

//CLICK PLAY AGAIN TAKES YOU TO START PAGE
function replayQuiz(){
    $(highscoreContainer).hide();
    $(gameoverDiv).hide();
    $(startQuizDiv).css("display", "flex");
    timeLeft = 76;
    score = 0;
    currentQuestionIndex = 0;
}

