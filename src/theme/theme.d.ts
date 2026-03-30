import '@mui/material/styles';

interface CustomShadows {
    z1: string;
    z4: string;
    z8: string;
    z12: string;
    z16: string;
    z20: string;
    z24: string;
    card: string;
    dropdown: string;
    dialog: string;
    primary: string;
    info: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    [key: string]: string;
}

declare module '@mui/material/styles' {
    interface Theme {
        customShadows: CustomShadows;
    }
    interface ThemeOptions {
        customShadows?: CustomShadows;
    }
    interface PaletteColor {
        lighter?: string;
        darker?: string;
    }
    interface SimplePaletteColorOptions {
        lighter?: string;
        darker?: string;
    }
}
