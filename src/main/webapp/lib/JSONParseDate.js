(function (JSON) {
  function isString(value) {
    return typeof value == 'string';
  }

  var ISO_8601_RE = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;

  var _parse = JSON.parse;
  JSON.parse = function (object, callback) {
    return _parse(object, function (key, value) {
      var result = value;
      if (isString(result) && ISO_8601_RE.test(result)) {
        result = new Date(result);
      }
      if (callback) {
        result = callback(key, result);
      }
      return result;
    });
  };
})(window.JSON);
