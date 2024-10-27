import shuffleArray from "../utils/randomShuffle";

const auth_recipe_images = [
    "https://firebasestorage.googleapis.com/v0/b/foodaddtech.appspot.com/o/image%2F1729997394435-bdjy71?alt=media&token=34be7f03-23b3-49d2-b65a-2d1ff0a5531a",
    "https://firebasestorage.googleapis.com/v0/b/foodaddtech.appspot.com/o/image%2F1730000546000-nm6byi?alt=media&token=5e8b5fb8-8e0f-4095-887d-0d928ebf70d7",
    "https://firebasestorage.googleapis.com/v0/b/foodaddtech.appspot.com/o/image%2F1729998610090-p6lnqv?alt=media&token=c8471ccb-5d6d-4e1d-9dca-d7103454aec2",
    "https://firebasestorage.googleapis.com/v0/b/foodaddtech.appspot.com/o/image%2F1729997920824-zt2k37?alt=media&token=4cbebfcd-1eac-4b64-a328-ffb1a0f5a2b5",
    "https://firebasestorage.googleapis.com/v0/b/foodaddtech.appspot.com/o/image%2F1729910457721-6qnurl?alt=media&token=1bd0720c-6119-46ba-b96a-132118148783"
];

const shuffled_auth_recipe_images: string[] = shuffleArray(auth_recipe_images)

export default shuffled_auth_recipe_images;