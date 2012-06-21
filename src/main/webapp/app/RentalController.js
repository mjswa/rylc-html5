define(function () {
  function RentalController($scope, rentalService, backendService, $navigate) {
    var SUCCESS_MESSAGE = "Bestellung erfolgreich entgegengenommen.";

    $scope.clearMessages = function () {
      $scope.successMessage = null;
      $scope.errorMessage = null;
    };

    $scope.prefetchMasterData = function () {
      backendService.carTypesBackground();
      backendService.citiesBackground();
    };

    $scope.initRental = function () {
      $scope.errorMessage = null;
      $scope.successMessage = null;
      $scope.startDate = new Date();
      $scope.endDate = new Date();
      $scope.maxPrice = 100;
      $scope.endDate.setDate($scope.startDate.getDate() + 1);
      backendService.cities().then(function (cities) {
        $scope.cities = cities;
        $scope.city = cities[0];
      }, function (errorMessage) {
        $scope.errorMessage = errorMessage;
      });
      backendService.carTypes().then(function (carTypes) {
        $scope.carTypes = carTypes;
        $scope.carType = carTypes[0];
      }, function (errorMessage) {
        $scope.errorMessage = errorMessage;
      });
      $navigate('#rental1Page');
    };

    $scope.searchAvailableCars = function () {
      return backendService.availableCars($scope.city.id, $scope.startDate, $scope.endDate, $scope.maxPrice).then(
        function (cars) {
          $scope.availableCars = cars;
          $navigate("#rental2Page");
        }, function (errorMessage) {
          $scope.errorMessage = errorMessage;
        });
    };

    $scope.totalPrice = function () {
      if ($scope.car) {
        return rentalService.totalPrice($scope.car.price, $scope.startDate, $scope.endDate);
      } else {
        return 0;
      }
    };

    $scope.selectCar = function (car) {
      $scope.car = car;
      $navigate('#rental3Page');
    };

    $scope.rentCar = function () {
      return backendService.rentCar($scope.car.id, $scope.startDate, $scope.endDate).then(
        function (rental) {
          $scope.rental = rental;
          $scope.successMessage = SUCCESS_MESSAGE;
          $navigate('back:#welcomePage');
        }, function (errorMessage) {
          $scope.errorMessage = errorMessage;
          $navigate('back:#welcomePage');
        });
    };
  }

  RentalController.$inject = ['$scope', 'rentalService', 'backendService', '$navigate'];

  return RentalController;
});