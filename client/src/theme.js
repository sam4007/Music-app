import { createTheme } from "@mui/material";
import { blue, grey, green } from "@mui/material/colors";

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: blue[600],
            light: blue[300],
            dark: blue[900],
        },
        secondary: {
            main: grey[600],
            light: grey[300],
            dark: grey[900],
        },
    }
})

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: green[600],
            light: green[500],
            dark: green[600],
        },
        secondary: {
            main: grey[300],
            light: grey[100],
            dark: grey[400],
        },
    }
})