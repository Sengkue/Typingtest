const storyTitleInput = document.getElementById("story-title");
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
    stories.forEach(({ title, text }) => addStoryToList(title, text));
}

// Add story to the list and local storage
function addStoryToList(title, text) {
    const li = document.createElement("li");
    li.textContent = title;
    li.onclick = () => selectStory(title, text);
    storyListElement.appendChild(li);
}

// Add story on button click
addStoryButton.addEventListener("click", () => {
    const title = storyTitleInput.value.trim();
    const story = storyInput.value.trim();
    if (title && story) {
        const stories = JSON.parse(localStorage.getItem("stories")) || [];
        stories.push({ title, text: story });
        localStorage.setItem("stories", JSON.stringify(stories));
        addStoryToList(title, story);
        storyTitleInput.value = ""; // Clear title input
        storyInput.value = ""; // Clear story input
    }
});

// Select a story for typing test
function selectStory(title, text) {
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus();
    userInput.placeholder = `Start typing "${title}"...`;
    userInput.dataset.selectedStory = text; // Store the selected story
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

    highlightIncorrectWords();
}

// Highlight incorrect words
function highlightIncorrectWords() {
    const typedText = userInput.value.trim().split(" ");
    const originalText = userInput.dataset.selectedStory.split(" ");
    
    const highlightedWords = typedText.map((word, index) => {
        if (word !== originalText[index]) {
            return `<span class="incorrect">${word}</span>`;
        }
        return word;
    }).join(" ");

    userInput.innerHTML = highlightedWords;
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
