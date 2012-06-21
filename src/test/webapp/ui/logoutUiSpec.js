/**
 * This test is only needed as we cannot mock window.location.reload in a Unit-Test.
 */
describeUi('logout', '/rylc-html5/index.html#logoutTestPage', function () {
  beforeLoad(function () {
    $("#loginPage").after('<div id="logoutTestPage" data-role="page"></div>');
  });

  it('should reload the page when calling logout on the backend service', function () {
    var flag = false;
    runs(function () {
      flag = true;
      backendService().logout();
    });
    runs(function () {
      expect(flag).toBeFalsy();
    });
  });

  it('should navigate to the login page after calling logout on the backend service', function () {
    runs(function () {
      backendService().logout();
    });
    runs(function () {
      expect(activePageId()).toBe('loginPage');
    });
  });
});

