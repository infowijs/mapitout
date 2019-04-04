import { mutations, actions } from "@/store/modules/areas";

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
    global.fetch = jest.fn();
    let context;
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
    let areasResponseJson = {
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
    };

    describe("fetch", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        context = {
          dispatch: jest.fn(),
          commit: jest.fn()
        };
      });

      it("should call fetch with the correct parameters and always call commit", async () => {
        const expectedRequest = {
          body: `{"departure_searches":[{"id":"range-0","coords":{"lat":1,"lng":1},"departure_time":"${ranges[0].departureTime.toISOString()}","travel_time":2700,"transportation":{"type":"public_transport"}},{"id":"range-1","coords":{"lat":1,"lng":2},"departure_time":"${ranges[1].departureTime.toISOString()}","travel_time":1200,"transportation":{"type":"car"}}],"unions":[{"id":"union","search_ids":["range-0","range-1"]}],"intersections":[{"id":"intersection","search_ids":["range-0","range-1"]}]}`,
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        };

        await actions.fetch(context, ranges);

        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[0][1]).toEqual(expectedRequest);

        expect(context.commit).toHaveBeenCalled();
      });

      it("should dispatch an error whenever the fetch call fails", async () => {
        global.fetch.mockRejectedValue(new Error());

        await actions.fetch(context, ranges);

        expect(context.dispatch).toHaveBeenCalled();
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
      });

      it("should dispatch an error whenever the fetch call returns an invalid response", async () => {
        global.fetch.mockResolvedValue({ ok: false });

        await actions.fetch(context, ranges);

        expect(context.dispatch).toHaveBeenCalled();
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
      });

      it("should commit a new areas value whenever a valid response is returned", async () => {
        global.fetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(areasResponseJson)
        });

        await actions.fetch(context, ranges);

        expect(context.commit).toHaveBeenCalledWith("update", [
          { id: "area-0", paths: [[{}], [{}], [{}]], rangeId: "range-0" }
        ]);
      });
    });
  });
});
