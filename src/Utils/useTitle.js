"use client"; // Ensure it's client-side

import { useEffect } from "react";

/**
 * Custom hook to update the document title
 * @param {string} title - The title to set
 * @param {string} suffix - Optional suffix (e.g., company name)
 */
export default function useTitle() {
    useEffect(() => {
        document.title = 'JupiNext - Where the Next Begins'
    }, []);
}
