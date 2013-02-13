(function () {
  var uit = uitest.current;
  uit.feature("xhrSensor", "timeoutSensor", "intervalSensor", "jqmAnimationSensor", "angularIntegration", "mobileViewport");

  // disable transitions and speed up timeout during ui tests for better test performance
  function jqueryMobileSpeedup() {
    uit.prepend(function(window) {
      // Allow at most 20ms as timeouts.
      var oldTimeout = window.setTimeout;
      window.setTimeout = function (fn, delay) {
        if (delay > 20) {
          delay = 20;
        }
        return oldTimeout.call(this, fn, delay);
      };
    });
    uit.append(function($) {
      // Disable transitions
      $.mobile.defaultPageTransition = "none";
      $.mobile.defaultDialogTransition = "none";
    });
  }

  jqueryMobileSpeedup();

  var angularBackendServiceResults,
      programmedBackendServiceResults;

  uit.append(function() {
    angularBackendServiceResults = {};
    programmedBackendServiceResults = {};
  });


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

  function backendServiceResult(serviceName) {
    var res = programmedBackendServiceResults[serviceName];
    if (!res) {
      res = {
        resolve:function (data) {
          this.apply = function (defer) {
            uit.inject(function($rootScope) {
              defer.resolve(data);
              $rootScope.$apply();
            });
          };
          if (angularBackendServiceResults[serviceName]) {
            this.apply(angularBackendServiceResults[serviceName]);
          }
        },
        reject:function (data) {
          this.apply = function (defer) {
            uit.inject(function($rootScope) {
              defer.reject(data);
              $rootScope.$apply();
            });
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
    return uit.inject(function(angular) {
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
    });
  }

  function backendService() {
    return uit.inject(function(backendService) {
      return backendService;
    });
  }

  // -----

  function activePage() {
    return uit.inject(function($) {
      return $.mobile.activePage;
    });
  }

  function activePageId() {
    if (activePage() == null) {
      throw new Error("No active page found.");
    }
    return activePage().attr('id');
  }

  function activatePage$(selector) {
    return uit.inject(function($) {
      return $(selector, activePage());
    });
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
    return uit.inject(function(utilsService) {
      return utilsService.formatSimpleDate(date);
    });
  }

  function formatDate(date) {
    return uit.inject(function(utilsService) {
      return utilsService.formatDate(date);
    });
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
    return uit.inject(function(phonegapService) {
      return phonegapService;
    });
  }

  // -----

  window.uit = uit;
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

})();
