const storyInput = document.getElementById("story-input");
const addStoryButton = document.getElementById("add-story-button");
const storyListElement = document.getElementById("story-list");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeElapsedElement = document.getElementById("time-elapsed");
const speedElement = document.getElementById("speed-value");

let startTime, timer;

// Load stories from local storage
function loadStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    stories.forEach(story => addStoryToList(story));
}

// Add story to the list and local storage
function addStoryToList(story) {
    const li = document.createElement("li");
    li.textContent = story;
    li.onclick = () => selectStory(story);
    storyListElement.appendChild(li);
}

// Add story on button click
addStoryButton.addEventListener("click", () => {
    const story = storyInput.value.trim();
    if (story) {
        const stories = JSON.parse(localStorage.getItem("stories")) || [];
        stories.push(story);
        localStorage.setItem("stories", JSON.stringify(stories));
        addStoryToList(story);
        storyInput.value = ""; // Clear input field
    }
});

// Select a story for typing test
function selectStory(story) {
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus();
    userInput.placeholder = "Start typing the selected story...";
    userInput.dataset.selectedStory = story; // Store the selected story
    resultElement.textContent = "";
    timeElapsedElement.textContent = "0";
    speedElement.textContent = "0";
    
    startTime = new Date().getTime();
    timer = setInterval(updateTime, 1000);
}

// Start typing test
function startTest() {
    if (!userInput.dataset.selectedStory) {
        alert("Please select a story from the list.");
        return;
    }
    
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
    const typedText = userInput.value.trim();
    const wordCount = typedText.split(" ").filter(word => word).length;
    const wpm = Math.round((wordCount / elapsed) * 60) || 0; // Avoid division by zero
    speedElement.textContent = wpm;
}

// End typing test
function endTest() {
    clearInterval(timer);
    userInput.disabled = true;

    const typedText = userInput.value;
    const originalText = userInput.dataset.selectedStory;
    let errors = 0;

    // Count incorrect characters
    for (let i = 0; i < Math.max(typedText.length, originalText.length); i++) {
        if (typedText[i] !== originalText[i]) {
            errors++;
        }
    }

    resultElement.textContent = `Errors: ${errors}`;
}

// Event listeners
startButton.addEventListener("click", startTest);
userInput.addEventListener("input", () => {
    if (userInput.value === userInput.dataset.selectedStory) {
        endTest();
    }
});
userInput.addEventListener("blur", endTest);
window.onload = loadStories;
