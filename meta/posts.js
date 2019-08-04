const glob = require('glob');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
module.exports = promisify(glob)("./pages/posts/*.md")
.then(files=>Promise.all(files.map(async file => 
    ({
        slug:path.parse(file).name,
        ...require(`../pages/posts/${path.basename(file)}`).frontMatter,
        href:`/posts/${path.parse(file).name}`,
        date:(await promisify(fs.stat)(path.resolve(file))).mtime
    })
)).then(posts=>posts.sort((a,b)=>b.date - a.date)))