// babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',
      'nativewind/babel',
    ],
    plugins: [
      'expo-router/babel',
      // Si usas Reanimated, este plugin DEBE ir al final
      'react-native-reanimated/plugin',
    ],
  };
};
