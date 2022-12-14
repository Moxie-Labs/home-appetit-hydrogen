export function logToConsole(...args) {
    if (import.meta.env.VITE_SHOW_DEBUG === "true")
        console.log(...args);
}