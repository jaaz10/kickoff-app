import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ChatTab: React.FC = () => {
  return (
    <View style={styles.chatTab}>
      <View style={styles.chatHeader}>
        <Text style={styles.headerText}>Chat</Text>
      </View>
      <View style={styles.chatMessages}>
        <View style={styles.messageReceived}>
          <Text style={styles.messageText}>
            Hello! How can I assist you today?
          </Text>
        </View>
        <View style={styles.messageSent}>
          <Text style={styles.messageText}>
            Hi there! I have a question about my order.
          </Text>
        </View>
        {/* More message bubbles can be added here */}
      </View>
      <View style={styles.chatInput}>
        <TextInput
          style={styles.inputText}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatTab: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "column",
  },
  chatHeader: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  chatInput: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputText: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChatTab;
