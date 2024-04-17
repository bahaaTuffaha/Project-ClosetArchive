import { Button } from "react-native-paper";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { colors } from "../../utils/colors";
import { CustomInput } from "../../components/CustomInput";
import { StyleSheet, View } from "react-native";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ThemeText } from "../../components/ThemeText";
import Icon from "react-native-vector-icons/FontAwesome5";
import { handleNumberChange } from "../../utils/validators";

export const BulkModeForm = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { selectedCategory } = route.params;
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [prefix, setPrefix] = useState("");
  const [imageNum, setImageNum] = useState(2);
  return (
    <ThemeView>
      <>
        <BackButton />
        <CustomInput
          mode="outlined"
          outlineColor={colors.mainGreen}
          selectionColor="#C0C0C0"
          activeOutlineColor={colors.mainGreen}
          textContentType="name"
          style={[
            styles.customWidth,
            {
              textAlign: storedSettings.language == 1 ? "right" : "left",
            },
          ]}
          // label={localization.Additional_notes[storedSettings.language]}
          label="Prefix"
          value={prefix}
          onChange={(text) => setPrefix(text.nativeEvent.text)}
        />
        <CustomInput
          mode="outlined"
          outlineColor={colors.mainGreen}
          selectionColor="#C0C0C0"
          activeOutlineColor={colors.mainGreen}
          textContentType="name"
          className="w-[50px] mx-5"
          label={"Number of items"}
          value={imageNum.toString()}
          onChange={(text) =>
            handleNumberChange(
              () => {
                setImageNum(Number(text.nativeEvent.text));
              },
              text.nativeEvent.text,
              2,
              30,
            )
          }
          keyboardType="numeric"
        />
        <View
          className={`flex ${
            storedSettings.language == 1 ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Icon name="info-circle" size={15} color={colors.mainCyan} />
          <ThemeText classNameStyle="text-xs mx-2">
            {
              "This will let you take images rapidly according to number of images"
            }
          </ThemeText>
        </View>
        <Button
          // className="mb-5"
          mode="contained"
          buttonColor={colors.mainCyan}
          textColor={colors.white}
          onPress={() => {}}
        >
          Start
        </Button>
      </>
    </ThemeView>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
