import { mutations, actions } from "@/store/modules/areas";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("areas store module", () => {
  describe("mutations", () => {
    describe("update", () => {
      it("should update the state areas", () => {
        const newAreas = [{ id: "area-0" }];
        const state = {
          areas: []
        };

        mutations.update(state, newAreas);

        expect(state.areas).toEqual(newAreas);
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn()
    };

    let ranges = [
      {
        id: "range-0",
        originCoordinates: { lat: 1, lng: 1 },
        travelTime: 45,
        transportType: "public_transport",
        departureTime: new Date()
      },
      {
        id: "range-1",
        originCoordinates: { lat: 1, lng: 2 },
        travelTime: 20,
        transportType: "car",
        departureTime: new Date()
      }
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("fetch", () => {
      it("should call fetch with the correct request object", () => {
        const expectedRequest = {
          body: `{"departure_searches":[{"id":"range-0","coords":{"lat":1,"lng":1},"departure_time":"${ranges[0].departureTime.toISOString()}","travel_time":2700,"transportation":{"type":"public_transport"}},{"id":"range-1","coords":{"lat":1,"lng":2},"departure_time":"${ranges[1].departureTime.toISOString()}","travel_time":1200,"transportation":{"type":"car"}}],"unions":[{"id":"union","search_ids":["range-0","range-1"]}],"intersections":[{"id":"intersection","search_ids":["range-0","range-1"]}]}`,
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        };

        actions.fetch(context, ranges);

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual(expectedRequest);
      });

      it("should commit a populated areas array whenever a valid response is returned", async () => {
        http.mockResolvedValue({
          results: [
            {
              search_id: "range-0",
              shapes: [
                {
                  shell: [{}],
                  holes: [[{}], [{}]]
                }
              ]
            }
          ]
        });

        await actions.fetch(context, ranges);

        expect(context.commit).toHaveBeenCalledWith("update", [
          { id: "area-0", paths: [[{}], [{}], [{}]], rangeId: "range-0" }
        ]);
      });

      it("should commit an empty array and dispatch an error whenever the http call fails", async () => {
        http.mockRejectedValue(new Error());

        await actions.fetch(context, ranges);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("update", []);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });
  });
});
