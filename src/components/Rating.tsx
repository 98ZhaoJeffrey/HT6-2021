import React, { useContext, useRef, useState } from "react";
import {Review} from "../ts/interfaces";
import {
    Box,
    Button,
    Flex,
    Text,
    Divider,
    ButtonGroup,
    Tooltip,
    Spacer,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Textarea,
    FormControl,
} from "@chakra-ui/react";
import { StarIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {AuthContext} from "../contexts/AuthContext";
import { firebase, firestore } from "../firebase";
import { User } from "firebase/auth";
import { AiFillEdit } from "react-icons/ai";
import { Timestamp } from "firebase/firestore";

type Liked = "Liked" | "Disliked" | "Neither"


interface Props{
    review: Review,
    userId: string
    updateReview: (updatedReview: Review, reviewer: string, updateComment: boolean) => void
    deleteReview: () => void 
}

const UserLiked = (likes: string[], dislikes: string[], user: User | null): Liked =>{
    if(user === null){
        return "Neither";
    }
    else if(likes.includes(user.uid)){
        return "Liked";
    }
    else if(dislikes.includes(user.uid)){
        return "Disliked";
    }
    return "Neither";
}

const Rating = (prop: Props) =>{
    const user = useContext(AuthContext);
    const [isTruncated, setIsTruncated] = useState(false);
    const [liked, setLiked] = useState<Liked>(UserLiked(prop.review.likes, prop.review.dislikes, user));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [rating, setRating] = useState(prop.review.rating);
    const commentRef = useRef<HTMLTextAreaElement>(null);

    const updateComment = () => {
        if(commentRef && commentRef.current){
            if(commentRef.current.value !== prop.review.comment || rating !== prop.review.rating){
                const review: Review = {
                    user: prop.review.user,
                    userId: prop.review.userId,
                    comment: commentRef.current.value,
                    date: Timestamp.fromDate(new Date()),
                    likes: prop.review.likes,
                    dislikes: prop.review.dislikes,
                    rating: rating
                };
                prop.updateReview(review, prop.review.userId, true);    
            }
            onClose();
        }
    }
    
    const deleteComment = () => {
        prop.deleteReview();
        onClose();
    }

    // if you like it but you dislike before, remove dislike and add like
    // if you dislike it, but you like before, remove dislike and add like

    const updateLikes = (like: boolean) => {
        const likes = new Set(prop.review.likes);
        const dislikes = new Set(prop.review.dislikes);
        if(like){
            // if is liked, we unlick it
            console.log(liked);
            if(liked === "Liked"){
                likes.delete(user!.uid);
            }
            else{
                likes.add(user!.uid);
                dislikes.delete(user!.uid);
            }
            setLiked(liked === "Liked" ? "Neither": "Liked");
        }
        // dislike video
        else{
            if(liked === "Disliked"){
                dislikes.delete(user!.uid);
            }
            else{
                likes.delete(user!.uid);
                dislikes.add(user!.uid);
            }
            setLiked(liked === "Disliked" ? "Neither": "Disliked");
        }
        const review = {
            user: prop.review.user,
            userId: prop.review.userId,
            comment: prop.review.comment,
            date: prop.review.date,
            likes: Array.from(likes),
            dislikes: Array.from(dislikes),
            rating: prop.review.rating
        };
        prop.updateReview(review, prop.review.userId, false);
    }

    return(
        <>
            <Box w="100%">
                <Divider/>
                <Text fontSize='3xl' fontWeight="600" color={prop.review.userId === user!.uid ? "green" : "black"}>{prop.review.user}</Text>
                <Text fontSize='xl' fontWeight="400">Last Updated: {prop.review.date.toDate().toDateString()}</Text>
                <Flex alignItems={'center'} height="50">
                    <Text fontSize='lg'>Rating:</Text>
                    {Array(5)
                    .fill("")
                    .map((_, i) => (
                        <StarIcon
                        key={i}
                        color={i < prop.review.rating ? "green.500" : "gray.300"}
                        w={6} h={6}
                    />))}
                </Flex>
                <Tooltip label="Click to shorten text">
                    <Text 
                        fontSize='xl' 
                        isTruncated={isTruncated}
                        onClick={() =>setIsTruncated(!isTruncated)}
                        my='3'
                    >{prop.review.comment}</Text>
                </Tooltip>
                <Flex>
                
                <ButtonGroup spacing='2'>
                <Tooltip label="I Like this">
                    <Button 
                        leftIcon={<TriangleUpIcon/>} 
                        colorScheme='green'
                        onClick={() => updateLikes(true)}
                        variant={liked === "Liked" ?  'solid' : 'ghost'}
                    >
                        {prop.review.likes.length}
                    </Button>
                </Tooltip>
                <Tooltip label="I dislike this">
                    <Button 
                        leftIcon={<TriangleDownIcon/>} 
                        colorScheme='red'
                        onClick={() => updateLikes(false)}
                        variant={liked === "Disliked" ?  'solid' : 'ghost'}
                    >
                        {prop.review.dislikes.length}
                    </Button>
                </Tooltip>
                </ButtonGroup>
                <Spacer/>
                { user !== null && user.uid === prop.userId && <IconButton 
                    icon={<AiFillEdit/>} 
                    aria-label='Edit'
                    colorScheme='blue'
                    onClick={onOpen}
                    variant='link'
                />}
                </Flex>
            </Box>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size='3xl'
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Edit your review</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                </ModalBody>
                    <FormControl>
                    <Textarea placeholder='Edit your review' w='95%' ref={commentRef}>{prop.review.comment}</Textarea>
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
                    </FormControl>
                <ModalFooter>
                    <Button colorScheme='green' mr={3} onClick={updateComment}>
                        Save
                    </Button>
                    <Button colorScheme='red' onClick={deleteComment}>
                        Delete
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Rating;

