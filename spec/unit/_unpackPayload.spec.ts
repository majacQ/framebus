import bus = require("../../src/lib/framebus");
import type {
  FramebusPayload,
  SubscriberArg,
  SubscribeHandler,
} from "../../src/lib/types";

const messagePrefix = "/*framebus*/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeEvent(options: any): MessageEvent {
  return new MessageEvent("foo", options);
}

describe("_unpackPayload", function () {
  it("should return false if unparsable", function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = bus._unpackPayload({ data: "}{" } as any);

    expect(actual).toBe(false);
  });

  it("should return false if not prefixed", function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = bus._unpackPayload({ data: JSON.stringify({}) } as any);

    expect(actual).toBe(false);
  });

  it("should return event and args in payload", function () {
    const event = "event name";
    const data = { data: "some data" };
    const actual = bus._unpackPayload(
      makeEvent({
        data: messagePrefix + JSON.stringify({ event, eventData: data }),
      })
    ) as FramebusPayload;
    const eventData = actual.eventData as SubscriberArg;

    expect(actual.event).toBe(event);
    expect(eventData).toEqual(data);
  });

  it("should return event and args and reply in payload", function () {
    const event = "event name";
    const reply = "123129085-4234-1231-99887877";
    const data = { data: "some data" };
    const actual = bus._unpackPayload(
      makeEvent({
        data:
          messagePrefix +
          JSON.stringify({ event: event, reply, eventData: data }),
      })
    ) as FramebusPayload;
    const eventData = actual.eventData as SubscriberArg;

    expect(actual.event).toBe(event);
    expect(actual.reply).toBeInstanceOf(Function);
    expect(eventData.data).toBe("some data");
  });

  it("the source should postMessage the payload to the origin when reply is called", function () {
    const fakeSource = {
      postMessage: jest.fn(),
    };
    const reply = "123129085-4234-1231-99887877";
    const data = { data: "some data" };
    const actual = bus._unpackPayload(
      makeEvent({
        source: fakeSource,
        origin: "origin",
        data:
          messagePrefix +
          JSON.stringify({
            event: "event name",
            reply,
            eventData: data,
          }),
      })
    ) as FramebusPayload;
    const handler = actual.reply as SubscribeHandler;

    handler({});

    expect(fakeSource.postMessage).toBeCalledTimes(1);
    expect(fakeSource.postMessage).toBeCalledWith(expect.any(String), "origin");
  });

  it("the source should not attempt to postMessage the payload to the origin if no source available", function () {
    const reply = "123129085-4234-1231-99887877";
    const data = { data: "some data" };
    const actual = bus._unpackPayload(
      makeEvent({
        origin: "origin",
        data:
          messagePrefix +
          JSON.stringify({
            event: "event name",
            reply,
            eventData: data,
          }),
      })
    ) as FramebusPayload;
    const handler = actual.reply as SubscribeHandler;

    expect(function () {
      handler({});
    }).not.toThrowError();
  });
});
