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
import firebase from "firebase";
import { useParams } from "react-router-dom";

type RecipeID = {
    id: string
}

const Reviews = () => {
    const user = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState<Record<string, Review>>({});
    const toast = useToast();
    const { id } = useParams<RecipeID>();
    const ref = firebase.firestore().collection("reviews").doc(id);
    const comment = useRef<HTMLTextAreaElement>(null);

    useEffect(() =>{
        ref.get().then((doc: firebase.firestore.DocumentData) => {
            if(doc.exists){
                setReviews(doc.data().reviews);
            }
            else{
                ref.set({'reviews': reviews});
            }
        })
    }, []);

    const updateReview = (updatedReview: Review, reviewer: string) => {
        ref.update({reviews: {...reviews, [reviewer] : updatedReview}});
        setReviews(prevState => { return {...prevState, [reviewer] : updatedReview}});
    }

    const deleteReview = () => {
        delete reviews[user!.uid];
        ref.update({reviews: {...reviews}});
        setReviews(prevState => { return {...prevState}});
    }

    const submitRating = () => {
        console.log(id)
        ref.get().then((doc: firebase.firestore.DocumentData) => {
            if(comment && comment.current){
                // do a filter check here before we save to db
                const review: Review = {
                    user: user!.displayName!,
                    userId: user!.uid,
                    comment: comment.current.value,
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    likes: [user!.uid],
                    dislikes: [],
                    rating: rating
                };
                if(doc.exists){
                    reviews[user!.uid] = review;
                    ref.update({reviews: reviews});
                    setReviews(prevState => { return {...prevState, [user!.uid] : review}});
                }else if(user && user.uid){
                    setReviews({[user.uid]: review});
                    ref.set({'reviews': reviews});
                }
                comment.current.value = '';
                toast({
                    title: 'Review posted!',
                    description: "Your review is now live for everyone to see",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                  })
            }
        })
    }

    return(
        <VStack spacing='24px'>
            <Text fontSize='4xl' fontWeight={700}>Reviews</Text>
            <FormControl>
                <Textarea placeholder='Leave a review' ref={comment} disabled={false}/>
                <Flex>
                    <Text fontSize='lg'>Overall Rating:</Text>
                    {Array(5)
                    .fill("")
                    .map((_, i) => (
                        <Box as='button' disabled={false}>
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
                    disabled={false}
                >
                    Submit review
                </Button>
            </FormControl>
            {Object.keys(reviews).length === 0 ? 
                <Text fontSize='xl' fontWeight={'600'}> 
                There are no reviews yet... You could be the first one! 
                </Text> : Object.keys(reviews).map((key) =>{ return(<Rating review={reviews[key]} userId={key} 
                updateReview={updateReview} deleteReview={deleteReview}/>)})}
        </VStack>
    );
};

export default Reviews;