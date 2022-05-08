# Strichliste

This is a Strichliste implementation.

There is a [german demo instance](strichliste-de.6xr.de) and [english demo instance](strichliste-en.6xr.de).

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

If you've added a dependency to the project, please regenerate the nix files with:

```bash
node2nix -l package-lock.json -c node-composition.nix --development
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

And run the production build with:

```bash
node build
```

