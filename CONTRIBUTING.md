# Contributing

## Code Standards
* Prefix underscore on variable names only if it has an associated getter and/or setter.
* Import singletons as camelCase, classes as PascalCase.
* Ensure that TSLint runs before committing. (TODO: Move into Webpack watcher)

## Maps
* JSON will be gzipped when served, so maps are stored uncompressed.
