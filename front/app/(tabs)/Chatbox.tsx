import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const socket = io("http://localhost:4000");

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);

  const auth = useSelector((state) => state.auth);
  const userId = auth?.user?._id;
  const email = auth?.user?.email;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && receiverId && userId) {
      const message = { sender: userId, receiver: receiverId, text: input };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  useEffect(() => {
    if (!userId || !email) return;

    socket.emit("registerUser", email);

    socket.on("userRegistered", ({ userId }) => {
      console.log("User re-registered with Socket ID, userId:", userId);
    });

    socket.on("usersList", (usersList) => {
      setUsers(usersList);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userRegistered");
      socket.off("usersList");
    };
  }, [userId, email]);

  const selectReceiver = (id) => {
    setReceiverId(id);
    fetch(`http://localhost:4000/messages/${userId}/${id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Erreur chargement des messages:", err));
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.boldText}>{email}</Text>
        </View>
        <FlatList
          data={users.filter((user) => user._id !== userId)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectReceiver(item._id)}
              style={[
                styles.sidebarUser,
                receiverId === item._id && styles.activeUser,
              ]}
            >
              <Text>{item.email}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Main chat */}
      <View style={styles.mainChat}>
        {receiverId ? (
          <>
            <View style={styles.chatHeader}>
              <Text style={styles.headerText}>
                {users.find((u) => u._id === receiverId)?.email}
              </Text>
            </View>

            <FlatList
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageRow,
                    item.sender?._id === userId
                      ? styles.messageSent
                      : styles.messageReceived,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      item.sender?._id === userId
                        ? styles.bubbleSent
                        : styles.bubbleReceived,
                    ]}
                  >
                    <Text style={styles.boldText}>{item.sender?.email}</Text>
                    <Text>{item.text}</Text>
                  </View>
                </View>
              )}
              ref={messagesEndRef}
              onContentSizeChange={scrollToBottom}
            />

            <View style={styles.chatFooter}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Send a message..."
                style={styles.input}
              />
              <Button title="Send" onPress={sendMessage} />
            </View>
          </>
        ) : (
          <View style={styles.selectUser}>
            <Text style={styles.mutedText}>Select a user to start chatting</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  boldText: {
    fontWeight: "bold",
  },
  sidebarUser: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  activeUser: {
    backgroundColor: "#e0e0e0",
  },
  mainChat: {
    flex: 1,
    flexDirection: "column",
  },
  chatHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageRow: {
    padding: 8,
  },
  messageSent: {
    alignItems: "flex-end",
  },
  messageReceived: {
    alignItems: "flex-start",
  },
  bubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  bubbleSent: {
    backgroundColor: "#dcf8c6",
  },
  bubbleReceived: {
    backgroundColor: "#fff",
  },
  chatFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  selectUser: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mutedText: {
    color: "#888",
  },
});

export default ChatBox;