import { useState ,useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./welcome.style";
import { useContext } from "react";
import { icons, SIZES } from "../../../constants";
import CarouselComponent from "../../carousel/carousel";
import YourCarouselComponent from "../../carousel/carousel";
import I18nContext from "../../../context/i18nProvider";

const Welcome = ({user,summary}) => {
  const router = useRouter();
  const {i18n} = useContext(I18nContext)
  return (
    <View style={{flex:1}}>
      <View >
        <Text style={{fontSize:20}} >{i18n.t('home.hello')} {user.name} ! </Text>
        <Text style={{fontSize:24,fontWeight:'500'}} >{i18n.t('home.greetings')} </Text>
      </View>
      <YourCarouselComponent   user ={user}  summary={summary}/>
    </View>

  );
};

export default Welcome;