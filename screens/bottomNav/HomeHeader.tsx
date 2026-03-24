import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Searchbar } from "react-native-paper";
import { ThemeText } from "../../components/ThemeText";
import { colors } from "../../utils/colors";
import { localization } from "../../utils/localization";

type Props = {
  navigation: any;
  storedSettings: any;
  isDarkMode: boolean;
  settingsIcon: any;
  settingsIconDark: any;
  handleOpenDrawer: () => void;
  setOpenColorFilter: (v: boolean) => void;
  setIsSearchVisible: (v: boolean) => void;
  isSearchVisible: boolean;
  searchFocus: any;
  setSearch: (v: string) => void;
  search: string;
};

const HomeHeader = ({
  navigation,
  storedSettings,
  isDarkMode,
  settingsIcon,
  settingsIconDark,
  handleOpenDrawer,
  setOpenColorFilter,
  setIsSearchVisible,
  isSearchVisible,
  searchFocus,
  setSearch,
  search,
}: Props) => {
  if (!storedSettings) return null;
  const language = storedSettings.language ?? 0;

  return (
    <>
      <View
        style={[
          styles.topHeaderRow,
          language === 1 ? styles.rowReverse : styles.row,
        ]}
      >
        <View style={styles.welcomeSection}>
          <ThemeText customStyle={styles.welcomeText}>
            {localization.Welcome[language] + storedSettings.name}
          </ThemeText>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={styles.settingsBtn}
          >
            <Image
              style={styles.settingsIcon}
              source={isDarkMode ? settingsIcon : settingsIconDark}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.collectionBtnContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CollectionForm")}
            style={styles.addCollectionBtn}
          >
            <Icon name="plus-square" size={20} color={colors.white} />
            <Text style={styles.collectionBtnText}>
              {localization.Collection[language]}
            </Text>
          </TouchableOpacity>
          <View style={[styles.decorationBase, styles.decorationCyan]} />
          <View style={[styles.decorationBase, styles.decorationPink]} />
        </View>
      </View>

      <View style={styles.actionButtonsWrapper}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ClosetInfo")}
            style={[
              styles.actionBtnBase,
              styles.closetInfoBtn,
              language === 1 && styles.rowReverse,
            ]}
          >
            <View style={styles.closetInfoContent}>
              <FontAwesome5
                name="question-circle"
                size={30}
                color={colors.white}
              />
              <Text style={styles.closetInfoText}>
                {localization.ClosetInfo[language]}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleOpenDrawer();
              setOpenColorFilter(true);
            }}
            style={[styles.actionBtnBase, styles.paletteBtn]}
          >
            <Ionicons
              name="color-palette-outline"
              size={28}
              color={colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleOpenDrawer();
              setOpenColorFilter(false);
            }}
            style={[styles.actionBtnBase, styles.filterBtn]}
          >
            <Icon name="filter" size={26} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const willShow = !isSearchVisible;
              setIsSearchVisible(willShow);
              setSearch("");
              if (willShow) {
                setTimeout(() => {
                  try {
                    searchFocus.current?.focus?.();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (_) {}
                }, 100);
              }
            }}
            style={[styles.actionBtnBase, styles.searchBtn]}
          >
            <Icon name="search" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <Searchbar
          theme={{
            roundness: 0,
            colors: {
              onSurfaceVariant: isDarkMode ? colors.white : colors.black,
              elevation: { level3: "#aebb77b0" },
            },
          }}
          placeholder={
            localization.SearchPlaceholder
              ? localization.SearchPlaceholder[language]
              : "Search"
          }
          value={search}
          ref={r => {
            searchFocus.current = r;
          }}
          onChangeText={v => setSearch(v)}
          style={styles.searchBar}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Layout Helpers
  topHeaderRow: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },
  row: { flexDirection: "row" },
  rowReverse: { flexDirection: "row-reverse" },

  // Welcome Section
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontWeight: "300",
    fontSize: 18,
    fontStyle: "italic",
  },
  settingsBtn: {
    marginLeft: 8,
  },
  settingsIcon: {
    width: 35,
    height: 35,
  },

  // Collection Button & Stacked Decorations
  collectionBtnContainer: {
    width: "20%",
    height: 48,
  },
  addCollectionBtn: {
    flex: 1,
    backgroundColor: colors.mainGreen,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  collectionBtnText: {
    fontSize: 12,
    color: colors.white,
  },
  decorationBase: {
    width: "100%",
    height: 48,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
  },
  decorationCyan: {
    backgroundColor: colors.mainCyan,
    zIndex: -10,
    right: 4,
    bottom: 4,
  },
  decorationPink: {
    backgroundColor: colors.mainPink,
    zIndex: -20,
    right: 8,
    bottom: 8,
  },

  // Action Buttons Row
  actionButtonsWrapper: {
    width: "100%",
    marginTop: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtnBase: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closetInfoBtn: {
    width: "37%",
    backgroundColor: colors.goldenrod,
    borderTopLeftRadius: 20,
    elevation: 5,
  },
  closetInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  closetInfoText: {
    color: colors.white,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginLeft: 4,
  },
  paletteBtn: {
    width: "20%",
    backgroundColor: colors.mainPink,
  },
  filterBtn: {
    width: "20%",
    backgroundColor: colors.mainGreen,
  },
  searchBtn: {
    width: "20%",
    backgroundColor: colors.mainCyan,
    borderTopRightRadius: 20,
  },
  searchBar: {
    marginTop: "1%",
  },
});

export default HomeHeader;
