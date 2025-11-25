const upstreamTransformer = require("@expo/metro-config/babel-transformer");

module.exports.transform = async function ({ src, filename, ...rest }) {
  if (filename.endsWith(".svg")) {
    const code = `module.exports = ${JSON.stringify(src)};`;
    return upstreamTransformer.transform({ src: code, filename, ...rest });
  }

  return upstreamTransformer.transform({ src, filename, ...rest });
};
