// import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useState } from "react";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { CustomInput } from "../../components/CustomInput";
// import { TouchableOpacity } from "react-native-gesture-handler";
import ColorModal from "../../components/ColorModal";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
import { ThemeText } from "../../components/ThemeText";
import { addCategory } from "../../redux/categoriesSlice";
import { CommonActions } from "@react-navigation/native";
import { colors as appColors } from "../../utils/colors";
import { localization } from "../../utils/localization";
import { RootState } from "../../redux/store";

export const CategoryForm = ({ navigation }: { navigation: any }) => {
  // const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [colors, setColors] = useState([""]);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const dispatch = useDispatch();

  async function addCategoryHandler() {
    const errors = [];

    if (name.length <= 0) {
      errors.push("Please enter a name for this Category");
    }
    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    dispatch(
      addCategory({
        name: name,
      }),
    );
    // navigation.popToTop("Category");
    navigation.dispatch(CommonActions.goBack());
  }
  return (
    <>
      <ColorModal
        colors={colors}
        setColors={setColors}
        visible={visible}
        setVisible={setVisible}
        colorSelection={0}
      />
      <ThemeView>
        <>
          <BackButton />

          <View className="flex flex-col items-center space-y-3">
            {/* <TouchableOpacity
              style={{ backgroundColor: colors[0] }}
              onPress={() => {
                setVisible(true);
              }}
              className="flex justify-center items-center w-16 h-16 border-[3px] rounded-xl mt-2"
            >
              <Text className="text-black">Color</Text>
            </TouchableOpacity> */}
            <ThemeText classNameStyle="text-xl mt-4 font-mono">
              {localization.Add_a_Category[storedSettings.language]}
            </ThemeText>
            <CustomInput
              mode="outlined"
              outlineColor={appColors.mainGreen}
              selectionColor="#C0C0C0"
              activeOutlineColor={appColors.mainGreen}
              textContentType="name"
              style={[
                styles.customWidth,
                {
                  textAlign: storedSettings.language == 1 ? "right" : "left",
                },
              ]}
              label={localization.Category_Name[storedSettings.language]}
              value={name}
              onChange={(text) => setName(text.nativeEvent.text)}
            />
            {errorsList.length > 0 && (
              <View>
                {errorsList.map((error, index) => {
                  return (
                    <Text key={index} className="text-[#C70039]">
                      {error}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>

          <Button
            // className="mb-5"
            mode="contained"
            buttonColor={appColors.mainCyan}
            textColor={appColors.white}
            onPress={addCategoryHandler}
            className="mx-10 my-5"
          >
            {localization.Save[storedSettings.language]}
          </Button>
        </>
      </ThemeView>
    </>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
