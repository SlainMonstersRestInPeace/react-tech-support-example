module.exports = {
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              esModule: false,
            },
          },
          "css-loader",
          'sass-loader'
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "imgs",
            esModule: false,
          }
        }
      },
      {
        test: /\.svg$/i,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
          }
        }
      },
      {
        test: /\.pug$/i,
        use: {
          loader: "pug-loader",
          options: {
            pretty: true
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
}