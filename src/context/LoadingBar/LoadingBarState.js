import React, { useState } from "react";

const LoadingBarContext = React.createContext({
    progress: 0,
    setProgress: () => { },
});

const LoadingBarState = ({ children }) => {

    const [progress, setProgress] = useState(0);

    const contextValue = { progress, setProgress };
    return (
        <LoadingBarContext.Provider value={contextValue}>
            {children}
        </LoadingBarContext.Provider>
    )
}

export { LoadingBarContext, LoadingBarState };