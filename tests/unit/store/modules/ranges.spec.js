import { mutations, actions } from "@/store/modules/ranges";

describe("ranges store module", () => {
  describe("mutations", () => {
    describe("add", () => {
      it("should add a new default value range to the store", () => {
        const range = { originId: "test" };
        const state = { ranges: [] };

        mutations.add(state, range);

        expect(state.ranges.length).toBe(1);
        expect(state.ranges[0]).toEqual({ ...range, id: 0 });
      });

      it("should increment the id of the newly added ranges", () => {
        const range = { originId: "test" };
        const state = {
          ranges: [{ ...range, id: 0 }]
        };

        mutations.add(state, range);

        expect(state.ranges.length).toBe(2);
        expect(state.ranges).toEqual([{ ...range, id: 0 }, { ...range, id: 1 }]);
      });
    });

    describe("activate", () => {
      it("should update the value of the state activeId", () => {
        const state = {
          activeId: 0
        };

        mutations.activate(state, 1);

        expect(state.activeId).toBe(1);
      });
    });

    describe("replace", () => {
      it("should update the value of the state ranges", () => {
        const state = {
          ranges: []
        };
        const ranges = [{ id: 0 }];

        mutations.replace(state, ranges);

        expect(state.ranges).toEqual(ranges);
      });
    });
  });

  describe("actions", () => {
    const context = {
      commit: jest.fn(),
      state: {
        ranges: [{ id: "range-0" }]
      }
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("add", () => {
      it("should call the appropriate mutation and return the new id", () => {
        const range = { id: 0 };

        context.commit.mockReturnValue(0);

        actions.add(context, range);

        expect(context.commit).toHaveBeenCalledWith("add", range);
      });
    });

    describe("activate", () => {
      it("should commit an activate action with the new activeRangeId", () => {
        actions.activate(context, 0);

        expect(context.commit).toHaveBeenCalledWith("activate", 0);
      });
    });

    describe("replace", () => {
      it("should commit a replace action with the new ranges", () => {
        const ranges = [{ id: 0 }];
        actions.replace(context, ranges);

        expect(context.commit).toHaveBeenCalledWith("replace", ranges);
      });
    });
  });
});
