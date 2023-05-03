import React, { useContext } from "react";
import {
    Avatar,
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon,
    IconButton,
    Image,
    Text,
    useColorModeValue,
    useDisclosure,
    Button,
    BoxProps,
    useColorMode,
    Spacer
} from "@chakra-ui/react";
import { AuthContext } from "../contexts/AuthContext";
import { FiMenu } from "react-icons/fi";
import {  HiCollection } from "react-icons/hi";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { EditIcon, MoonIcon, Search2Icon, SunIcon, TimeIcon } from "@chakra-ui/icons";

const links = [
    {"link": "/dashboard", "name": "Dashboard", "icon": EditIcon},
    {"link": "/search", "name": "Search", "icon": Search2Icon},
    {"link": "/collection", "name": "Collection", "icon": HiCollection},
    {"link": "/history", "name": "History", "icon": TimeIcon }
]

const Sidebar = (props: {children: React.ReactNode}) => {
    const sidebar = useDisclosure();
    const user = useContext(AuthContext);
    const navigate = useNavigate();
    const color = useColorModeValue("gray.600", "gray.300");
    const { colorMode, toggleColorMode } = useColorMode();
  
    const NavItem = (props: { [x: string]: any; icon: any; children: any; }) => {
      const { icon, children, ...rest } = props;
      return (
        <Flex
          align="center"
          px="4"
          pl="4"
          py="3"
          cursor="pointer"
          color={useColorModeValue("inherit", "gray.400")}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.900"),
            color: useColorModeValue("gray.900", "gray.200"),
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
          {...rest}
        >
          {icon && (
            <Icon
              mx="2"
              boxSize="4"
              _groupHover={{
                color: color,
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      );
    };
  
    const SidebarContent = (props: BoxProps) => (
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg={useColorModeValue("white", "gray.800")}
        borderColor={useColorModeValue("inherit", "gray.700")}
        borderRightWidth="1px"
        w="60"
        {...props}
      >
        <Flex px="4" py="5" align="center">
            <Image width="30px" height="30px" src={logo}></Image>
            <Link to="/">
                <Text
                    fontSize="2xl"
                    ml="2"
                    color={useColorModeValue("brand.500", "white")}
                    fontWeight="semibold"
                >
                    FoodAddTech
                </Text>
            </Link>
        </Flex>
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
            {links.map((item) => {
                return(
                <NavItem icon={item.icon} onClick={() => navigate(item.link)}>
                    {item.name}
                </NavItem>
                )
            })}
        </Flex>
      </Box>
    );

    return (
      <Box
        as="section"
        bg={useColorModeValue("gray.50", "gray.700")}
        minH="100vh"
      >
        <SidebarContent display={{ base: "none", md: "unset" }} />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Flex
            as="header"
            align="center"
            justify={{base:"space-between", md: "flex-end"}}
            w="full"
            px="4"
            py="4"
            h="8vh"
            bg={useColorModeValue("white", "gray.800")}
            borderBottomWidth="1px"
            borderColor={useColorModeValue("inherit", "gray.700")}
          >
            <IconButton 
              onClick={toggleColorMode}
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              aria-label="Dark mode"
              mr="2"
              variant="outline"
            />
            <IconButton
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
            {user ? (
                <Link to="/dashboard">
                    <Avatar
                        name="name"
                        src={"user.photoURL"}
                    />
                </Link>
                ) : (
                <Button
                    variant="ghost"
                    onClick={() => {navigate("/login");}}
                >
                    Sign in
                </Button>
            )}
          </Flex>
          {props.children}
        </Box>
      </Box>
    );
  }
  
  export default Sidebar;