
if (REASY && REASY.run && REASY.log) {
  if (REASY.state == "stopped")
    REASY.run();
  else
    REASY.log("Reasy is already running");
} else
  alert("Reasy is not ready");

// vim:sw=2:
