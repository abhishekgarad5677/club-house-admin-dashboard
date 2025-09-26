import { useMemo } from "react";

// Custom hook to generate unique id
export const generateUID = () => 'uid-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);


// Custom hook to format date
export const useFormattedDate = (isoString) => {
    return useMemo(() => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }, [isoString]);
};