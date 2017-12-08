# Simplicity

* See ./src/external/ for copy of original asset files.
* Uses DawnBringer's [DawnLike](https://opengameart.org/content/dawnlike-16x16-universal-rogue-like-tileset-v181) tile pack.
* Also uses Antifarea's [16x18 RPG Sprites](https://opengameart.org/content/18x20-characters-walkattackcast-spritesheet).

## Unit Testing
* See [Unit Testing Node Applications With TypeScript Using Mocha and Chai](https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2) for information about why the unit testing environment is set up the way it is.
* --watch flag does not always pick up changes correctly, particuarly with class and method signature changes.

## Integration Testing
* Need a test that ensures that save file won't get corrupted if exiting while still initializing.

## Resource requesting and caching
* Enter point in gameplay where the resource *is known to be needed at some point*
* See if resource is already cached
** If not already cached
*** Fire async request for uncached map, image, etc
*** Go about business (optional)
* Enter point in gameplay where the resource *is needed immediately*
* See if resource has been pulled into the cache
** If not yet cached
*** Pause the game timer
*** Signal an event that means 'loading' - perhaps an array of requests?
*** Wait for the array of requests to complete
* Use the resource
