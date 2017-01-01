// background page

// set default settings if not available
function loadDefaultSettings(key, defaultValue) {
  chrome.storage.local.get(key, function(r) {
    if (!r.hasOwnProperty(key)) {
      var obj = {};
      obj[key] = defaultValue;
      chrome.storage.local.set(obj);
    }
  });
}

// Load default settings
loadDefaultSettings("s__color", "#ffff80");
loadDefaultSettings("s__auto", true);

function addWord(info) {
    var key = "n__" + info.selectionText.trim().toLowerCase();
    var obj = {};
    obj[key] = {};
    chrome.storage.local.set(obj);
}

// Create menu item
chrome.contextMenus.create({
    title: "Wordmark it!",
    contexts: ["selection"],
    onclick: addWord
});
