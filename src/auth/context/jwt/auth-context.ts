import { createContext } from 'react';

// ----------------------------------------------------------------------

export interface AuthContextType {
    user: any;
    method: string;
    loading: boolean;
    authenticated: boolean;
    unauthenticated: boolean;
    // register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    sendOtp: (phoneNumber: string, password: string) => Promise<void>;
    ResendOtp: (phoneNumber: string, DeviceID: string) => Promise<void>;
    verifyOtpCode: (code: string, phoneNumber: string) => Promise<void>;
    logout: () => Promise<void>;
    [key: string]: any;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
