var path = require('path');
var sourcePath = path.resolve(__dirname, './app/assets/javascripts');
var sourcePath2 = path.resolve(__dirname, './vendor/assets/javascripts');

module.exports = {
   entry: [
      path.resolve(sourcePath, 'index.js'),
      path.resolve(sourcePath, 'libraries_css.js')
   ],
   output: { path: sourcePath, filename: 'bundle.js' },
   devtool: 'source-map',
   resolve: {
      modules: ['node_modules', 'app/assets/javascripts', 'vendor/assets/javascripts'],
      extensions: ['.js', '.jsx', '.es6', '.es6.jsx'],
      alias: {
        jquery: path.join(sourcePath, 'jquery_alias.js')
      }
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
         },
         {
            test: /\.jsx?|\.es6$/,
            exclude: /node_modules/,
            use: ['babel-loader']
         },
         {
            test: /\.(png|jpg|gif)$/,
            use: {
               loader: 'url-loader',
               query: {
                  limit: 8192
               }
            }
         }
      ]
   }
}
