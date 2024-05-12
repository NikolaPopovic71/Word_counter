document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");
  const textInput = document.getElementById("textInput");
  const wordInput = document.getElementById("wordInput");
  const highlightedTextContainer = document.getElementById("highlightedText");
  const wordCountDisplay = document.getElementById("wordCount");
  const nextButton = document.getElementById("next");
  const previousButton = document.getElementById("previous");
  const countWordButton = document.getElementById("countWord");
  const clearFieldsButton = document.getElementById("clearFields");

  let currentHighlightIndex = 0;
  let highlights = [];

  toggle.addEventListener("change", toggleNightMode);

  countWordButton.addEventListener("click", function () {
    const languageOption = document.querySelector(
      'input[name="fav_option"]:checked'
    );
    if (!languageOption) {
      alert("Please select a counting option.");
      return;
    }

    switch (languageOption.value) {
      case "all":
        countAllWords();
        break;
      case "exact_word":
        countExactWord();
        break;
      case "part_of_word":
        countPartialWords();
        break;
    }
  });

  clearFieldsButton.addEventListener("click", clearFields);

  nextButton.addEventListener("click", function () {
    navigateHighlights(1);
  });

  previousButton.addEventListener("click", function () {
    navigateHighlights(-1);
  });

  function toggleNightMode() {
    document.body.classList.toggle("night-mode");
  }

  function countAllWords() {
    const text = textInput.value;
    if (!text) {
      alert("Please enter some text.");
      return;
    }
    // Update regex to include Unicode letters and digits
    let words = text.match(/[\p{L}\d]+/gu);
    let count = words ? words.length : 0;
    wordCountDisplay.textContent = count.toString();
    highlightedTextContainer.innerHTML = text; // No highlighting necessary
  }

  function countExactWord() {
    performWordCount(true);
  }

  function countPartialWords() {
    performWordCount(false);
  }

  function performWordCount(exactMatch) {
    const text = textInput.value;
    const word = wordInput.value.trim();
    if (!text || !word) {
      alert("Please fill in all fields.");
      return;
    }
    let regexPattern = exactMatch ? `\\b${word}\\b` : word;
    // Ensure regex accounts for words adjacent to punctuation or numbers
    highlightWords(regexPattern, exactMatch);
  }

  function highlightWords(pattern, exactMatch) {
    let flags = "gi";
    let regex;
    if (exactMatch) {
      regex = new RegExp(`\\b${pattern}\\b`, flags);
    } else {
      regex = new RegExp(pattern, flags);
    }
    const words = textInput.value.split(/([\s\-\.,!?]+)/);
    let count = 0;
    const highlightedText = words
      .map((part) => {
        if (regex.test(part)) {
          count++;
          return `<span class="highlight">${part}</span>`;
        } else {
          return part;
        }
      })
      .join("");
    highlightedTextContainer.innerHTML = highlightedText;
    wordCountDisplay.textContent = count.toString();
    highlights = Array.from(document.querySelectorAll(".highlight"));
    currentHighlightIndex = -1;
    navigateHighlights(1); // Move to the first highlight
  }

  function clearFields() {
    textInput.value = "";
    wordInput.value = "";
    highlightedTextContainer.innerHTML = "";
    wordCountDisplay.textContent = "0";
    document
      .querySelectorAll('input[name="fav_option"]')
      .forEach((input) => (input.checked = false));
    highlights = [];
    currentHighlightIndex = -1;
  }

  function navigateHighlights(direction) {
    if (highlights.length === 0) return;
    if (currentHighlightIndex >= 0) {
      highlights[currentHighlightIndex].classList.remove("active");
    }
    currentHighlightIndex =
      (currentHighlightIndex + direction + highlights.length) %
      highlights.length;
    highlights[currentHighlightIndex].classList.add("active");

    // Delay scrolling to the highlighted element
    setTimeout(() => {
      highlights[currentHighlightIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 2000); // Delay of 2000 milliseconds (2 seconds)
  }
});
