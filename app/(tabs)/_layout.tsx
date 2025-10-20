import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={{ color: theme.danger, marginRight: 15 }}>Logout</Text>
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: theme.tint,
        headerShown: true,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="add" options={{ title: 'Add Post' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="profile" options={{ title: 'My Profile' }} />
    </Tabs>
  );
}
