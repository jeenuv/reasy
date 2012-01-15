

function highlightError(item) {
  item.data("border", item.css("border"));
  item.css("border", "4px solid red");
  item.focus();
  setTimeout(function (obj) {
    obj.css("border", obj.data("border"));
    }, 1000, item);
  throw "";
};

function loadOptions() {
  var options;
  var tmp;

  tmp = localStorage.getItem("options");
  if (!tmp) {
    alert("No options configured");
    return;
  }
  options = JSON.parse(tmp);

  $(":input").each(function () {
      var id = $(this).attr("id");
      var type = $(this).attr("type");

      if (type == "text")
        $(this).attr("value", options[id]);
      else if (type == "checkbox")
        if (options[id] == 1)
          $(this).attr("checked", "checked");
    });
}


function saveOptions() {
  var tmp = {};

  try {
    $(":input").each(function () {
        var id = $(this).attr("id");
        var type = $(this).attr("type");

        if (type == "text") {
          var value = $(this).attr("value");
          if (value != "")
            tmp[id] = value;
          else {
            $(this).focus();
            highlightError($(this));
          }
        } else if (type == "checkbox") {
          if ($(this).attr("checked"))
            tmp[id] = 1;
          else
            tmp[id] = 0;
        }
      });

    var wpm = $("#wpm");
    var val = parseInt(wpm.attr("value"));
    if (isNaN(val))
      highlightError(wpm);
    wpm.attr("value", val);

    localStorage.setItem("options", JSON.stringify(tmp));
  } catch (e) {
  }
}


// Load default/saved options on startup
$(document).ready(function () {
    loadOptions();
    $("#saveButton").click(saveOptions);
    $("#resetButton").click(function () {
      chrome.extension.sendRequest({ "header": "options.setdefault" },
        function () {
          loadOptions();
        });
      });
  });


// vim:sw=2 tw=78:
