export const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMsg, config) => {
    const errorMsgElement = formElement.querySelector(
        `#${inputElement.id}-error`
    );
    if (errorMsgElement) {
        errorMsgElement.textContent = errorMsg;
        errorMsgElement.classList.add(config.errorClass);
    }
    inputElement.classList.add(config.inputErrorClass);
};

const hideInputError = (formElement, inputElement, config) => {
    const errorMsgElement = formElement.querySelector(
        `#${inputElement.id}-error`
    );
    if (errorMsgElement) {
        errorMsgElement.textContent = "";
        errorMsgElement.classList.remove(config.errorClass);
    }
    inputElement.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formElement, inputElement, config) => {
    if (!inputElement.validity.valid) {
        showInputError(
            formElement,
            inputElement,
            inputElement.validationMessage,
            config
        );
    } else {
        hideInputError(formElement, inputElement, config);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
        return !input.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonElement, config) => {
    if (!buttonElement) return; // Add this check

    if (hasInvalidInput(inputList)) {
        disabledButton(buttonElement, config);
    } else {
        buttonElement.disabled = false;
    }
};

export const disabledButton = (buttonElement, config) => {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass); // Add the modifier class
};

export function resetValidation(formElement, inputElements = [], settings) {
    if (!Array.isArray(inputElements)) {
        console.error("resetValidation: inputElements is not an array");
        return;
    }

    inputElements.forEach((inputElement) => {
        if (!inputElement) {
            console.error("resetValidation: inputElement is undefined");
            return;
        }
    });
}

//TODO use the settings object in all functions instead of hard-coded strings

const setEventListeners = (formElement, config) => {
    const inputList = Array.from(
        formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(
        config.submitButtonSelector
    );

    inputList.forEach((inputElement) => {
        const errorMsgElement = formElement.querySelector(
            `#${inputElement.id}-error`
        );
        if (errorMsgElement) {
            errorMsgElement.textContent = "";
            errorMsgElement.classList.remove(config.errorClass);
        }
        inputElement.classList.remove(config.inputErrorClass);
    });
    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};

export const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formElement) => {
        setEventListeners(formElement, config);
    });
};
