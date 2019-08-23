import config from "./config";
import MESSAGE_TYPES from "app/base/constants";

describe("config actions", () => {
  it("should handle fetching config", () => {
    expect(config.fetch()).toEqual({
      type: "FETCH_CONFIG",
      meta: {
        model: "config",
        method: "list",
        type: MESSAGE_TYPES.REQUEST
      }
    });
  });

  it("should handle saving config", () => {
    const values = {
      maas_name: "bionic-maas",
      enable_analytics: true
    };

    expect(config.update(values)).toEqual({
      type: "UPDATE_CONFIG",
      payload: {
        params: [
          { name: "maas_name", value: "bionic-maas" },
          { name: "enable_analytics", value: true }
        ]
      },
      meta: {
        model: "config",
        method: "update",
        type: MESSAGE_TYPES.REQUEST
      }
    });
  });
});
