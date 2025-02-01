import React from "react";
import { View, StyleSheet } from "react-native";

function CenteredLayout({ children }) {
  return <View style={styles.layout}>{children}</View>;
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center", // si vous voulez aligner le texte au centre
  },
});

export default CenteredLayout;