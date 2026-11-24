import { Tabs } from "expo-router";
import { BottomTabBar, type BottomTabBarProps } from "expo-router/tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AppIcon,
  type AppIconName,
} from "@/presentation/components/common/AppIcon";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import { MiniPlayer } from "@/presentation/components/customer/player/MiniPlayer";

const tabIcons: Record<string, AppIconName> = {
  index: "home",
  search: "search",
  favorites: "heart",
  profile: "user",
};

function CustomerTabBar(props: BottomTabBarProps) {
  return (
    <View>
      <MiniPlayer bottomInset={false} />
      <BottomTabBar {...props} />
    </View>
  );
}

export function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => <CustomerTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: C.background },
        headerTintColor: C.text,
        headerShadowVisible: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: "#9CA2AE",
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 61 + Math.max(insets.bottom, 10),
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ],
        tabBarIcon: ({ focused, color }) => (
          <View style={[styles.icon, focused && styles.activeIcon]}>
            <AppIcon
              name={tabIcons[route.name] ?? "home"}
              color={color}
              size={21}
            />
          </View>
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Trang chủ", headerShown: false }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Tìm kiếm", headerShown: false }}
      />
      <Tabs.Screen name="favorites" options={{ title: "Yêu thích" }} />
      <Tabs.Screen name="profile" options={{ title: "Cá nhân" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 7,
    backgroundColor: C.background,
    borderTopColor: C.border,
    borderTopWidth: 1,
  },
  label: { fontSize: 9, fontWeight: "600", marginTop: 3 },
  icon: {
    width: 47,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  activeIcon: { backgroundColor: C.accentLight },
});
