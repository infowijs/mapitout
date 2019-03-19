import { mutations, actions } from "../../../src/store";

jest.mock("../../../src/store/modules/address", () => {
  return {};
});

describe("root store", () => {
  describe("mutations", () => {
    describe("error", () => {
      it("should update the state error string", () => {
        const state = { error: "" };
        const errorMessage = "Error bad";

        mutations.error(state, errorMessage);

        expect(state.error).toEqual(errorMessage);
      });
    });
  });

  describe("actions", () => {
    let context;

    beforeEach(() => {
      context = { commit: jest.fn() };
    });

    describe("reportError", () => {
      it("should commit the newly reported error to the state", () => {
        const errorMessage = "test error message";

        actions.reportError(context, new Error(errorMessage));

        expect(context.commit).toHaveBeenCalledWith("error", errorMessage);
      });
    });
  });
});
