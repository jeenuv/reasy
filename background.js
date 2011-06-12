
// Function to run when context menu is clicked
function reasyContextMenuClicked(info, tab) {
  chrome.tabs.executeScript(null, { file: "jquery-1.6.1.min.js" });
  chrome.tabs.executeScript(null, { file: "reasy.js" });
}

// Create a context menu
var menuProperties = {
  "title": "Reasy",
  "contexts": [ "selection" ],
  "onclick": reasyContextMenuClicked
};
chrome.contextMenus.create(menuProperties);

// vim:set sw=2:
