import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connexion établie.');
      socket.send(JSON.stringify({ type: 'getUsers' }));
      socket.send(JSON.stringify({ type: 'connect', data: 'user' }));
    };

    socket.onclose = () => {
      console.log('WebSocket connexion fermée.');
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && input) {
      ws.send(JSON.stringify({ type: 'message', message: input }));
      ws.onmessage = (event) => {
        try {
          const newMessage = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
          console.error("Non-JSON message reçu:", event.data);
        }
      };
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebSocket Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item.message}</Text>}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default Message;