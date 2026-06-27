// Safe stub target for any 'react-native-maps' resolution on web.
// Real package is only resolved on native via direct imports in .native.* files
// or default resolver.
module.exports = require('./MapViewWebStub');