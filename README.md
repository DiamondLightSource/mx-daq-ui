# Prototype web gui, for I24 serial, I23 laser shaping, and whatever else

## Installation

On a DLS workstation, clone the repository and inside it run:

```bash
module load node

npm install
```

Note that the current default version for node is `21.7.1`, which is getting quite old and not supported by somme of the packages we need to install. It would be best to have a version `>=22.12.0`.

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
npm run dev
```

inside the repository and clicking on the link.
