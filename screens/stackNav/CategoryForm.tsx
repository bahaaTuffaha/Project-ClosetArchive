// import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";
import { BackButton } from "../../components/backButton";
import { TextInput } from "react-native-paper";
import { useState } from "react";

export const CategoryForm = () => {
    // const navigation = useNavigation<any>();
    const [name, setName] = useState("");

    return (
        <SafeAreaView className="flex-1 bg-white">
            <BackButton />
            <TextInput
                mode="outlined"
                outlineColor="#BB77AE"
                textColor="#BB77AE"
                activeOutlineColor="#BB77AE"
                textContentType="name"
                label="Name"
                value={name}
                onChangeText={text => setName(text)} />
        </SafeAreaView>
    );
};
