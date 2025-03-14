const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__button_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMsg, config) => {
    const errorMsgElement = formElement.querySelector(
        `#${inputElement.id}-error`
    );
    errorMsgElement.textContent = errorMsg;
    inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formElement, inputElement, config) => {
    const errorMsgElement = formElement.querySelector(
        `#${inputElement.id}-error`
    );
    errorMsgElement.textContent = "";
    inputElement.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
        showInputError(
            formElement,
            inputElement,
            inputElement.validationMessage
        );
    } else {
        hideInputError(formElement, inputElement);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
        return !input.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
        disabledButton(buttonElement);
    } else {
        buttonElement.disabled = false;
        //remove disabled class
    }
};

const disabledButton = (buttonElement, config) => {
    buttonElement.disabled = true;
    //TODO add modifier class to buttonElement to make it grey
    //Dont forget CSS
};

const resetValidation = (formElement, inputList) => {
    inputList.forEach((input) => {
        hideInputError(formElement, input);
    });
};

//TODO use the settings object in all functions instead of hard-coded strings

const setEventListeners = (formElement, config) => {
    const inputList = Array.from(
        formElement.querySelectorAll(config.inputSelector)
    );
    const buttonElement = formElement.querySelector(
        config.submitButtonSelector
    );

    // TODO Handle initial states
    toggleButtonState(inputList, buttonElement, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formElement) => {
        setEventListeners(formElement, config);
    });
};

enableValidation(settings);
