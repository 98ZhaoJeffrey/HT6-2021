import * as API_ENDPOINTS from "../constants/api_endpoints";

const checkProfanity = async (message: String) => {
    const body = JSON.stringify({
        message
    });

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
    };
    try{
        const response = await fetch(API_ENDPOINTS.PROFANITY_ENDPOINT, options);
        const result = await response.json();
        return !result["hasProfanity"];
    }catch (error){
        return false;
    }
}

export default checkProfanity;