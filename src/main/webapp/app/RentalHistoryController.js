define(function () {
  function RentalHistoryController($scope, rentalService, backendService) {

    $scope.searchRentals = function () {
      var res = backendService.rentalsByCustomerId(backendService.authenticatedCustomer().id);
      res.then(function (data) {
        $scope.rentals = data;
      }, function (errorMessage) {
        $scope.errorMessage = errorMessage;
      });
      return res;
    };

    $scope.totalPrice = function (rental) {
      return rentalService.totalPrice(
        rental.car.price, rental.hireStartDate, rental.hireEndDate);
    };

    $scope.infoMessage = function () {
      if ($scope.rentals && $scope.rentals.length === 0) {
        return "Keine Daten gefunden.";
      } else {
        return null;
      }
    };

  }

  RentalHistoryController.$inject = ['$scope', 'rentalService', 'backendService'];

  return RentalHistoryController;
});