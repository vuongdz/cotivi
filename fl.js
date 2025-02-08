import React, { useRef } from "react";
import {
  Platform,
  ScrollView,
  View,
  Text,
  StyleSheet,
  findNodeHandle,
  Alert,
  Image,
} from "react-native";
import Style from "./st";
import FocusableHighlight from "./fb";

const ROWS = 10;
const ITEMS = 15;

const ScrollViewDemo = () => {
  const rowsRef = useRef(null);
  const rowRefs = useRef([]);
  const cac = () => {
    Alert.alert("press", "press nef!", [{ text: "OK" }]);
  };
  console.log(rowRefs);
  function onItemFocus(e, row, item) {
    if (!rowRefs.current) {
      return;
    }
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
    return row.list.map((item) => {
      const key = "scrollview_item_" + row.kenh + "." + item.id;
      return (
        <FocusableHighlight
          onPress={cac}
          onFocus={(e) => {
            onItemFocus(e, row.kenh, item.id);
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
              style={{ width: 100, height: 50 }}
              source={{
                uri: "https://assets.vtvdigital.vn/assets/images/v2/logo/VTV1_150x902_1675159127.webp",
              }}
            />
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </FocusableHighlight>
      );
    });
  }
  function showRow(row) {
    return (
      <View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", color: "black" }}>{row.kenh}</Text>
        </View>
        <ScrollView
          ref={(ref) => {
            rowRefs.current[row.kenh] = ref;
          }}
          style={styles.row}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          nativeID={"scrollview_row_" + row.kenh}
          key={"scrollview_row_" + row.kenh}
        >
          {showItems(row)}
        </ScrollView>
      </View>
    );
  }

  function showRows() {
    return dt.map((dts) => {
      return showRow(dts);
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
        {showRows()}
      </ScrollView>
    </View>
  );
};

export default ScrollViewDemo;

const styles = StyleSheet.create({
  rows: {
    width: "100%",
    height: Style.px(780),
  },
  row: {
    width: "100%",
    height: Style.px(260),
  },
  rowItem: {
    width: Style.px(284),
    height: Style.px(240),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: Style.px(40),
  },
});
