# Usage

After running one of the below commands you will be led through an interactive interface to create your app.

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam [framework] [options...]
```

#### **npm**
```bash
npm init jam [framework] [options...]
```

#### **npx**
```bash
npx create-jam [framework] [options...]
```
<!-- tabs:end -->

## Alias package

The `create-jam` CLI is also published as `create-jam-app`. The functionality is exactly the same and they may be used interchangeably.

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam-app [framework] [options...]
```

#### **npm**
```bash
npm init jam-app [framework] [options...]
```

#### **npx**
```bash
npx create-jam-app [framework] [options...]
```
<!-- tabs:end -->

## Framework

Optionally, you can provide the framework to the command to skip the framework selection.

[View available app frameworks](/frameworks.md)

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam react [options...]
```

#### **npm**
```bash
npm init jam react [options...]
```

#### **npx**
```bash
npx create-jam react [options...]
```
<!-- tabs:end -->

## Options

Any additional options added to the command will be passed to the framework's CLI command.

<!-- tabs:start -->
#### **yarn**
```bash
yarn create jam react example-app --typescript

# is the equivalent of
yarn create react-app example-app --typescript
```

#### **npm**
```bash
npm init jam react example-app --typescript

# is the equivalent of
npm init react-app example-app --typescript
```

#### **npx**
```bash
npx create-jam react example-app --typescript

# is the equivalent of
npx create-react-app example-app --typescript
```
<!-- tabs:end -->
