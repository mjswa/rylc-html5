describe('backendService', function () {
  var backendBaseUri = '/rylc-html5/api';
  var resourceCall, resourceDeferred;
  var $httpDefer, $rootScope, $waitDialog, $http, backendService, authenticationHeader, $q;

  beforeEach(function () {
    module("rylc-services", function ($provide) {

      $provide.factory('$http', function ($q) {
        $http = jasmine.createSpy();
        $httpDefer = $q.defer();
        $http.andReturn($httpDefer.promise);
        return $http;
      });
      $provide.factory('$waitDialog', function () {
        $waitDialog = {
          show:jasmine.createSpy(),
          hide:jasmine.createSpy()
        };
        return $waitDialog;
      });
    });
    inject(["$rootScope", "backendService", "$q", function (_$rootScope, _backendService, _$q) {
      $rootScope = _$rootScope;
      backendService = _backendService;
      $q = _$q;
    }]);

    setAuthentication("someUser", "somePassword");
  });

  function setAuthentication(username, password) {
    backendService.setCredentials(username, password);
    authenticationHeader = "Basic " + Base64.encode(username + ':' + password);
  }

  function resolveHttp(data) {
    $httpDefer.resolve(data);
    $rootScope.$digest();
  }

  function rejectHttp(data) {
    $httpDefer.reject(data);
    $rootScope.$digest();
  }

  function expectPromiseToUnpackResult(promise) {
    var expectedResult = {key:'someValue'};
    var result;
    promise.then(function (data) {
      result = data;
    });
    expect(result).toBeUndefined();

    resolveHttp({data:expectedResult});

    expect(result).toBe(expectedResult);
  }

  function expectPromiseToReturnErrorMessage(promise, errorCode, errorMessage) {
    if (!errorCode) {
      errorCode = 404;
    }
    if (!errorMessage) {
      errorMessage = "Ein unbekannter Fehler ist aufgetreten.";
    }
    var result;
    promise.then(null, function (data) {
      result = data;
    });
    expect(result).toBeUndefined();

    rejectHttp({status:errorCode});

    expect(result).toBe(errorMessage);

  }

  function expectPromiseToShowWaitDialogForSuccess(promise) {
    expect($waitDialog.show).toHaveBeenCalled();
    expect($waitDialog.hide).not.toHaveBeenCalled();
    resolveHttp({data:"someData"});
    expect($waitDialog.hide).toHaveBeenCalled();
  }

  function expectPromiseToShowWaitDialogForError(promise) {
    expect($waitDialog.show).toHaveBeenCalled();
    expect($waitDialog.hide).not.toHaveBeenCalled();
    rejectHttp({status:404});
    expect($waitDialog.hide).toHaveBeenCalled();
  }

  describe('carTypesBackground', function () {
    it('should call $http with the the correct params', function () {
      backendService.carTypesBackground();
      expect($http).toHaveBeenCalledWith({
        method:'GET',
        url:backendBaseUri + '/cartypes',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should not show a wait dialog', function () {
      backendService.carTypesBackground();
      expect($waitDialog.show).not.toHaveBeenCalled();
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.carTypesBackground());
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.carTypesBackground());
    });

    it("should cache the resulting promise", function () {
      var result1, result2;
      backendService.carTypesBackground().then(function (data) {
        result1 = data;
      });
      backendService.carTypesBackground().then(function (data) {
        result2 = data;
      });
      resolveHttp({data:"someData"});
      expect(result1).toBe(result2);
      expect($http.callCount).toBe(1);
    });

  });
  describe('carTypes', function () {
    it('should call $http with the the correct params', function () {
      backendService.carTypes();
      expect($http).toHaveBeenCalledWith({
        method:'GET',
        url:backendBaseUri + '/cartypes',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should show a wait dialog for successful result', function () {
      expectPromiseToShowWaitDialogForSuccess(backendService.carTypes());
    });

    it('should show a wait dialog for error result', function () {
      expectPromiseToShowWaitDialogForError(backendService.carTypes());
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.carTypes());
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.carTypes());
    });

    it("should cache the resulting promise", function () {
      var result1, result2;
      backendService.carTypes().then(function (data) {
        result1 = data;
      });
      backendService.carTypes().then(function (data) {
        result2 = data;
      });
      resolveHttp({data:"someData"});
      expect(result1).toBe(result2);
      expect($http.callCount).toBe(1);
    });

    it("should share the cache with carTypesBackground", function () {
      var result1, result2;
      backendService.carTypesBackground().then(function (data) {
        result1 = data;
      });
      backendService.carTypes().then(function (data) {
        result2 = data;
      });
      resolveHttp({data:"someData"});
      expect(result1).toBe(result2);
      expect($http.callCount).toBe(1);
    });

  });

  describe('citiesBackground', function () {
    it('should call $http with the the correct params', function () {
      backendService.citiesBackground();
      expect($http).toHaveBeenCalledWith({
        method:'GET',
        url:backendBaseUri + '/cities',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should not show a wait dialog', function () {
      backendService.citiesBackground();
      expect($waitDialog.show).not.toHaveBeenCalled();
    });


    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.citiesBackground());
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.citiesBackground());
    });

    it("should cache the resulting promise", function () {
      var result1, result2;
      backendService.citiesBackground().then(function (data) {
        result1 = data;
      });
      backendService.citiesBackground().then(function (data) {
        result2 = data;
      });
      resolveHttp({data:"someData"});
      expect(result1).toBe(result2);
      expect($http.callCount).toBe(1);
    });


  });
  describe('cities', function () {
    it('should call $http with the the correct params', function () {
      backendService.cities();
      expect($http).toHaveBeenCalledWith({
        method:'GET',
        url:backendBaseUri + '/cities',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should show a wait dialog for successful result', function () {
      expectPromiseToShowWaitDialogForSuccess(backendService.cities());
    });

    it('should show a wait dialog for error result', function () {
      expectPromiseToShowWaitDialogForError(backendService.cities());
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.cities());
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.cities());
    });

    it("should cache the resulting promise", function () {
      var result1, result2;
      backendService.cities().then(function (data) {
        result1 = data;
      });
      backendService.cities().then(function (data) {
        result2 = data;
      });
      resolveHttp({data:"someData"});
      expect(result1).toBe(result2);
      expect($http.callCount).toBe(1);
    });

    it("should share the cache with carTypesBackground", function () {
      var result1, result2;
      backendService.citiesBackground().then(function (data) {
        result1 = data;
      });
      backendService.cities().then(function (data) {
        result2 = data;
      });
      resolveHttp({data:"someData"});
      expect(result1).toBe(result2);
      expect($http.callCount).toBe(1);
    });


  });


  describe("rentalsByCustomerId", function () {

    it("should call with GET method at URL", function () {
      var customerId = 42;
      backendService.rentalsByCustomerId(customerId);

      expect($http).toHaveBeenCalledWith({
        url:backendBaseUri + '/rentals?customerId=' + customerId,
        method:'GET',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.rentalsByCustomerId(123));
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.rentalsByCustomerId(123));
    });

    it('should show a wait dialog for successful result', function () {
      expectPromiseToShowWaitDialogForSuccess(backendService.rentalsByCustomerId(123));
    });

    it('should show a wait dialog for error result', function () {
      expectPromiseToShowWaitDialogForError(backendService.rentalsByCustomerId(123));
    });

  });

  describe("customerByUsername", function () {

    it("should call with GET method at URL", function () {
      var username = "someUser";
      backendService.customerByUsername(username);

      expect($http).toHaveBeenCalledWith({
        url:backendBaseUri + '/customers?username=' + username,
        method:'GET',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.customerByUsername("someUser"));
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.customerByUsername("someUser"));
    });

    it('should show a wait dialog for successful result', function () {
      expectPromiseToShowWaitDialogForSuccess(backendService.customerByUsername("someUser"));
    });

    it('should show a wait dialog for error result', function () {
      expectPromiseToShowWaitDialogForError(backendService.customerByUsername("someUser"));
    });

  });


  describe("availableCars", function () {
    var someCity = 'someCity';
    var startDate = new Date(2010, 1, 1);
    var endDate = new Date(2010, 1, 2);
    var maxPrice = 100;
    it("should call with GET method at URL", function () {
      backendService.availableCars(someCity, startDate, endDate, maxPrice);

      expect($http).toHaveBeenCalledWith({
        url:backendBaseUri + '/availableCars?cityId=' + someCity + '&startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString() + '&maxPrice=' + maxPrice,
        method:'GET',
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.availableCars(someCity, startDate, endDate, maxPrice));
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.availableCars(someCity, startDate, endDate, maxPrice));
    });

    it('should show a wait dialog for successful result', function () {
      expectPromiseToShowWaitDialogForSuccess(backendService.availableCars(someCity, startDate, endDate, maxPrice));
    });

    it('should show a wait dialog for error result', function () {
      expectPromiseToShowWaitDialogForError(backendService.availableCars(someCity, startDate, endDate, maxPrice));
    });

  });

  describe("rentCar", function () {
    var someCarId = 42;
    var startDate = new Date(2010, 1, 1);
    var endDate = new Date(2010, 1, 2);

    it("should call with POST method at URL", function () {
      backendService.rentCar(someCarId, startDate, endDate);

      expect($http).toHaveBeenCalledWith({
        url:backendBaseUri + '/rental',
        method:'POST',
        data:{
          carId:someCarId,
          startDate:startDate,
          endDate:endDate
        },
        headers:{
          'Authorization':authenticationHeader
        }
      });
    });

    it('should forward the result of $http as result', function () {
      expectPromiseToUnpackResult(backendService.rentCar(someCarId, startDate, endDate));
    });

    it('should return an error message on $http error', function () {
      expectPromiseToReturnErrorMessage(backendService.rentCar(someCarId, startDate, endDate));
    });

    it('should return "Car not available" error message on 409 error', function () {
      expectPromiseToReturnErrorMessage(backendService.rentCar(someCarId, startDate, endDate),
        409, "Fahrzeug leider nicht mehr verf\u00FCgbar.");
    });

    it('should show a wait dialog for successful result', function () {
      expectPromiseToShowWaitDialogForSuccess(backendService.rentCar(someCarId, startDate, endDate));
    });

    it('should show a wait dialog for error result', function () {
      expectPromiseToShowWaitDialogForError(backendService.rentCar(someCarId, startDate, endDate));
    });

  });

  describe('login', function () {
    it('should login and get the customer by username', function () {
      var username = "username1";
      var password = "password1";
      expectPromiseToUnpackResult(backendService.login(username, password));
      authenticationHeader = "Basic " + Base64.encode(username + ':' + password);
      expect($http).toHaveBeenCalledWith({
        method:'GET',
        url:backendBaseUri + '/customers?username=' + username,
        headers:{
          'Authorization':authenticationHeader
        }
      });

    });
  });

  describe('authenticatedCustomer', function () {
    it("should return the customer loaded by login", function () {
      backendService.login("someUser", "somePassword");
      var someCustomer = {id:'someId'};
      resolveHttp({data:someCustomer});
      expect(backendService.authenticatedCustomer()).toBe(someCustomer);
    });
  });
});
