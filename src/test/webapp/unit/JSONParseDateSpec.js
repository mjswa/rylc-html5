describe('JSON.parse', function () {
  it("should parse dates in ISO 8601 format in objects", function () {
    var dateString = "2011-05-28T00:00:01.000Z";

    expect(JSON.parse('{"a": "' + dateString + '"}')).toEqual({a:new Date(dateString)});
  });

  it("should parse dates in ISO 8601 format in nested objects", function () {
    var dateString = "2011-05-28T00:00:01.000Z";

    expect(JSON.parse('{"a": {"b": "' + dateString + '"}}')).toEqual({a:{b:new Date(dateString)}});
  });

  it("should leave non ISO strings untouched", function () {
    var someString = "someString";

    expect(JSON.parse('{"a": "' + someString + '"}')).toEqual({a:someString});
  });

  it("should use the given callback", function () {
    var someString = "someString";
    expect(JSON.parse('{}', function (key, value) {
      return someString
    })).toEqual(someString);
  });

  it("should use the given callback after the date parsing", function () {
    var dateString = "2011-05-28T00:00:01.000Z";

    expect(JSON.parse('{"a": "' + dateString + '"}', function (key, value) {
      if (key === "a") {
        return {"b":value};
      }
      return value;
    })).toEqual({a:{b:new Date(dateString)}});
  });


});