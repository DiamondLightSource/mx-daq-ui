import { useState, useEffect } from "react";

export const useContainerDimensions = (
  ref: React.MutableRefObject<HTMLHeadingElement | null>,
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const getDimensions = () => ({
      width: ref.current?.offsetWidth || 0,
      height: ref.current?.offsetWidth || 0,
    });
    const handleResize = () => {
      setDimensions(getDimensions());
    };
    if (ref.current) {
      setDimensions(getDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
};

/** Where this app serves the OAV stream from, proxied to the MJPG server itself. */
export const OAV_STREAM_PATH = "/oav-stream";

/**
 * Where the browser should fetch the OAV stream from, given the URL the IOC advertises.
 *
 * The MJPG server speaks http only, and a page served over https will not load an image
 * over http - the browser blocks it as mixed content, which is what happens whenever
 * this app is deployed to the cluster rather than run locally. So the stream is fetched
 * from this app's own origin, which proxies it on to the server (see the location block
 * in nginx.conf, and the dev server's proxy in vite.config.ts). The IOC still says which
 * stream to show; only where the browser collects it from moves.
 */
export const oavStreamUrl = (iocUrl: string): string => {
  const { pathname, search } = new URL(iocUrl);
  return `${OAV_STREAM_PATH}${pathname}${search}`;
};
