import {
    enableValidation,
    settings,
    resetValidation,
    disabledButton,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";
import { setbuttonText } from "../utils/helpers.js";
// import { set } from "core-js/core/dict";

// const initialCards = [
//     {
//         name: "Val Thorens",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//     },
//     {
//         name: "Restaurant terrace",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//     },
//     {
//         name: "An outdoor cafe",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//     },
//     {
//         name: "A very long bridge, over the forest and through the trees",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//     },
//     {
//         name: "Tunnel with morning light",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//     },
//     {
//         name: "Mountain house",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//     },
// ];

const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
        authorization: "5644952e-2d27-433e-aa79-12a5c9f211e5",
        "Content-Type": "application/json",
    },
});

api.getAppInfo()
    .then(([cards, userInfo]) => {
        cards.forEach((item) => {
            const cardElement = getCardElement(item);
            cardsList.prepend(cardElement);
        });
        profileName.textContent = userInfo.name;
        profileDescription.textContent = userInfo.about;

        profileAvatar.src = userInfo.avatar;
    })
    .catch((err) => {
        console.error(err);
    });

//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

//Card Form Elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Delete form Element

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

//Avatar Modal Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");

const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");

// Preview Image Popup Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const modals = document.querySelectorAll(".modal");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const editModalCloseButton = document.querySelector(".modal__close-btn");
const editModalNameInput = editProfileModal.querySelector(
    "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
    "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleEscape(evt) {
    if (evt.key === "Escape") {
        const activeModal = document.querySelector(".modal_opened");
        closeModal(activeModal);
    }
}

modals.forEach((modal) => {
    modal.addEventListener("mousedown", (evt) => {
        if (evt.target.classList.contains("modal")) {
            closeModal(modal);
        }
    });
});

function getCardElement(data) {
    const cardElement = cardTemplate.content
        .querySelector(".card")
        .cloneNode(true);

    // Card Elements
    const cardNameEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtn = cardElement.querySelector(".card__like-button");
    const cardDeleteBtn = cardElement.querySelector(".card__delete-icon");

    // Set card content
    cardNameEl.textContent = data.name;
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;

    if (data.isLiked) {
        cardLikeBtn.classList.add("card__like-button_liked");
    }

    // Like button logic
    cardLikeBtn.addEventListener("click", () => {
        const isLiked = cardLikeBtn.classList.contains(
            "card__like-button_liked"
        );
        const cardId = data._id;

        if (isLiked) {
            api.removeLike(cardId)
                .then(() => {
                    cardLikeBtn.classList.remove("card__like-button_liked");
                })
                .catch(console.error);
        } else {
            api.addLike(cardId)
                .then(() => {
                    cardLikeBtn.classList.add("card__like-button_liked");
                })
                .catch(console.error);
        }
    });

    // Image preview logic
    cardImageEl.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImageEl.src = data.link;
        previewModalCaptionEl.textContent = data.name;
        previewModalImageEl.alt = data.name;
    });

    // Delete button logic
    cardDeleteBtn.addEventListener("click", () => {
        handleDeleteCard(cardElement, data._id);
    });

    return cardElement;
}

function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keyup", handleEscape);
}

function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keyup", handleEscape);
}

function handleEditFormSubmit(evt) {
    evt.preventDefault();

    const submitBtn = evt.submitter;
    setbuttonText(submitBtn, true, "Saving...", "Save");

    api.editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
    })
        .then((data) => {
            profileName.textContent = data.name;
            profileDescription.textContent = data.about;
            closeModal(editProfileModal);
        })
        .catch(console.error)
        .finally(() => {
            setbuttonText(submitBtn, false, "Saving...", "Save");
        });
}

function handleAddCardSubmit(evt) {
    evt.preventDefault();

    const submitBtn = evt.submitter || cardSubmitBtn;
    setbuttonText(submitBtn, true, "Saving...", "Save");

    const inputValues = {
        name: cardNameInput.value,
        link: cardLinkInput.value,
    };

    api.addCard(inputValues)
        .then((cardData) => {
            const cardElement = getCardElement(cardData);
            cardsList.prepend(cardElement);
            evt.target.reset();
            disabledButton(cardSubmitBtn, settings);
            closeModal(cardModal);
        })
        .catch(console.error)
        .finally(() => {
            setbuttonText(submitBtn, false, "Saving...", "Save");
        });
}

function handleAvatarSubmit(evt) {
    evt.preventDefault();

    const submitBtn = evt.submitter || avatarSubmitBtn;
    setbuttonText(submitBtn, true, "Saving...", "Save");

    const avatarUrl = avatarInput.value;
    if (!avatarUrl) {
        console.error("Avatar URL is empty.");
        setbuttonText(submitBtn, false, "Saving...", "Save");
        return;
    }

    api.editAvatarInfo(avatarUrl)
        .then((data) => {
            if (data && data.avatar) {
                if (profileAvatar) {
                    profileAvatar.src = data.avatar;
                } else {
                    console.error("Profile avatar element not found.");
                }
                closeModal(avatarModal);
                evt.target.reset();
                disabledButton(avatarSubmitBtn, settings);
            } else {
                console.error("API did not return a valid avatar URL.", data);
            }
        })
        .catch(console.error)
        .finally(() => {
            setbuttonText(submitBtn, false, "Saving...", "Save");
        });
}

function handleDeleteSubmit(evt) {
    evt.preventDefault();

    const submitBtn =
        evt.submitter || deleteModal.querySelector(".modal__submit-btn");
    setbuttonText(submitBtn, true, "Deleting...", "Delete");

    api.deleteCard(selectedCardId)
        .then(() => {
            if (selectedCard) {
                selectedCard.remove();
            }
            closeModal(deleteModal);
            selectedCard = null;
            selectedCardId = null;
        })
        .catch(console.error)
        .finally(() => {
            setbuttonText(submitBtn, false, "Deleting...", "Delete");
        });
}
function handleDeleteCard(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    console.log(cardId);
    openModal(deleteModal);
}

profileEditButton.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;

    resetValidation(
        editFormElement,
        [editModalNameInput, editModalDescriptionInput],
        settings
    );
    openModal(editProfileModal);
});

editModalCloseButton.addEventListener("click", () => {
    closeModal(editProfileModal);
});

cardModalBtn.addEventListener("click", () => {
    openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
    openModal(avatarModal);
});

avatarCloseBtn.addEventListener("click", () => {
    closeModal(avatarModal);
});

cardModalCloseBtn.addEventListener("click", () => {
    closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
    closeModal(previewModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
    closeModal(deleteModal);
});

cancelBtn.addEventListener("click", () => {
    closeModal(deleteModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
