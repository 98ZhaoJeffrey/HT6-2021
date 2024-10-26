export const parseNumber = (input: string | null) => {
    if(input === null){
        return 1;
    }
    return parseInt(input);
}

export const parseString = (input: string | null) => {
    if(input === null){
        return "";
    }
    return input;
}