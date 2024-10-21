export const generateImageId = (): string => {
    const timestamp = Date.now(); // Current timestamp
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    return `${timestamp}-${randomString}`; // Combine them
  };