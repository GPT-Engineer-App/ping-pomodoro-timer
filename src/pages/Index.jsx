import React, { useState, useEffect, useRef } from "react";
import { VStack, Button, Text, useToast, Box, Container, Heading, IconButton, useColorMode, useBreakpointValue, HStack } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { FaPlay, FaPause, FaSyncAlt, FaCoffee, FaBusinessTime } from "react-icons/fa";

const Index = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPomodoro, setIsPomodoro] = useState(true);
  const toast = useToast();
  const audioRef = useRef(new Audio("https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"));

  const [pauseTime, setPauseTime] = useState(0);

  const toggle = () => {
    if (isActive) {
      setPauseTime(seconds);
    } else {
      // Set the startTime to the current time minus the elapsed time when paused
      audioRef.current.startTime = Date.now() - ((isPomodoro ? 25 * 60 : 5 * 60) - pauseTime) * 1000;
      setPauseTime(0); // Reset pauseTime after resuming
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(isPomodoro ? 25 * 60 : 5 * 60);
    setIsActive(false);
  };

  const startPomodoro = () => {
    const startTime = Date.now();
    setSeconds(25 * 60);
    setIsActive(true);
    setIsPomodoro(true);
    audioRef.current.startTime = startTime;
  };

  const startBreak = () => {
    const startTime = Date.now();
    setSeconds(5 * 60);
    setIsActive(true);
    setIsPomodoro(false);
    audioRef.current.startTime = startTime;
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      if (pauseTime > 0) {
        setSeconds(pauseTime);
        setPauseTime(0);
      } else {
        interval = setInterval(() => {
          const currentTime = Date.now();
          const elapsedTime = Math.floor((currentTime - audioRef.current.startTime) / 1000);
          const remainingTime = isPomodoro ? 25 * 60 - elapsedTime : 5 * 60 - elapsedTime;
          if (remainingTime >= 0) {
            setSeconds(remainingTime);
          } else {
            clearInterval(interval);
            setIsActive(false);
            audioRef.current.play();
            toast({
              title: isPomodoro ? "Pomodoro Finished" : "Break Finished",
              status: "info",
              duration: 5000,
              isClosable: true,
            });
          }
        }, 1000);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPomodoro, toast]);

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
    <Container centerContent p={8} position="relative">
      <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} isRound={true} size="md" alignSelf="flex-end" position="absolute" top={4} right={4} onClick={toggleColorMode} aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`} />
      <VStack spacing={4} align="center">
        <Heading>Pomodoro Timer</Heading>
        <Box p={4} borderRadius="md" borderWidth="1px">
          <Text fontSize="4xl" fontFamily="monospace">
            {displayTime()}
          </Text>
        </Box>
        {useBreakpointValue({
          base: (
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
            </VStack>
          ),
          sm: (
            <HStack spacing={2}>
              <Button leftIcon={<FaPlay />} colorScheme="green" onClick={startPomodoro}>
                Start Pomodoro
              </Button>
              <Button leftIcon={<FaCoffee />} colorScheme="orange" onClick={startBreak}>
                Start Break
              </Button>
              <Button leftIcon={isActive ? <FaPause /> : <FaPlay />} onClick={toggle}>
                {isActive ? "Pause" : "Resume"}
              </Button>
            </HStack>
          ),
        })}

        <Button leftIcon={<FaSyncAlt />} colorScheme="red" onClick={reset}>
          Reset
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
