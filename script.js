const storyTitleInput = document.getElementById("story-title");
const storyInput = document.getElementById("story-input");
const addStoryButton = document.getElementById("add-story-button");
const storySelect = document.getElementById("story-select");
const deleteButton = document.getElementById("delete-button");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeElapsedElement = document.getElementById("time-elapsed");
const speedElement = document.getElementById("speed-value");
const highlightedText = document.getElementById("highlighted-text");
const countdownElement = document.getElementById("countdown");
const errorSound = document.getElementById("error-sound"); // Audio element for error sound

let startTime, timer, countdownTimer;

// Load stories from local storage
function loadStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    stories.forEach(({ title }) => addStoryToSelect(title));
}

// Add story to the select dropdown
function addStoryToSelect(title) {
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    storySelect.appendChild(option);
}

// Add story on button click
addStoryButton.addEventListener("click", () => {
    const title = storyTitleInput.value.trim();
    const story = storyInput.value.trim();
    if (title && story) {
        const stories = JSON.parse(localStorage.getItem("stories")) || [];
        stories.push({ title, text: story });
        localStorage.setItem("stories", JSON.stringify(stories));
        addStoryToSelect(title);
        storyTitleInput.value = ""; // Clear title input
        storyInput.value = ""; // Clear story input
    }
});

// Delete story
deleteButton.addEventListener("click", () => {
    const selectedTitle = storySelect.value;
    if (!selectedTitle) {
        alert("Please select a story to delete.");
        return;
    }

    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const updatedStories = stories.filter(story => story.title !== selectedTitle);
    localStorage.setItem("stories", JSON.stringify(updatedStories));
    
    // Refresh the dropdown
    storySelect.innerHTML = '<option value="">-- Choose a story --</option>';
    updatedStories.forEach(({ title }) => addStoryToSelect(title));
    
    // Clear the displayed story
    highlightedText.innerHTML = ''; // Clear highlighted text
});

// Display the selected story
storySelect.addEventListener("change", () => {
    const selectedTitle = storySelect.value;
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const selectedStory = stories.find(story => story.title === selectedTitle);
    
    if (selectedStory) {
        highlightedText.innerHTML = selectedStory.text; // Show the original story text
        userInput.dataset.selectedStory = selectedStory.text; // Store the selected story text for comparison
        userInput.value = ""; // Clear user input
        resultElement.textContent = "";
        userInput.disabled = true; // Disable input until start
    } else {
        highlightedText.innerHTML = ''; // Clear if no story is selected
    }
});

// Start typing test from the selected story
startButton.addEventListener("click", () => {
    const selectedTitle = storySelect.value;
    if (!selectedTitle) {
        alert("Please select a story from the dropdown.");
        return;
    }

    countdown(3); // Start countdown from 3
});

// Countdown function
function countdown(seconds) {
    let count = seconds;
    countdownElement.textContent = count; // Show initial countdown value
    countdownElement.style.display = "block"; // Show countdown element

    countdownTimer = setInterval(() => {
        count--;
        countdownElement.textContent = count;

        if (count < 0) {
            clearInterval(countdownTimer);
            countdownElement.style.display = "none"; // Hide countdown element
            startTypingTest(); // Start the typing test after countdown
        }
    }, 1000);
}

// Start the typing test
function startTypingTest() {
    userInput.disabled = false;
    userInput.placeholder = "Start typing...";
    resultElement.textContent = "";
    timeElapsedElement.textContent = "0";
    speedElement.textContent = "0";
    
    startTime = new Date().getTime();
    timer = setInterval(updateTime, 1000);
}

// Update time and speed
function updateTime() {
    const elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    timeElapsedElement.textContent = elapsed;
    calculateSpeed(elapsed);
}

// Calculate typing speed
function calculateSpeed(elapsed) {
    const typedText = userInput.value;
    const wpm = Math.round((typedText.split(" ").length / elapsed) * 60) || 0; // Avoid division by zero
    speedElement.textContent = wpm;

    highlightIncorrectCharacters();

    // Check if the user has completed typing the story
    const originalText = userInput.dataset.selectedStory;
    if (typedText === originalText) {
        endTest();
    }
}

// Highlight incorrect characters
function highlightIncorrectCharacters() {
    const typedText = userInput.value;
    const originalText = userInput.dataset.selectedStory;
    const typedWords = typedText.split(" ");
    const originalWords = originalText.split(" ");

    let highlightedWords = "";

    for (let i = 0; i < originalWords.length; i++) {
        const originalWord = originalWords[i];
        const typedWord = typedWords[i] || ""; // Handle undefined typed words

        let highlightedChars = "";
        let hasError = false; // Track if there's an error in the current word

        for (let j = 0; j < originalWord.length; j++) {
            const originalChar = originalWord[j];
            const typedChar = typedWord[j];

            if (typedChar === undefined) {
                highlightedChars += originalChar; // No typing yet
            } else if (typedChar === originalChar) {
                highlightedChars += `<span class="correct">${originalChar}</span>`; // Highlight correct characters
            } else {
                highlightedChars += `<span class="incorrect">${typedChar}</span>`; // Highlight incorrect characters
                hasError = true; // Mark error found
            }
        }

        // Play sound if there was an error
        if (hasError) {
            errorSound.currentTime = 0; // Reset sound
            errorSound.play(); // Play error sound
        }

        highlightedWords += highlightedChars + " "; // Add space after each word
    }

    highlightedText.innerHTML = highlightedWords; // Display highlighted text
}

// End typing test
function endTest() {
    clearInterval(timer);
    userInput.disabled = true;
    resultElement.textContent = "Test completed! Great job!";
}

// Event listeners for user input
userInput.addEventListener("input", highlightIncorrectCharacters);
userInput.addEventListener("keypress", (event) => {
    if (event.key === " ") {
        // Prevent default space behavior if the user tries to move to the next word
        event.preventDefault();
        // Move to the next word by updating the input
        const typedText = userInput.value.trim();
        const words = typedText.split(" ");
        const currentWord = words[words.length - 1];

        // Check if the current word is correct
        const originalText = userInput.dataset.selectedStory.split(" ");
        const correctWord = originalText[words.length - 1];

        if (currentWord === correctWord) {
            // Clear the input for the next word
            userInput.value += " "; // Add a space to move to the next word
        } else {
            // Allow corrections
            userInput.value = typedText; // Keep the current input
        }

        highlightIncorrectCharacters(); // Update highlighting
    }
});

window.onload = loadStories;
