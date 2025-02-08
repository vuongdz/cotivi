import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";

import * as Progress from "react-native-progress";

const App = () => {
  return (
    <View style={styles.container}>
      <Image
        style={{ width: 250, height: 250 }}
        source={require("./assets/cotivi.png")}
      />
      <Progress.Bar width={200} indeterminate={true} color={"red"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff2f5",
  },
});

export default App;
