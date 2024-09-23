const textElement = document.getElementById("text-to-type");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");

let startTime, endTime;

// Fetch random text from the Lorem Ipsum API
function fetchText() {
    fetch('https://loripsum.net/api/1/short')
        .then(response => response.text())
        .then(data => {
            textElement.innerHTML = data;
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
    startTime = new Date().getTime();
    fetchText(); // Fetch new text when starting the test
});

// Monitor user input
userInput.addEventListener("input", () => {
    const typedText = userInput.value.trim();

    // Compare typed text with the fetched text
    if (typedText === textElement.textContent.trim()) {
        endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000; // in seconds
        const wordsPerMinute = (textElement.textContent.split(" ").length / timeTaken) * 60;
        resultElement.textContent = `Well done! Time taken: ${timeTaken} seconds. WPM: ${Math.round(wordsPerMinute)}`;
        userInput.disabled = true;
    }
});
