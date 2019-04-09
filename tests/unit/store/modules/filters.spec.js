import { mutations, actions } from "@/store/modules/filters";

describe("filters store module", () => {
  describe("mutations", () => {
    describe("toggle", () => {
      it("should update the state filters", () => {
        const filter = { id: 0, selected: true };
        const state = {
          filters: [
            {
              id: 0,
              selected: false
            },
            {
              id: 1,
              selected: false
            }
          ]
        };
        const expected = [
          {
            id: 0,
            selected: true
          },
          {
            id: 1,
            selected: false
          }
        ];

        mutations.toggle(state, filter);

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

    describe("toggle", () => {
      it("should commit a state mutation to toggle the filter", () => {
        const filter = { id: 0, selected: true };

        actions.toggle(context, filter);

        expect(context.commit).toHaveBeenCalled();
      });
    });
  });
});
