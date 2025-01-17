# Practical use of Effect-TS: Todo app sample

This is an opinionated sample use of full-stack [Effect-TS](https://github.com/Effect-TS/core).
(See repositories for more info and discord link, articles, youtube videos, etc).

Though in the frontend, the Views and Presentational components so far are void of it's use.

The sample is somewhat based on Microsoft To Do.

**WORK IN PROGRESS**

## Note worthy

- API usecases are implemented in Delivery and Persistence ignorant way
 - Delivery type: HTTP REST/RPC/GQL can easily be exchanged. Library too: Express, KOA, etc.
 - Persistence type: NoSQL, SQL can easily be exchanged. DB driver too: in memory, disk, Redis, Mongo, etc.

TODO: Implement a Layer to demo replacing for example the persistence mechanism.

## Getting Started

From repo root:
- `git submodule init`
- `yarn`
- `yarn libs-fix` - this installs some npm bins to libs, do **not** run `yarn` inside the libs folder!
- `yarn dev`
- visit `http://localhost:3133`
- for api docs, visit: `http://localhost:3330/docs` or `http://localhost:3330/swagger`

Interesting bits are in:
- `apps/api`
- `apps/frontend/features/Tasks`
- `packages/client` and `packages/types`

You can interact via the included frontend project, the docs or swagger endpoint, Postman (by importing api/openapi.json), or go wild with `curl` if that's your thing ;-)

### A word on the libs submodule

While not ideal, I like developing the sample app and the libraries in tandem,
as such the easiest way to do this is not to have to deploy to NPM and update the packages every time the libs change.
I've tried many different setups, but the current one seems to tick most of the boxes (always a compromise).
The trick now is to have the libs node_modules/.bin installed (linked to root node_modules), but not the actual packages.
You have been warned :) Duplicate effect-ts packages etc will ruin your day!

Once the libs stabilise, we can switch to published npm packages.

### Postman

1. import [openapi.json](apps/api/openapi.json)
2. create an environment `localhost`, add `baseUrl` variable with value: `http://localhost:3330`, and make the environment active
3. add a pre-request script to the collection:
```
pm.request.headers.add({
        key: 'x-user',
        value: '{ "sub": "0"}'
    }
);
```

### Testing

From repo root or per app/package:
`yarn testsuite`

### Important steps

- in Editor, make sure the typescript runtime is set to the local node_modules/typescript

## More Documentation

Check the [Docs](docs/index.md)
