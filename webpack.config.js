const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "humanapi-connect-client.js",
        library: "humanapiConnectClient",
        libraryTarget: "umd"
    }
};
