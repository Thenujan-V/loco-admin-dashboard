/// <reference types="vite/client" />

// Image modules
declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.webp' {
    const content: string;
    export default content;
}

// CSS modules
declare module '*.css';

// Third-party modules without types
declare module 'stylis-plugin-rtl';

// react-lazy-load-image-component CSS
declare module 'react-lazy-load-image-component/src/effects/blur.css';

// simplebar-react CSS
declare module 'simplebar-react/dist/simplebar.min.css';

// Vite env variables
interface ImportMetaEnv {
    readonly REACT_APP_HOST_API: string;
    readonly REACT_APP_ASSETS_API: string;
    readonly REACT_APP_FIREBASE_API_KEY: string;
    readonly REACT_APP_FIREBASE_AUTH_DOMAIN: string;
    readonly REACT_APP_FIREBASE_PROJECT_ID: string;
    readonly REACT_APP_FIREBASE_STORAGE_BUCKET: string;
    readonly REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly REACT_APP_FIREBASE_APPID: string;
    readonly REACT_APP_FIREBASE_MEASUREMENT_ID: string;
    readonly REACT_APP_AWS_AMPLIFY_USER_POOL_ID: string;
    readonly REACT_APP_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID: string;
    readonly REACT_APP_AWS_AMPLIFY_REGION: string;
    readonly REACT_APP_AUTH0_CLIENT_ID: string;
    readonly REACT_APP_AUTH0_DOMAIN: string;
    readonly REACT_APP_AUTH0_CALLBACK_URL: string;
    readonly REACT_APP_MAPBOX_API: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
