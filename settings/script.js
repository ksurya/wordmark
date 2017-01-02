// form submissions

var settings = {

  // keys..
  colorKey: "s__color",
  autorunKey: "s__auto",

  get: function(key, callback) {
    chrome.storage.local.get(key, function(r) {
      callback(r[key]);
    });
  },

  update: function(key, value, callback) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, callback);
  }

};

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    
    // highlight color
    var colorEle = document.body.querySelector("form input[name='color']");
    settings.get(settings.colorKey, function(v) {
      colorEle.value = v;
    })
    colorEle.onchange = function(e) {
      settings.update(settings.colorKey, e.target.value);
    }

    // autorun on
    var autorunOnEle = document.body.querySelector("form input[name='autorun'][value='on']");
    settings.get(settings.autorunKey, function(v) {
      autorunOnEle.checked = v;
    });
    autorunOnEle.onchange = function(e) {
      settings.update(settings.autorunKey, e.target.checked);
    }
    
    // autorun off
    var autorunOffEle = document.body.querySelector("form input[name='autorun'][value='off']");
    settings.get(settings.autorunKey, function(v) {
      autorunOffEle.checked = !v;
    });
    autorunOffEle.onchange = function(e) {
      settings.update(settings.autorunKey, !e.target.checked);
    }
  }  
}

