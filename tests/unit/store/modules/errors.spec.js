import { actions } from "@/store/modules/errors";

describe("errors store module", () => {
  describe("actions", () => {
    global.console = {
      error: jest.fn()
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("network", () => {
      it("should console.error the passed error", () => {
        const error = new Error();

        actions.network({}, error);

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(error);
      });
    });

    describe("generic", () => {
      it("should console.error the passed error", () => {
        const error = new Error();

        actions.generic({}, error);

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(error);
      });
    });
  });
});
