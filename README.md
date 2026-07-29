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

To connect to the Diamond PVWS instance at `pvws.diamond.ac.uk`, we take advantage of the [cs-web-lib]https://github.com/DiamondLightSource/cs-web-lib) package - the current stable version being `0.9.10`. PVWS is now configured by setting up the parameters in a JSON config file which is loaded at runtime. The `pvwsconfig.json` is located in the `/public` directory to make it always accessible at runtime.

### Environment variables

`.env` holds the URLs the app talks to:

| Variable                  | Read by                             | What it does                       |
| ------------------------- | ----------------------------------- | ---------------------------------- |
| `VITE_CONFIG_SOCKET`      | `src/config_server/configServer.ts` | the daq-config server              |
| `VITE_BLUEAPI_SOCKET_DEV` | `vite.config.ts`                    | where `pnpm dev` proxies `/api` to |
| `VITE_BLUEAPI_SOCKET`     | nothing, currently                  | see below                          |

blueapi is addressed as the origin-relative `/api` (`src/blueapi/blueapi.ts`), so in a
deployment whatever sits in front of the app routes that on, and `VITE_BLUEAPI_SOCKET` is
not read - the line that read it is still there, commented out. The dev server has nothing
in front of it, so it proxies `/api` itself, to `VITE_BLUEAPI_SOCKET_DEV`.

### BlueAPI config

Settings for connecting to BlueAPI should also be in the .env file.
For I23, there is a branch on mx-bluesky https://github.com/DiamondLightSource/mx-bluesky/tree/i23_and_ui_testing which has some test devices and plans. This UI expects to connect to a local instance of BlueAPI with those plans and devices loaded. You can use the config

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

For I24 instead, The first few plans are in the branch https://github.com/DiamondLightSource/mx-bluesky/tree/151_web-ui-first-plans and there is already a BlueAPI configuration defined in https://github.com/DiamondLightSource/mx-bluesky/blob/main/src/mx_bluesky/beamlines/i24/serial/blueapi_config.yaml that can be used for testing.

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
