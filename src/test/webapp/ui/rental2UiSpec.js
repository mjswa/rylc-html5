describe('rental2', function () {
  uit.url('/rylc-html5/index.html#welcomePage');
  
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

  uit.append(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
    backendServiceResult('cities').resolve(someCities);
    backendServiceResult('citiesBackground').resolve(someCities);
  });

  beforeEach(function () {
    uit.runs(function () {
      click('.newRental');
    });
    uit.runs(function () {
      click('.search');
    });
  });

  function init(carTypes, cars) {
    uit.runs(function () {
      backendServiceResult('carTypes').resolve(carTypes);
      backendServiceResult('carTypesBackground').resolve(carTypes);
      backendServiceResult('availableCars').resolve(cars);
    });
  }

  it('should show the expected number of carTypes', function () {
    init(someCarTypes, []);
    uit.runs(function () {
      expect(count("select.selectedCarType > option")).toBe(someCarTypes.length);
    });
  });

  it('should show the car type name', function () {
    init([someCarType], []);
    uit.runs(function () {
      expect(value("select.selectedCarType > option")).toBe(someCarType);
    });
  });

  it('should select the first car type when the page is visited', function () {
    init(someCarTypes, []);
    uit.runs(function () {
      expect(value("select.selectedCarType")).toBe('0');
    });
  });

  it('should show the car fields', function () {
    init([someCarType], [someCar]);
    uit.runs(function () {
      expect(value(".carManufacturer")).toBe(someCar.manufacturer);
      expect(value(".carDescription")).toBe(someCar.description);
      expect(value(".carPrice")).toBe('\u20AC' + someCar.price + '.00');
    });
  });

  it('should filter the cars by the selected car type when the page is visited', function () {
    init(someCarTypes, someCars);
    uit.runs(function () {
      expect(count('.car')).toBe(1);
      expect(value(".carManufacturer")).toBe(someCars[0].manufacturer);
    });
  });

  it('should filter the cars by the selected car type when the car type is changed', function () {
    init(someCarTypes, someCars);
    uit.runs(function () {
      value("select.selectedCarType", 1);
    });
    uit.runs(function () {
      expect(count('.car')).toBe(1);
      expect(value(".carManufacturer")).toBe(someCars[1].manufacturer);
    });
  });

  it('should allow to logout', function () {
    init([], []);
    uit.runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should be active when coming back from third rental page and the values should not change', function () {
    init(someCarTypes, someCars);
    uit.runs(function () {
      value("select.selectedCarType", 1);
      click(".selectCar");
    });
    uit.runs(function () {
      expect(activePageId()).toBe('rental3Page');
    });
    uit.runs(function () {
      click('.back');
    });
    uit.runs(function () {
      expect(activePageId()).toBe('rental2Page');
      expect(value("select.selectedCarType")).toBe('1');
    });
  });
});

