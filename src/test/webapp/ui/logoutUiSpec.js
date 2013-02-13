/**
 * This test is only needed as we cannot mock window.location.reload in a Unit-Test.
 */
describe('logout', function () {
  uit.url('/rylc-html5/index.html#logoutTestPage');
  uit.append(function ($) {
    $("#loginPage").after('<div id="logoutTestPage" data-role="page"></div>');
  });

  it('should reload the page when calling logout on the backend service', function () {
    uit.runs(function (window) {
      window.flag = true;
      backendService().logout();
    });
    uit.runsAfterReload(function (window) {
      expect(window.flag).toBeFalsy();
    });
  });

  it('should navigate to the login page after calling logout on the backend service', function () {
    uit.runs(function () {
      backendService().logout();
    });
    uit.runsAfterReload(function () {
      expect(activePageId()).toBe('loginPage');
    });
  });
});

