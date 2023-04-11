# Community Resources

## Contributing

`create-jam` wraps the CLIs of the most popular Jamstack frameworks.
This let's you create any of these apps from a single CLI.

### Local Development

To start, pull down the repo and install dependencies:

```bash
yarn install
```

Next, run the dev script to create a stub to run the CLI with the local files:

```bash
yarn dev
```

Finally, run the CLI:

```bash
yarn cli
```

### Testing

If you are modifying the code or adding a new framework, make sure to add or edit corresponding tests in the `__tests__` directory.

As a final test, build the app and run the CLI against a built version of the code:

```bash
yarn build
```

```bash
yarn cli
```

## New Frameworks

Head to our [ideas discussions](https://github.com/spencerlabs/create-jam/discussions/categories/ideas) to suggest a framework or [open a PR](https://github.com/spencerlabs/create-jam/pulls) with the new framework.
