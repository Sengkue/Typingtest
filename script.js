const textElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeLeftElement = document.getElementById("time-left");
const timerElement = document.getElementById("timer");
const speedElement = document.getElementById("speed-value");

let timer, timeLimit = 0, startTime;

function fetchText() {
    fetch('https://loripsum.net/api/1/short')
        .then(response => response.text())
        .then(data => {
            textElement.textContent = data;
        })
        .catch(error => {
            console.error('Error fetching text:', error);
            textElement.textContent = "Failed to load text. Please try again.";
        });
}

function startTimer() {
    let timeRemaining = timeLimit * 60; // Convert minutes to seconds
    timeLeftElement.textContent = timeLimit < 10 ? `0${timeLimit}` : timeLimit;

    timer = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timeLeftElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            endTest(false); // Time's up
        }
    }, 1000);
}

function endTest(success) {
    userInput.disabled = true;
    clearInterval(timer);
    
    if (success) {
        resultElement.textContent = "Well done! You've completed the test.";
    } else {
        resultElement.textContent = "Time's up! Please try again.";
    }
}

function calculateSpeed() {
    const typedText = userInput.value.trim();
    const wordsTyped = typedText.split(" ").filter(word => word).length;
    const timeElapsed = (new Date().getTime() - startTime) / 1000; // in seconds
    const minutesElapsed = timeElapsed / 60;
    const speed = Math.round(wordsTyped / minutesElapsed);
    speedElement.textContent = speed || 0; // Avoid division by zero
}

startButton.addEventListener("click", () => {
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus();
    resultElement.textContent = "";
    fetchText(); // Fetch new text when starting the test
    calculateSpeed(); // Reset speed
});

userInput.addEventListener("input", () => {
    const typedText = userInput.value.trim();

    // Check if the typed text is correct
    if (typedText === textElement.textContent.trim()) {
        endTest(true); // User completed typing correctly
    }

    calculateSpeed(); // Update speed in real-time
});

// Time setting buttons
document.getElementById("set-time-3").addEventListener("click", () => {
    timeLimit = 3;
    startTimer();
});
document.getElementById("set-time-5").addEventListener("click", () => {
    timeLimit = 5;
    startTimer();
});
document.getElementById("set-time-10").addEventListener("click", () => {
    timeLimit = 10;
    startTimer();
});
document.getElementById("set-time-15").addEventListener("click", () => {
    timeLimit = 15;
    startTimer();
});
