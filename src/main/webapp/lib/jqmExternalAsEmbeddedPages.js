/**
 * Patch for jquery mobile to transparently lookup non existing embedded pages
 * as external pages with the suffix .html.
 */
(function ($) {
  $.mobile.originalLoadPage = $.mobile.loadPage;
  $.mobile.loadPage = function (url, options) {
    var match = url.match(/#(\w+)/);
    var pageId = match && match[1];
    if (pageId && !document.getElementById(pageId)) {
      url = pageId+".html";
    }
    return $.mobile.originalLoadPage(url, options);
  };
})(window.jQuery);

