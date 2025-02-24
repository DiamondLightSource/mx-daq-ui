# Prototype web gui, for I24 serial, I23 laser shaping, and whatever else

## Installation

On a DLS workstation, clone the repository and inside it run:

```bash
module load node

npm install
```

## Gotchas

### Environment variables

To connect to the Diamond PVWS instance at `pvws.diamond.ac.uk` the environment variables `VITE_PVWS_SOCKET` and `VITE_PVWS_SSL` must be set to the URL and `"true"` respectively. This is in the file `.env`. Note that the value must be the string "true"

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

### BlueAPI issue - firefox error

If firefox gives you CORS errors you can edit blueAPI's main.py to add to `get_app()`:

```python
    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
```

plus `from fastapi.middleware.cors import CORSMiddleware`

until https://github.com/DiamondLightSource/blueapi/issues/738 is resolved

### Dark mode

At the moment, the color scheme defaults to dark mode, making things difficult to read in a browser set light mode.
Until https://github.com/DiamondLightSource/mx-daq-ui/issues/13 is fixed, the browser needs to be temporarily set to dark mode to run the gui.

## Run

Once all the above steps are done, start a blueapi server. The gui can be started by running:

```bash
npm run dev
```

inside the repository and clicking on the link.
