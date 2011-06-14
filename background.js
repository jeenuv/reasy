
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

// vim:sw=2 tw=78:
