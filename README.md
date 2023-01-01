# Create JAM App

Create a [Jamstack](https://jamstack.org) app with many of the most popular frameworks through a single CLI.

## Available apps

> Apps with only one configuration have nothing in the 'Templates' columns

| Framework                                                | Type         | Templates                                                                                                                                                                                                                                                                                     | Underlying Configs |
| -------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [Docusaurus](https://docusaurus.io/)                     | `docusaurus` | <ul><li>`typescript`</li><li>`javascript`</li></ul>                                                                                                                                                                                                                                           |                    |
| [Eleventy](https://www.11ty.dev)                         | `eleventy`   |                                                                                                                                                                                                                                                                                               |                    |
| [Gatsby](https://www.gatsbyjs.com)                       | `gatsby`     | <ul><li>`typescript`</li><li>`javascript`</li></ul>                                                                                                                                                                                                                                           |                    |
| [Hexo](https://hexo.io/)                                 | `hexo`       |                                                                                                                                                                                                                                                                                               |                    |
| [Next.js](https://nextjs.org)                            | `next`       | <ul><li>`typescript`</li><li>`javascript`</li></ul>                                                                                                                                                                                                                                           | `--eslint`         |
| [Nuxt](https://nuxtjs.org/)                              | `nuxt`       |                                                                                                                                                                                                                                                                                               |                    |
| [Preact](https://preactjs.com/)                          | `preact`     | <ul><li>`default`</li><li>`simple`</li><li>`netlify`</li><li>`typescript`</li></ul>                                                                                                                                                                                                           |                    |
| React ([create-react-app](https://create-react-app.dev)) | `react`      | <ul><li>`typescript`</li><li>`javascript`</li></ul>                                                                                                                                                                                                                                           |                    |
| [Redux](https://redux.js.org))                           | `redux`      | <ul><li>`typescript`</li><li>`javascript`</li></ul>                                                                                                                                                                                                                                           |                    |
| [Redwood](https://redwoodjs.com)                         | `redwood`    | <ul><li>`typescript`</li><li>`javascript`</li></ul>                                                                                                                                                                                                                                           |                    |
| [Remix](https://remix.run/)                              | `remix`      | <ul><li>`arc` (js and ts)</li><li>`cloudflare-pages` (js and ts)</li><li>`cloudflare-workers` (js and ts)</li><li>`deno` (js and ts)</li><li>`express` (js and ts)</li><li>`fly` (js and ts)</li><li>`netlify` (js and ts)</li><li>`remix` (js and ts)</li><li>`vercel` (js and ts)</li></ul> |                    |
| [Vite](https://vitejs.Dev/)                              | `vite`       | <ul><li>`vanilla` (js and ts)</li><li>`vue` (js and ts)</li><li>`react` (js and ts)</li><li>`preact` (js and ts)</li><li>`lit` (js and ts)</li><li>`svelte` (js and ts)</li></ul>                                                                                                             |                    |

## Using `create-jam`

```bash
# yarn
yarn create jam <project-name>

# npm
npm init jam <project-name>

# npx
npx create-jam <project-name>
```

You will be led through an interactive interface to create your app.

### Alias package

The `create-jam` CLI is also published as `create-jam-app`. The functionality is exactly the same and they may be used interchangeably.

```bash
# yarn
yarn create jam-app <project-name>

# npm
npm init jam-app <project-name>

# npx
npx create-jam-app <project-name>
```

### `--app | -a`

Alternatively, you can provide the app type to the command:

```bash
yarn create jam <project-name> --app react
# or
yarn create jam <project-name> -a react
```

This will skip directly to the template selection question.

### `--typescript | -t`

To default to the TypeScript version, use the `--typescript` flag:

```bash
yarn create jam <project-name> --app react --typescript
# or
yarn create jam <project-name> -a react -t
```

If the app has a `typescript` template version it will automatically create that template.
If there are multiple TypeScript templates, it will limit the template choices to just TypeScript options.

You can also provide the `--typescript` flag without the app type to utilize the TypeScript template or limit to just TypeScript templates after selecting the app type:

```bash
yarn create jam <project-name> --typescript
# or
yarn create jam <project-name> -t
```

### `--overwrite | -o`

Passing the overwrite flag allows `create-jam` to overwrite the directory if it already exists:

```bash
yarn create jam <project-name> --overwrite
# or
yarn create jam <project-name> -o
```

### Disabling defaults

#### `--no-install`

By default `create-jam` will install the packages for the project. To disable this, add the `--no-install` flag:

```bash
yarn create jam <project-name> --no-install
```

#### `--no-init`

By default `create-jam` will run `git init` to initialize Git in the repo. To disable this, add the `--no-init` flag:

```bash
yarn create jam <project-name> --no-init
```

#### `--bare | -b`

A shorthand to run all of the above disabling commands is the `--bare` flag:

```bash
yarn create jam <project-name> --bare
# or
yarn create jam <project-name> -b
```

## Contributing

`create-jam` uses GitHub actions to check and pull changes from the respective app templates. Each app (React, Redwood, etc.) has it's own action which calls the core `create-app` action.

### Recommending a new framework to support

Head to our [ideas discussions](https://github.com/spencerlabs/create-jam/discussions/categories/ideas) to comment on other people's framework suggestions or, if you don't see one you want, start your own framework discussion.

## Disclaimer

We do not claim ownership over any of the templates and their code used in this CLI.
Each is owned by the respective company.

Due to the nature of wrapping other CLIs, some features of those CLIs are not available through `create-jam` while others are preconfigured and opinionated.
