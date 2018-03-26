const webpack = require('webpack');
const resolve = require('path').resolve;

module.exports = {
    entry: [
        'react-hot-loader/patch',
        `${__dirname}/src/index.js`
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
            'mapbox-gl$': resolve(`${__dirname}/node_modules/mapbox-gl/dist/mapbox-gl.js`)
        }
    },
    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './public',
        hot: true
    }
};
