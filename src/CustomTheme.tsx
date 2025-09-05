import {
  mergeThemeOptions,
  DiamondThemeOptions,
} from "@diamondlightsource/sci-react-ui";
import { createTheme, Theme } from "@mui/material";

// Augment the palette to include a custom color
declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
  }

  interface PaletteOptions {
    custom?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include a new option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    custom: true;
  }
}

const I24DiamondThemeOptions = mergeThemeOptions(
  {
    colorSchemes: {
      light: {
        palette: {
          custom: {
            main: "#1976d2",
            light: "#68a0e2",
            dark: "#10569b",
            contrastText: "#ffffff", // white
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: "#202740",
            light: "#4C5266",
            dark: "#161B2C",
          },
          secondary: {
            main: "#facf07",
            light: "#FBD838", // light yellow
            dark: "#AF9004", // dark yellow
          },
          custom: {
            main: "#1976d2",
            light: "#68a0e2",
            dark: "#10569b",
            contrastText: "#ffffff", // white
          },
          background: {
            default: "#050505",
            paper: "#121212",
          },
        },
      },
    },
  },
  DiamondThemeOptions
);

export const I24DiamondTheme: Theme = createTheme(I24DiamondThemeOptions);
