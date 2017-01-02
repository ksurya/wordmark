/**
  Popups. Well, people definitely don't like them...

 */

var popup = {

  // Popup HTML element (to be initialized)
  element: null,

  // API settings..
  apiKey: "AJUAF7OXfF3AXF7rvCLIPcCC1PgZS3tn",

};

popup.query = function(word, callback) {
  var url = "http://api.pearson.com/v2/dictionaries/lasde/entries";
  var params = { headword: word, limit: 1, apiKey: popup.apiKey };
  $.get(url, params, function(r) {
    if (!!r.results && r.results.length > 0) {
      var resp = r.results[0];
      var data = { word: word };

      // add phonetics
      if (!!resp.pronunciations && resp.pronunciations.length > 0) {
        data.phonetics = resp.pronunciations[0].ipa
      }

      // add defn
      if (!!resp.senses && resp.senses.length > 0 && resp.senses[0].definition.length > 0) {
        data.definition = resp.senses[0].definition[0];
      }

      // add parts of speech
      data.part_of_speech = resp.part_of_speech;

      // URLs
      data.ref = {
        google: "https://google.com/search?q=define+" + word,
        webster: "https://www.merriam-webster.com/dictionary/" + word,
        vocabulary: "https://www.vocabulary.com/dictionary/" + word,
        dictionary: "http://www.dictionary.com/browse/" + word,
        thesaurus: "http://www.thesaurus.com/browse/" + word,
      }

      // return data
      callback(data);
    }
  });
}

popup.setContent = function(content) {
  popup.element.querySelector(".popover-content").innerHTML = content;
}

popup.setLocation = function(x, y) {
  popup.element.style.left = x;
  popup.element.style.top = y;
}

// get selection elements. check if its warped. Warp with a span
popup.show = function(e) {
  var selection = window.getSelection().getRangeAt(0);
  var parent = selection.commonAncestorContainer.parentElement;
  var word = selection.toString().trim().toLowerCase();
  
  popup.query(word, function(data) {

    // set content
    var content = `
      <b>${ data.word }</b></br>
      <i>${ data.phonetics || "" } ${ data.part_of_speech || "" }</i></br>
      <p>
        ${ data.definition || "" }</br></br>
        <a target="_blank" href="${ data.ref.google }">Google</a>,
        <a target="_blank" href="${ data.ref.vocabulary }">Vocabulary</a>,
        <a target="_blank" href="${ data.ref.thesaurus }">Thesaurus</a>
      </p>
    `;
    popup.setContent(content);

    // set location
    popup.setLocation(e.clientX + "px", e.clientY + 8 + "px");

    // finally, let's show..
    $(popup.element).show();

  });
}

popup.init = function() {

  $.get(chrome.extension.getURL("popup/index.html"), function(html) {
    
    // initialize popup
    var ele = document.createElement("div");
    ele.innerHTML = html;
    popup.element = ele.querySelector(".popover"); // we don't want wrapper..

    // insert into DOM
    document.body.append(popup.element);

  }, "html");

  // Start listening to double clicks..
  document.body.addEventListener("dblclick", popup.show);

  // Hide popups
  document.body.addEventListener("click", function(event) {
    if (!popup.element || !popup.element.contains(event.target)) {
      $(popup.element).hide();
    }
  });

}

// Initialize the module
popup.init();
