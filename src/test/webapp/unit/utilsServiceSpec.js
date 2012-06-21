describe("utilsService", function () {

  beforeEach(function () {
    module('rylc-services');
  });

  describe("parseSimpleDate", function () {
    it("should return expected date for valide date string", inject(function (utilsService) {
      var dateAsString = "25.05.2011";
      var expectedDate = new Date(2011, 5 - 1, 25);
      expect(expectedDate).toEqual(utilsService.parseSimpleDate(dateAsString));
    }));

    it("should return undefined if parameter is falsy", inject(function (utilsService) {
      expect(utilsService.parseSimpleDate(undefined)).toBeUndefined();
      expect(utilsService.parseSimpleDate(null)).toBeUndefined();
      expect(utilsService.parseSimpleDate("")).toBeUndefined();
    }));
  });

  describe("parseHtml5Date", function () {
    it("should return expected date for valide date string", inject(function (utilsService) {
      var dateAsString = "2011-05-25";
      var expectedDate = new Date(2011, 5 - 1, 25);
      expect(expectedDate).toEqual(utilsService.parseHtml5Date(dateAsString));
    }));

    it("should return undefined if parameter is falsy", inject(function (utilsService) {
      expect(utilsService.parseHtml5Date(undefined)).toBeUndefined();
      expect(utilsService.parseHtml5Date(null)).toBeUndefined();
      expect(utilsService.parseHtml5Date("")).toBeUndefined();
    }));
  });

  describe("formatSimpleDate", function () {
    it("should return undefined if date is falsy", inject(function (utilsService) {
      expect(utilsService.formatSimpleDate(undefined)).toBeUndefined();
      expect(utilsService.formatSimpleDate(null)).toBeUndefined();
    }));

    it("should return well formatted date as String", inject(function (utilsService) {
      var dateToBeFormatted = new Date(2010, 4, 5);
      var expectedString = "05.05.2010";
      expect(expectedString).toEqual(utilsService.formatSimpleDate(dateToBeFormatted));
      dateToBeFormatted = new Date(2010, 11, 11);
      expectedString = "11.12.2010";
      expect(expectedString).toEqual(utilsService.formatSimpleDate(dateToBeFormatted));
    }));
  });

  describe("formatHtml5Date", function () {
    it("should return undefined if date is falsy", inject(function (utilsService) {
      expect(utilsService.formatHtml5Date(undefined)).toBeUndefined();
      expect(utilsService.formatHtml5Date(null)).toBeUndefined();
    }));

    it("should return well formatted date as String", inject(function (utilsService) {
      var dateToBeFormatted = new Date(2010, 4, 5);
      var expectedString = "2010-05-05";
      expect(expectedString).toEqual(utilsService.formatHtml5Date(dateToBeFormatted));
      dateToBeFormatted = new Date(2010, 11, 11);
      expectedString = "2010-12-11";
      expect(expectedString).toEqual(utilsService.formatHtml5Date(dateToBeFormatted));
    }));
  });

  describe("validateSimpleDate", function () {
    it("should return truthy if date format matches", inject(function (utilsService) {
      expect(utilsService.validateSimpleDate("25.05.2011")).toBeTruthy();
    }));

    it("should return falsy if date format does not match", inject(function (utilsService) {
      expect(utilsService.validateSimpleDate("2010/13/30")).toBeFalsy();
    }));
  });

  describe("validateHtml5Date", function () {
    it("should return truthy if date format matches", inject(function (utilsService) {
      expect(utilsService.validateHtml5Date("2011-05-25")).toBeTruthy();
    }));

    it("should return falsy if date format does not match", inject(function (utilsService) {
      expect(utilsService.validateHtml5Date("2010/13/30")).toBeFalsy();
    }));
  });

  describe("dayCount", function () {
    it("should return expected count", inject(function (utilsService) {
      var startDate = new Date(2011, 1, 1);
      var endDate = new Date(2011, 1, 11);
      expect(utilsService.dayCount(startDate, endDate)).toEqual(11);
    }));
  });

  describe("builder", function () {
    it("should call the callback with the given properties and arguments if no setter is called", inject(function (utilsService) {
      var callback = jasmine.createSpy("callback");
      var props = { key1:"val1", key2:"val2" };
      var arg1 = "arg1", arg2 = "arg2";
      utilsService.builder(props, callback)(arg1, arg2);
      expect(callback).toHaveBeenCalledWith(props, [arg1, arg2]);
    }));
  });
});
