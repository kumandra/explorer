import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import "../styles/globals.css";

export function SafeHydrate({ children }) {
    const [isSSR, setIsSSR] = useState(true);
    useEffect(() => {
        setIsSSR(false);
    }, []);
    return <div suppressHydrationWarning>{!isSSR && children}</div>;
}

function MyApp({ Component, pageProps }) {
    const { theme, setTheme } = useTheme();
    return (
        <SafeHydrate>
            <ThemeProvider attribute="data-theme" enableSystem={true} defaultTheme="dark">
                <Component {...pageProps} />;
            </ThemeProvider>
        </SafeHydrate>
    );
}

export default MyApp;
