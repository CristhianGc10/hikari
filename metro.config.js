// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tratar SVG como código fuente (no como asset binario)
// Esto permite importarlos y procesarlos con nuestro transformador
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Usar nuestro transformador personalizado que convierte SVG a string
config.transformer.babelTransformerPath = require.resolve('./svg-transformer.js');

module.exports = config;