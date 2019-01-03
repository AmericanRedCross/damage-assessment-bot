const pathHelper = require('./tools/pathHelper');
const copyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');

const isProductionBuild = process.env.NODE_ENV === 'production';

process.traceDeprecation = true;

module.exports = {
  target: 'node',
  entry: function() {
    // Automatically discovers azure functions and registers them as entrypoints
    const entryPoints = {};
    for (const scriptPath of glob.sync('./src/functions/root/*/*.ts')) {
      let scriptName = scriptPath.slice('./src/functions/root/'.length, scriptPath.lastIndexOf('/') - scriptPath.length);
        entryPoints[scriptName] = pathHelper.root(scriptPath.slice('./'.length));
    }
    return entryPoints;
  },
  devtool: undefined,//isProductionBuild ? undefined : "source-map",
  output: {
    path: pathHelper.root('dist'),
    filename: '[name]/index.js',
    chunkFilename: '_shared/bundles/[chunkHash].bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader?declaration=false',
        include: pathHelper.root("src"),
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
      '@common': pathHelper.root("../common/bin")
    }
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new copyWebpackPlugin([
      {
        context: 'src/functions/root',
        from: '**/*.json',
        to: '',
        ignore: isProductionBuild ? [ '**/local.settings.json' ] : []
      },
      {
        context: 'src/chat/localization/botbuilder',
        from: '*/BotBuilder.json',
        to: 'locale'
      }
    ])
  ],
  node: {
    __filename: false,
    __dirname: false,
  }
};
