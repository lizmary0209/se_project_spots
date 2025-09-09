import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
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

const modals = document.querySelectorAll(".modal");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);

const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");

const editProfileForm = document.forms["edit-profile-form"];
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostForm = newPostModal.querySelector(".modal__form");
const newPostCaption = document.querySelector("#caption-input");
const newPostImageInput = document.querySelector("#card-image-input");

const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

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
    console.log(evt.target);
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

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

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

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
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
    .catch(console.error);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
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
    .catch(console.error);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  api
    .updateAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error);
});

enableValidation(validationConfig);
