
if (REASY && REASY.run) {
  if (REASY.state == "stopped")
    REASY.run();
  else
    REASY.log("Reasy is already running");
} else
  alert("Reasy is not ready");

// vim:sw=2 tw=78:
