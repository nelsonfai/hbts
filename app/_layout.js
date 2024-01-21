import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { UserProvider } from "../context/userContext";
import { RefreshProvider } from "../context/refreshContext";
import { I18nProvider } from "../context/i18nProvider";
import { SummaryProvider } from "../context/summaryContext";
import { SwipeableProvider } from "../context/swipeableContext";

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <UserProvider>
        <I18nProvider>
          <RefreshProvider>
            <SummaryProvider>
              <SwipeableProvider>
                <Stack initialRouteName="home">
                  <Stack.Screen
                    options={{
                      headerShadowVisible: true,
                      headerShown: false,
                      headerTitle: ''
                    }}
                    name="(tabs)"
                  />
                </Stack>
              </SwipeableProvider>
            </SummaryProvider>
          </RefreshProvider>
        </I18nProvider>
      </UserProvider>
  );
};

export default Layout;
