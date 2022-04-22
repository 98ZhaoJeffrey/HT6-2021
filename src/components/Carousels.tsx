import React, { useState } from "react";
import { Text, Box, Flex, Image, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

type Props = {
  images: string[],
  height: string,
  width: string
}


const Carousels = (prop: Props) => {


  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesCount = prop.images.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  const carouselStyle = {
    transition: "all .5s",
    ml: `-${currentSlide * 100}%`,
  };

  return (
    <Flex w="full" overflow="hidden" pos="relative">
      <Flex h={prop.height} w={prop.width} {...carouselStyle}>
        {prop.images.map((slide, sid) => (
          <Box key={`slide-${sid}`} boxSize="full" shadow="md" flex="none">
            <Text
              color="white"
              fontSize="xs"
              p="8px 12px"
              pos="absolute"
              top="0"
            >
              {sid + 1} / {slidesCount}
            </Text>
            <Image
              src={slide}
              alt="carousel image"
              boxSize="full"
              backgroundSize="cover"
            />
          </Box>
        ))}
      </Flex>
      <IconButton 
        variant="ghost" 
        onClick={prevSlide} 
        aria-label={"prevslide"} 
        icon={<ChevronLeftIcon/>} 
        cursor="pointer" 
        pos="absolute" 
        top="50%"
        left="0"
        fontWeight="bold"
        fontSize="2rem" 
        color="white"
      />
      <IconButton         
        variant="ghost" 
        onClick={nextSlide} 
        aria-label={"nextslide"} 
        icon={<ChevronRightIcon/>} 
        cursor="pointer" 
        pos="absolute" 
        top="50%"
        right="0"
        fontWeight="bold"
        fontSize="2rem" 
        color="white"
      />
    </Flex>
  );
};

export default Carousels;
