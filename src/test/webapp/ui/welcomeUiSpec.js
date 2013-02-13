describe('welcome', function () {
  uit.url('/rylc-html5/index.html#welcomePage');
  var authenticatedCustomer = { id:42, name:"someName" };

  uit.append(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
  });

  it('should greet user after successful login', function () {
    uit.runs(function () {
      expect(value(".greeting")).toBe('Hallo ' + authenticatedCustomer.name);
    });
  });

  it('should allow to logout', function () {
    uit.runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should show the profile page after click on profile button', function () {
    uit.runs(function () {
      click(".profile");
    });
    uit.runs(function () {
      expect(activePageId()).toBe('profilePage');
    });
  });

  it('should be active when coming back from profile page', function () {
    uit.runs(function () {
      click(".profile");
    });
    uit.runs(function () {
      click('.back');
    });
    uit.runs(function () {
      expect(activePageId()).toBe('welcomePage');
    });
  });

  it('should show the rental history page after click on rental history button', function () {
    uit.runs(function () {
      click(".rentalHistory");
    });
    uit.runs(function () {
      expect(activePageId()).toBe('rentalHistoryPage');
    });
  });

  it('should be active when coming back from rental history page', function () {
    uit.runs(function () {
      click(".rentalHistory");
    });
    uit.runs(function () {
      click('.back');
    });
    uit.runs(function () {
      expect(activePageId()).toBe('welcomePage');
    });
  });

  it('should show the first rental page after click on new rental button', function () {
    uit.runs(function () {
      click(".newRental");
    });
    uit.runs(function () {
      expect(activePageId()).toBe('rental1Page');
    });
  });

  it('should be active when coming back from the first rental page', function () {
    uit.runs(function () {
      click(".newRental");
    });
    uit.runs(function () {
      click('.back');
    });
    uit.runs(function () {
      expect(activePageId()).toBe('welcomePage');
    });
  });
});
