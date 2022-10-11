import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';

const styles = {
  global: props => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', 'gray.900')(props),
    },
  }),
};

const components = {
  Drawer: {
    // setup light/dark mode component defaults
    baseStyle: props => ({
      dialog: {
        bg: mode('gray.400', 'gray.100')(props),
      },
    }),
  },
};

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
  }

const theme = extendTheme({
  components,
  styles,
  config
});

export default theme;