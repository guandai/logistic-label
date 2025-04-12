const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust this if your entry point is different
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  optimization: {
    splitChunks: false,
  }
  mode: 'development', // Use 'production' for production builds
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'), // Serve from the build directory
    },
    compress: true, // Enable gzip compression
    port: 3000, // Port to run the dev server on
    historyApiFallback: true, // Serve index.html for all 404s (useful for SPAs)
    open: true, // Automatically open the browser
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Process CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Handle image files
        type: 'asset/resource',
      },
    ],
  },
};
