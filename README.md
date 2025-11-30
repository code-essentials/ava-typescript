# ava-typescript

[ava](https://github.com/avajs/ava/) is a test framework for javascript and typescript. this package provides a configuration for easily using typescript with ava in an individual package, debugging in vscode, and in a pnpm workspace/monorepo.

## for a package

to use this configuration in a package, add this `ava-config` to the project's dependencies, and in the package's root put `config.js`

```javascript
import { config } from '@code-essentials/ava-config'

export default config
```

configure your package's `package.json` to look similar to the following

```json
{
    "configurations": [
        {
            "name": "...",
            "version": "...",
            "description": "...",
            "type": "module",
            "main": "./dist/index.js",
            "types": "./dist/index.d.ts",
            "files": [
                "dist"
            ],
            "scripts": {
                "clean": "rm -rf dist",
                "prebuild": "pnpm run clean",
                "prebuild:debug": "pnpm run clean",
                "build": "tsc -p tsconfig.prod.json",
                "build:debug": "tsc -p tsconfig.debug.json",
                "pretest": "pnpm run build:debug",
                "test": "ava",
                "prepublishOnly": "pnpm test && pnpm run build"
            },
            "devDependencies": {
                "@ava/typescript": "^6.0.0",
                "ava": "^6.4.0",
                "typescript": "^5.9.0"
            },
        }
    ]
}
```

these scripts continue to work in the following sections.

## debugging in vscode

to let the package be debugged with vscode, put the following two files in its `.vscode` folder.

`.vscode/launch.json`

```json
{
    "configurations": [
        {
            "name": "test",
            "request": "launch",
            "runtimeArgs": [
                "run-script",
                "test:run"
            ],
            "runtimeExecutable": "pnpm",
            "sourceMaps": true,
            "pauseForSourceMap": true,
            "preLaunchTask": "npm: pretest (build:debug)",
            "internalConsoleOptions": "neverOpen",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        },
        {
            "name": "test (no build)",
            "request": "launch",
            "runtimeArgs": [
                "run-script",
                "test:run"
            ],
            "runtimeExecutable": "pnpm",
            "sourceMaps": true,
            "pauseForSourceMap": true,
            // "preLaunchTask": "npm: pretest (build:debug)",
            "internalConsoleOptions": "neverOpen",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        }
    ]
}
```

`.vscode/tasks.json`

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "npm: pretest (build:debug)",
            "type": "shell",
            "command": "npm",
            "args": [
                "run-script",
                "pretest",
            ],
            "problemMatcher": [
                "$tsc"
            ],
            "presentation": {
                "reveal": "silent",
                "close": true,
            },
            "group": "build"
        }
    ]
}
```

## in a workspace/monorepo

[pnpm](https://pnpm.io) and [turborepo](https://turborepo.com/docs) let many packages be tested in parallel. To setup your [workspace](https://pnpm.io/workspaces) for parallel testing and debugging compatibility in vscode, these scripts worked

in root `turbo.json`

```json
{
    "$schema": "https://turbo.build/schema.v2.json",
    "tasks": {
        "clean": {
        },
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**"]
        },
        "build:debug": {
            "dependsOn": ["^build:debug"],
            "outputs": ["dist/**"]
        },
        "test:run": {
            "dependsOn": ["build:debug"]
        }
    }
}
```

in root `package.json`

```json
{
  "name": "...",
  "private": true,
  "scripts": {
    "clean": "turbo run clean",
    "build": "turbo run build",
    "pretest": "turbo run build:debug",
    "test": "turbo run test:run --continue=dependencies-successful"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "^5.9.0"
  },
}
```
