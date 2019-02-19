const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

const targetEnvironment = (process.env.TargetEnvironment || "custom").toLowerCase();
const isProductionGradeBuild = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'ts':  [
              {
                  loader: 'ts-loader',
                  options: {
                      appendTsSuffixTo: [/\.vue$/]
                  }
              }]
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      { 
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@config': path.resolve(__dirname, `src/config/config.${targetEnvironment}.ts`),
      '@': path.resolve(__dirname, "src"),
      '@common': path.resolve(__dirname, "../common/src"),
      'styles': path.resolve(__dirname, "src/components/styles"),
    },
    extensions: ['*', '.js', '.ts', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    disableHostCheck: true,
    before(app) {
      app.use((req, res, next) => {
        if (req.path.endsWith(".gz")) {
          res.set('Content-Encoding', 'gzip');
        }
        next()
      })
    }
  },
  performance: {
    hints: false
  },
  devtool: '#source-map',
  mode: process.env.NODE_ENV,
  plugins: [
    new copyWebpackPlugin([
      {
        context: 'src',
        from: 'images/*'
      }
    ]),
    // The app serves files out of azure storage for static sites, which does not currently perform compression
    new CompressionPlugin({
      algorithm: "gzip",
      deleteOriginalAssets: false
    })
  ]
}

if (isProductionGradeBuild) {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}
