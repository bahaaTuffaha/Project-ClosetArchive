import React, { Dispatch, SetStateAction, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ItemBox } from "./ItemBox";
import dayjs from "dayjs";
import { deleteEventLog, deleteLog } from "../redux/itemsSlice";
import { colors } from "../utils/colors";

interface LogComponentProps {
  eventName: string;
  eventDate: Date;
  eventId: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setModalEventId: Dispatch<SetStateAction<string>>;
}

export const LogComponent = ({
  eventName,
  eventDate,
  eventId,
  setRefresh,
  setModalVisible,
  setModalEventId,
}: LogComponentProps) => {
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === "dark";
  const itemsState = useSelector((state: RootState) => state.itemsList.items);

  const associatedItems = useMemo(() => {
    return itemsState.filter(item => item.logIds?.some(id => id === eventId));
  }, [itemsState, eventId]);

  const handleDelete = () => {
    dispatch(deleteLog({ selectedLogId: eventId }));
    dispatch(deleteEventLog({ selectedLogId: eventId }));
    setRefresh(prev => !prev);
  };

  const handlePress = () => {
    setModalVisible(true);
    setModalEventId(eventId);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1C1C1E" : colors.white },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.eventInfo}>
          <Text variant="titleMedium" style={styles.eventTitle}>
            {eventName}
          </Text>
          <View style={styles.dateTimeRow}>
            <Text variant="bodySmall" style={styles.dateText}>
              {dayjs(eventDate).format("DD/MM/YYYY")}
            </Text>
            <View style={styles.separator} />
            <Text variant="bodySmall" style={styles.timeText}>
              {dayjs(eventDate).format("h:mm A")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.itemsGrid,
          { borderColor: isDarkMode ? "#2C2C2E" : "#F2F2F7" },
        ]}
      >
        {associatedItems.length > 0 ? (
          associatedItems.map(item => (
            <View key={`log-item-${item.id}`} style={styles.itemWrapper}>
              <ItemBox
                primary={item.primaryColor || colors.white}
                secondary={item.secondaryColor || colors.white}
                tertiary={item.tertiaryColor || colors.white}
                image={item.image}
                name={item.name}
                type={item.type}
                id={item.id}
                logs={item.logIds || []}
                addSpace={true}
              />
            </View>
          ))
        ) : (
          <Text variant="bodySmall" style={styles.noItemsText}>
            No items associated with this log.
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: colors.mainCyan,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: colors.gray,
  },
  timeText: {
    color: colors.gray,
  },
  separator: {
    width: 1,
    height: 10,
    backgroundColor: colors.lightGray,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: colors.red,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "rgba(124, 139, 161, 0.1)", // Subtle tint
    padding: 10,
    justifyContent: "flex-start",
    borderTopWidth: 1,
    minHeight: 80,
  },
  itemWrapper: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 4,
  },
  noItemsText: {
    width: "100%",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: colors.gray,
  },
});
