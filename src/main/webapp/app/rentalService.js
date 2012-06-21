define(function() {
  function rentalServiceFactory(utilsService) {

    function totalPrice(pricePerDay, startDate, endDate) {
      return pricePerDay * utilsService.dayCount(startDate, endDate);
    }

    return {
      totalPrice:totalPrice
    }
  }

  rentalServiceFactory.$inject = ["utilsService"];

  return rentalServiceFactory;

});