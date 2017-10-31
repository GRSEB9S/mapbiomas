var path = require('path');
var webpack = require('webpack');
var sourcePath = path.resolve(__dirname, './app/assets/javascripts');
var sourcePath2 = path.resolve(__dirname, './vendor/assets/javascripts');

module.exports = {
   entry: [
      path.resolve(sourcePath, 'index.js'),
      path.resolve(sourcePath, 'libraries_css.js')
   ],
   output: { path: sourcePath, filename: 'bundle.js' },
   resolve: {
      modules: ['node_modules', 'app/assets/javascripts', 'vendor/assets/javascripts'],
      extensions: ['.js', '.jsx', '.es6', '.es6.jsx'],
      alias: {
        jquery: path.join(sourcePath, 'jquery_alias.js')
      }
   },
   module: {
      loaders: [
         { test: /\.css$/, loader: 'style-loader!css-loader' },
         { test: /\.jsx?|\.es6$/, exclude: /node_modules/, loader: 'babel-loader' }
      ]
   },
   plugins: [
      new webpack.optimize.UglifyJsPlugin({
         sourceMap: false,
         mangle: {
            except: ['$', 'exports', 'require', '_', 'React', 'ReactDOM']
         }
      }),
      new webpack.DefinePlugin({
        "process.env": {
           NODE_ENV: JSON.stringify('production')
         }
      })
   ]
}
