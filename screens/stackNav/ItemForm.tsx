// import { useNavigation } from "@react-navigation/native";
import {
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import addImage from "../../assets/images/addImage.png";
import { BackButton } from "../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { addItem, item } from "../../redux/itemsSlice";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import ColorModal from "../../components/ColorModal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { CustomInput } from "../../components/CustomInput";
import { MultipleSelectList } from 'react-native-dropdown-select-list'
// import { RootState } from "../../redux/store";
function get_random(list: string[]) {
    return list[Math.floor(Math.random() * list.length)];
}
export const ItemForm = () => {
    // const navigation = useNavigation<any>();
    const [name, setName] = useState("");
    const [collection, setCollection] = useState([]);
    const [size, setSize] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [automaticColor, setAutomaticColor] = useState("");
    const [errorsList, setErrorsList] = useState<string[]>([]);
    const [colors, setColors] = useState(["", "", ""]);
    const [colorSelection, setColorSelection] = useState(0);
    const RandomNamesP1 = [
        "Wildfire",
        "Sunshine Spirit",
        "Retro Rebel",
        "Neon Nights",
        "Midnight Mirage",
        "Enigma",
        "Stardust Surfer",
        "Classic Comfort",
        "Essential Basics",
        "Everyday Style",
        "Timeless Appeal",
        "Urban Chic",
        "Casual Cool",
        "Easy Breezy",
        "Effortless Elegance",
        "Simple Sophistication",
        "Modern Minimalism",
        "Relaxed Vibes",
        "Versatile Essentials",
        "Contemporary Classic",
        "Effortless Style",
        "Trendy Basics",
        "Casual Chic",
        "Modern Edge",
        "Urban Essentials",
        "Easygoing Fashion",
        "Contemporary Comfort",
    ];

    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);

    function addItemHandler() {
        const errors = [];

        if (name.length <= 0) {
            errors.push("Please enter item name");
        }
        if (name.length > 20) {
            errors.push("Please enter a name within 20 characters");
        }
        if (parseInt(size) < 0) {
            errors.push("Please enter the size in a positive value");
        }

        if (errors.length > 0) {
            setErrorsList(errors);
            return;
        }
        setErrorsList([]);
        dispatch(
            addItem({
                name: name,
                collection: collection,
                size: size,
                purchaseDate: purchaseDate,
                image: imageUrl,
                automaticColorPicking: automaticColor,
                primaryColor: colors[0],
                secondaryColor: colors[1],
                tertiaryColor: colors[2],
            }),
        );
    }
    const handleImagePicker = () => {
        launchImageLibrary(
            { mediaType: "photo", selectionLimit: 1 },
            (response) => {
                if (response.didCancel) {
                    console.log("Image picker cancelled");
                } else if (response.errorCode) {
                    console.log("Image picker error: ", response.errorMessage);
                } else {
                    setImageUrl(response.assets[0].uri || "");
                }
            },
        );
    };
    //   await launchCamera({mediaType:"photo",}) //here
    // const itemsState = useSelector((state: RootState) => state.itemsList)
    // console.log(itemsState.items)
    return (
        <>
            <ColorModal
                colors={colors}
                setColors={setColors}
                visible={visible}
                setVisible={setVisible}
                colorSelection={colorSelection}
            />
            <View className="flex-1 bg-white">
                <BackButton />
                <View className="flex items-center space-y-3">
                    <TouchableOpacity onPress={handleImagePicker}>
                        <Image
                            style={{ resizeMode: "contain" }}
                            source={imageUrl == "" ? addImage : { uri: imageUrl }}
                            className="w-20 h-20 rounded-md object-contain"
                        />
                    </TouchableOpacity>
                    <CustomInput
                        mode="outlined"
                        outlineColor="#AEBB77"
                        selectionColor="#C0C0C0"
                        activeOutlineColor="#AEBB77"
                        textContentType="name"
                        style={styles.customWidth}
                        theme={{ roundness: 10, colors: { background: "white" } }}
                        label="Name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        right={
                            <Pressable onPress={() => setName(get_random(RandomNamesP1))}>
                                <Icon name="dice" size={15} color="#77AEBB" />
                            </Pressable>
                        } />
                    <TextInput
                        mode="outlined"
                        outlineColor="#AEBB77"
                        // textColor="#BB77AE"
                        selectionColor="#C0C0C0"
                        activeOutlineColor="#AEBB77"
                        textContentType="name"
                        style={styles.customWidth}
                        theme={{ roundness: 10, colors: { background: "white" } }}
                        keyboardType="numeric"
                        label="Size"
                        value={size}
                        onChangeText={(text) => setSize(text?.replace(/[^0-9]/g, ""))}
                    />

                    <View className="flex flex-row justify-between items-center border-[1px] border-mainGreen rounded-lg w-4/5 h-8 px-5">
                        <Text>Primary color</Text>
                        <Pressable
                            onPress={() => {
                                setVisible(true);
                                setColorSelection(0);
                            }}
                        >
                            <View
                                className="h-5 w-5"
                                style={{ backgroundColor: colors[0] || "gray" }}
                            />
                        </Pressable>
                    </View>
                    <View className="flex flex-row justify-between items-center border-[1px] border-mainGreen rounded-lg w-4/5 h-8 px-5">
                        <Text>Secondary</Text>
                        <Pressable
                            onPress={() => {
                                setVisible(true);
                                setColorSelection(1);
                            }}
                        >
                            <View
                                className="h-5 w-5"
                                style={{ backgroundColor: colors[1] || "gray" }}
                            />
                        </Pressable>
                    </View>
                    <View className="flex flex-row justify-between items-center border-[1px] border-mainGreen rounded-lg w-4/5 h-8 px-5">
                        <Text>Tertiary color</Text>
                        <Pressable
                            onPress={() => {
                                setVisible(true);
                                setColorSelection(2);
                            }}
                        >
                            <View
                                className="h-5 w-5"
                                style={{ backgroundColor: colors[2] || "gray" }}
                            />
                        </Pressable>
                    </View>

                    <View>
                        {errorsList.map((error, index) => {
                            return (
                                <Text key={index} className="text-[#C70039]">
                                    {error}
                                </Text>
                            );
                        })}
                    </View>
                    <Button
                        mode="contained"
                        buttonColor="#77AEBB"
                        onPress={addItemHandler}
                    >
                        Save
                    </Button>
                </View>
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    customWidth: { width: "80%" },
});
