import { Dispatch, SetStateAction } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker'
const ColorModal = ({ setVisible, visible, colors, setColors, colorSelection }: { colors: string[], colorSelection: number, setColors: Dispatch<SetStateAction<string[]>>, setVisible: Dispatch<SetStateAction<boolean>>, visible: boolean }) => {
    let newColors = colors;
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                setVisible(!visible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ColorPicker
                        color={colors[colorSelection]}
                        onColorChange={(color) => { newColors[colorSelection] = color; setColors(newColors) }}
                        thumbSize={40}
                        sliderSize={40}
                        noSnap={true}
                        row={false}
                        swatches={false}
                        sliderHidden={true}
                    />

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#49494968"
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: "80%",
        height: "80%",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
export default ColorModal;