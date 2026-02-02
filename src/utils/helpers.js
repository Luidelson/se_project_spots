export function setbuttonText(button, isLoading, loadingText, defaultText) {
    if (!button) {
        console.error("Button is not defined");
        return;
    }
    button.textContent = isLoading ? loadingText : defaultText;
}
