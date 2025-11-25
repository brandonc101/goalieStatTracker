#!/bin/bash
# Fix HomeScreen
sed -i '' 's/import { SafeAreaView } from '\''react-native'\'';/import { SafeAreaView } from '\''react-native-safe-area-context'\'';/g' src/screens/HomeScreen.tsx

# Fix AddGameScreen
sed -i '' 's/import { SafeAreaView } from '\''react-native'\'';/import { SafeAreaView } from '\''react-native-safe-area-context'\'';/g' src/screens/AddGameScreen.tsx

# Fix HistoryScreen
sed -i '' 's/import { SafeAreaView } from '\''react-native'\'';/import { SafeAreaView } from '\''react-native-safe-area-context'\'';/g' src/screens/HistoryScreen.tsx

# Fix GameDetailScreen
sed -i '' 's/import { SafeAreaView } from '\''react-native'\'';/import { SafeAreaView } from '\''react-native-safe-area-context'\'';/g' src/screens/GameDetailScreen.tsx

echo "Fixed SafeAreaView imports!"
