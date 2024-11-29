# Prototype web gui, for I24 serial, I23 laser shaping, and whatever else

## Installation

Currently this relies on a branch of cs-web-lib. This is waiting on https://github.com/DiamondLightSource/cs-web-lib/pull/69#pullrequestreview-2470013371 after which the code currently in this repo will work with installation of `@diamondlightsource/cs-web-lib` but it's possible we will need to do more of this in the future if I didn't add enough there.

Clone that repository, and run

```bash
git checkout expose_hooks
npm install
npm run rollup
npm pack
```

and copy the generated .tgz file over to this repo

then here run `npm install` and also run it again on the tarball of cs-web-lib. this avoids the issue of ending up with multiple copies of react due to linked dependencies (https://react.dev/warnings/invalid-hook-call-warning#duplicate-react)

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
