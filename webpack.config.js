var path = require('path');
var sourcePath = path.resolve(__dirname, './app/assets/javascripts');
var sourcePath2 = path.resolve(__dirname, './vendor/assets/javascripts');

module.exports = {
   entry: [
      path.resolve(sourcePath, 'index.js'),
      path.resolve(sourcePath, 'libraries_css.js'),
      path.resolve(sourcePath2, 'react-toggle.jsx')
   ],
   output: { path: sourcePath, filename: 'bundle.js' },
   devtool: 'source-map',
   resolve: {
      modulesDirectories: ['node_modules', 'app/assets/javascripts', 'vendor/assets/javascripts'],
      extensions: ['', '.js', '.jsx', '.es6', '.es6.jsx'],
      alias: {
        jquery: path.join(sourcePath, 'jquery_alias.js')
      }
   },
   module: {
      loaders: [
         { test: /\.css$/, loader: 'style-loader!css-loader' },
         { test: /\.jsx?|\.es6$/, exclude: /node_modules/, loader: 'babel-loader' }
      ]
   }
}
