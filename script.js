const textElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeElapsedElement = document.getElementById("time-elapsed");
const speedElement = document.getElementById("speed-value");

let startTime, timer;

function startTest() {
    const originalText = textElement.value.trim();
    if (originalText === "") {
        alert("Please paste a text or story in the box above.");
        return;
    }
    
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus();
    resultElement.textContent = "";
    timeElapsedElement.textContent = "0";
    speedElement.textContent = "0";
    
    startTime = new Date().getTime();
    timer = setInterval(updateTime, 1000);
}

function updateTime() {
    const elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    timeElapsedElement.textContent = elapsed;
    calculateSpeed(elapsed);
}

function calculateSpeed(elapsed) {
    const typedText = userInput.value.trim();
    const wordCount = typedText.split(" ").filter(word => word).length;
    const wpm = Math.round((wordCount / elapsed) * 60) || 0; // Avoid division by zero
    speedElement.textContent = wpm;
}

function endTest() {
    clearInterval(timer);
    userInput.disabled = true;

    const typedText = userInput.value;
    const originalText = textElement.value.trim();
    let errors = 0;

    // Count incorrect characters
    for (let i = 0; i < Math.max(typedText.length, originalText.length); i++) {
        if (typedText[i] !== originalText[i]) {
            errors++;
        }
    }

    resultElement.textContent = `Errors: ${errors}`;
}

// Store text in local storage
function storeText() {
    const textToStore = textElement.value;
    localStorage.setItem("typingText", textToStore);
}

// Load text from local storage if available
function loadText() {
    const savedText = localStorage.getItem("typingText");
    if (savedText) {
        textElement.value = savedText;
    }
}

startButton.addEventListener("click", startTest);
userInput.addEventListener("input", () => {
    if (userInput.value === textElement.value.trim()) {
        endTest();
    }
});
userInput.addEventListener("blur", endTest);
textElement.addEventListener("input", storeText);

// Load any saved text when the page loads
window.onload = loadText;
