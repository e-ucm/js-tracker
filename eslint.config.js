module.exports = {
    files: ["**/*.js"], // Adjust this to match your project file patterns if needed
    languageOptions: {
        globals: {
            ADL: false,
            angular: false,
            $: false,
            RadialProgress: true,
            ColumnProgress: true,
            gauss: false,
            d3: false,
            jQuery: false,
            module: true,
            require: true,
            console: true,
            localStorage: true,
            describe: true,
            it: true,
        },
    },
    rules: {
        // Add your ESLint rules here
        strict: ["error", "global"],
        // Example additional rules
        "no-unused-vars": "warn",
        "no-console": "off",
        semi: ["error", "always"],
    },
};
