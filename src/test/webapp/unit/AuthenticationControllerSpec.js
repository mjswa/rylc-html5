describe('AuthenticationController', function () {
  var scope, loginResultDeferred;

  beforeEach(function () {
    module("rylc-controllers", function ($provide) {
      $provide.factory('backendService', function ($q) {
        loginResultDeferred = $q.defer();
        return {
          login:jasmine.createSpy().andReturn(loginResultDeferred.promise),
          carTypesBackground:jasmine.createSpy(),
          citiesBackground:jasmine.createSpy()
        };
      });
      $provide.factory('$navigate', function () {
        return jasmine.createSpy();
      });
    });
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller("rylc.AuthenticationController", {$scope: scope});
    });
  });

  describe('login', function () {
    it('should call backendService.login with username and password', inject(function (backendService) {
      var username = 'username1';
      var password = 'password1';
      scope.username = username;
      scope.password = password;
      scope.login();
      expect(backendService.login).toHaveBeenCalledWith(username, password);
    }));

    it('should navigate to the welcomePage', inject(function ($navigate, $rootScope) {
      scope.username = 'someUser';
      scope.password = 'somePassword';
      loginResultDeferred.resolve();
      scope.login();
      $rootScope.$digest();
      expect($navigate).toHaveBeenCalledWith('welcomePage.html');
    }));

    it('should update errorMessage property', inject(function ($rootScope) {
      var username = 'username1';
      var password = 'password1';
      var error = 'myerror';
      scope.username = username;
      scope.password = password;
      loginResultDeferred.reject(error);
      scope.login();
      $rootScope.$digest();
      expect(scope.errorMessage).toBe(error);
    }));
  });

  describe('loginPossible', function () {
    it('should return false when username or passwort is empty', function () {
      scope.username = "";
      scope.password = "";
      expect(scope.loginPossible()).toBeFalsy();
      scope.username = "someUsername";
      scope.password = "";
      expect(scope.loginPossible()).toBeFalsy();
      scope.username = "";
      scope.password = "somePassword";
      expect(scope.loginPossible()).toBeFalsy();
    });

    it('should return true when username and password is not empty', function () {
      scope.username = "someUsername";
      scope.password = "somePassword";
      expect(scope.loginPossible()).toBeTruthy();
    });
  });
});
