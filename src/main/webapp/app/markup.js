(function (angular) {

  function simpleDateFilterFactory(utilsService) {
    return utilsService.formatSimpleDate;
  }
  simpleDateFilterFactory.$inject = ["utilsService"];

  function dateInputDirectiveFactory(utilsService) {
    return {
      require:'?ngModel',
      restrict:'E',
      link:function (scope, element, attrs, ctrl) {
        if (attrs.type === 'date') {
          ctrl.$formatters.push(function (value) {
            return utilsService.formatDate(value);
          });

          ctrl.$parsers.push(function (value) {
            var valid = utilsService.validateDate(value);
            ctrl.$setValidity('date', valid);
            var res;
            if (valid) {
              res = utilsService.parseDate(value);
            }
            return res;
          });
        }
      }
    }
  }
  dateInputDirectiveFactory.$inject = ["utilsService"];

  var module = angular.module("rylc-markup", ["rylc-services"]);
  module.filter("simpleDate", simpleDateFilterFactory);
  module.directive("input", dateInputDirectiveFactory);

})(angular);
