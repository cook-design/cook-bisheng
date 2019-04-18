const { existsSync } = require('fs');
const { join, resolve } = require('path');
const pkgPath = join(process.cwd(), 'package.json');
const pkg = existsSync(pkgPath) ? require(pkgPath) : {};
let theme = {};
if (pkg.theme && typeof pkg.theme === 'string') {
  let cfgPath = pkg.theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = resolve(process.cwd(), cfgPath);
  }
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof pkg.theme === 'object') {
  theme = pkg.theme;
}
export default postcssOptions => ([
  {
    test(filePath) {
      return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
    },
    use: [{
      loader: require.resolve('css-loader'),
      options: {
        restructuring: false,
        autoprefixer: false,
      },
    }, {
      loader: require.resolve('postcss-loader'),
      options: postcssOptions,
    }],
  },
  {
    test: /\.module\.css$/,
    use: [{
      loader: require.resolve('css-loader'),
      options: {
        restructuring: false,
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
        autoprefixer: false,
      },
    }, {
      loader: require.resolve('postcss-loader'),
      options: postcssOptions,
    }],
  },
  {
    test(filePath) {
      return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath);
    },
    use: [{
      loader: require.resolve('css-loader'),
      options: {
        autoprefixer: false,
      },
    }, {
      loader: require.resolve('postcss-loader'),
      options: postcssOptions,
    }, {
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: true,
        modifyVars: theme,
      },
    }],
  },
  {
    test: /\.module\.less$/,
    use: [{
      loader: require.resolve('css-loader'),
      options: {
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
        autoprefixer: false,
      },
    }, {
      loader: require.resolve('postcss-loader'),
      options: postcssOptions,
    }, {
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: true,
        modifyVars: theme,
      },
    }],
  },
  {
    test(filePath) {
      return /\.scss$/.test(filePath) && !/\.module\.scss$/.test(filePath);
    },
    use: [{
      loader: require.resolve('css-loader'),
      options: {
        autoprefixer: false,
      },
    }, {
      loader: require.resolve('postcss-loader'),
      options: postcssOptions,
    }, 'sass-loader'],
  },
  {
    test: /\.module\.scss$/,
    use: [{
      loader: require.resolve('css-loader'),
      options: {
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
        autoprefixer: false,
      },
    }, {
      loader: require.resolve('postcss-loader'),
      options: postcssOptions,
    }, 'sass-loader'],
  }
]);
