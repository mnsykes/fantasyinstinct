import { createContext, useContext } from 'react';
import type { Config } from '../types/config'

const ConfigContext = createContext<Config | undefined>(undefined)

export const ConfigProvider = ({ children }: {children: any}) => {
    const config: Config = {
        apiUrl: import.meta.env.VITE_API_URL,
        fantraxApiUrl: import.meta.env.VITE_FANTRAX_API_URL,
        fantraxLeagueId: import.meta.env.VITE_FANTRAX_LEAGUE_ID
    };

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): Config => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within configuration');
    }

    return context;
}

