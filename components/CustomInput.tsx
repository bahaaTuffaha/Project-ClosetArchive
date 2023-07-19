import { StyleSheet, TextInput, View, useColorScheme } from "react-native";
import { TextInput as TextInput2 } from "react-native-paper";
import { Props } from "react-native-paper/lib/typescript/src/components/TextInput/TextInput";

export interface CustomInputProps extends Props {
  left?: React.ReactElement;
  right?: React.ReactElement;
}
export const CustomInput = ({ left, right, ...props }: CustomInputProps) => (
  <TextInput2
    theme={{
      roundness: 10,
      colors: {
        background: useColorScheme() == "light" ? "white" : "#2B2E3D",
      },
    }}
    {...props}
    render={(inputProps) => (
      <View style={{ flexDirection: "row" }}>
        {left && <View style={styles.customLeft}>{left}</View>}
        <TextInput className="w-10/12" {...inputProps} />
        {right && <View style={styles.customRight}>{right}</View>}
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  customLeft: {
    position: "absolute",
    left: 0,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  customRight: {
    position: "absolute",
    right: 0,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
});
