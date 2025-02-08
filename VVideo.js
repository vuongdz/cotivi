import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import { Video, ResizeMode } from "expo-av";

const tivi = ({ navigation, route }) => {
  const data = route.params;
  const { focusedItem } = route.params;
  const datahead = data.head;
  // console.log(data.head);
  const video = useRef(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [status, setStatus] = useState({});
  const itemRefs = useRef({});
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      // Alert.alert("Hold on!", "Are you sure you want to go back?", [
      //   {
      //     text: "Cancel",
      //     onPress: () => null,
      //     style: "cancel",
      //   },
      //   { text: "YES", onPress: () => navigation.goBack() },
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (focusedItem) {
      // console.log(focusedItem);
      setTimeout(() => {
        const key = `scrollview_item_${focusedItem.row}.${focusedItem.item}`;
        if (itemRefs.current[key]) {
          itemRefs.current[key].focus();
        }
      }, 0);
    }
    return () => {
      // setFocusedItem(null); // Optional: clear focusedItem on unmount
    };
  }, [focusedItem]);
  return (
    <View style={styles.container}>
      {isPreloading && (
        <ActivityIndicator
          animating
          color={"gray"}
          size="large"
          style={{
            flex: 1,
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        />
      )}
      <Video
        ref={video}
        onLoadStart={() => setIsPreloading(true)}
        onReadyForDisplay={() => setIsPreloading(false)}
        onError={() => {
          Alert.alert("Thông báo", "Đã xảy ra lỗi, vui lòng chọn kênh khác!", [
            { text: "OK" },
          ]);
          navigation.goBack();
        }}
        style={styles.video}
        source={{
          uri: data.dvv,
          headers: data.head,
        }}
        useNativeControls
        resizeMode={ResizeMode.STRETCH}
        isLooping
        PLAYER_DID_PRESENT={0}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        shouldPlay={true}
      />
    </View>
  );
};
export default tivi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  video: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
