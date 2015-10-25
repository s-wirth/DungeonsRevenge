# Wirthslike

Welcome to Sophie's roguelike, Wirthslike. Feel free to change the name.

## Setup

All dependencies are managed through NPM (the Node Package Manager). The node version is listed in `.node-version`, you
can install Node by hand or with an environment manager like nodenv or NVM (I recommend nodenv).

```
npm install
```

## Development

All build scripts are registered in `package.json`. For normal development you'll probably only need:

* `npm run serve`: runs a local development server and automatically recompiles your code while you work

## Structure

* Code lives in `src/`
* Output will go in `public/`

Both locations are configured in `package.json`, so you can change them if you want.
