import { BackButton } from "../../components/BackButton";
import { ThemeText } from "../../components/ThemeText";
import { ThemeView } from "../../components/ThemeView";
import { View } from "react-native";
import {
  categoryInfo,
  closetInfo,
  localization,
} from "../../utils/localization";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { Children, ReactElement, useEffect, useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { defaultCategories } from "./Category";
import { ItemBox } from "../../components/ItemBox";
import { item } from "../../redux/itemsSlice";
import { Category } from "../../redux/categoriesSlice";
const InfoCardWrapper = ({
  title,
  index,
  children,
}: {
  title: string;
  index: number;
  children: ReactElement;
}) => {
  return (
    <Animated.View
      className="flex flex-col items-center bg-mainGreen border-white border-solid border-[1px]"
      entering={SlideInLeft.delay(index * 200)}
    >
      {Children.count(children) > 0 && (
        <>
          <ThemeText>{title}</ThemeText>

          <View className="flex flex-row">{children}</View>
        </>
      )}
    </Animated.View>
  );
};
const InfoCardNumber = ({
  title,
  value,
  index,
}: {
  title: string;
  value: number;
  index: number;
}) => {
  return (
    <Animated.View
      className="flex flex-col bg-mainCyan text-white items-center border-white border-solid border-[1px]"
      entering={SlideInLeft.delay(index * 200)}
    >
      <ThemeText classNameStyle="text-bold">{title}</ThemeText>
      <ThemeText classNameStyle="text-[40px]">{String(value)}</ThemeText>
    </Animated.View>
  );
};
const InfoCardCategories = ({
  items,
  Categories,
  language,
}: {
  items: item[];
  Categories: Category[];
  language: number;
}) => {
  const [value, setValue] = useState<number[]>([]);
  useEffect(() => {
    let newArray = items;
    Categories.forEach((Category) => {
      setValue((prev) => [
        ...prev,
        newArray.filter((item) => Category.index == item.category).length,
      ]);
    });
  }, [Categories.length, items.length]);

  return (
    <View>
      {Categories.map((category, index) => {
        return (
          <Animated.View
            entering={SlideInLeft.delay(index * 300)}
            key={"Card" + index}
            className="flex flex-col bg-mainCyan text-white items-center border-white border-solid border-[1px]"
          >
            <ThemeText>
              {category.name[language] + " " + categoryInfo[language]}
            </ThemeText>
            <View className="flex flex-row items-center">
              <ThemeText classNameStyle="text-[40px]">
                {String(value[index])}
              </ThemeText>
              <ThemeText classNameStyle="text-[10px]">
                {" item" + (value[index] > 1 ? "s" : "")}
              </ThemeText>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};

export const ClosetInfo = ({}) => {
  const storedSettings = useSelector((state: RootState) => state.settings);
  const storedItems = useSelector((state: RootState) => state.itemsList.items);
  const storedEvents = useSelector((state: RootState) => state.itemsList.logs);
  const storedCollections = useSelector(
    (state: RootState) => state.itemsList.collectionTags,
  );
  const storedCategories = [
    ...defaultCategories,
    ...useSelector((state: RootState) => state.CategoryList.Categories),
  ];

  const data = useMemo(() => {
    const sortedItems = [...storedItems].sort(
      (a, b) => b.logIds.length - a.logIds.length,
    );
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const filteredEventsLastMonth = storedEvents.filter((x) => {
      const eventDate = new Date(JSON.parse(x.eventDate));
      return eventDate >= oneMonthAgo && eventDate <= currentDate;
    });

    const top5LastMonth = sortedItems
      .filter((x) => {
        return x.logIds?.some((logId) =>
          filteredEventsLastMonth.some((event) => event.eventId === logId),
        );
      })
      .slice(0, 5);
    const top5 = sortedItems.filter((item, index) => index < 5);
    let info = [
      storedItems.length,
      storedEvents.length,
      storedCollections.length,
      top5LastMonth,
      top5,
    ];

    return info;
  }, [storedCategories.length, storedCollections.length, storedItems.length]);

  return (
    <ThemeView>
      <>
        <View className="w-full flex flex-row h-14 justify-center items-center">
          <BackButton />
          <ThemeText classNameStyle="text-xl italic">
            {localization.ClosetInfo[storedSettings.language]}
          </ThemeText>
        </View>
        <FlashList
          ListFooterComponent={
            <InfoCardCategories
              Categories={storedCategories}
              items={storedItems}
              language={storedSettings.language}
            />
          }
          showsVerticalScrollIndicator={false}
          data={closetInfo[storedSettings.language]}
          renderItem={({ item, index }) =>
            index > 2 ? (
              <InfoCardWrapper
                index={index}
                key={"infoCard" + index}
                title={item}
              >
                {data[index].map((item: item) => {
                  return (
                    <ItemBox
                      primary={item.primaryColor || "#fff"}
                      secondary={item.secondaryColor || "#fff"}
                      tertiary={item.tertiaryColor || "#fff"}
                      key={item.id}
                      image={item.image}
                      name={item.name}
                      type={item.type}
                      id={item.id}
                      logs={item.logIds || []}
                      addSpace={true}
                    />
                  );
                })}
              </InfoCardWrapper>
            ) : (
              <InfoCardNumber
                index={index}
                key={"infoCardNum" + index}
                title={item}
                value={data[index] as number}
              />
            )
          }
          estimatedItemSize={64}
        />
      </>
    </ThemeView>
  );
};
