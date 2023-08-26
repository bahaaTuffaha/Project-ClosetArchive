import { Pressable, useColorScheme } from "react-native";
import { ThemeText } from "./ThemeText";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export const DatePicker = ({
  title = "Date",
  isDatePickerVisible,
  date,
  setDate,
  setDatePickerVisibility,
  type = "date",
}: {
  title: string;
  isDatePickerVisible: boolean;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  setDatePickerVisibility: Dispatch<SetStateAction<boolean>>;
  type?: "date" | "time" | "both";
}) => {
  return (
    <>
      <Pressable
        className="w-4/5 h-12 border rounded-md border-mainGreen flex flex-row justify-between px-2 items-center"
        onPress={() => {
          setDatePickerVisibility(true);
        }}
        style={{
          backgroundColor: useColorScheme() == "dark" ? "#2B2E3D" : "white",
        }}
      >
        <ThemeText lightColor="black">{title + ":"}</ThemeText>
        <ThemeText>{date ? dayjs(date).format("DD/MM/YYYY") : ""}</ThemeText>
        {type == "time" ||
          (type == "both" && (
            <ThemeText>
              {date ? dayjs(date).format("h:mm a") : "Select Date"}
            </ThemeText>
          ))}
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        display={
          type == "both" ? "inline" : type == "date" ? "spinner" : "clock"
        }
        mode={type == "both" ? "datetime" : type == "date" ? "date" : "time"}
        onConfirm={(date: Date) => {
          setDatePickerVisibility(false);
          setDate(date);
        }}
        onCancel={() => {
          setDatePickerVisibility(false);
        }}
      />
    </>
  );
};
