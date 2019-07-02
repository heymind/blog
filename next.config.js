const path = require("path");
const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withPurgeCss = require("next-purgecss");
const rehypePrism = require("@mapbox/rehype-prism");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins:[[require("remark-toc"),{maxDepth:4}],require("remark-slug")],
    rehypePlugins: [rehypePrism]
  }
});

module.exports = withPlugins([
  [
    withMDX,
    {
      pageExtensions: ["js", "jsx", "md", "mdx"],
      webpack(config, options) {
        config.node = { fs: "empty" };
        config.module.rules.push({
          test: /\.mdx?$/,
          use: [path.join(__dirname, "./lib/mdx-fm-loader")]
        });
        return config;
      }
    }
  ],
  // [
  //   withPurgeCss,
  //   {
  //     purgeCss: {
  //       whitelist: () => ["body"]
  //     }
  //   }
  // ],
  [withCSS],
  {
    module: {
      rules: [
        {
          test: /\.mdx?$/,
          use: [
            "babel-loader",
            "@mdx-js/loader",
            path.join(__dirname, "./lib/fm-loader")
          ]
        }
      ]
    }
  }
]);
// console.log(module.exports);
// module.exports = withMDX({
//     pageExtensions: ['js', 'jsx', 'md', 'mdx']
//   })
//   console.log(module.exports);
