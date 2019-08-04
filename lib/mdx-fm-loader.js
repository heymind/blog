// https://github.com/c8r/x0/blob/master/lib/mdx-fm-loader.js
// front-matter loader for mdx
const matter = require('gray-matter')
const stringifyObject = require('stringify-object')

module.exports = async function (src) {
  const callback = this.async()
  const { content, data } = matter(src)

  const code = `export const frontMatter = ${stringifyObject(data)}
${content}
  `
  return callback(null, code)
}