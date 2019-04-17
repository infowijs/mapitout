import { getters } from "@/store/modules/transports";

describe("filters store module", () => {
  describe("mutations", () => {
    describe("getTransportValueById", () => {
      const state = {
        types: [{ id: 0, value: "test" }]
      };
      it("should return the value of a type based on its id", () => {
        const result = getters.getTransportValueById(state)(0);

        expect(result).toBe(state.types[0].value);
      });

      it("should return undefined for an invalid type id", () => {
        const result = getters.getTransportValueById(state)(1);

        expect(result).toBeUndefined();
      });
    });

    describe("getTransportIconComponentById", () => {
      const state = {
        types: [{ id: 0, iconComponent: "test" }]
      };
      it("should return the value of a type based on its id", () => {
        const result = getters.getTransportIconComponentById(state)(0);

        expect(result).toBe(state.types[0].value);
      });

      it("should return undefined for an invalid type id", () => {
        const result = getters.getTransportIconComponentById(state)(1);

        expect(result).toBeUndefined();
      });
    });
  });
});
