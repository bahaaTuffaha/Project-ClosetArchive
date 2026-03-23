import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, Keyboard } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { Button, HelperText, TextInput } from "react-native-paper";
import { colors as appColors } from "../utils/colors";
import CustomModal from "./CustomModal";
import { localization } from "../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const HEX_COLOR_PATTERN = /^#([0-9A-F]{3}){1,2}$/i;

const ColorModal = ({
  setVisible,
  visible,
  colors,
  setColors,
  colorSelection,
}: {
  colors: string[];
  colorSelection: number;
  setColors: Dispatch<SetStateAction<string[]>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
}) => {
  const initialColor = colors[colorSelection] || "#000000";
  const [draftColor, setDraftColor] = useState(initialColor);
  const [inputValue, setInputValue] = useState(initialColor);
  const storedSettings = useSelector((state: RootState) => state.settings);
  const isValidHex = HEX_COLOR_PATTERN.test(inputValue);
  const savedColor = colors[colorSelection] || "#000000";
  const hasChanged = draftColor !== savedColor;

  useEffect(() => {
    if (visible) {
      setDraftColor(savedColor);
      setInputValue(savedColor);
    }
  }, [visible, savedColor]);

  const updateDraftColor = (color: string) => {
    setDraftColor(color);
    setInputValue(color);
  };

  const confirmColor = () => {
    if (!isValidHex) {
      return;
    }

    const updatedColors = [...colors];
    updatedColors[colorSelection] = inputValue;
    setColors(updatedColors);
    setVisible(false);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const syncHexToPicker = () => {
    if (HEX_COLOR_PATTERN.test(inputValue)) {
      setDraftColor(inputValue.toUpperCase());
    }
  };

  return (
    <CustomModal
      visible={visible}
      setVisible={setVisible}
      label={localization.Pick_A_Color[storedSettings.language]}
      minHeight={250}
    >
      <>
        <View className="h-[280px] p-4">
          <ColorPicker
            onInteractionStart={() => Keyboard.dismiss()}
            color={draftColor}
            onColorChange={updateDraftColor}
            thumbSize={40}
            sliderSize={40}
            noSnap={true}
            row={false}
            swatches={false}
            sliderHidden={false}
            wheelHidden={false}
          />
        </View>
        <TextInput
          mode="outlined"
          outlineColor={appColors.mainGreen}
          selectionColor="#C0C0C0"
          activeOutlineColor={appColors.mainGreen}
          className="m-2"
          theme={{ roundness: 10 }}
          label="HEX"
          value={inputValue}
          onChangeText={handleInputChange}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          keyboardType="default"
          right={
            <TextInput.Icon
              icon="check"
              disabled={!isValidHex}
              onPress={syncHexToPicker}
            />
          }
        />
        <HelperText type="error" visible={inputValue.length > 0 && !isValidHex}>
          Enter a valid HEX color like #D30047 or #F00.
        </HelperText>
        <Button
          mode="contained"
          buttonColor={appColors.mainGreen}
          textColor={appColors.black}
          className="m-2"
          disabled={!isValidHex || !hasChanged}
          onPress={confirmColor}
        >
          {localization.Save[storedSettings.language]}
        </Button>
      </>
    </CustomModal>
  );
};
export default ColorModal;
