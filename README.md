# Prototype web gui, for I24 serial, I23 laser shaping, and whatever else

## Installation

On a DLS workstation, clone the repository and inside it run:

```bash
module load vscode

code .
```

When vscode opens, select `Reopen in container` to get a working environment with `pnpm` installed.

On a non-dls workstation you have the option of opening the devcontainer or installing pnpm globally and then running the app.
To install the app:

```bash
pnpm install
```

## Gotchas

### PVWS

To connect to the Diamond PVWS instance at `pvws.diamond.ac.uk`, we take advantage of the [cs-web-lib](https://github.com/DiamondLightSource/cs-web-lib) package - the current stable version being `0.9.10`. PVWS is now configured by setting up the parameters in a JSON config file which is loaded at runtime. The `pvwsconfig.json` is located in the `/public` directory to make it always accessible at runtime.

### OAV video stream

The OAV IOC advertises its MJPG stream over http, which a browser will not load into a
page served over https - it blocks it as mixed content, so the stream comes up blank
wherever the app is deployed behind TLS. The app therefore asks for the stream at
`/oav-stream` on its own origin, and that is proxied on to the MJPG server: by nginx in
the built image, and by the dev server otherwise. Which stream is shown still comes from
the IOC's `MJPG_URL_RBV`; only which server it is fetched from is set here, and in both
cases the environment sets it:

|             | Proxy                                                    | Which server                 | Default                 |
| ----------- | -------------------------------------------------------- | ---------------------------- | ----------------------- |
| Built image | `oav-stream.conf.template`, filled in at container start | `OAV_STREAM_SERVER`          | set in the `Dockerfile` |
| `pnpm dev`  | `vite.config.ts`                                         | `VITE_OAV_STREAM_SOCKET_DEV` | set in `.env`           |

Set `OAV_STREAM_SERVER` on the container to proxy a different MJPG server; leaving it
empty leaves nginx refusing to start rather than quietly serving nothing.

The MJPG server is looked up per request, so the app starts, and serves everything else,
whether or not that server is up: while it is down the stream is a broken image and a
502 in the nginx log, and it starts working again when the server does, with no restart.
The cost is that the lookup is DNS only - `OAV_STREAM_SERVER` must be a fully qualified
name, since nginx's resolver reads neither `/etc/hosts` nor the search domains.

### Environment variables

`.env` holds the URLs the app talks to:

| Variable                     | Read by                             | What it does                              |
| ---------------------------- | ----------------------------------- | ----------------------------------------- |
| `VITE_CONFIG_SOCKET`         | `src/config_server/configServer.ts` | the daq-config server                     |
| `VITE_BLUEAPI_SOCKET_DEV`    | `vite.config.ts`                    | where `pnpm dev` proxies `/api` to        |
| `VITE_BLUEAPI_SOCKET`        | nothing, currently                  | see below                                 |
| `VITE_OAV_STREAM_SOCKET_DEV` | `vite.config.ts`                    | where `pnpm dev` proxies `/oav-stream` to |

blueapi is addressed as the origin-relative `/api` (`src/blueapi/blueapi.ts`), so in a
deployment whatever sits in front of the app routes that on, and `VITE_BLUEAPI_SOCKET` is
not read - the line that read it is still there, commented out. The dev server has nothing
in front of it, so it proxies `/api` itself, to `VITE_BLUEAPI_SOCKET_DEV`.

### BlueAPI config

Settings for connecting to BlueAPI should also be in the .env file.
For I23, there is a branch on mx-bluesky [i23_and_ui_testing](https://github.com/DiamondLightSource/mx-bluesky/tree/i23_and_ui_testing) which has some test devices and plans. This UI expects to connect to a local instance of BlueAPI with those plans and devices loaded. You can use the config

```yaml
env:
  sources:
    - kind: dodal
      module: mx_bluesky.ui_working.devices
    - kind: planFunctions
      module: mx_bluesky.ui_working.plans

stomp:
  host: localhost
  port: 61613
  auth:
    username: guest
    # This is for local development only, production systems should use good passwords
    password: guest
```

For I24 instead, The first few plans are in the branch [151_web-ui-first-plans](https://github.com/DiamondLightSource/mx-bluesky/tree/151_web-ui-first-plans) and there is already a BlueAPI configuration defined in [blueapi_config](https://github.com/DiamondLightSource/mx-bluesky/blob/main/src/mx_bluesky/beamlines/i24/serial/blueapi_config.yaml) that can be used for testing.

### PNPM Audits

Occasionally third party dependencies may have new known vulnerabilities. The CI checks for these when code is committed and pushed. To fix this, run the audit command with the fix flag. This scans your dependencies for vulnerabilities and automatically adds overrides to `package.json`, pinning affected packages to safe versions. Review these changes before proceeding, as some bumps may be to a new major version that may break other third party dependencies.

```bash
pnpm audit --fix
pnpm install
```

If vulnerabilities remain or other packages break after this, you may need to repeat the command or manually update the affected package (`pnpm update <package>`) or add an override in `package.json` yourself.

## Run

Once all the above steps are done, start a blueapi server. The gui can be started by running:

```bash
pnpm run dev
```

inside the repository and clicking on the link.

## Make a release

Make a release from the github `Releases` page and point it to either a tag or a branch.
There is a workflow job that will then build the app and publish a docker image - which is necessary
for deployment.

Also update the [I24-services](https://gitlab.diamond.ac.uk/controls/containers/beamline/i24-services/-/blob/main/services/i24-daq-ui/Chart.yaml?ref_type=heads) chart to the same version. That will trigger Kubernetes to set the production version.
