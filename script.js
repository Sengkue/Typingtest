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

let startTime, timer;

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

    userInput.disabled = false;
    userInput.placeholder = "Start typing...";
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

    // Check if the user has completed typing the story
    const originalText = userInput.dataset.selectedStory.trim();
    if (typedText === originalText) {
        endTest();
    }
}

// Highlight incorrect words
function highlightIncorrectWords() {
    const typedText = userInput.value.trim().split(" ");
    const originalText = userInput.dataset.selectedStory.split(" ");
    
    const highlightedWords = originalText.map((word, index) => {
        const typedWord = typedText[index];
        if (typedWord === word) {
            return `<span class="correct">${word}</span>`; // Wrap correct words
        } else if (typedWord && typedWord !== word) {
            return `<span class="incorrect">${typedWord}</span>`; // Wrap incorrect words
        }
        return word; // Return original word if not typed yet
    }).join(" ");

    highlightedText.innerHTML = highlightedWords; // Display highlighted text
}

// End typing test
function endTest() {
    clearInterval(timer);
    userInput.disabled = true;
    resultElement.textContent = "Test completed! Great job!";
}

// Event listeners for user input
userInput.addEventListener("input", highlightIncorrectWords);
window.onload = loadStories;
