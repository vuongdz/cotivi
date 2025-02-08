// import * as React from "react";
import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  Text,
  View,
  // Pressable,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import { createStackNavigator } from "@react-navigation/stack";
import Tivi from "./VVideo";
import Tivi2 from "./SportsVideo";
import Style from "./styles";
import FocusableHighlight from "./fb";
import LoaderScreen from "./Loader";

import { expo } from "./app.json";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="XemTiVi"
        component={Tivi}
        options={{
          title: "VTV2",
          headerStyle: {
            backgroundColor: "red",
          },
          headerBackVisible: true,
          headerTintColor: "#fff",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="XemTiVi2"
        component={Tivi2}
        options={{
          title: "VTV3",
          headerStyle: {
            backgroundColor: "red",
          },
          headerBackVisible: true,
          headerTintColor: "#fff",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const [isActive, setActive] = React.useState(false);
  const [dulieu, setdulieu] = React.useState(null);
  const [Author, setAuthor] = React.useState(null);
  const [pressedButton, setPressedButton] = React.useState(null);
  const rowsRef = useRef(null);
  const rowRefs = useRef([]);
  const [focusedItem, setFocusedItem] = useState({});
  useEffect(() => {
    getlist();
    const backAction = () => {
      // navigation.goBack();
      Alert.alert("Thông báo", "Bạn có chắc chắn muốn thoát ứng dụng?", [
        {
          text: "HỦY",
          onPress: () => null,
          style: "cancel",
        },
        { text: "THOÁT", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
  const getlist = async () => {
    // console.log(isActive);
    if (isActive == true) return;
    setActive(true);
    try {
      const cc = await axios.get(
        "https://api.cotivi.online/api/getList?version=1.0.3"
      );
      const Tach1 = cc.data;
      console.log(Tach1);
      if (Tach1.status == false) {
        Alert.alert(Tach1.title, Tach1.textBody, [{ text: Tach1.button }]);
        return;
      }
      const result = Tach1.Data;
      setdulieu(result);
      setAuthor(Tach1);
      console.log(result);
      setActive(false);
    } catch (err) {
      console.log(err);

      setActive(false);
      if (err == "AxiosError: Network Error") {
        Alert.alert(
          "Mất kết nối",
          "Bạn cần kết nối mạng để sử dụng ứng dụng này!",
          [{ text: "OK" }]
        );
      } else {
        console.log(err);
        Alert.alert(
          "Mất kết nối",
          "Không thể kết nối đến máy chủ Cò Tivi, vui lòng thử lại sau!",
          [{ text: "OK" }]
        );
      }
    }
  };
  let timerRef = React.useRef(null);

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => clearTimeout(timerRef.current);
  }, []);

  if (timerRef.current != null) {
    clearTimeout(timerRef.current);
  }

  // now we set a new timer for 1 second
  timerRef.current = setTimeout(() => {
    getlist();
  }, 180000);
  if (dulieu == null) {
    return <LoaderScreen />;
  }

  function onItemFocus(e, row, item) {
    if (!rowRefs.current) {
      return;
    }
    // console.log(rowRefs.current);
    if (row >= 0 && row < rowRefs.current.length) {
      // Check refs
      const rowRef = rowRefs.current[row];
      if (!rowRef || !rowsRef) {
        return;
      }
      // Get styles
      const rowsStyle = StyleSheet.flatten(styles.rows);
      const rowItemStyle = StyleSheet.flatten(styles.rowItem);
      // Get rows width / height
      const rowsWidth = rowsStyle.width;
      const rowsHeight = rowsStyle.height;
      // Get item width / height
      const itemWidth = rowItemStyle.width + rowItemStyle.margin * 2;
      const itemHeight = rowItemStyle.height + rowItemStyle.margin * 2;
      // Get horizontal offset for current item in current row
      const itemLeftOffset = itemWidth * item;
      // Get vertical offset for current row in rows
      const itemTopOffset = itemHeight * row;
      // Center item horizontally in row
      const rowsWidthHalf = rowsWidth / 2;
      if (itemLeftOffset >= rowsWidthHalf) {
        const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
        rowRef.scrollTo({ x: x, animated: true });
      } else {
        rowRef.scrollTo({ x: 0, animated: true });
      }
      // Scroll vertically to current row
      const rowsHeightHalf = rowsHeight / 2;
      if (itemTopOffset >= rowsHeightHalf - itemHeight) {
        const y = itemTopOffset;
        rowsRef.current.scrollTo({ y: y, animated: true });
      } else {
        rowsRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  }

  function showItems(row) {
    if (row.Sports == true) {
      return row.List.map((item, index) => {
        const key = "scrollview_item_" + row.Kenh + "." + item.id;
        return (
          <FocusableHighlight
            // key={index}
            onPress={() => {
              navigation.navigate("XemTiVi2", {
                source: item.src,
                dvv: item.keys,
                head: item.header,
              });
            }}
            onFocus={(e) => {
              onItemFocus(e, row.Kenh, item.id);
            }}
            underlayColor={Style.buttonFocusedColor}
            style={styles.rowItem2}
            nativeID={key}
            key={key}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={Author.SportsLogoStyle}
                    source={{
                      uri: item.homeLogo,
                    }}
                  />
                  <Text style={{ color: "white" }}>{item.home}</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <Image
                    style={Author.SportsLogoStyle}
                    source={{
                      uri: item.wayLogo,
                    }}
                  />
                  <Text style={{ color: "white" }}>{item.way}</Text>
                </View>
              </View>
              <View style={{ marginTop: 5 }}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </View>
          </FocusableHighlight>
        );
      });
    } else {
      return row.List.map((item, index) => {
        const key = "scrollview_item_" + row.Kenh + "." + item.id;
        return (
          <FocusableHighlight
            onPress={() => {
              navigation.navigate("XemTiVi", {
                dvv: item.link,
                head: item.header,
              });
            }}
            onFocus={(e) => {
              onItemFocus(e, row.Kenh, item.id);
            }}
            underlayColor={Style.buttonFocusedColor}
            style={styles.rowItem}
            nativeID={key}
            key={key}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={Author.ChannelLogoStyle}
                source={{
                  uri: item.icon,
                }}
              />
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </FocusableHighlight>
        );
      });
    }
  }
  function showRow(row, index) {
    return (
      <View key={index}>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", color: "black" }}>{row.Kenh}</Text>
        </View>
        <ScrollView
          ref={(ref) => {
            rowRefs.current[row.Kenh] = ref;
          }}
          style={styles.row}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          nativeID={"scrollview_row_" + row.Kenh}
          key={"scrollview_row_" + row.Kenh}
        >
          {showItems(row)}
        </ScrollView>
      </View>
    );
  }

  function showRows(dulieu) {
    // console.log(dulieu);
    return dulieu.map((dts, index) => {
      return showRow(dts, index);
    });
  }

  return (
    <View style={Style.styles.content}>
      <ScrollView
        ref={rowsRef}
        style={styles.rows}
        nativeID={"rows"}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Image
            style={Author.BannerStyle}
            source={{
              uri: Author.BannerURL,
            }}
          />
          <Text style={Author.descStyle}>{Author.desc}</Text>
          <Text style={Author.DevelopedStyle}>{Author.Developed}</Text>
        </View>
        {showRows(dulieu)}
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            © Cò TiVi
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  rows: {
    width: "100%",
    height: Style.px(780),
  },
  row: {
    width: "100%",
    height: "auto",
  },
  rowItem: {
    width: "auto",
    padding: 10,
    height: "auto",
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowItem2: {
    width: "auto",
    padding: 10,
    height: "auto",
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: Style.px(40),
  },
});
