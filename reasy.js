
// Let's not pollute the global space
window.REASY = {};
var REASY = window.REASY;

// RegEx to detect punctuation pause
REASY.punc = /[^\w"']/;

// Other initialization
REASY.state = "stopped";
REASY.wpm = "450";
REASY.nextTick = 0;

// Print a log message
REASY.log = function (message) {
  console.log("REASY <" + Date.now() + ">: " + message);
};

REASY.keyHandler = function () {
  event.stopImmediatePropagation();
  event.preventDefault();
  if (REASY.keystate == "handling")
    return;

  if (event.keyCode == ("q".charCodeAt(0) - 32))
    REASY.hideStage();

  var wasAlreadyPaused = (REASY.state == "paused")
  REASY.state = "paused";
  setTimeout(function (code) {
      var idx = REASY.nextIdx;

      // Subtract 32 from keycode for alphabets
      if (code == ("b".charCodeAt(0) - 32)) {
        // Backward
        idx -= 10;
        if (idx < 0)
          idx = 0;
        REASY.nextIdx = idx;
      } else if (code == ("f".charCodeAt(0) - 32)) {
        // Forward
        idx += 10;
        if (idx > REASY.words.length)
          idx = REASY.words.length;
        REASY.nextIdx = idx;
      } else if (code == "0".charCodeAt(0)) {
        // Beginning
        REASY.nextIdx = 0;
      }

      // Pause/Resume
      if (code == ("p".charCodeAt(0) - 32)) {
        if (!wasAlreadyPaused) {
          REASY.keystate = "";
          return;
        }
      }

      // Space to stop
      REASY.state = "running";
      REASY.play();
      REASY.keystate = "";
      }, 600, event.keyCode);
};

// Insert necessary HTML items into the page so that we have a stage
// to display the text
REASY.prepareStage = function () {
  try {
    REASY.stage = $("#reasy-stage");
    if (REASY.stage.length != 0) {
      // The page already has the stage. Initialize fields and make it visible
      REASY.textArea = $("#reasy-text");
      REASY.wpmSpan = $("#reasy-wpm");
      REASY.wpmSpan.text(REASY.wpm);
      REASY.stage.css("display", "block");

      $(document).keyup(REASY.keyHandler);
      return;
    }

    // Create the stage
    var stageH = 125;
    var stageW = 500;
    var stageX = window.innerWidth - stageW - 30;
    var stageY = 10;

    var stage = $("<div>")
      .css( { "position": "fixed",
              "left": stageX,
              "top": stageY,
              "width": stageW,
              "height": stageH,
              "color": "white",
              "background-color": "black",
              "font-family": "sans-serif",
              "z-index": "10000",
              "display": "block"
          })
      .attr("id", "reasy-stage");

    var closeButton = $("<input>")
      .attr( { "type": "button",
               "value": " x "
             })
      .css({ "position": "absolute",
              "margin": "5px",
              "right": "0",
              "top": "0",
            })
      .click(function () {
          REASY.hideStage();
          });

    var titleDiv = $("<div>").css("height", "35px");
    var wpmDec = $("<input>")
      .attr( { "type": "button",
               "value": " < "
             })
      .css( { "margin": "5px" })
      .click(function () {
          REASY.wpm = parseInt(REASY.wpm) - 20;
          REASY.wpmSpan.text(REASY.wpm);
          });
    var wpmSpan = $("<span>")
      .attr("id", "reasy-wpm")
      .css( { "margin": "5px",
              "font-weight": "bold"
            })
      .text(REASY.wpm);
    var wpmInc = $("<input>")
      .attr( { "type": "button",
               "value": " > "
             })
      .css( { "margin": "0px 5px" })
      .click(function () {
          REASY.wpm = parseInt(REASY.wpm) + 20;
          REASY.wpmSpan.text(REASY.wpm);
          });
    titleDiv.append(wpmDec)
      .append(wpmSpan)
      .append(wpmInc)
      .append(closeButton);

    // Text area
    var textArea = $("<div>")
      .attr("id", "reasy-text")
      .css( { "text-align": "center",
              "overflow": "hidden",
              "font-size": "30pt"
              })
      .click(function () {
        if (REASY.state == "paused") {
          REASY.state = "running";
          REASY.play();
        } else
          REASY.state = "paused";
        });

    stage.append(titleDiv)
      .append(textArea);

    stage.appendTo($("body"));

    REASY.textArea = textArea;
    REASY.stage = stage;
    REASY.wpmSpan = wpmSpan;

    $(document).keyup(REASY.keyHandler);
  } catch (e) {
    REASY.log(e);
    REASY.stage = null;
  }
};


// Hides the stage
REASY.hideStage = function () {
  if (REASY.stage != null)
    REASY.stage.css("display", "none");
  REASY.state = "stopped";
  REASY.textArea.text("");
  $(document).unbind("keyup");
};


REASY.play = function () {
  var words = REASY.words;
  var index = REASY.nextIdx;
  var delay;

  if (REASY.state != "running")
    return;

  // It appears that if key events continue coming in, the setTimeout function
  // returns quite early than expected. This is a workaround for that
  var now = Date.now();
  if (REASY.nextTick > 0 && REASY.nextTick > now) {
    setTimeout(REASY.play, REASY.nextTick - now);
    return;
  }

  if (index < words.length) {
    var word = words[index];
    REASY.textArea.text(word);
    if (REASY.punc.test(word) == true)
      delay = 650;
    else
      delay = 60000 / REASY.wpm;
    REASY.nextIdx++;

    // Schedule read for next word
    REASY.nextTick = Date.now() + delay;
    setTimeout(REASY.play, delay);
  } else {
    REASY.hideStage();

    // Unselect
    window.getSelection().removeAllRanges();
  }
};

REASY.run = function () {
  REASY.state = "running";

  // Get the selection
  var selection = window.getSelection().toString();
  if (selection.length < 25) {
    REASY.log("Length of selected string less than threshold");
    return;
  }

  REASY.words = selection.split(/\s+/);
  REASY.nextIdx = 0;

  REASY.prepareStage();
  REASY.play();
};

REASY.run();

// vim:sw=2:
