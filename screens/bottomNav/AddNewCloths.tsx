import { styled } from "nativewind";
import { Text, View } from "react-native"

export const AddNewCloths = () => {
    const StyledView = styled(View);
    const StyledText = styled(Text);
    return (
        <StyledView className="flex-1">
            <StyledText>test</StyledText>
        </StyledView>
    )
}