import {extendTheme} from '@chakra-ui/react';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

const theme = extendTheme({ 
    initialColorMode: 'light',
    useSystemColorMode: false,
    components: {
        Steps,
    },
    colors: {
        brand: {
            light: "#F7FAFC",
            dark: "#1A202C",
            green: "#48BB78",
            red: "red.500",
            darkGreen: "#22543D",
            lightGreen: "#38A169",
        }
    },
});

export default theme;