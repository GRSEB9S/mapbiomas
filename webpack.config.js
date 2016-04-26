var path = require('path');
var sourcePath = path.resolve(__dirname, './app/assets/javascripts');

module.exports = {
   entry: path.resolve(sourcePath, './index.js'),
   output: { path: sourcePath, filename: 'bundle.js' },
   resolve: {
      root: sourcePath,
      extensions: ['', '.js', '.jsx', '.es6.jsx']
   },
   module: {
      loaders: [
         { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
      ]
   }
}
