describeUi('rental3', '/rylc-html5/index.html#welcomePage', function () {
  var authenticatedCustomer = { id:42, name:"someName" };
  var someCity = {id:42, name:'City A'};
  var someCarType = 'CarTypeA';
  var someCar = {id:44, "carType":"CarTypeA", "description":"fortwo", "manufacturer":"smart", "price":56.00};
  var startDate = new Date(2011, 10 - 1, 10);
  var endDate = new Date(2011, 10 - 1, 11);

  beforeLoad(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
    var cities = [someCity];
    backendServiceResult('cities').resolve(cities);
    backendServiceResult('citiesBackground').resolve(cities);
    var carTypes = [someCarType];
    backendServiceResult('carTypes').resolve(carTypes);
    backendServiceResult('carTypesBackground').resolve(carTypes);
    var cars = [someCar];
    backendServiceResult('availableCars').resolve(cars);
  });

  beforeEach(function () {
    runs(function () {
      click('.newRental');
    });
    runs(function () {
      value('.startDate', formatDate(startDate));
      value('.endDate', formatDate(endDate));
      click('.search');
    });
    runs(function () {
      click('.selectCar');
    });
  });

  it('should show the rental data', function () {
    runs(function () {
      expect(value('.carManufacturer')).toBe(someCar.manufacturer);
      expect(value('.carDescription')).toBe(someCar.description);
      expect(value('.carType')).toBe(someCar.carType);
      expect(value('.city')).toBe(someCity.name);
      expect(value('.carPrice')).toBe('\u20AC' + someCar.price + '.00');
      expect(value(".startDate")).toBe(formatSimpleDate(startDate));
      expect(value(".endDate")).toBe(formatSimpleDate(endDate));
      expect(value(".totalPrice")).toBe('\u20AC112.00');
    });
  });

  it('should rent with the given data', function () {
    runs(function () {
      click('.rentCar');
    });
    runs(function () {
      expect(backendService().rentCar).toHaveBeenCalledWith(someCar.id, startDate, endDate);
    });
  });

  it('should allow to logout', function () {
    runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should show the welcome page after rent and show an error message when an error occurred', function () {
    var someBackendError = "someBackendError";
    runs(function () {
      backendServiceResult('rentCar').reject(someBackendError);
      click(".rentCar");
    });
    runs(function () {
      expect(value('.error')).toBe(someBackendError);
      expect(activePageId()).toBe('welcomePage');
    });
  });

  it('should show the welcome page after rent and show a success message when no error occurred', function () {
    runs(function () {
      backendServiceResult('rentCar').resolve([]);
      click(".rentCar");
    });
    runs(function () {
      expect(value('.success')).toBe('Bestellung erfolgreich entgegengenommen.');
      expect(activePageId()).toBe('welcomePage');
    });
  });
});

