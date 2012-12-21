define(function () {
  function AuthenticationController($scope, backendService, $location) {

    $scope.login = function () {
      return backendService.login($scope.username, $scope.password).then(function () {
          $location.url('#welcomePage');
      }, function (errorMessage) {
        $scope.errorMessage = errorMessage;
      });
    };

    $scope.loginPossible = function () {
      return $scope.username && $scope.password;
    };

    $scope.logout = function () {
      backendService.logout();
    };

    $scope.customer = function () {
      return backendService.authenticatedCustomer();
    };

  }

  AuthenticationController.$inject = ['$scope', 'backendService', '$location'];

  return AuthenticationController;
});