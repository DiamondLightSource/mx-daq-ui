# Prototype web gui, for I24 serial

## Installation

Currently this relies on a branch of cs-web-lib. Clone that repository, and run

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
