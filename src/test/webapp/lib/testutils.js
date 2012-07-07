jasmineui.inject(function () {

  // disable transitions and speed up timeout during ui tests for better test performance
  function jqueryMobileSpeedup() {
    // Allow at most 20ms as timeouts.
    var oldTimeout = window.setTimeout;
    window.setTimeout = function (fn, delay) {
      if (delay > 20) {
        delay = 20;
      }
      return oldTimeout.call(this, fn, delay);
    };

    // Disable transitions
    beforeLoad(function () {
      $.mobile.defaultPageTransition = "none";
      $.mobile.defaultDialogTransition = "none";
    });
  }

  jqueryMobileSpeedup();

  // -----

  var angularBackendServiceResults = {};

  function angularBackendServiceResult($q, name) {
    var res = backendServiceResult[name];
    if (!res) {
      res = angularBackendServiceResults[name] = $q.defer();
      if (programmedBackendServiceResults[name]) {
        programmedBackendServiceResults[name].apply(res);
      }
    }
    return res;
  }

  function createMockBackendService($q, service) {
    return jasmine.createSpy(service).andCallFake(function () {
      return angularBackendServiceResult($q, service).promise;
    });
  }

  var programmedBackendServiceResults = {};

  function backendServiceResult(serviceName) {
    var res = programmedBackendServiceResults[serviceName];
    if (!res) {
      res = {
        resolve:function (data) {
          this.apply = function (defer) {
            defer.resolve(data);
            $("body").scope().$apply();
          };
          if (angularBackendServiceResults[serviceName]) {
            this.apply(angularBackendServiceResults[serviceName]);
          }
        },
        reject:function (data) {
          this.apply = function (defer) {
            defer.reject(data);
            $("body").scope().$apply();
          };
          if (angularBackendServiceResults[serviceName]) {
            this.apply(angularBackendServiceResults[serviceName]);
          }
        },
        clear:function () {
          delete programmedBackendServiceResults[serviceName];
          delete angularBackendServiceResults[serviceName];
          return backendServiceResult(serviceName);
        }
      };
    }
    return programmedBackendServiceResults[serviceName] = res;
  }

  function mockBackend() {
    var services = ['carTypesBackground',
      'carTypes',
      'citiesBackground',
      'cities',
      'customerByUsername',
      'rentalsByCustomerId',
      'availableCars',
      'rentCar',
      'login',
      'logout',
      'promo'];

    function backendServiceFactory($q) {
      var res = {};
      var customer;
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        res[service] = createMockBackendService($q, service);
      }
      angularBackendServiceResult($q, 'login').promise.then(function (c) {
        customer = c;
      });
      res.authenticatedCustomer = function () {
        return customer;
      };
      return res;
    }

    backendServiceFactory.$inject = ['$q'];
    angular.module(["rylc-services"]).factory('backendService', backendServiceFactory);
  }

  function backendService() {
    return $("body").injector().get("backendService");
  }

  // -----

  function activePage() {
    return $.mobile.activePage;
  }

  function activePageId() {
    if (activePage() == null) {
      throw new Error("No active page found.");
    }
    return activePage().attr('id');
  }

  function activatePage$(selector) {
    return $(selector, activePage());
  }

  function activePageScope() {
    if (activePage() == null) {
      throw new Error("No active page found.");
    }
    return activePage().scope();
  }

  function click(selector) {
    var element = activatePage$(selector);
    if (element.length !== 1) {
      throw new Error("No unique element found for " + selector);
    }
    if (element.attr("type")==="submit") {
      element.submit();
    } else {
      element.click();
    }
    element.scope().$root.$digest();
  }

  function count(selector) {
    var element = activatePage$(selector);
    return element.length;
  }

  function enabled(selector) {
    var element = activatePage$(selector);
    if (element.length !== 1) {
      throw new Error("No unique element found for " + selector);
    }
    return !element.attr('disabled');
  }

  function hasValidationError(selector) {
    var element = activatePage$(selector);
    if (element.length !== 1) {
      throw new Error("No unique element found for " + selector);
    }
    return element.hasClass('ng-invalid');
  }

  function value(selector, value) {
    var element = activatePage$(selector);
    if (element.length !== 1) {
      throw new Error("No unique element found for " + selector);
    }
    if (arguments.length === 1) {
      var elementName = element[0].nodeName.toUpperCase();
      if (elementName === 'INPUT' || elementName === 'SELECT') {
        return element.val();
      } else {
        return element.text();
      }
    }
    element.val(value);
    triggerChangeEvent(element);
    element.scope().$root.$digest();
  }

  var inputEventSupported = "oninput" in document.createElement('div');

  function triggerChangeEvent(element) {
    if (element[0].tagName.toLowerCase() === 'input' && inputEventSupported) {
      element.trigger('input');
    } else {
      element.trigger('change');
    }
  }

  // -----

  function formatSimpleDate(date) {
    var injector = $(document.documentElement).injector();
    return injector.get("utilsService").formatSimpleDate(date);
  }

  function formatDate(date) {
    var injector = $(document.documentElement).injector();
    return injector.get("utilsService").formatDate(date);
  }

  // -----
  function mockPhonegap() {
    var services = ['scan'];

    function phonegapServiceFactory($q) {
      var res = {};
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        res[service] = createMockBackendService($q, service);
      }
      return res;
    }

    phonegapServiceFactory.$inject = ['$q'];
    angular.module(["rylc-services"]).factory('phonegapService', phonegapServiceFactory);
  }

  function phonegapService() {
    return $("body").injector().get("phonegapService");
  }

  // -----

  window.mockBackend = mockBackend;
  window.backendService = backendService;
  window.backendServiceResult = backendServiceResult;

  window.activePageId = activePageId;
  window.activePageScope = activePageScope;
  window.count = count;
  window.click = click;
  window.enabled = enabled;
  window.hasValidationError = hasValidationError;
  window.value = value;

  window.formatSimpleDate = formatSimpleDate;
  window.formatDate = formatDate;

  window.mockPhonegap = mockPhonegap;
  window.phonegapService = phonegapService;
  window.phonegapServiceResult = backendServiceResult;

});
