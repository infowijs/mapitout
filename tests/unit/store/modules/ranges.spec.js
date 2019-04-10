import { mutations, actions, DEFAULT_RANGE } from "@/store/modules/ranges";

describe("ranges store module", () => {
  describe("mutations", () => {
    describe("add", () => {
      it("should add a new default value range to the store", () => {
        const state = { ranges: [] };

        mutations.add(state);

        expect(state.ranges.length).toBe(1);
        expect(state.ranges[0]).toEqual({ ...DEFAULT_RANGE, id: "range-0" });
      });

      it("should increment the id of the newly added ranges", () => {
        const state = {
          ranges: [{ id: "range-0" }]
        };

        mutations.add(state);

        expect(state.ranges[1]).toEqual({ ...DEFAULT_RANGE, id: "range-1" });
      });
    });

    describe("update", () => {
      it("should update the passed in range in the ranges array", () => {
        const updated = {
          id: "range-1",
          value: 1
        };
        const state = {
          ranges: [{ id: "range-0" }, { id: "range-1" }]
        };

        mutations.update(state, updated);

        expect(state.ranges[0]).toEqual({ id: "range-0" });
        expect(state.ranges[1]).toEqual(updated);
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

    describe("update", () => {
      it("should call the appropriate mutation", () => {
        const updated = { id: "range-0" };
        actions.update(context, updated);

        expect(context.commit).toHaveBeenCalledWith("update", updated);
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
