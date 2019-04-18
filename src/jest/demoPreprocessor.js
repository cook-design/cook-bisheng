import { relative } from 'path';
import * as crypto from 'crypto';
import markTwain from 'cook-mark-twain';
import JsonML from 'jsonml.js/lib/utils';
import * as babel from '@babel/core';
import getBabelCommonConfig from '../config/getBabelCommonConfig';
import { version } from '../../package.json';
const libDir = process.env.LIB_DIR || 'component';

function getCode(tree) {
  let code;
  const find = node => {
    if (code) return;
    if (!JsonML.isElement(node)) return;
    if (JsonML.getTagName(node) !== 'pre') {
      JsonML.getChildren(node).forEach(find);
      return;
    }
    code = JsonML.getChildren(JsonML.getChildren(node)[0] || '')[0] || '';
  };
  find(tree);
  return code;
}

function createDemo({ types: t }) {
  return {
    visitor: {
      Program(path) {
        const importReact = t.ImportDeclaration(
          [t.importDefaultSpecifier(t.Identifier('React'))],
          t.StringLiteral('react')
        );
        path.unshiftContainer('body', importReact);
      },

      CallExpression(path) {
        if (
          path.node.callee.object &&
          path.node.callee.object.name === 'ReactDOM' &&
          path.node.callee.property.name === 'render'
        ) {
          const app = t.VariableDeclaration('const', [
            t.VariableDeclarator(t.Identifier('__Demo'), path.node.arguments[0]),
          ]);
          const exportDefault = t.ExportDefaultDeclaration(t.Identifier('__Demo'));
          path.insertAfter(exportDefault);
          path.insertAfter(app);
          path.remove();
        }
      },
    },
  };
}

module.exports = {
  process(src, path) {
    const markdown = markTwain(src);
    src = getCode(markdown.content);

    // @ @ secret API.
    global.__clearBabelAntdPlugin && global.__clearBabelAntdPlugin(); // eslint-disable-line

    const babelConfig = getBabelCommonConfig();
    babelConfig.plugins = [...babelConfig.plugins];

    babelConfig.plugins.push(createDemo);

    babelConfig.filename = path;

    src = babel.transform(src, babelConfig).code;

    return src;
  },

  getCacheKey(fileData, filename, configString, options) {
    const { instrument, rootDir } = options;

    return crypto
      .createHash('md5')
      .update(fileData)
      .update('\0', 'utf8')
      .update(relative(rootDir, filename))
      .update('\0', 'utf8')
      .update(configString)
      .update('\0', 'utf8')
      .update(instrument ? 'instrument' : '')
      .update('\0', 'utf8')
      .update(libDir)
      .update('\0', 'utf8')
      .update(version)
      .digest('hex');
  },
};
