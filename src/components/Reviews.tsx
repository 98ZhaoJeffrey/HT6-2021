import React, { useContext, useEffect, useRef, useState } from "react";
import {Review} from "../ts/interfaces";
import {
    Box,
    Button,
    Flex,
    Text,
    VStack,
    FormControl,
    useToast,
    Textarea
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import {AuthContext} from "../contexts/AuthContext";
import Rating from "./Rating";
import { firebase, firestore } from "../firebase";
import { doc, updateDoc, Timestamp, setDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import checkProfanity from "../utils/checkProfanity";

type RecipeID = {
    id: string
}

const Reviews = (props: {average: number, reviewCount: number}) => {
    const user = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState<{ [key: string]: Review} >({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const toast = useToast();
    const { id } = useParams<RecipeID>();
    const ref = doc(firestore, "reviews", id as string);
    const comment = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        getDoc(ref).then(doc => {
            if(doc.exists()){
                setReviews(doc.data().reviews);
            }
        })
    }, []);

    
    const updateReview = async (updatedReview: Review, reviewer: string, updateComment: boolean) => {
        if(await checkProfanity(updatedReview.comment)){
            updateDoc(ref, {reviews: {...reviews, [reviewer] : updatedReview}});
            setReviews(prevState => { return {...prevState, [reviewer] : updatedReview}});
            if(updateComment){
                toast({
                    title: 'Review updated!',
                    description: "Your review is now updated for everyone to see",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        else{
            if(updateComment){
                toast({
                    title: 'Please do not use profanity',
                    description: "Your review was not updated because there was profanity found",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }

    }

    const deleteReview = () => {
        delete reviews[user!.uid];
        updateDoc(ref, {reviews: {...reviews}});
        setReviews(prevState => { return {...prevState}});
    }

    const submitRating = async () => {
        setIsSubmitting(true);
        try{
            const doc = await getDoc(ref)
            if(comment && comment.current){
                // do a filter check here before we save to db
                if(await checkProfanity(comment.current.value)){
                    const review: Review = {
                        user: "user!.displayName",
                        userId: user!.uid,
                        comment: comment.current.value,
                        date: Timestamp.fromDate(new Date()),
                        likes: [user!.uid],
                        dislikes: [],
                        rating: rating
                    };
                    if(doc.exists()){
                        reviews[user!.uid] = review;
                        updateDoc(ref, {reviews: reviews});
                        setReviews(prevState => { return {...prevState, [user!.uid] : review}});
                    }else if(user && user.uid){
                        setReviews({[user.uid]: review});
                        setDoc(ref, {'reviews': reviews});
                    }
                    toast({
                        title: 'Review posted!',
                        description: "Your review is now live for everyone to see",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    })
                }
                else{
                    toast({
                        title: 'Please do not use profanity',
                        description: "Your review was not posted because there was profanity found",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                }
                setIsSubmitting(false);
                comment.current.value = '';
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <VStack spacing='24px'>
            <Text fontSize='4xl' fontWeight={700}>Reviews</Text>
            <Flex gap="1" alignItems="center">
                <StarIcon color="green.500" fontSize="2xl"/> 
                <Box as="span" fontWeight="bold" fontSize="2xl">{Math.round(props.average * 100) / 100}</Box>
                <Box as="span" color="gray.600" fontWeight="bold" fontSize="2xl">({props.reviewCount} review(s))</Box>
            </Flex>
            <FormControl>
                <Textarea placeholder='Leave a review' ref={comment} disabled={false}/>
                <Flex>
                    <Text fontSize='lg'>Overall Rating:</Text>
                    {Array(5)
                    .fill("")
                    .map((_, i) => (
                        <Box as='button' disabled={Object.keys(reviews).includes(user!.uid)}>
                        <StarIcon
                            key={i}
                            color={i < rating ? "green.500" : "gray.300"}
                            w={6} h={6}
                            onClick={()=>setRating(i+1)}
                        />
                        </Box>))}
                </Flex>
                <Button 
                    mt='24px'
                    variant='ghost'
                    onClick={submitRating}
                    disabled={Object.keys(reviews).includes(user!.uid)}
                    isLoading={isSubmitting}
                    loadingText='Submitting'
                >
                    {Object.keys(reviews).includes(user!.uid) ? "You have already submitted a review" : "Submit review"}
                </Button>
            </FormControl>
            <Box maxHeight="30vh" overflowY="auto">
                {Object.keys(reviews).length === 0 ? 
                    <Text fontSize='xl' fontWeight={'600'}> 
                    There are no reviews yet... You could be the first one! 
                    </Text> : Object.entries(reviews).sort((a, b) => { return b[1]['date'].seconds - a[1]['date'].seconds}).map(
                        (data) => {return <Rating review={data[1]} userId={data[0]} updateReview={updateReview} deleteReview={deleteReview}/>})
                }
            </Box>
        </VStack>
    );
};

export default Reviews;
