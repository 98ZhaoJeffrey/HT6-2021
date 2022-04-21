import {
    Box,
    Button,
    Checkbox,
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
import { Link } from "react-router-dom";
import React, {useState, useRef} from 'react'
import logo from "../assets/logo.png";
import { PasswordField } from '../components/PasswordField';
import firebase from 'firebase';
import {FcGoogle} from "react-icons/fc";
  
const SignUp = () => {

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

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
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
                console.log(response.user)
                await response.user?.updateProfile({
                    displayName: name,
                });
            }
            catch(error: any) {
                setError(error.message);
                console.log(error);
                if(passwordRef && passwordRef.current){
                    passwordRef.current.value = '';
                }
            }
        }
    }

    const GoogleSignIn = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try{
            await firebase.auth().signInWithPopup(provider)
            window.location.href = "/dashboard";
        }catch(error: any){
            console.log(error.code);
            console.log(error.message);
            console.log(error.credential);
        };
    }


    return (
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
            bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
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
    )
}

export default SignUp