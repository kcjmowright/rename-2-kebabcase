let _ = require('lodash');
let process = require('process');
let recursive = false;
let directories = []; 
let fs = require('fs');

process.argv.forEach((val, idx) => {
  if(idx < 2) {
    return;
  }
  switch(val) {
    case '-r':
      recursive = true;
      break;
    default:
      directories.push(val);
      break;
  } 
});

if(!directories.length) {
  directories.push(process.cwd());
}
directories.forEach(dir => processDirectory(dir));

function processDirectory(dir) {
  console.log(`Reading contents of "${dir}"...`);
  fs.readdir(dir, (err, files) => {
    if(err) {
      console.log(e);
      return;
    } else if(_.isUndefined(files) || !files.length) {
      console.log(`no files found in ${dir}`);
      return;
    }
    files.forEach(f => {
      let idx = f.lastIndexOf('.');
      let renamed;
      let stats = fs.statSync(`${dir}/${f}`);
      let suffix;
       
      if(stats.isDirectory()) {
        processDirectory(`${dir}/${f}`);
        return;
      } else if(!stats.isFile()) {
        return;
      }
      if(idx >= 0) {
        suffix = f.substring(f.lastIndexOf('.'));
        renamed = `${_.kebabCase(f.substring(0, idx))}${suffix}`;
      } else {
        renamed = _.kebabCase(f);
      }
      console.log(`Attempting to rename "${f}" to "${renamed}"`);
      fs.rename(`${dir}/${f}`, `${dir}/${renamed}`, e => {
        if(e) {
          console.log(e);
        }
      });
    });
  });
}
