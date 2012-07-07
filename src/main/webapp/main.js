require.config({
  paths:{
    'jquery':'lib/jquery',
    'angular':'lib/angular',
    'jquery.mobile':'lib/jquery.mobile'
  },
  shim:{
    'lib/Base64':{exports:'Base64'},
    'angular':{ deps:['jquery'],exports:'angular' }
  }
});

function tryHoldReady() {
  if (!tryHoldReady.executed && window.jQuery) {
    window.jQuery.holdReady(true);
    tryHoldReady.executed = true;
  }
}
tryHoldReady();
require.onResourceLoad = tryHoldReady;

require([
  "jquery",
  // Libraries
  "lib/jqmExternalAsEmbeddedPages",
  "lib/JSONParseDate",
  "lib/jquery-mobile-angular-adapter",
  // Application
  "app/services",
  "app/controllers",
  "app/markup",
  "app/application"
], function (jquery) {
  jquery.holdReady(false);
});

