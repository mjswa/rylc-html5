define(function() {
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

    function builder(props, callback) {
      var res;

      function setterFor(key) {
        return function (value) {
          if (value === undefined) {
            value = true;
          }
          props[key] = value;
          return res;
        }
      }

      res = function () {
        return callback.call(this, props, arguments);
      };

      for (var key in props) {
        res[key] = setterFor(key);
      }
      res.clone = function () {
        return builder(angular.copy(props), callback);
      };
      return res;
    }

    var parseDate = supportsHtml5Date() ? parseHtml5Date : parseSimpleDate;
    var formatDate = supportsHtml5Date() ? formatHtml5Date : formatSimpleDate;
    var validateDate = supportsHtml5Date() ? validateHtml5Date : validateSimpleDate;

    return {
      parseSimpleDate: parseSimpleDate,
      formatSimpleDate: formatSimpleDate,
      validateSimpleDate: validateSimpleDate,
      parseHtml5Date: parseHtml5Date,
      formatHtml5Date: formatHtml5Date,
      validateHtml5Date: validateHtml5Date,
      parseDate: parseDate,
      formatDate: formatDate,
      validateDate: validateDate,
      dayCount: dayCount,
      builder: builder
    };
  }

  return utilsServiceFactory;
});