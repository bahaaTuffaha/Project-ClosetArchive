// import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import { BackButton } from "../../components/BackButton";
import { ThemeView } from "../../components/ThemeView";
import { CustomInput } from "../../components/CustomInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import ColorModal from "../../components/ColorModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const CategoryForm = () => {
  // const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [colors, setColors] = useState([""]);
  const categoriesState = useSelector((state: RootState) => state.CategoryList);

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
          <View className="flex items-center space-y-3">
            <TouchableOpacity
              style={{ backgroundColor: colors[0] }}
              onPress={() => {
                setVisible(true);
              }}
              className="flex justify-center items-center w-16 h-16 border-[3px] rounded-xl mt-2"
            >
              <Text className="text-black">Color</Text>
            </TouchableOpacity>
            <CustomInput
              mode="outlined"
              outlineColor="#AEBB77"
              selectionColor="#C0C0C0"
              activeOutlineColor="#AEBB77"
              textContentType="name"
              style={styles.customWidth}
              label="Category Name"
              value={name}
              onChange={(text) => setName(text.nativeEvent.text)}
            />
          </View>
        </>
      </ThemeView>
    </>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
