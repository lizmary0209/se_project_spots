import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7693afef-dcd9-4d4b-a9c3-9f72d6b208e9",
    "Content-Type": "application/json",
  },
});

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const previewModal = document.querySelector("#preview-modal");
const avatarModal = document.querySelector("#avatar-modal");
const deleteModal = document.querySelector("#delete-modal");
const modals = document.querySelectorAll(".modal");

const editProfileForm = document.forms["edit-profile-form"];
const newPostForm = newPostModal.querySelector(".modal__form");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const deleteForm = deleteModal.querySelector("#modal__delete-form");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__new-post-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const newPostCaption = document.querySelector("#caption-input");
const newPostImageInput = document.querySelector("#card-image-input");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");

const editProfileSubmitBtn = editProfileForm.querySelector(
  'button[type="submit"]'
);
const newPostSubmitBtn = newPostForm.querySelector('button[type="submit"]');
const avatarSubmitBtn = avatarForm.querySelector('button[type="submit"]');
const deleteSubmitBtn = deleteForm.querySelector('button[type="submit"]');

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarModalDeleteBtn = deleteModal.querySelector(
  ".modal__delete_close-btn"
);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard = null;
let selectedCardId = null;

function handleCardDelete(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

const cancelBtn = deleteModal.querySelector(".modal__cancel-btn");

cancelBtn.addEventListener("click", () => {
  selectedCard = null;
  selectedCardId = null;
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (!selectedCardId) return;

  setButtonText(deleteSubmitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard({ id: selectedCardId })
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSubmitBtn, false, "Delete", "Deleting...");
    });
});

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) closeModal(openModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (
      evt.target === modal ||
      evt.target.classList.contains("modal__close-btn") ||
      evt.target.classList.contains("modal__close_type_preview")
    ) {
      closeModal(modal);
    }
  });
});

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) cardLikeBtnEl.classList.add("card__like-btn_active");

  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");
    if (!isLiked) {
      api
        .addLike(data._id)
        .then(() => cardLikeBtnEl.classList.add("card__like-btn_active"))
        .catch(console.error);
    } else {
      api
        .removeLike(data._id)
        .then(() => cardLikeBtnEl.classList.remove("card__like-btn_active"))
        .catch(console.error);
    }
  });

  cardDeleteBtnEl.addEventListener("click", () =>
    handleCardDelete(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    const previewImageEl = previewModal.querySelector(".modal__image");
    const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
    cards.forEach((item) => renderCard(item, "append"));
  })
  .catch(console.error);

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});
newPostBtn.addEventListener("click", () => openModal(newPostModal));
avatarModalBtn.addEventListener("click", () => openModal(avatarModal));

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal)
);
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));
avatarModalDeleteBtn.addEventListener("click", () => closeModal(deleteModal));

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  const cardData = {
    name: newPostCaption.value,
    link: newPostImageInput.value,
  };

  api
    .addNewCard(cardData)
    .then((newCard) => {
      renderCard(newCard, "prepend");
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .updateAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(submitBtn, false));
});

enableValidation(validationConfig);
