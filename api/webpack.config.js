const pathHelper = require('./tools/pathHelper');
const uglifyJSPlugin = require('uglifyjs-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');

module.exports = {
  target: 'node',
  entry: function() {
    // Automatically discovers azure functions and registers them as entrypoints
    const entryPoints = {};
    for (const scriptPath of glob.sync('./src/functions/*/*.ts')) {
      let scriptName = scriptPath.slice('./src/functions/'.length, scriptPath.lastIndexOf('/') - scriptPath.length);
      entryPoints[scriptName] = pathHelper.root(scriptPath.slice('./'.length));
    }
    return entryPoints;
  },
  devtool: "source-map",
  output: {
    path: pathHelper.root('dist'),
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader?declaration=false',
        exclude: [/\.(spec|e2e)\.ts$/]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [
      'node_modules',
      'src'
    ],
    alias: {
      '@': pathHelper.root("src")
    }
  },
  plugins: [
    // new uglifyJSPlugin({
    //   uglifyOptions: {
    //     ecma: 6
    //   },
    //   sourceMap: true
    // }),
    new copyWebpackPlugin([
      {
        from: 'src/functions/host.json',
        to: 'host.json'
      },
      {
        context: 'src/functions',
        from: '**/function.json',
        to: ''
      }
    ])
  ],
  node: {
    __filename: false,
    __dirname: false,
  }
};
