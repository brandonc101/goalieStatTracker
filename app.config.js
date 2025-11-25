module.exports = {
  name: 'Goalie Stats Tracker',
  slug: 'goalie-stats-tracker',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0a0e1a',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.haakon.goaliestatstracker',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0a0e1a',
    },
    package: 'com.haakon.goaliestatstracker',
  },
};
