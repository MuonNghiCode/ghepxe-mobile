module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-worklets/plugin",
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@assets": "./src/assets",
            "@utils": "./src/utils",
            "@context": "./src/context",
          },
        },
      ],
    ],
  };
};
