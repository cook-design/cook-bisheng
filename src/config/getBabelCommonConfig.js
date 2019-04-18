const { tmpdir } = require('os');

const { resolve } = require;

export default function babel() {
  return {
    compact: false,
    // cacheDirectory: tmpdir(),
    presets: [
      resolve('@babel/preset-react'),
      [
        resolve('@babel/preset-env'),
        {
          targets: {
            browsers: [
              'last 2 versions',
              'Firefox ESR',
              '> 1%',
              'ie >= 8',
              'iOS >= 8',
              'Android >= 4',
            ],
          },
        },
      ],
    ],
    plugins: [
      resolve('@babel/plugin-proposal-object-rest-spread'),
      [
        resolve('@babel/plugin-proposal-decorators'),
        { decoratorsBeforeExport: true },
      ],
      resolve('@babel/plugin-proposal-class-properties'),
      resolve('@babel/plugin-proposal-export-default-from'),
      resolve('@babel/plugin-proposal-export-namespace-from'),
      [resolve('babel-plugin-import'), {
        libraryName: 'antd',
        style: true,
      }, 'antd'],
      [resolve('babel-plugin-import'), {
        libraryName: 'antd-mobile',
        style: true,
      }, 'antd-mobile'],
      [resolve('babel-plugin-import'), {
        libraryName: '@alipay/qingtai',
        style: true,
      }, '@alipay/qingtai'],
      [resolve('babel-plugin-import'), {
        libraryName: '@alipay/cook',
        style: true,
      }, '@alipay/cook'],
      [resolve('babel-plugin-import'), {
        libraryName: 'kb-cook',
        libraryDirectory: "es",
        style: true,
      }, 'kb-cook'],
    ],
  };
}
