import { Image } from "expo-image";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/presentation/components/common/AppIcon";
import { BrandLogo } from "@/presentation/components/customer/layout/BrandLogo";
import { CustomerTheme as C } from "@/shared/constants/customerTheme.constants";
import type { AuthFormMode } from "./authForm.validation";
import { normalizeAuthReturnTo } from "@/shared/utils/authRedirect.utils";

export function CustomerAuthScreen({
  mode,
  children,
}: PropsWithChildren<{ mode: AuthFormMode }>) {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const returnTo = normalizeAuthReturnTo(params.returnTo);
  const isRegister = mode === "register";
  const switchHref = {
    pathname: isRegister ? "/(auth)/login" : "/(auth)/register",
    params: { returnTo },
  } as const;

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/(tabs)")
            }
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <AppIcon name="chevronLeft" size={19} color={C.text} />
          </Pressable>
          <Link href="/(tabs)" replace asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Về trang chủ"
            >
              <BrandLogo compact />
            </Pressable>
          </Link>
        </View>
        <Link href={switchHref} replace asChild>
          <Pressable
            accessibilityRole="link"
            style={({ pressed }) => [
              styles.headerSwitch,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.headerSwitchText}>
              {isRegister ? "Đăng nhập" : "Đăng ký"}
            </Text>
          </Pressable>
        </Link>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("@/assets/images/home-glow.svg")}
          alt=""
          style={styles.glow}
          contentFit="fill"
          pointerEvents="none"
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.heading}>
                <View style={styles.headingIcon}>
                  <AppIcon
                    name={isRegister ? "userPlus" : "headphones"}
                    size={26}
                    color={C.accent}
                  />
                </View>
                <Text accessibilityRole="header" style={styles.title}>
                  {isRegister ? "Đăng ký" : "Đăng nhập"}
                </Text>
                <Text style={styles.subtitle}>
                  {isRegister
                    ? "Bắt đầu hành trình lắng nghe của bạn."
                    : "Chào mừng bạn trở lại với audiobook."}
                </Text>
              </View>
              {children}
              <View style={styles.switchRow}>
                <Text style={styles.switchPrompt}>
                  {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                </Text>
                <Link href={switchHref} replace asChild>
                  <Pressable accessibilityRole="link" hitSlop={8}>
                    <Text style={styles.switchText}>
                      {isRegister ? "Đăng nhập ngay" : "Đăng ký ngay"}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
            <View style={styles.tagline}>
              <AppIcon name="headphones" size={15} color="#B798A3" />
              <Text style={styles.taglineText}>
                Những cuốn sách hay, luôn bên bạn.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  header: {
    minHeight: 68,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: C.background,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  back: {
    width: 34,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  headerSwitch: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.accentLight,
  },
  headerSwitchText: { fontSize: 11, fontWeight: "700", color: C.accent },
  pressed: { opacity: 0.65 },
  keyboard: { flex: 1, backgroundColor: "#F8F9FC" },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 440,
    opacity: 0.7,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  content: { width: "100%", maxWidth: 440, alignSelf: "center" },
  card: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 25,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E9EAF0",
    backgroundColor: C.background,
    boxShadow: "0px 12px 36px rgba(30,41,59,0.05)",
  },
  heading: { alignItems: "center", marginBottom: 26 },
  headingIcon: {
    width: 54,
    height: 54,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accentLight,
    marginBottom: 18,
  },
  title: {
    color: C.text,
    fontSize: 29,
    lineHeight: 37,
    fontWeight: "800",
    letterSpacing: -0.9,
    textAlign: "center",
  },
  subtitle: {
    color: C.secondary,
    fontSize: 11,
    lineHeight: 19,
    marginTop: 7,
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F5",
    paddingTop: 22,
    marginTop: 25,
  },
  switchPrompt: { color: C.secondary, fontSize: 11, lineHeight: 20 },
  switchText: {
    color: C.accent,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 20,
  },
  tagline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 25,
    paddingHorizontal: 10,
  },
  taglineText: { color: "#A28C95", fontSize: 10, lineHeight: 18 },
});
