describe('jqmExternalAsEmbeddedPages', function () {
  var someOptions = {};
  var container;
  beforeEach(function () {
    spyOn($.mobile, 'originalLoadPage');
    container = $("<div></div>");
    $("body").append(container);
  });
  afterEach(function () {
    container.remove();
  });

  describe("directly specified pages", function () {
    it("should pass through absolute path pages", function () {
      var someExternalPage = '/someExternalPage';
      $.mobile.loadPage(someExternalPage, someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith(someExternalPage, someOptions);
    });

    it("should pass through relative path pages", function () {
      var someExternalPage = 'someExternalPage';
      $.mobile.loadPage(someExternalPage, someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith(someExternalPage, someOptions);
    });

    it("should load non existing embedded pages as external pages", function () {
      $.mobile.loadPage("#somePage", someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith("somePage.html", someOptions);
    });

    it("should pass through embedded pages that are already in the dom", function () {
      container.append('<div id="somePage"></div>');
      $.mobile.loadPage("#somePage", someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith("#somePage", someOptions);
    });

  });

  describe("pages in the hash of a page url", function () {
    it("should pass through absolute pages", function () {
      var someExternalPage = 'index.html#/someExternalPage';
      $.mobile.loadPage(someExternalPage, someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith(someExternalPage, someOptions);
    });

    it("should load non existing embedded pages as external pages", function () {
      $.mobile.loadPage("index.html#somePage", someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith("somePage.html", someOptions);
    });

    it("should pass through embedded pages that are already in the dom", function () {
      container.append('<div id="somePage"></div>');
      $.mobile.loadPage("index.html#somePage", someOptions);
      expect($.mobile.originalLoadPage).toHaveBeenCalledWith("index.html#somePage", someOptions);
    });

  });
});