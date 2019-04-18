import * as crypto from 'crypto';
import * as babelJest from 'babel-jest';
import * as tsJest from 'ts-jest';

import getBabelCommonConfig from '../config/getBabelCommonConfig';
import { version } from '../../package.json';
const libDir = process.env.LIB_DIR || 'component';

module.exports = {
  canInstrument: true,
  process(src, path, config, transformOptions) {
    const isTypeScript = path.endsWith('.ts') || path.endsWith('.tsx');
    const isJavaScript = path.endsWith('.js') || path.endsWith('.jsx');
    const babelConfig = getBabelCommonConfig();
    if (isTypeScript) {
      config.globals['ts-jest'] = config.globals['ts-jest'] || {};
      config.globals['ts-jest'].babelConfig = babelConfig;
      config.globals['ts-jest'].tsConfig = {
        target: 'es5',
        jsx: 'preserve',
        moduleResolution: 'node',
        declaration: false
      };

      return tsJest.process(src, path, config, transformOptions);
    }
    const fileName = path;
    return babelJest.createTransformer(babelConfig).process(src, fileName, config, transformOptions);
  },

  getCacheKey(...args) {
    return crypto
      .createHash('md5')
      .update(tsJest.getCacheKey.call(tsJest, ...args))
      .update('\0', 'utf8')
      .update(libDir)
      .update('\0', 'utf8')
      .update(version)
      .digest('hex');
  },
};
