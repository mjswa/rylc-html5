(function (angular, Base64) {

  function configureHttp($httpProvider) {
    $httpProvider.defaults.headers.post = {'Content-Type':'application/json'};
  }
  configureHttp.$inject = ["$httpProvider"];

  /*
   * utilsService
   */

  function utilsServiceFactory() {

    function parseSimpleDate(dateAsString) {
      if (!dateAsString) {
        return undefined;
      }
      var parts = dateAsString.split('.');
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    function formatSimpleDate(date) {
      if (!date) {
        return undefined;
      }
      var month = String(date.getMonth() + 1);
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = String(date.getDate());
      if (day.length == 1) {
        day = "0" + day;
      }
      return day + "." + month + "." + date.getFullYear();
    }

    function validateSimpleDate(dateAsString) {
      var simpleDateRegex = /^\d\d?\.\d\d?\.\d\d(\d\d)?$/;
      return dateAsString && dateAsString.match(simpleDateRegex);
    }

    function parseHtml5Date(dateAsString) {
      if (!dateAsString) {
        return undefined;
      }
      var parts = dateAsString.split('-');
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    function formatHtml5Date(date) {
      if (!date) {
        return undefined;
      }
      var month = String(date.getMonth() + 1);
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = String(date.getDate());
      if (day.length == 1) {
        day = "0" + day;
      }
      return date.getFullYear() + '-' + month + "-" + day;
    }

    function validateHtml5Date(dateAsString) {
      var dateRegex = /^\d\d\d\d-\d\d-\d\d$/;
      return dateAsString && dateAsString.match(dateRegex);
    }

    var _html5DateSupport;

    function supportsHtml5Date() {
      if (_html5DateSupport === undefined) {
        var d = document.createElement('input');
        d.setAttribute('type', 'date');
        _html5DateSupport = d.type === 'date';
      }
      return _html5DateSupport;
    }

    function dayCount(startDate, endDate) {
      return 1 + (endDate - startDate) / 1000 / 60 / 60 / 24;
    }

    var parseDate = supportsHtml5Date() ? parseHtml5Date : parseSimpleDate;
    var formatDate = supportsHtml5Date() ? formatHtml5Date : formatSimpleDate;
    var validateDate = supportsHtml5Date() ? validateHtml5Date : validateSimpleDate;

    return {
      parseSimpleDate:parseSimpleDate,
      formatSimpleDate:formatSimpleDate,
      validateSimpleDate:validateSimpleDate,
      parseHtml5Date:parseHtml5Date,
      formatHtml5Date:formatHtml5Date,
      validateHtml5Date:validateHtml5Date,
      parseDate:parseDate,
      formatDate:formatDate,
      validateDate:validateDate,
      dayCount:dayCount
    };
  }

  /*
   * backendService
   */

  function backendServiceFactory($http, $q, $waitDialog) {
    var backendBaseUri = '/rylc-html5/api';
    var defaultErrorCodeMessageMapping = {
      401:'Zugriff verweigert.',
      0:'Ein unbekannter Fehler ist aufgetreten.'
    };

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

  /*
   * rentalService
   */

  function rentalServiceFactory(utilsService) {

    function totalPrice(pricePerDay, startDate, endDate) {
      return pricePerDay * utilsService.dayCount(startDate, endDate);
    }

    return {
      totalPrice:totalPrice
    }
  }

  rentalServiceFactory.$inject = ["utilsService"];

  /*
   * define angular module
   */

  var module = angular.module("rylc-services", []);
  module.config(configureHttp);
  module.factory("utilsService", utilsServiceFactory);
  module.factory("backendService", backendServiceFactory);
  module.factory("rentalService", rentalServiceFactory);

})(angular, Base64);
