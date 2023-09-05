const path = require('path');

module.exports = {
  entry: './src/server.ts',
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  resolve: {
    extensions: [
      '.ts',
      '...',
    ],
  },
  target: 'node',
};
