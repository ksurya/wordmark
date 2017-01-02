/**
  Word marker.
 */

var word = {

  // don't lookup these nodes
  ignoreNodes: ["script", "iframe", "link", "meta", "use", "img", "pre", "code"],

  // defaults
  color: "#ffff80",
  autorun: true,

  // keys
  colorKey: "s__color",
  autorunKey: "s__auto",

  // storage
  storage: chrome.storage.local

};

// add word to storage
// PS: I've no idea why I used n__. Late night hacking is indeed crazy.
word.add = function(w) {
  var obj = {};
  var key = "n__" + w.toLowerCase();
  obj[key] = {};
  word.storage.set(obj);
}

// remove word in storage
word.remove = function(w) {
  var key = "n__" + w.toLowerCase();
  word.storage.remove(key);
}

// check whether a word exists in storage
word.exists = function(w, callback) {
  var key = "n__" + w.toLowerCase();
  word.storage.get(key, function(r) {
    callback(r.hasOwnProperty(key));
  });
}

// Highlight important words under element e
word.highlight = function(e) {

  // If the element has children..
  if (e.childElementCount !== 0) {
    for (var i = 0, c; i < e.childElementCount; i++) {
      if (word.ignoreNodes.indexOf(e.children[i].nodeName.toLowerCase()) == -1) {
        word.highlight(e.children[i]);
      }
    }
    return;
  }

  // Get the text as list of words in the element
  // TODO: This regex should be improved. Special chars should be considered.
  var wordList = e.textContent.split(/(\s)/);

  // There is something crazy happening in this. 
  var loop = function(index) {
    word.exists(wordList[index], function(isExists) {
      if (isExists) {
        var span = document.createElement("span");
        span.style.background = word.color;
        span.innerHTML = wordList[index];
      }
      
      if (++index < wordList.length) {
        loop(index);
      }

      if (index == wordList.length) {
        e.innerHTML = wordList.join("");
      }
    });
  }

  // start the loop
  loop(0);
}

word.init = function() {

  // Load custom color (if exists)
  word.storage.get(word.colorKey, function(r) {
    if (r.hasOwnProperty(word.colorKey)) word.color = r[word.colorKey];
  });

  // Start the highlighter, well.. if the mode is `auto`
  word.storage.get(word.autorunKey, function(r) {
    if (!r.hasOwnProperty(word.autorunKey) || r[word.autorunKey]) {
      word.highlight(document.body)
    }
  });

}

// Initialize the module
word.init();
