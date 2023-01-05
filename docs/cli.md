# CLI

## Usage

After running one of the below commands you will be led through an interactive interface to create your app. `project-name` is required and will be used for both the generated app's folder and the `name` value in the app `package.json`, if applicable.

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name>
```

#### **npm**
```bash
npm init jam <project-name>
```

#### **npx**
```bash
npx create-jam <project-name>
```
<!-- tabs:end -->

### Alias package

The `create-jam` CLI is also published as `create-jam-app`. The functionality is exactly the same and they may be used interchangeably.

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam-app <project-name>
```

#### **npm**
```bash
npm init jam-app <project-name>
```

#### **npx**
```bash
npx create-jam-app <project-name>
```
<!-- tabs:end -->

### App ID

Optionally, you can provide the app ID to the command to skip directly to the template selection for that app, if more than one are available.

[View available app frameworks](/frameworks.md)

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> react
```

#### **npm**
```bash
npm init jam <project-name> react
```

#### **npx**
```bash
npx create-jam <project-name> react
```
<!-- tabs:end -->

### `--typescript | -t`

To default to the TypeScript version, use the `--typescript` flag:

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> react --typescript
# or
yarn create jam <project-name> react -t
```

#### **npm**
```bash
npm init jam <project-name> react --typescript
# or
npm init jam <project-name> react -t
```

#### **npx**
```bash
npx create-jam <project-name> react --typescript
# or
npx create-jam <project-name> react -t
```
<!-- tabs:end -->

If the app has a `typescript` template version it will automatically create that template.
If there are multiple TypeScript templates, it will limit the template choices to just TypeScript options.

You can also provide the `--typescript` flag without the app type to utilize the TypeScript template or limit to just TypeScript templates after selecting the app type:

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> --typescript
# or
yarn create jam <project-name> -t
```

#### **npm**
```bash
npm init jam <project-name> --typescript
# or
npm init jam <project-name> -t
```

#### **npx**
```bash
npx create-jam <project-name> --typescript
# or
npx create-jam <project-name> -t
```
<!-- tabs:end -->

### `--overwrite | -o`

Passing the overwrite flag allows `create-jam` to overwrite the directory if it already exists:

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> --overwrite
# or
yarn create jam <project-name> -o
```

#### **npm**
```bash
npm init jam <project-name> --overwrite
# or
npm init jam <project-name> -o
```

#### **npx**
```bash
npx create-jam <project-name> --overwrite
# or
npx create-jam <project-name> -o
```
<!-- tabs:end -->

### `--template`

Passing a template value will select the corresponding template without the need to do so in the CLI. If the template does not exist it will ignore the provided value, unless the `canary` flag is used then it will proceed with the value.

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> vite --template vue
```

#### **npm**
```bash
npm init jam <project-name> vite --template vue
```

#### **npx**
```bash
npx create-jam <project-name> vite --template vue
```
<!-- tabs:end -->

### `--noInstall`

By default `create-jam` will install the packages for the project. To disable this, add the `--noInstall` flag:

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> --noInstall
```

#### **npm**
```bash
npm init jam <project-name> --noInstall
```

#### **npx**
```bash
npx create-jam <project-name> --noInstall
```
<!-- tabs:end -->

### `--noInit`

By default `create-jam` will run `git init` to initialize Git in the repo. To disable this, add the `--noInit` flag:

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> --noInit
```

#### **npm**
```bash
npm init jam <project-name> --noInit
```

#### **npx**
```bash
npx create-jam <project-name> --noInit
```
<!-- tabs:end -->

### `--bare | -b`

A shorthand to run all of the above disabling commands (commands that start with `--no`) is the `--bare` flag:

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam <project-name> --bare
# or
yarn create jam <project-name> -b
```

#### **npm**
```bash
npm init jam <project-name> --bare
# or
npm init jam <project-name> -b
```

#### **npx**
```bash
npx create-jam <project-name> --bare
# or
npx create-jam <project-name> -b
```
<!-- tabs:end -->

### `--canary`

Passing the canary flag will pull templates from the default repo branch rather than the release branch.

For example, without canary the `v0.5.0` release will use the `v0.5.0` release tagged branch which will maintain consistent results.

Using canary will pull from the templates on the default (`next`) branch at that moment in time. This means the templates in the release and the templates in the canary version could differ or not even exist.

The canary flag is most useful for testing and should not be relied on for production.
