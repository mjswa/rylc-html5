describeUi('profile', '/rylc-html5/index.html#profilePage', function () {
  var authenticatedUsername = "someUsername";
  var authenticatedCustomer = {
    id: 42,
    name: "someName",
    city: "someCity",
    email: "someEmail",
    zip: "12345",
    street: "someStreet"
  };

  beforeLoad(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
  });

  beforeEach(function () {
    // TODO extract function "setAuthenticatedUser(username, customer)" and move it to testutils.js
    runs(function () {
      activePageScope().auth.username = authenticatedUsername;
      activePageScope().$root.$digest();
    });
  });

  it('should allow to logout', function () {
    runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should show the profile of the authenticated customer', function () {
    runs(function () {
      expect(value('#profilePage_username')).toBe(authenticatedUsername);
      expect(value('#profilePage_name')).toBe(authenticatedCustomer.name);
      expect(value('#profilePage_city')).toBe(authenticatedCustomer.city);
      expect(value('#profilePage_street')).toBe(authenticatedCustomer.street);
      expect(value('#profilePage_zip')).toBe(authenticatedCustomer.zip);
      expect(value('#profilePage_email')).toBe(authenticatedCustomer.email);
    });
  });
});

