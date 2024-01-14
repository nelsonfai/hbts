import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  flexcontainer: {
    flexDirection: 'row',
  },
  userName: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2,
  },
  scrollView: {
    backgroundColor:'lightgrey',
    marginBottom:30,
    marginTop:20,
    borderRadius:8
  },
  div1: {
    height: 250,
    backgroundColor: 'lightblue',
    flex:1,
    padding:10
  },
  div2: {
    height: 200,
    backgroundColor: 'lightgreen',
    flex:1,
    padding:10
  },

 
});

export default styles;
