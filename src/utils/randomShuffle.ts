const shuffleArray = <T>(array: T[]): T[] =>{
    return array.sort((a, b) => 0.5 - Math.random());
}

export default shuffleArray;