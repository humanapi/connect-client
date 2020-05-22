module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                debug: true,
                modules: "umd",
                useBuiltIns: "usage",
                corejs: 3
            }
        ]
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            { corejs: 3 }
        ]
    ]
};
