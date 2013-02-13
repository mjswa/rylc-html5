describe('login', function () {
  uit.url('/rylc-html5/index.html');
  
  var someUsername = "someUsername";
  var somePassword = "somePassword";
  var someCustomer = { id:42, name:"someName" };

  uit.append(function() {
    mockBackend();
  });

  it('should show the login page when visiting the application', function () {
    uit.runs(function () {
      expect(activePageId()).toBe('loginPage');
    });
  });

  it('should not allow login when the username or password is empty', function () {
    uit.runs(function () {
      value("#loginPage_username", '');
      value("#loginPage_password", '');
      expect(enabled(".login")).toBeFalsy();
    });
    uit.runs(function () {
      value("#loginPage_username", someUsername);
      value("#loginPage_password", '');
      expect(enabled(".login")).toBeFalsy();
    });
    uit.runs(function () {
      value("#loginPage_username", '');
      value("#loginPage_password", somePassword);
      expect(enabled(".login")).toBeFalsy();
    });
  });

  it('should allow login when the username and password are not empty', function () {
    uit.runs(function () {
      value("#loginPage_username", someUsername);
      value("#loginPage_password", somePassword);
      expect(enabled(".login")).toBeTruthy();
    });
  });

  it('should show the welcome page after successful login', function () {
    uit.runs(function () {
      backendServiceResult('login').resolve(someCustomer);
      value("#loginPage_username", someUsername);
      value("#loginPage_password", somePassword);
      click(".login");
    });
    uit.runs(function () {
      expect(backendService().login).toHaveBeenCalledWith(someUsername, somePassword);
      expect(activePageId()).toBe('welcomePage');
    });
  });

  it('should show an error when the backend reports an error on login', function () {
    var someBackendError = "someBackendError";
    uit.runs(function () {
      backendServiceResult('login').reject(someBackendError);
      value("#loginPage_username", someUsername);
      value("#loginPage_password", somePassword);
      click(".login");
    });
    uit.runs(function () {
      expect(activePageId()).toBe('loginPage');
      expect(value(".error")).toEqual(someBackendError);
    });
  });
});

