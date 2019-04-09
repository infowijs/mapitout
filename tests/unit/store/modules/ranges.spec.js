import { mutations, actions, getters, DEFAULT_RANGE } from "@/store/modules/ranges";

describe("ranges store module", () => {
  describe("getters", () => {
    describe("rangesWithOrigin", () => {
      it("should add a new default value range to the store", () => {
        const rangesWithOrigin = [{ originId: "test" }, { originId: "test2" }];
        const state = {
          ranges: [...rangesWithOrigin, { rangeId: "range-0" }, { rangeId: "range-1" }]
        };

        const result = getters.rangesWithOrigin(state);
        expect(result).toEqual(rangesWithOrigin);
      });
    });
  });

  describe("mutations", () => {
    describe("add", () => {
      it("should add a new default value range to the store", () => {
        const state = { ranges: [] };

        mutations.add(state);

        expect(state.ranges.length).toBe(1);
        expect(state.ranges[0]).toEqual({ id: "range-0", ...DEFAULT_RANGE });
      });

      it("should properly increment the id of the newly added ranges", () => {
        const state = {
          ranges: [{ id: "range-0" }]
        };

        mutations.add(state);

        expect(state.ranges[1]).toEqual({ id: "range-1", ...DEFAULT_RANGE });
      });
    });

    describe("remove", () => {
      it("should remove the corresponding range from the state", () => {
        const state = {
          ranges: [{ id: "test-id" }, { id: "test-id1" }]
        };

        mutations.remove(state, "test-id");

        expect(state.ranges.length).toBe(1);
      });

      it("should never remove the last range of the array", () => {
        const state = {
          ranges: [{ id: "test-id" }]
        };

        mutations.remove(state, "test-id");

        expect(state.ranges.length).toBe(1);
      });

      it("should do nothing if passed an invalid id", () => {
        const state = {
          ranges: [{ id: "range-0" }, { id: "range-1" }]
        };

        mutations.remove(state, "test-id");

        expect(state.ranges.length).toBe(2);
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
      it("should call the appropriate mutation", () => {
        actions.add(context);

        expect(context.commit).toHaveBeenCalledWith("add");
      });
    });

    describe("remove", () => {
      it("should call the appropriate mutation", () => {
        const id = "range-0";
        actions.remove(context, id);

        expect(context.commit).toHaveBeenCalledWith("remove", id);
      });
    });
  });
});
