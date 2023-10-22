import { StyleSheet, Text, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { BackButton } from "../../components/BackButton";
import { CustomInput } from "../../components/CustomInput";
import { useState } from "react";
import { DatePicker } from "../../components/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { addEventLog, addLog } from "../../redux/itemsSlice";
import { nanoid } from "nanoid";
import { CommonActions } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { ThemeText } from "../../components/ThemeText";
import { colors } from "../../utils/colors";
import { localization } from "../../utils/localization";
import { RootState } from "../../redux/store";

export const EventLogForm = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const { selectedIDs } = route.params;
  const dispatch = useDispatch();
  const storedSettings = useSelector((state: RootState) => state.settings);

  async function addEventHandler() {
    const generatedId = nanoid(); // event Id
    const errors = [];

    if (eventName.length <= 0) {
      errors.push("Please enter a name for this event");
    }
    if (eventName.length > 20) {
      errors.push("Please enter a name within 20 characters");
    }
    if (errors.length > 0) {
      setErrorsList(errors);
      return;
    }
    setErrorsList([]);
    dispatch(
      addEventLog({
        eventDate: JSON.stringify(eventDate),
        eventName: eventName,
        eventId: generatedId,
        logTime: JSON.stringify(new Date()),
        additionalNotes: additionalNotes,
      }),
    );

    selectedIDs.forEach((id: string) => {
      dispatch(addLog({ selectedId: id, logId: generatedId }));
    });
    navigation.popToTop("Category");
    navigation.dispatch(CommonActions.goBack());
  }
  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">
            {localization.EventInfo[storedSettings.language]}
          </ThemeText>
        </View>
        <View className="flex items-center space-y-3">
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
            className="mb-5"
            label={localization.EventName[storedSettings.language]}
            value={eventName}
            onChange={(text) => setEventName(text.nativeEvent.text)}
          />
          <DatePicker
            title={localization.EventDate[storedSettings.language]}
            type="both"
            date={eventDate}
            isDatePickerVisible={isDatePickerVisible}
            setDate={setEventDate}
            setDatePickerVisibility={setDatePickerVisibility}
          />
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
            textArea={true}
            label={localization.Additional_notes[storedSettings.language]}
            value={additionalNotes}
            onChange={(text) => setAdditionalNotes(text.nativeEvent.text)}
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
          <Button
            // className="mb-5"
            mode="contained"
            buttonColor={colors.mainCyan}
            textColor={colors.white}
            onPress={addEventHandler}
          >
            {localization.Save[storedSettings.language]}
          </Button>
        </View>
      </>
    </ThemeView>
  );
};
const styles = StyleSheet.create({
  customWidth: { width: "80%" },
});
