const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.electron.config');
const { resolve } = require('path');
const webpack = require('webpack');
const numeroPort = 8080;

new WebpackDevServer(webpack(config), { contentBase: resolve(__dirname, 'build'), hot: true, publicPath: '/' })
    .listen(numeroPort, 'localhost', (err) => {
        if (err) {
            console.log(err);
        }

        console.log('Ecoute localhost:' + numeroPort);
    });


