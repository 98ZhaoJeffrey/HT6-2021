import { EditIcon, Search2Icon, TimeIcon, UnlockIcon } from "@chakra-ui/icons";
import { FiUpload, FiUserPlus } from "react-icons/fi";
import { HiCollection } from "react-icons/hi";
import * as PageRoutes from "./routes";

export const AUTH_LINKS = [
    {"link": PageRoutes.DASHBOARD_PAGE, "name": "Dashboard", "icon": EditIcon},
    {"link": PageRoutes.SEARCH_PAGE, "name": "Search", "icon": Search2Icon},
    {"link": PageRoutes.UPLOAD_PAGE, "name": "Upload", "icon": FiUpload},
    {"link": PageRoutes.FAVORITE_PAGE, "name": "Favorites", "icon": HiCollection},
    {"link": PageRoutes.HISTORY_PAGE, "name": "History", "icon": TimeIcon }
]

export const UNAUTH_LINKS = [
  {"link": PageRoutes.LOGIN_PAGE, "name": "Login", "icon": UnlockIcon},
  {"link": PageRoutes.SIGNUP_PAGE, "name": "Signup", "icon": FiUserPlus},
]