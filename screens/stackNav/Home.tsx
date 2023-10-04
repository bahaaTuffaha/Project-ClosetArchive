import React from "react";
import MyTabs from "../../routers/BottomTabNav";
import { ThemeView } from "../../components/ThemeView";
export function Home() {
  return (
    <ThemeView>
      <MyTabs />
    </ThemeView>
  );
}
