# Simplicity

* See ./src/external/ for copy of original asset files.
* Uses DawnBringer's [DawnLike](https://opengameart.org/content/dawnlike-16x16-universal-rogue-like-tileset-v181) tile pack.
* Also uses Antifarea's [16x18 RPG Sprites](https://opengameart.org/content/18x20-characters-walkattackcast-spritesheet).

## Getting Started
* Development requires these tools:
    * [Node.js](https://nodejs.org)
    * [Tiled Map Editor](https://thorbjorn.itch.io/tiled)
    * [Yarn](https://yarnpkg.com) (optional)
```
git clone <this-repository>
cd simplicity
yarn              # or npm install
yarn run dev      # or npm run dev
```

## Unit Testing
* See [Unit Testing Node Applications With TypeScript Using Mocha and Chai](https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2) for information about why the unit testing environment is set up the way it is.
* --watch flag does not always pick up changes correctly, particuarly with class and method signature changes.

## Integration Testing
* Need a test that ensures that save file won't get corrupted if exiting while still initializing.
