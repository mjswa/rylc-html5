describeUi('welcome', '/rylc-html5/index.html#welcomePage', function () {
  var authenticatedCustomer = { id:42, name:"someName" };

  beforeLoad(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
  });

  it('should greet user after successful login', function () {
    runs(function () {
      expect(value(".greeting")).toBe('Hallo ' + authenticatedCustomer.name);
    });
  });

  it('should allow to logout', function () {
    runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should show the profile page after click on profile button', function () {
    runs(function () {
      click(".profile");
    });
    runs(function () {
      expect(activePageId()).toBe('profilePage');
    });
  });

  it('should be active when coming back from profile page', function () {
    runs(function () {
      click(".profile");
    });
    runs(function () {
      click('.back');
    });
    runs(function () {
      expect(activePageId()).toBe('welcomePage');
    });
  });

  it('should show the rental history page after click on rental history button', function () {
    runs(function () {
      click(".rentalHistory");
    });
    runs(function () {
      expect(activePageId()).toBe('rentalHistoryPage');
    });
  });

  it('should be active when coming back from rental history page', function () {
    runs(function () {
      click(".rentalHistory");
    });
    runs(function () {
      click('.back');
    });
    runs(function () {
      expect(activePageId()).toBe('welcomePage');
    });
  });

  it('should show the first rental page after click on new rental button', function () {
    runs(function () {
      click(".newRental");
    });
    runs(function () {
      expect(activePageId()).toBe('rental1Page');
    });
  });

  it('should be active when coming back from the first rental page', function () {
    runs(function () {
      click(".newRental");
    });
    runs(function () {
      click('.back');
    });
    runs(function () {
      expect(activePageId()).toBe('welcomePage');
    });
  });
});
