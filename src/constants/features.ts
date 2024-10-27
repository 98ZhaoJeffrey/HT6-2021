import { FaSearch, FaUpload, FaPlus } from "react-icons/fa";
import { CiMenuFries, CiLogin } from "react-icons/ci";
import { ImBooks } from "react-icons/im";

export const FEATURES = [
    {color: "red", title: "Tracking", text: "Login to track the ingredients in your fridge!", icon: CiLogin},
    {color: "green", title: "Search", text: "Search for recipes with common ingredients!", icon: FaSearch},
    {color: "blue", title: "Recipes", text: "Delicious recipes with instructions to create!", icon: CiMenuFries},
    {color: "yellow", title: "Upload", text: "Upload your own recipes for others to enjoy!", icon: FaUpload},
    {color: "orange", title: "Collections", text: "Save recipes that you've made or really like!", icon: ImBooks},
    {color: "purple", title: "More features under development", text: "We are always looking to improve the site with better features!", icon: FaPlus},
]