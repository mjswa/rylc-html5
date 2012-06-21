describe("rentalService", function () {
  var rentalService;

  beforeEach(function() {
    module("rylc-services");
    inject(function (_rentalService_) {
      rentalService = _rentalService_;
    });
  });

  describe("totalPrice", function () {
    it("should return zero when pricePerDay is zero", function() {
      expect(rentalService.totalPrice(0, new Date(), new Date())).toBe(0);
    });
    it("should return pricePerDay when rented one day", function () {
      expect(rentalService.totalPrice(1.5, new Date(2012, 0, 1), new Date(2012, 0, 1))).toBe(1.5);
    });
    it("should return pricePerDay times days rented", function () {
      expect(rentalService.totalPrice(1.5, new Date(2012, 0, 1), new Date(2012, 0, 5))).toBe(1.5 * 5);
    });
  });

});