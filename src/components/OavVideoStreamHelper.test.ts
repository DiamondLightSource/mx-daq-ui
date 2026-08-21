import { describe, expect, test } from "vitest";
import { oavStreamUrl } from "./OavVideoStreamHelper";

describe("oavStreamUrl", () => {
  test("serves the stream the IOC names from this origin", () => {
    // An https page cannot load the http URL the IOC advertises, so the same stream is
    // asked for from here instead, and proxied on to the MJPG server.
    expect(
      oavStreamUrl("http://bl24i-di-serv-01.diamond.ac.uk:8080/OAV1.mjpg.mjpg"),
    ).toBe("/oav-stream/OAV1.mjpg.mjpg");
  });

  test("keeps whatever the URL asks of the stream", () => {
    expect(
      oavStreamUrl(
        "http://bl24i-di-serv-01.diamond.ac.uk:8080/OAV1.mjpg?fps=5",
      ),
    ).toBe("/oav-stream/OAV1.mjpg?fps=5");
  });
});
