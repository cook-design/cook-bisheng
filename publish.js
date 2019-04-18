const { version } = require('./package.json');
const { exec } = require('child_process');

const ps = exec(`npm run build && git tag ${version} && git push origin ${version} && npm publish`, (err) => {
  if (err) {
    console.log(`Error: ${err}`) // eslint-disable-line
  } else {
    console.log('发布完成。。。') // eslint-disable-line
  }
});

ps.stdout.on('data', (d) => {
  console.log(d); // eslint-disable-line
});
