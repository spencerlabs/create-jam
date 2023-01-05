# Programmatic Usage

In addition to the [CLI](/cli), the `create-jam` package also ships with a programmatic function.

## Installation

Start by installing the package:

<!-- tabs:start -->
#### **yarn**
```bash
yarn add create-jam
```

#### **npm**
```bash
npm install create-jam
```
<!-- tabs:end -->

Import the `createJam` function. The CLI actually uses this under the hood!

```js
import { createJam } from 'create-jam';
// or
const { createJam } = require('create-jam');
```

Then use the function to create an app:

```js
await createJam('example-app', 'react', {
  template: 'typescript',
})
```

## Configuration

The configuration options for the function match the corresponding CLI options:

| Property  | Type   | Required | Description                                                    |
| --------- | ------ | -------- | -------------------------------------------------------------- |
| `dir`     | string | yes      | The directory where the app should be created                  |
| `app`     | string | yes      | The app framework ID ([see available frameworks](/frameworks)) |
| `options` | object | no       | See below                                                      |

### Options

| Property    | Type    | Required | Description                                                                                                                       |
| ----------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `canary`    | boolean | no       | Use the default branch when pulling templates; this should primarily be used for testing and not in production                    |
| `overwrite` | boolean | no       | Overwrite the project directory, removing any existing files                                                                      |
| `template`  | string  | no       | The name of the framework template; not required if only one template, will fail if not provided and there are multiple templates |

