module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                debug: true,
                modules: "umd"
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
