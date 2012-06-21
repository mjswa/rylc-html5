describeUi('rental2', '/rylc-html5/index.html#welcomePage', function () {
  var authenticatedCustomer = { id:42, name:"someName" };
  var someCities = [
    {id:10, name:'City A'}
  ];
  var someCarType = 'CarTypeA';
  var someCarTypes = [someCarType, 'CarTypeB'];
  var someCar = {"carType":"CarTypeA", "description":"fortwo", "manufacturer":"smart", "price":56.00};
  var someCars = [
    someCar,
    {"carType":"CarTypeB", "description":"mini", "manufacturer":"smart2", "price":66.00}
  ];

  beforeLoad(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
    backendServiceResult('cities').resolve(someCities);
    backendServiceResult('citiesBackground').resolve(someCities);
  });

  beforeEach(function () {
    runs(function () {
      click('.newRental');
    });
    runs(function () {
      click('.search');
    });
  });

  function init(carTypes, cars) {
    runs(function () {
      backendServiceResult('carTypes').resolve(carTypes);
      backendServiceResult('carTypesBackground').resolve(carTypes);
      backendServiceResult('availableCars').resolve(cars);
    });
  }

  it('should show the expected number of carTypes', function () {
    init(someCarTypes, []);
    runs(function () {
      expect(count(".selectedCarType > option")).toBe(someCarTypes.length);
    });
  });

  it('should show the car type name', function () {
    init([someCarType], []);
    runs(function () {
      expect(value(".selectedCarType > option")).toBe(someCarType);
    });
  });

  it('should select the first car type when the page is visited', function () {
    init(someCarTypes, []);
    runs(function () {
      expect(value(".selectedCarType")).toBe('0');
    });
  });

  it('should show the car fields', function () {
    init([someCarType], [someCar]);
    runs(function () {
      expect(value(".carManufacturer")).toBe(someCar.manufacturer);
      expect(value(".carDescription")).toBe(someCar.description);
      expect(value(".carPrice")).toBe('\u20AC' + someCar.price + '.00');
    });
  });

  it('should filter the cars by the selected car type when the page is visited', function () {
    init(someCarTypes, someCars);
    runs(function () {
      expect(count('.car')).toBe(1);
      expect(value(".carManufacturer")).toBe(someCars[0].manufacturer);
    });
  });

  it('should filter the cars by the selected car type when the car type is changed', function () {
    init(someCarTypes, someCars);
    runs(function () {
      value(".selectedCarType", 1);
    });
    runs(function () {
      expect(count('.car')).toBe(1);
      expect(value(".carManufacturer")).toBe(someCars[1].manufacturer);
    });
  });

  it('should allow to logout', function () {
    init([], []);
    runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should be active when coming back from third rental page and the values should not change', function () {
    init(someCarTypes, someCars);
    runs(function () {
      value(".selectedCarType", 1);
      click(".selectCar");
    });
    runs(function () {
      expect(activePageId()).toBe('rental3Page');
    });
    runs(function () {
      click('.back');
    });
    runs(function () {
      expect(activePageId()).toBe('rental2Page');
      expect(value(".selectedCarType")).toBe('1');
    });
  });
});

