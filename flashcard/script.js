// script


document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    
    // Load the data
    chrome.storage.local.get(null, function(r) {
      
      // Load all words
      wordList = [];
      keys = Object.keys(r);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("n__")) wordList.push(keys[i].split("n__")[1]);
      }

      // get the container to manage flash cards
      var container = document.getElementById("flashcard");

      // update flash card
      function updateCard(title) {
        var ele = document.createElement("h1");
        ele.innerHTML = title || "";
        container.innerHTML = "";
        container.append(ele);
      }

      var index = -1;
      var prevBtn = document.getElementById("prevBtn");
      var nextBtn = document.getElementById("nextBtn");
      
      function updateBtns() {
        if (index == wordList.length - 1) {
          prevBtn.className = prevBtn.className.replace("disabled", "");
          nextBtn.className += "disabled";
        } else if (index == 0) {
          prevBtn.className += "disabled";
          nextBtn.className = nextBtn.className.replace("disabled", "");
        } else {
          nextBtn.className = nextBtn.className.replace("disabled", "");
          prevBtn.className = prevBtn.className.replace("disabled", "");
        }
      }

      prevBtn.onclick = function() {
        if (index > 0) {
          updateCard(wordList[--index]);
          updateBtns();
        }
      }
      
      nextBtn.onclick = function() {
        if (index < wordList.length-1) {
          updateCard(wordList[++index]);
          updateBtns();
        }
      }

      // trigget first card
      if (wordList.length == 0) {
        updateCard("Empty");
        prevBtn.className += "disabled";
        nextBtn.className += "disabled";
      } else {
        nextBtn.click();
      }

    });
  }
}

