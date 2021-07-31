import { Dimensions, StyleSheet } from "react-native";
import { gray } from "../../../utils/color";

const { height } = Dimensions.get("screen");
const height_logo = height * 0.40;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 30
  },
  logo: {
    height: height_logo,
  },
  brandTitle: {
    color: 'white',
    fontSize: 30,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold'
  },
  text: {
    color: 'black',
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    alignItems: 'center',
    height: 50,
    width: '80%',
    backgroundColor: gray,
    borderRadius: 15
  },
  buttonContainer: {
    alignItems: 'center',
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row'
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold'
  },
  allowBluetoothDescription: { 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 5,
  }
});