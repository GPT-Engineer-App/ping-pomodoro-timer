import React, { useState, useEffect, useRef } from "react";
import { VStack, Button, Text, useToast, Box, Container, Heading } from "@chakra-ui/react";
import { FaPlay, FaPause, FaSyncAlt, FaCoffee, FaBusinessTime } from "react-icons/fa";

const Index = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPomodoro, setIsPomodoro] = useState(true);
  const toast = useToast();
  const audioRef = useRef(new Audio('GPTENG:get_audio("ping sound")'));

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(isPomodoro ? 25 * 60 : 5 * 60);
    setIsActive(false);
  };

  const startPomodoro = () => {
    setSeconds(25 * 60);
    setIsActive(true);
    setIsPomodoro(true);
  };

  const startBreak = () => {
    setSeconds(5 * 60);
    setIsActive(true);
    setIsPomodoro(false);
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  useEffect(() => {
    if (seconds === 0 && isActive) {
      setIsActive(false);
      audioRef.current.play();
      toast({
        title: isPomodoro ? "Pomodoro Finished" : "Break Finished",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [seconds, isActive, isPomodoro, toast]);

  const displayTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Container centerContent p={8}>
      <VStack spacing={4} align="center">
        <Heading>Pomodoro Timer</Heading>
        <Box p={4} borderRadius="md" borderWidth="1px">
          <Text fontSize="4xl" fontFamily="monospace">
            {displayTime()}
          </Text>
        </Box>
        <VStack spacing={2}>
          <Button leftIcon={<FaPlay />} colorScheme="green" onClick={startPomodoro}>
            Start Pomodoro
          </Button>
          <Button leftIcon={<FaCoffee />} colorScheme="orange" onClick={startBreak}>
            Start Break
          </Button>
          <Button leftIcon={isActive ? <FaPause /> : <FaPlay />} onClick={toggle}>
            {isActive ? "Pause" : "Resume"}
          </Button>
          <Button leftIcon={<FaSyncAlt />} colorScheme="red" onClick={reset}>
            Reset
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;
