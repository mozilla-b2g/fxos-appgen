const Cu = Components.utils;
const {devtools} = Cu.import("resource://gre/modules/devtools/shared/Loader.jsm", {});
const {require} = devtools;
const {installPackaged} = require("devtools/shared/apps/app-actor-front");

const { DebuggerServer } = require("devtools/server/main");
const { DebuggerClient } = require("devtools/shared/client/main");

let gClient, gActor;
let gAppId = "YOURAPPID";

let onDone = function () {
  installPackaged(gClient, gActor, "/data/local/YOURAPPZIP", gAppId)
    .then(function ({ appId }) {
      gClient.close();
      marionetteScriptFinished("finished");
    }, function (e) {
      gClient.close();
      marionetteScriptFinished("Failed install uploaded packaged app: " + e.error + ": " + e.message);
    });
};

let connect = function(onDone) {
  // Initialize a loopback remote protocol connection
  if (!DebuggerServer.initialized) {
    DebuggerServer.init(function () { return true; });
    // We need to register browser actors to have `listTabs` working
    // and also have a root actor
    DebuggerServer.addBrowserActors();
  }

  // Setup the debugger client
  gClient = new DebuggerClient(DebuggerServer.connectPipe());
  gClient.connect(function onConnect() {
    gClient.listTabs(function onListTabs(aResponse) {
      gActor = aResponse.webappsActor;
      onDone();
    });
  });
};

connect(onDone);
