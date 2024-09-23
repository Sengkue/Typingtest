const storyTitleInput = document.getElementById("story-title");
const storyInput = document.getElementById("story-input");
const addStoryButton = document.getElementById("add-story-button");
const storyDropdown = document.getElementById("story-dropdown");
const userInput = document.getElementById("user-input");
const startButton = document.getElementById("start-button");
const resultElement = document.getElementById("result");
const timeElapsedElement = document.getElementById("time-elapsed");
const speedElement = document.getElementById("speed-value");
const storyListElement = document.getElementById("story-list");

let startTime, timer;

// Load stories from local storage
function loadStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    stories.forEach(({ title, text }) => addStoryToDropdown(title, text));
}

// Add story to the dropdown and local storage
function addStoryToDropdown(title, text) {
    const option = document.createElement("option");
    option.value = text; // Store the text in the option value
    option.textContent = title;
    storyDropdown.appendChild(option);

    // Add to the story list
    const li = document.createElement("li");
    li.textContent = title;
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash", "delete-icon");
    deleteIcon.onclick = () => deleteStory(title);
    li.appendChild(deleteIcon);
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
        addStoryToDropdown(title, story);
        storyTitleInput.value = ""; // Clear title input
        storyInput.value = ""; // Clear story input
    }
});

// Delete story
function deleteStory(title) {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const filteredStories = stories.filter(story => story.title !== title);
    localStorage.setItem("stories", JSON.stringify(filteredStories));
    
    // Remove from dropdown and list
    const optionToRemove = Array.from(storyDropdown.options).find(option => option.text === title);
    if (optionToRemove) {
        storyDropdown.removeChild(optionToRemove);
    }
    const listItemToRemove = Array.from(storyListElement.children).find(li => li.textContent === title);
    if (listItemToRemove) {
        storyListElement.removeChild(listItemToRemove);
    }
}

// Start typing test from the dropdown selection
startButton.addEventListener("click", () => {
    const selectedStory = storyDropdown.value;
    if (!selectedStory) {
        alert("Please select a story from the dropdown.");
        return;
    }
    
    userInput.disabled = false;
    userInput.value = "";
    userInput.placeholder = "Start typing...";
    userInput.dataset.selectedStory = selectedStory; // Store the selected story text
    resultElement.textContent = "";
    timeElapsedElement.textContent = "0";
    speedElement.textContent = "0";
    
    startTime = new Date().getTime();
    timer = setInterval(updateTime, 1000);
});

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

// Event listeners for user input
userInput.addEventListener("input", () => {
    if (userInput.value === userInput.dataset.selectedStory) {
        endTest();
    }
});
userInput.addEventListener("blur", endTest);
window.onload = loadStories;
