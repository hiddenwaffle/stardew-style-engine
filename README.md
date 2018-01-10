# Simplicity

* See ./src/external/ for copy of original asset files.
    * Uses DawnBringer's [DawnLike](https://opengameart.org/content/dawnlike-16x16-universal-rogue-like-tileset-v181) tile pack.
    * Antifarea's [16x18 RPG Sprites](https://opengameart.org/content/18x20-characters-walkattackcast-spritesheet).
    * Redshrike's [Indoor RPG Tileset](https://opengameart.org/content/16x16-indoor-rpg-tileset-the-baseline)

## Getting Started
* Engine development requires only [Node.js](https://nodejs.org).
* (Optional) [Tiled](https://thorbjorn.itch.io/tiled) is recommended for map editing.
* (Optional) [Yarn](https://yarnpkg.com) is needed for package.json dependency updates.
```
git clone <this-repository>
cd simplicity
npm install       # or: yarn install
npm run dev       # or: yarn run dev
```

## Unit Testing
* See [Unit Testing Node Applications With TypeScript Using Mocha and Chai](https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2) for information about why the unit testing environment is set up the way it is.
* --watch flag does not always pick up changes correctly, particuarly with class and method signature changes.

## Integration Testing
* Need a test that ensures that save file won't get corrupted if exiting while still initializing.
