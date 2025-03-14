const shortcuts = {};

export function setKeyShortcut(key, command) {
    shortcuts[key] = command;
}

document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
    }
});
