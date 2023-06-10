import { styled } from "nativewind";
import { Text, View } from "react-native"

export const Settings = () => {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    return (
        <StyledView className="">
            <Text className="text-4xl">Settings</Text>
        </StyledView>
    )
}