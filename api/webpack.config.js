const pathHelper = require('./tools/pathHelper');
const uglifyJSPlugin = require('uglifyjs-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');

const isProductionBuild = process.env.NODE_ENV === 'production';
const isOfflineBuild = false;

const ignoredFunctions = isOfflineBuild ? [
  // cloud-only functions
  "chat-login"
] : [
  // offline-only functions

];

module.exports = {
  target: 'node',
  entry: function() {
    // Automatically discovers azure functions and registers them as entrypoints
    const entryPoints = {};
    for (const scriptPath of glob.sync('./src/functions/root/*/*.ts')) {
      let scriptName = scriptPath.slice('./src/functions/root/'.length, scriptPath.lastIndexOf('/') - scriptPath.length);
      if (!ignoredFunctions.includes(scriptName)){
        entryPoints[scriptName] = pathHelper.root(scriptPath.slice('./'.length));
      }
    }
    return entryPoints;
  },
  devtool: isProductionBuild ? undefined : "source-map",
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
      '@': pathHelper.root("src"),
      '@common': pathHelper.root("../common/src")
    }
  },
  plugins: [
    new copyWebpackPlugin([
      {
        context: 'src/functions/root',
        from: '**/*.json',
        to: '',
        ignore: isProductionBuild ? [ '**/local.settings.json' ] : []
      }
    ])
  ].concat(!isProductionBuild ? [] : [
    // production-only plugins
    new uglifyJSPlugin({
      uglifyOptions: {
        ecma: 6,
        compress: true
      }
    })
  ]),
  node: {
    __filename: false,
    __dirname: false,
  }
};
