import bus = require("../../src/lib/framebus");

describe("_dispatch", function () {
  it("should execute subscribers for the given event and origin", function () {
    const subscriber = jest.fn();
    const origin = "https://example.com";

    bus.target(origin).subscribe("test event", subscriber);

    bus._dispatch(origin, "test event", { data: "data" });

    expect(subscriber).toBeCalled();
    // eslint-disable-next-line no-undefined
    expect(subscriber).toBeCalledWith({ data: "data" }, undefined);
  });

  it("should not execute subscribers for a different event", function () {
    const subscriber = jest.fn();
    const origin = "https://example.com";

    bus.target(origin).subscribe("test event", subscriber);

    bus._dispatch(origin, "different event", { data: "data" });

    expect(subscriber).not.toBeCalled();
  });

  it("should not execute subscribers for a different domain", function () {
    const subscriber = jest.fn();
    const origin = "https://example.com";

    bus.target(origin).subscribe("test event", subscriber);

    bus._dispatch("https://domain.com", "test event", { data: "data" });

    expect(subscriber).not.toBeCalled();
  });

  it("can pass a reply handler", function () {
    const subscriber = jest.fn();
    const reply = jest.fn();
    const origin = "https://example.com";

    bus.target(origin).subscribe("test event", subscriber);

    bus._dispatch(origin, "test event", { data: "data" }, reply);

    expect(subscriber).toBeCalled();
    expect(subscriber).toBeCalledWith({ data: "data" }, reply);
  });
});
