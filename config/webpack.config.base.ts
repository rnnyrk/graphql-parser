import path from 'path';
import * as webpack from 'webpack';
import * as devServer from 'webpack-dev-server';
import CopyPlugin from 'copy-webpack-plugin';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

// Remove reference to webpack config tsconfig.json
delete process.env.TS_NODE_PROJECT;

const baseConfig: webpack.Configuration = {
  mode: 'production',
  target: 'browserslist',
  output: {
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].js',
    path: path.resolve('dist'),
    publicPath: '/',
  },
  entry: path.resolve('src'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /external/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 10000,
              },
            }],
          },
          {
            use: ['@svgr/webpack'],
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        oneOf: [
          {
            resourceQuery: /external/,
            use: [{
              loader: 'file-loader',
              options: {
                name: 'static/[name].[ext]',
              },
            }],
          },
          {
            use: [{
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'static/images/[contenthash].[ext]',
              },
            }],
          },
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        exclude: [
          /\.[tj]sx?$/,
          /\.css$/,
          /\.svg$/,
          /\.(jpe?g|png|gif)$/i,
          /\.json$/,
          /\.html$/,
          /\.ejs$/,
        ],
        use: [{
          loader: 'file-loader',
          options: { name: 'static/[name].[ext]' },
        }],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './public' }],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('src/template.ejs'),
      filename: 'index.html',
      chunksSortMode: 'auto',
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    extensions: ['*', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin(),
    ],
  },
};

export default baseConfig;

export type WebpackConfig = webpack.Configuration & { devServer?: devServer.Configuration };
type WebpackMergeType = (...config: WebpackConfig[]) => WebpackConfig;

export const merge: WebpackMergeType = (...config) => webpackMerge(baseConfig, ...config);
