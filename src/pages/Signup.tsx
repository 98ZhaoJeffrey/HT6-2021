import {
    Box,
    Button,
    Flex,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    Image,
    useBreakpointValue,
    useColorModeValue,
    Divider,
} from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom";
import React, {useState, useRef} from 'react'
import logo from "../assets/logo.png";
import { PasswordField } from '../components/PasswordField';
import Carousels from '../components/Carousels';
import {FcGoogle} from "react-icons/fc";
import { firebase, auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import * as PageRoutes from "../constants/routes";
import shuffled_auth_recipe_images from '../constants/auth_recipe_images';
  
const SignUp = () => {

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const signup = async () => {
        const name = nameRef && nameRef.current ? nameRef.current.value : '';
        const email = emailRef && emailRef.current ? emailRef.current.value : '';
        const password = passwordRef && passwordRef.current ? passwordRef.current.value : '';
        
        if(name === ''){
            setError('Enter your name');
        }
        if(email === ''){
            setError('Enter an email');
        }
        else{
            try{
                const response = await createUserWithEmailAndPassword(auth, email, password);
                if(auth.currentUser){
                   updateProfile(auth.currentUser, {displayName: name}); 
                }
                console.log(response)
            }
            catch(error: any) {
                setError("Unable to signup at this time, please try again");
                if(passwordRef && passwordRef.current){
                    passwordRef.current.value = '';
                }
            }
        }
    }

    const GoogleSignIn = async () => {
        try{
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate(PageRoutes.DASHBOARD_PAGE);
        }catch(error: any){
            console.log(error.code);
            console.log(error.message);
            console.log(error.credential);
        };
    }


    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            bg={useColorModeValue("brand.light", "brand.dark")}
            px={{base: 0, xl: 16}}
            mx="auto"
            alignItems='center'
        >            
            <Box w={{ base: "full", md: 10 / 12 }} mx="auto" textAlign="center" display={{ base: "none", xl: "flex"}}>
            <Carousels images={shuffled_auth_recipe_images} width="full" height="600px"/>
            </Box>
            <Box
                w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                mx="auto"
                pr={{ md: 20 }}
            >
            <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
                <Stack spacing="8">
                <Stack spacing="6">
                    <Image width="80px" height="80px" src={logo} alignSelf="center"/>
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                    <Heading size='lg'>
                        Create an account
                    </Heading>
                    <HStack spacing="1" justify="center">
                        <Text color="muted">Have an account?</Text>
                        <Link to='/login'>
                            <Button variant="link" colorScheme="green">
                                Login
                            </Button>
                        </Link>
                    </HStack>
                    </Stack>
                </Stack>
                <Box
                    py={{ base: '0', sm: '8' }}
                    px={{ base: '4', sm: '10' }}
                    bg={useBreakpointValue({ base: 'transparent', sm: useColorModeValue('md', 'gray.700') })}
                    boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
                    borderRadius={{ base: 'none', sm: 'xl' }}
                >
                    <Stack spacing="6">
                    <Stack spacing="5">
                        <FormControl>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input id="name" type="name" ref={nameRef}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input id="email" type="email" ref={emailRef}/>
                        </FormControl>
                        <PasswordField ref={passwordRef}/>
                        {error && <Text color='red'>{error}</Text>}
                    </Stack>
                    <Stack spacing="6">
                    <Button colorScheme="green" onClick={signup}>Sign up</Button>
                    <HStack>
                        <Divider />
                        <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                        or continue with
                        </Text>
                        <Divider />
                    </HStack>
                    <Button 
                        variant="outline" 
                        size='lg' 
                        fontSize='lg' 
                        leftIcon={<FcGoogle />} 
                        aria-label={'Google'} 
                        onClick={GoogleSignIn}
                    >
                        Continue with Google
                    </Button>
                    </Stack>
                    </Stack>
                </Box>
                </Stack>
            </Container>
            </Box>
        </Flex>
    )
}

export default SignUp