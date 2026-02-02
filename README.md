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

To connect to the BlueAPI instance for I24, the environment variables `VITE_BLUEAPI_SOCKET` must be set to the URL in the file `.env`. The URL is currently set to localhost - but should change to the ingress once the UI is deployed to the beamline cluster.

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
