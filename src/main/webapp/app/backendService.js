define(function () {
  function backendServiceFactory($http, $q, $waitDialog) {
    var defaultErrorCodeMessageMapping = {
      401:'Zugriff verweigert.',
      0:'Ein unbekannter Fehler ist aufgetreten.'
    };

    var backendBaseUri = '/rylc-html5/api';

    var carTypesPromise, citiesPromise, authorizationHeader, _authenticationCustomer;

    function carTypesBackground() {
      if (!carTypesPromise) {
        carTypesPromise = unpackPromiseAndHandleErrorCodes($http({
          url:backendBaseUri + '/cartypes',
          method:'GET',
          headers:{
            'Authorization':authorizationHeader
          }
        }));
      }
      return carTypesPromise;
    }

    function carTypes() {
      return showWaitDialogWhile(carTypesBackground());
    }

    function citiesBackground() {
      if (!citiesPromise) {
        citiesPromise = unpackPromiseAndHandleErrorCodes($http({
          url:backendBaseUri + '/cities',
          method:'GET',
          headers:{
            'Authorization':authorizationHeader
          }
        }));
      }
      return citiesPromise;
    }

    function cities() {
      return showWaitDialogWhile(citiesBackground());
    }

    function rentalsByCustomerId(customerId) {
      return showWaitDialogWhile(unpackPromiseAndHandleErrorCodes($http({
        url:backendBaseUri + '/rentals?customerId=' + customerId,
        method:'GET',
        headers:{
          'Authorization':authorizationHeader
        }
      })));
    }

    function customerByUsername(username) {
      return showWaitDialogWhile(unpackPromiseAndHandleErrorCodes($http({
        url:backendBaseUri + '/customers?username=' + username,
        method:'GET',
        headers:{
          'Authorization':authorizationHeader
        }
      })));
    }

    function availableCars(cityId, startDate, endDate, maxPrice) {
      return showWaitDialogWhile(unpackPromiseAndHandleErrorCodes($http({
        url:backendBaseUri + '/availableCars?cityId=' + cityId + '&startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString() + '&maxPrice=' + maxPrice,
        method:'GET',
        headers:{
          'Authorization':authorizationHeader
        }
      })));
    }

    function rentCar(carId, startDate, endDate) {
      var errorCodeMapping = {
        409:"Fahrzeug leider nicht mehr verf\u00FCgbar."
      };
      return showWaitDialogWhile(unpackPromiseAndHandleErrorCodes($http({
        url:backendBaseUri + '/rental',
        method:'POST',
        data:{
          carId:carId,
          startDate:startDate,
          endDate:endDate
        },
        headers:{
          'Authorization':authorizationHeader
        }
      }), errorCodeMapping));
    }

    function setCredentials(username, password) {
      authorizationHeader = "Basic " + Base64.encode(username + ':' + password);
    }

    function login(username, password) {
      setCredentials(username, password);
      return customerByUsername(username).then(function (data) {
        return _authenticationCustomer = data;
      }, function (data) {
        return $q.reject(data);
      });
    }

    function authenticatedCustomer() {
      return _authenticationCustomer;
    }

    function logout() {
      var url = location.href;
      var lastSlash = url.lastIndexOf('/');
      location.href = url.substring(0, lastSlash) + '/index.html';
    }

    function showWaitDialogWhile(promise) {
      $waitDialog.show();
      return promise.then(function (response) {
        $waitDialog.hide();
        return response;
      }, function (response) {
        $waitDialog.hide();
        return $q.reject(response);
      });
    }

    function unpackPromiseAndHandleErrorCodes(promise, errorCodeMessageMapping) {
      return promise.then(function (response) {
        return response.data;
      }, function (response) {
        var errorCode = response.status;
        var errorMessage;
        if (errorCodeMessageMapping) {
          errorMessage = errorCodeMessageMapping[errorCode];
        }
        if (!errorMessage) {
          errorMessage = defaultErrorCodeMessageMapping[errorCode];
        }
        if (!errorMessage) {
          errorMessage = defaultErrorCodeMessageMapping[0];
        }

        return $q.reject(errorMessage);
      });
    }

    return {
      carTypes:carTypes,
      carTypesBackground:carTypesBackground,
      cities:cities,
      citiesBackground:citiesBackground,
      rentalsByCustomerId:rentalsByCustomerId,
      customerByUsername:customerByUsername,
      availableCars:availableCars,
      rentCar:rentCar,
      login:login,
      setCredentials:setCredentials,
      authenticatedCustomer:authenticatedCustomer,
      logout:logout
    }
  }

  backendServiceFactory.$inject = ["$http", "$q", "$waitDialog"];

  return backendServiceFactory;
});