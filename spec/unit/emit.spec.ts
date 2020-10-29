import { attach } from "../../src/lib/attach";
import bus = require("../../src/");

describe("emit", () => {
  beforeEach(() => {
    attach();
  });

  it("should return false if event is not a string", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = bus.emit({} as any, { data: "data" });

    expect(actual).toBe(false);
  });

  it("should return false if origin is not a string", () => {
    const actual = bus
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .target({ origin: "object" } as any)
      .emit("event", { data: "data" });

    expect(actual).toBe(false);
  });

  it("should return true if origin and event are strings", () => {
    const actual = bus
      .target("https://example.com")
      .emit("event", { data: "data" });

    expect(actual).toBe(true);
  });

  it("can pass a reply function without passing data", () => {
    const actual = bus.target("https://example.com").emit("event", jest.fn());

    expect(actual).toBe(true);
  });
});
