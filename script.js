const textElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeLeftElement = document.getElementById("time-left");
const timerElement = document.getElementById("timer");

let startTime, timer, timeLimit = 30; // Time limit in seconds

// Fetch random text from the Lorem Ipsum API
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

// Start the test
startButton.addEventListener("click", () => {
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus();
    resultElement.textContent = "";
    timeLeftElement.textContent = timeLimit;
    startTimer();
    fetchText(); // Fetch new text when starting the test
});

// Start the countdown timer
function startTimer() {
    timer = setInterval(() => {
        timeLimit--;
        timeLeftElement.textContent = timeLimit;
        
        if (timeLimit <= 0) {
            clearInterval(timer);
            endTest(false); // Time's up
        }
    }, 1000);
}

// End the test
function endTest(success) {
    userInput.disabled = true;
    clearInterval(timer);
    
    if (success) {
        resultElement.textContent = "Well done! You've completed the test.";
    } else {
        resultElement.textContent = "Time's up! Please try again.";
    }
}

// Monitor user input
userInput.addEventListener("input", () => {
    const typedText = userInput.value.trim();

    // Check if the typed text is correct
    if (typedText === textElement.textContent.trim()) {
        endTest(true); // User completed typing correctly
    }
});
