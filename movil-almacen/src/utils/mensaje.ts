import Toast from "react-native-toast-message";

export const mensaje = async (type: string, text1: string, text2: string) => {
  Toast.show({
    type,
    text1,
    text2,
    position: "top",
    visibilityTime: 2000,
  });
};
