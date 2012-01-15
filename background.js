
var defaultOptions = {
  "wpm": 300,
  "fontSize": 40,
  "launchKey": "R",
  "pauseKey": "p",
  "quitKey": "q",
  "wpmInc": "+",
  "wpmDec": "-",
  "beginningKey": "0",
  "wbKey": "b",
  "wfKey": "f",
  "nWords": "10",
  "sbKey": "(",
  "sfKey": ")",
  "debug": 0,
  "sos": 1,
};

// Function to run when context menu is clicked
function reasyContextMenuClicked(info, tab) {
  chrome.tabs.executeScript(null, { file: "reasy-launch.js" });
}

// Create a context menu
var menuProperties = {
  "title": "Reasy",
  "contexts": [ "selection" ],
  "onclick": reasyContextMenuClicked
};
chrome.contextMenus.create(menuProperties);


// Write the default options to local storage
if (!localStorage.getItem("options"))
  localStorage.setItem("options", JSON.stringify(defaultOptions));


// vim:sw=2 tw=78:
