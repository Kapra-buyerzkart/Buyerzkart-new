module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ["./src/assets/fonts/"], // stays the same
  dependencies: {
    'lottie-ios': {
      platforms: {
        ios: null, // disable iOS platform, other platforms will still autolink if provided
      },
    },
    'lottie-react-native': {
      platforms: {
        ios: null, // disable iOS platform, other platforms will still autolink if provided
      },
    },
  },
};
