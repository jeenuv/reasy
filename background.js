
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

function writeDefault() {
  localStorage.setItem("options", JSON.stringify(defaultOptions));
}

// Function to run when context menu is clicked
function reasyContextMenuClicked(info, tab) {
  chrome.tabs.executeScript(null, { file: "reasy-launch.js" });
}

// Create a context menu
var menuProperties = {
  "type": "normal",
  "title": "Reasy",
  "contexts": [ "selection" ],
  "onclick": reasyContextMenuClicked
};
chrome.contextMenus.create(menuProperties);

// Register a request handler so that context menu can load/save options
function rwOption(request, sender, sendResponse)
{
  var tmp = {};

  switch (request.header) {
    case "options.read":
      tmp = JSON.parse(localStorage.getItem("options"));
      break;

    case "options.setdefault":
      writeDefault();
      break;

    case "options.write":
      if (request.payload)
        localStorage.setItem("options", JSON.stringify(request.payload));
      else
        alert("No payload to write");
      break;

    default:
      REASY.log("Unknown request header: " +  request.header);
      break;
  }

  sendResponse(tmp);
}
chrome.extension.onRequest.addListener(rwOption);

// Write the default options to local storage
if (!localStorage.getItem("options"))
  writeDefault();


// vim:sw=2 tw=78:
