import React from "react";
import MyTabs from "../../routers/BottomTabNav";
import { ThemeView } from "../../components/ThemeView";
export function Home() {
  //title == "Add"?'#77AEBB'
  return (
    <ThemeView>
      <MyTabs />
    </ThemeView>
  );
}
