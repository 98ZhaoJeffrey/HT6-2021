import React, { useContext, useEffect, useState } from "react";
import {
    chakra,
    Avatar,
    Image,
    Box,
    Flex,
    useColorModeValue,
    VisuallyHidden,
    HStack,
    Button,
    useDisclosure,
    VStack,
    IconButton,
    CloseButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logo.png";
import firebase from "../firebase";
import { AuthContext } from "../contexts/AuthContext";

const Nav = () => {
    const user = useContext(AuthContext);
    const bg = useColorModeValue("white", "gray.800");
    const mobileNav = useDisclosure();
    const signIn = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try{
            const result = await firebase.auth().signInWithPopup(provider)
            // Redirect to dashboard
            window.location.href = "/dashboard";
        }catch(error: any){
            console.log(error.code);
            console.log(error.message);
            console.log(error.credential);
        };
    }

    return (
        <React.Fragment>
            <chakra.header
                bg={bg}
                w="full"
                px={{ base: 2, sm: 4 }}
                py={4}
                shadow="md"
            >
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    mx="auto"
                >
                    <Flex alignItems="center">
                        <chakra.a
                            href="/"
                            title="Choc Home Page"
                            display="flex"
                            alignItems="center"
                        >
                            <VisuallyHidden>Choc</VisuallyHidden>
                        </chakra.a>
                        <Link to="/">
                            <Box display="flex" flex="row">
                                <Image width="30px" height="30px" src={logo}></Image>
                                <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                                    FoodAddict
                                </chakra.h1>
                            </Box>
                        </Link>
                    </Flex>
                    <HStack display="flex" alignItems="center" spacing={1}>
                        <HStack
                            spacing={1}
                            mr={1}
                            color="brand.500"
                            display={{ base: "none", md: "inline-flex" }}
                        >
                            <Link to="/search">
                                <Button variant="ghost">Search</Button>
                            </Link>

                            {user ? (
                                <Link to="/dashboard">
                                    <Avatar
                                        name="name"
                                        src={user.photoURL!}
                                    />
                                </Link>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => signIn()}
                                >
                                    Sign in
                                </Button>
                            )}
                        </HStack>
                        <Box display={{ base: "inline-flex", md: "none" }}>
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                aria-label="Open menu"
                                fontSize="20px"
                                color={useColorModeValue("gray.800", "inherit")}
                                variant="ghost"
                                icon={<AiOutlineMenu />}
                                onClick={mobileNav.onOpen}
                            />

                            <VStack
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                display={mobileNav.isOpen ? "flex" : "none"}
                                flexDirection="column"
                                p={2}
                                pb={4}
                                m={2}
                                bg={bg}
                                spacing={3}
                                rounded="sm"
                                shadow="sm"
                            >
                                <CloseButton
                                    aria-label="Close menu"
                                    onClick={mobileNav.onClose}
                                />
                                <Button w="full" variant="ghost" onClick={() => {signIn()}}>
                                    Sign in
                                </Button>
                            </VStack>
                        </Box>
                    </HStack>
                </Flex>
            </chakra.header>
        </React.Fragment>
    );
};

export default Nav;
