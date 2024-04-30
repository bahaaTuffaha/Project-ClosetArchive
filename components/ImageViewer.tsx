import { Dispatch, SetStateAction, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import addImage from "../assets/images/addImage.png";
import { Image } from "react-native";
import CustomModal from "./CustomModal";
import useWidthScreen from "../hooks/useWidthScreen";

export const ImageViewer = ({
  imageUrl,
  setImageModalVisible,
}: {
  imageUrl: string;
  setImageModalVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showImageFull, setShowImageFull] = useState(false);
  const screenWidth = useWidthScreen();
  return (
    <>
      <CustomModal
        setVisible={setShowImageFull}
        visible={showImageFull}
        maxHeight={screenWidth}
        showClose={false}
      >
        <Image
          source={
            imageUrl == ""
              ? addImage
              : { uri: `data:image/*;base64,${imageUrl}` }
          }
          className="w-full h-full rounded-md"
        />
      </CustomModal>
      <TouchableOpacity
        onLongPress={() => imageUrl != "" && setShowImageFull(true)}
        onPress={() => {
          setImageModalVisible(true);
        }}
      >
        <Image
          source={
            imageUrl == ""
              ? addImage
              : { uri: `data:image/*;base64,${imageUrl}` }
          }
          className="w-20 h-20 rounded-md object-contain"
        />
      </TouchableOpacity>
    </>
  );
};
