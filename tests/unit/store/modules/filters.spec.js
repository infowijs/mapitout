import { mutations, actions } from "@/store/modules/filters";

describe("filters store module", () => {
  describe("mutations", () => {
    describe("select", () => {
      it("should update the state filters based on selectedIds passed", () => {
        const filter1 = { id: 0, selected: false };
        const filter2 = { id: 1, selected: true };
        const state = {
          filters: [filter1, filter2]
        };
        const expected = [
          filter1,
          {
            ...filter2,
            selected: true
          }
        ];

        mutations.select(state, [1]);

        expect(state.filters).toEqual(expected);
      });
    });
  });

  describe("actions", () => {
    const context = {
      commit: jest.fn()
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("select", () => {
      it("should commit a state mutation to select the filter ids", () => {
        const filters = [{ id: 0, selected: true }];

        actions.select(context, filters);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("select", filters);
      });
    });
  });
});
