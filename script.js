const textToType = "The quick brown fox jumps over the lazy dog.";
const textElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");

let startTime, endTime;

textElement.textContent = textToType;

startButton.addEventListener("click", () => {
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus();
    resultElement.textContent = "";
    startTime = new Date().getTime();
});

userInput.addEventListener("input", () => {
    const typedText = userInput.value;
    
    if (typedText === textToType) {
        endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000; // in seconds
        const wordsPerMinute = (textToType.split(" ").length / timeTaken) * 60;
        resultElement.textContent = `Well done! Time taken: ${timeTaken} seconds. WPM: ${Math.round(wordsPerMinute)}`;
        userInput.disabled = true;
    }
});
