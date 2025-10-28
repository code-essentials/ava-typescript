// import {  } from 'ava'

// where is typing info for ava configuration?
// https://github.com/avajs/ava/blob/main/lib/cli.js#L162

export const config = {
    files: [
        "src/**/*.spec.ts"
    ],
    typescript: {
        rewritePaths: {
            "src/": "dist/"
        },
        extensions: [
            "ts"
        ],
        compile: false
    }
} as const // satisfies 
