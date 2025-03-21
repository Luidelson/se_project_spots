//TODO pass settings object to validation functions that are called in this file

const initialCards = [
    {
        name: "Val Thorens",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    },
    {
        name: "Restaurant terrace",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    },
    {
        name: "An outdoor cafe",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    },
    {
        name: "A very long bridge, over the forest and through the trees",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    },
    {
        name: "Tunnel with morning light",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    },
    {
        name: "Mountain house",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

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

    const cardNameEl = cardElement.querySelector(".card__title");

    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtn = cardElement.querySelector(".card__like-button");
    const cardDeleteBtn = cardElement.querySelector(".card__delete-icon"); //Added Delete button
    //TODO -select delete button

    cardNameEl.textContent = data.name;
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;

    cardLikeBtn.addEventListener("click", () => {
        cardLikeBtn.classList.toggle("card__like-button_liked");
    });

    cardImageEl.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImageEl.src = data.link;
        previewModalCaptionEl.textContent = data.name;
        previewModalImageEl.alt = data.name;
    });

    cardDeleteBtn.addEventListener("click", () => {
        cardElement.remove(cardDeleteBtn); //DONE
    });
    //TODO set listener on delete button     //DONE
    // The handler should remove card from DOM   //DONE
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
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {
    evt.preventDefault();
    //make image appear when adding card    //DONE
    const inputValues = {
        name: cardNameInput.value,
        link: cardLinkInput.value,
    };
    const cardElement = getCardElement(inputValues);
    //TODO make sure card appear at top of list    //DONE
    cardsList.prepend(cardElement);
    evt.target.reset();
    disabledButton(cardSubmitBtn, settings);
    closeModal(cardModal);
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

cardModalCloseBtn.addEventListener("click", () => {
    closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
    closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
    const cardElement = getCardElement(item);
    cardsList.prepend(cardElement);
});
