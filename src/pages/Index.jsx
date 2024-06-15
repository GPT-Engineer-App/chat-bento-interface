import React, { useState } from "react";
import { Container, VStack, HStack, Input, Button, Text, Box, Spinner } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("YOUR_BENTOML_ENDPOINT", { message: input });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response from BentoML:", error);
      const errorMessage = { sender: "bot", text: "Sorry, something went wrong. Please try again later." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Box width="100%" height="60vh" overflowY="auto" border="1px solid #e2e8f0" borderRadius="md" padding={4}>
          {messages.map((message, index) => (
            <Box key={index} alignSelf={message.sender === "user" ? "flex-end" : "flex-start"} bg={message.sender === "user" ? "blue.100" : "gray.100"} borderRadius="md" padding={2} marginY={1}>
              <Text>{message.text}</Text>
            </Box>
          ))}
          {loading && (
            <Box alignSelf="flex-start" bg="gray.100" borderRadius="md" padding={2} marginY={1}>
              <Spinner size="sm" />
            </Box>
          )}
        </Box>
        <HStack width="100%">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
          <Button onClick={handleSendMessage} colorScheme="blue" rightIcon={<FaPaperPlane />}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
