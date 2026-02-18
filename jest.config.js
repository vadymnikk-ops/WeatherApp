module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  watchman: false,
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community)/)'
  ]
};
