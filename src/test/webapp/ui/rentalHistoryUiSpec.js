describe('rentalHistory', function () {
  uit.url('/rylc-html5/index.html#rentalHistoryPage');

  var authenticatedUsername = "someUsername";
  var authenticatedCustomer = { id:42 };

  uit.append(function () {
    mockBackend();
    backendServiceResult('login').resolve(authenticatedCustomer);
  });

  beforeEach(function () {
    // TODO extract function "setAuthenticatedUser(username, customer)" and move it to testutils.js
    uit.runs(function () {
      activePageScope().auth.username = authenticatedUsername;
      activePageScope().$root.$digest();
    });
  });

  function init(method, data) {
    uit.runs(function () {
      backendServiceResult('rentalsByCustomerId')[method](data);
    });
  }

  it('should allow to logout', function () {
    init('resolve', []);
    uit.runs(function () {
      click(".logout");
      expect(backendService().logout).toHaveBeenCalled();
    });
  });

  it('should show the expected number of rentals', function () {
    var someRentals = [
      {"car":{"description":"Meriva", "id":988, "manufacturer":"Opel", "price":25.24}, "hireEndDate":new Date(2011, 10, 07), "hireStartDate":new Date(2011, 10, 07), "id":178},
      {"car":{"description":"Golf", "id":995, "manufacturer":"VW", "price":80.00}, "hireEndDate":new Date(2011, 10, 07), "hireStartDate":new Date(2011, 10, 07), "id":179},
      {"car":{"description":"Golf", "id":1008, "manufacturer":"VW", "price":100.00}, "hireEndDate":new Date(2011, 10, 07), "hireStartDate":new Date(2011, 10, 07), "id":180}
    ];
    init('resolve', someRentals);
    uit.runs(function () {
      expect(count('.rental')).toBe(someRentals.length);
    });
  });

  it('should show the expected fields for a rental', function () {
    var someRental = {"car":{"description":"Golf", "id":1008, "manufacturer":"VW", "price":100.00}, "hireEndDate":new Date(2011, 10, 07), "hireStartDate":new Date(2011, 10, 07), "id":180};
    init('resolve', [someRental]);
    uit.runs(function () {
      expect(value(".manufacturer")).toBe(someRental.car.manufacturer);
      expect(value(".description")).toBe(someRental.car.description);
      expect(value(".startDate")).toBe('07.11.2011');
      expect(value(".endDate")).toBe('07.11.2011');
      expect(value(".totalPrice")).toBe('\u20AC100.00');
    });

  });

  it('should show an info message when no rentals found', function () {
    init('resolve', []);
    uit.runs(function () {
      expect(value('.info')).toBe("Keine Daten gefunden.");
    });
  });

  it('should show an error when the backend reports an error', function () {
    var someBackendError = "someBackendError";
    init('reject', someBackendError);
    uit.runs(function () {
      expect(value('.error')).toBe(someBackendError);
    });
  });
});


