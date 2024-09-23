const textElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeLeftElement = document.getElementById("time-left");

let timer;
let timeLeft = 60; // 60 seconds
let startTime, endTime;

// Fetch random text from the Lorem Ipsum API
function fetchText() {
    fetch('https://loripsum.net/api/1/short')
        .then(response => response.text())
        .then(data => {
            textElement.textContent = data.trim();
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
    timeLeft = 60;
    timeLeftElement.textContent = timeLeft;
    fetchText(); // Fetch new text when starting the test

    // Start the timer
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endTest(false);
        }
    }, 1000);
});

// Monitor user input
userInput.addEventListener("input", () => {
    const typedText = userInput.value;
    const originalText = textElement.textContent;

    // Highlight correct and incorrect input
    let highlightedText = '';
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === originalText[i]) {
            highlightedText += `<span class="correct">${typedText[i]}</span>`;
        } else {
            highlightedText += `<span class="incorrect">${typedText[i]}</span>`;
        }
    }
    highlightedText += originalText.slice(typedText.length); // Add remaining original text
    textElement.innerHTML = highlightedText;

    // Check if the text is completely typed correctly
    if (typedText === originalText) {
        endTest(true);
    }
});

// End test function
function endTest(success) {
    clearInterval(timer);
    userInput.disabled = true;
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    const wordsPerMinute = (textElement.textContent.split(" ").length / timeTaken) * 60;

    if (success) {
        resultElement.textContent = `Well done! Time taken: ${timeTaken.toFixed(2)} seconds. WPM: ${Math.round(wordsPerMinute)}`;
    } else {
        resultElement.textContent = "Time's up! Please try again.";
    }
}
