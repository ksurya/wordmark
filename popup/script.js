/**
  Popups. Well, people definitely don't like them...

 */

var popup = {};

popup.element = null;

popup.setTitle = function(title) {
  popup.element.querySelector(".popover-title").innerHTML = title;
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
  
  popup.setTitle(selection.toString());
  popup.setContent("");
  popup.setLocation(e.clientX + "px", e.clientY + 8 + "px");
  $(popup.element).show();
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
