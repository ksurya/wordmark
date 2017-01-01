/**
  The main engine of the application.
 */


// Wordmark object
var wm = {};

// Don't lookup these nodes
wm.ignoreNodes = ["script", "iframe", "link", "meta", "use", "img"];

// Load background color
wm.color = "#ffff80";
chrome.storage.local.get("s__color", function(r) {
  if (r.hasOwnProperty("s__color")) wm.color = r.s__color;
});

// Add a word to local storage
wm.word = {};

wm.word.add = function(w) {
  var obj = {};
  var key = "n__" + w.toLowerCase();
  obj[key] = {};
  chrome.storage.local.set(obj);
}

wm.word.remove = function(w) {
  var key = "n__" + w.toLowerCase();
  chrome.storage.local.remove(key);
}

wm.word.exists = function(w, callback) {
  var key = "n__" + w.toLowerCase();
  chrome.storage.local.get(key, function(r) {
    callback(r.hasOwnProperty(key));
  });
}

// Highlight important words
wm.highlight = function(e) {

  if (e.childElementCount != 0) {
    for (var i = 0, c; i < e.childElementCount; i++) {
      if (wm.ignoreNodes.indexOf(e.children[i].nodeName.toLowerCase()) == -1) {
        wm.highlight(e.children[i]);
      }
    }
  } else {
    var words = e.textContent.split(/(\s)/);
    var loop = function(index, maxCount) {
      wm.word.exists(words[index], function(isExists) {
        if (isExists) {
          words[index] = "<span style='background-color:" + wm.color + "'>" + words[index] + "</span>";
        }
        
        if (++index < maxCount) {
          loop(index, maxCount);
        }

        if (index == maxCount) {
          e.innerHTML = words.join("");
        }
      });
    }

    // start the loop
    loop(0, words.length);
  }
}

// This script is scheduled to run after document is loaded.
chrome.storage.local.get("s__auto", function(r) {
  if (r.s__auto) wm.highlight(document.body);
});
