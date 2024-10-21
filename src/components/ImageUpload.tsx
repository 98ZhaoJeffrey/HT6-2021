import React, { useState, FC } from 'react';
import { 
  Box, Button, Image, Input, Stack, useToast 
} from '@chakra-ui/react';

interface ImageUploadProps {
    onImageUpload: (image: string | ArrayBuffer | null) => void;
  }

const ImageUpload: FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const toast = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type.',
        description: 'Please upload a valid image file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      onImageUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
        <Box borderWidth={1} borderRadius="md" p={4} boxShadow="sm">
          <Stack spacing={4}>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              display="none" 
              id="file-upload" 
            />
            <Button as="label" htmlFor="file-upload">
              Choose Image
            </Button>

            {image && (
              <Box mt={4} borderWidth={1} borderRadius="md" overflow="hidden" display={"flex"} justifyContent={'center'}>
                <Image 
                  src={image as string} 
                  alt="Recipe" 
                  objectFit="cover" 
                  maxWidth="500px" 
                  maxHeight="300px"  
                />
              </Box>
            )}
          </Stack>
        </Box>
  );
};

export default ImageUpload;
