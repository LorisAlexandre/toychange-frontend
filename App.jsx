import { NavigationContainer } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { StripeProvider } from "@stripe/stripe-react-native";

import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
const reducers = combineReducers({ user });
import AsyncStorage from "@react-native-async-storage/async-storage";
import user from "./reducers/user";

import Favories from "./screens/FavoriesScreen.jsx";
import Search from "./screens/SearchScreen.jsx";
import AddPost from "./screens/AddPostScreen.jsx";
import Inbox from "./screens/InboxScreen.jsx";
import MyAccount from "./screens/MyAccountScreen.jsx";
import PostScreen from "./screens/PostScreen.jsx";
import CheckoutScreen from "./screens/CheckoutScreen.jsx";
import MyAnnouncesScreen from "./screens/MyAnnouncesScreen.jsx";
import MyOrdersScreen from "./screens/MyOrdersScreen.jsx";
import MyOrderScreen from "./screens/MyOrderScreen.jsx";
import MyChannelScreen from "./screens/MyChannelScreen.jsx";

const store = configureStore({
  reducer: { user },
});
// const persistConfig = {
//   key: "ToyChange",
//   storage: AsyncStorage,
//   blacklist: ["user"],
// };
// const store = configureStore({
//   reducer: persistReducer(persistConfig, reducers),
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });
// const persistor = persistStore(store);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Recherche"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          switch (route.name) {
            case "Favoris":
              iconName = "heart";
              break;
            case "Recherche":
              iconName = "search";
              break;
            case "Publier":
              iconName = "plus-square";
              break;
            case "Messages":
              iconName = "comment-alt";
              break;
            case "Mon Compte":
              iconName = "user";
              break;
          }

          return <FontAwesome name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: "#F56E00",
        tabBarInactiveTintColor: "lightgray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Favoris" component={Favories} />
      <Tab.Screen name="Recherche" component={Search} />
      <Tab.Screen name="Publier" component={AddPost} />
      <Tab.Screen name="Messages" component={Inbox} />
      <Tab.Screen name="Mon Compte" component={MyAccount} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor}> */}
      <StripeProvider
        publishableKey="pk_test_51OACi2BvdD53AmibPhkwBMa2sYBVRUkt50bPhHuTVUqQ1fMSntJRl5jE8yg3owQFcEzMlk8CfXL62aBI5uejU3cO00OubHVXO0"
        urlScheme=""
        merchantIdentifier=""
      >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="TabNavigator"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="PostScreen" component={PostScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen
              name="MyAnnouncesScreen"
              component={MyAnnouncesScreen}
            />
            <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
            <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} />
            <Stack.Screen name="MyChannelScreen" component={MyChannelScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}
