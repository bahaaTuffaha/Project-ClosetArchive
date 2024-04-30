import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import addImage from "../assets/images/addImage.png";
import { Image } from "react-native";

export const ImageViewer = ({
  imageUrl,
  setImageModalVisible,
}: {
  imageUrl: string;
  setImageModalVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setImageModalVisible(true);
      }}
    >
      <Image
        source={
          imageUrl == "" ? addImage : { uri: `data:image/*;base64,${imageUrl}` }
        }
        className="w-20 h-20 rounded-md object-contain"
      />
    </TouchableOpacity>
  );
};
