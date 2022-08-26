module.exports = {
    "parser": "@babel/eslint-parser",
    "env": {
        "node": true,
        "es6": true,
        "mocha": true,
        "jest": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 9
    },
    "extends": "eslint:recommended",
    "globals": {
        "db": false,
        "requirelib": false
    },
    "rules": {
        "require-atomic-updates": "off",
        "max-len": [ "error", {"code": 94, "ignoreStrings": true} ],
        "space-in-parens": ["error", "always", { "exceptions": ["{}"] }],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": ["error", "double"],
        "semi": [
            "error",
            "always"
        ],
        "no-trailing-spaces": [ "error" ],
        "spaced-comment": [ "error", "always" ],
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "destructuredArrayIgnorePattern": "^_" }],
        "eol-last": ["error", "always"]
    }
};
