import { Stack ,Tabs, Slot} from "expo-router";
import { useFonts } from "expo-font";
import { UserProvider } from "../context/userContext";
import { RefreshProvider } from "../context/refreshContext";
import { I18nProvider } from "../context/i18nProvider";
import{ SummaryProvider } from "../context/summaryContext";
import { SwipeableProvider } from "../context/swipeableContext";
import { StripeProvider } from '@stripe/stripe-react-native';

const Layout = () => {
  const p_key ="pk_test_51OPRTQHZ7b9ff5E2gwvHGdbBmnRzFiFe6jipBucbyJtJ8EAgPAQQdI6sVaSejPN0jHO6eaq01NxzdJ2hVeHYCri300PdlNLEVK"

  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <StripeProvider publishableKey={p_key}>

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
                        headerTitle:''
                      }} name="(tabs)" 
              />

          </Stack>
          </SwipeableProvider>
        </SummaryProvider>
      </RefreshProvider>
   </I18nProvider>
    </UserProvider>
    </StripeProvider>

  )
};

export default Layout;
