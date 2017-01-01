// script

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    
    var table = document.body.querySelector("table tbody");
    
    // Insert words into table
    chrome.storage.local.get(null, function(data) {
      var count = 1;
      var row = null;
      var col = null;

      function deleteWord(e) {
        var i = e.target.getAttribute("data-index");
        var k = Object.keys(data)[i];
        chrome.storage.local.remove(k, function() {
          e.target.parentElement.parentElement.remove();
        });
      }

      Object.keys(data).forEach(function(k, idx) {
        if (k.startsWith("n__")) {
          // create a table row
          row = document.createElement("tr");

          // add word index
          col = document.createElement("td");
          col.innerHTML = count++;
          row.append(col);

          // add word
          col = document.createElement("td");
          col.innerHTML = k.split("__")[1];
          row.append(col);

          // create delete btn
          btn = document.createElement("button");
          btn.setAttribute("class", "btn btn-xs btn-primary");
          btn.setAttribute("data-index", idx);
          btn.innerHTML = "delete";
          btn.onclick = deleteWord;

          col = document.createElement("td");
          col.append(btn);
          row.append(col);

          table.append(row);
        }
      })
    });
  }  
}

