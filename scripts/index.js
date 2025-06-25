const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostModalBtn = newPostModal.querySelector("#new-post-modal");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#caption-input");

const profileNameEl = document.querySelector(".profile__name"); 
const profileDescriptionEl = document.querySelector(".profile__description");


editProfileBtn.addEventListener("click", function() {
    editProfileNameInput.value = profileNameEl.textContent;
    editDescriptionInput.value = profileDescriptionEl.textContent;
    editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function() {
editProfileModal.classList.remove("modal_is-opened");
});



newPostBtn.addEventListener("click", function() {
    newPostModal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function() {
    newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
    evt.preventDefault();
    profileNameEl.textContent = editProfileNameInput.value;
    profileDescriptionEl.textContent = editDescriptionInput.value;
    editProfileModal.classList.remove("modal_is-opened");
    console.log("submitting");
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
    evt.preventDefault();
    newPostModalBtn.classList.remove("modal_is-opened");
    console.log("newPostImageInput.value");
    console.log("newPostCaption.value");
    console.log("submitting");
}

newPostBtn.addEventListener("submit", handleNewPostSubmit);








