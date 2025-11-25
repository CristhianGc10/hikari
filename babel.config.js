// babel.config.js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      // Expo + NativeWind
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated SIEMPRE debe ir de último
      "react-native-reanimated/plugin",
    ],
  };
};
