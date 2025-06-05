import logo from "./assets/logo.svg";

import { DiamondTheme } from "@diamondlightsource/sci-react-ui";
import { createTheme, Theme } from "@mui/material";

export const I24DiamondTheme: Theme = createTheme({
  ...DiamondTheme,
  logos: {
    normal: {
      src: logo,
      srcDark: logo,
      alt: "DLS logo",
    },
  },
  colorSchemes: {
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
        },
        background: {
          paper: "121212",
        },
      },
    },
  },
});

/** Set up a customisable theme derived from the common DiamondTheme
 * This way it should be possible to easily add settings if required
 * eg. to add colorescheme options
 * colorSchemes: {
 *   dark: {
 *     palette: {
 *       background: {
 *         default: "121212",
 *         paper: "121212",
 *       },
 *     },
 *   },
 * }, */
