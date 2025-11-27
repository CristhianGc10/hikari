// svg-transformer.js
// 
// Transformador personalizado para Metro que convierte archivos SVG
// en módulos JavaScript que exportan el contenido como string.
// Esto evita el problema de namespaces XML (kvg:) que causa errores
// con react-native-svg-transformer.
//

const { readFileSync } = require('fs');
const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = async ({ src, filename, options }) => {
  // Si es un archivo SVG, convertirlo a un módulo que exporta el string
  if (filename.endsWith('.svg')) {
    const svgContent = readFileSync(filename, 'utf8');
    
    // Escapar caracteres especiales para template literal
    const escaped = svgContent
      .replace(/\\/g, '\\\\')  // Escapar backslashes
      .replace(/`/g, '\\`')    // Escapar backticks
      .replace(/\$/g, '\\$');  // Escapar signos de dólar
    
    // Crear código que exporta el SVG como string
    const code = `export default \`${escaped}\`;`;
    
    return upstreamTransformer.transform({
      src: code,
      filename,
      options,
    });
  }

  // Para otros archivos, usar el transformador por defecto
  return upstreamTransformer.transform({ src, filename, options });
};