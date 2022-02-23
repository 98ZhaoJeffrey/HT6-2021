import React from "react";
import Features from "../components/Features";
import Hero from "../components/Hero";
import { Box } from "@chakra-ui/react";

const Home = () =>{
    return(
        <Box>
            <Hero/>
            <Features/>
        </Box>
    )
}

export default Home