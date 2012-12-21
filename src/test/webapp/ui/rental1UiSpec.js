describeUi('rental1', '/rylc-html5/index.html#welcomePage', function () {
  var authenticatedCustomer = { id: 42, name: "someName" };
  var someCity = {id: 42, name: "City A"};
  var someCities = [someCity, {id: 43, name: "City B"}];
  var someErrorDate = "someErrorDate";
  var someErrorPrice = "someError";

  beforeLoad(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
  });

  beforeEach(function () {
    runs(function () {
      click('.newRental');
    });
  });

  function init(cities) {
    runs(function () {
      backendServiceResult('cities').resolve(cities);
      backendServiceResult('citiesBackground').resolve(cities);
    });
  }

  it('should show the expected number of cities', function () {
    init(someCities);
    runs(function () {
      expect(count(".selectedCity > option")).toBe(someCities.length);
    });
  });

  it('should show the city name', function () {
    init([someCity]);
    runs(function () {
      expect(value(".selectedCity > option")).toBe(someCity.name);
    });
  });

  it('should show defaults when the page is visited', function () {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    init(someCities);
    runs(function () {
      expect(value("select.selectedCity")).toBe('0');
      expect(value(".startDate")).toBe(formatDate(today));
      expect(value(".endDate")).toBe(formatDate(tomorrow));
      expect(value(".maxPrice")).toBe('100');
    });
  });

  it('should mark erroneous start date', function () {
    init(someCities);
    runs(function () {
      value('.startDate', someErrorDate);
    });
    runs(function () {
      expect(hasValidationError('.startDate')).toBeTruthy();
    });
  });

  it('should mark erroneous end date', function () {
    init(someCities);
    runs(function () {
      value('.endDate', someErrorDate);
    });
    runs(function () {
      expect(hasValidationError('.endDate')).toBeTruthy();
    });
  });

  it('should mark erroneous max price', function () {
    init(someCities);
    runs(function () {
      value('.maxPrice', someErrorPrice);
    });
    runs(function () {
      expect(hasValidationError('.maxPrice')).toBeTruthy();
    });
  });

  it('should allow search when page is visited', function () {
    init(someCities);
    runs(function () {
      expect(enabled('.search')).toBeTruthy();
    });
  });

  it('should disable search when validation errors exist', function () {
    init(someCities);
    runs(function () {
      value('.maxPrice', someErrorPrice);
    });
    runs(function () {
      expect(enabled('.search')).toBeFalsy();
    });
  });

  it('should search with the given search criteria', function () {
    init(someCities);
    runs(function () {
      value('select.selectedCity', someCities[0].id);
      value('.startDate', formatDate(new Date(2011, 10 - 1, 10)));
      value('.endDate', formatDate(new Date(2011, 11 - 1, 11)));
      value('.maxPrice', '150');
      click('.search');
    });
    runs(function () {
      expect(backendService().availableCars).toHaveBeenCalledWith(
        someCities[0].id, new Date(2011, 10 - 1, 10), new Date(2011, 11 - 1, 11), 150
      );
    });
  });

  it('should show an error when the backend reports an error on search', function () {
    var someBackendError = "someBackendError";
    init(someCities);
    runs(function () {
      backendServiceResult('availableCars').reject(someBackendError);
      click(".search");
    });
    runs(function () {
      expect(value('.error')).toBe(someBackendError);
    });
  });

  it('should allow to logout', function () {
    init(someCities);
    runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should clear the error message when the page is left', function () {
    var someBackendError = "someBackendError";
    init(someCities);
    runs(function () {
      backendServiceResult('availableCars').reject(someBackendError);
      click(".search");
      backendServiceResult('availableCars').clear().resolve([]);
      click(".search");
    });
    runs(function () {
      expect(count('.error')).toBe(0);
    });
  });

  it('should show the second rental page after search', function () {
    init(someCities);
    runs(function () {
      backendServiceResult('availableCars').resolve([]);
      click(".search");
    });
    runs(function () {
      expect(activePageId()).toBe('rental2Page');
    });
  });

  it('should be active when coming back from second rental page and the values should not change', function () {
    init(someCities);
    runs(function () {
      value(".maxPrice", "150");
      backendServiceResult('availableCars').resolve([]);
      click(".search");
    });
    runs(function () {
      expect(activePageId()).toBe('rental2Page');
    });
    runs(function () {
      click('.back');
    });
    runs(function () {
      expect(activePageId()).toBe('rental1Page');
      expect(value(".maxPrice")).toBe("150");
    });
  });
});

