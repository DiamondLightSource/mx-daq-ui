# Prototype web gui, for I24 serial, I23 laser shaping, and whatever else

## Installation

On a DLS workstation, clone the repository and inside it run:

```bash
module load node

npm install
```

## Gotchas

To connect to the Diamond PVWS instance at `pvws.diamond.ac.uk` the environment variables `VITE_PVWS_SOCKET` and `VITE_PVWS_SSL` must be set to the URL and `"true"` respectively. This is in the file `.env`. Note that the value must be the string "true"

Settings for connecting to BlueAPI should also be in the .env file. There is a branch on mx-bluesky
https://github.com/DiamondLightSource/mx-bluesky/tree/i23_and_ui_testing which has some test devices and plans. This UI expects to connect to a local instance of BlueAPI with those plans and devices loaded. You can use the config

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

## Run

Once all the above steps are done, start a blueapi server. The gui can be started by running:

```bash
npm run dev
```

inside the repository and clicking on the link.
