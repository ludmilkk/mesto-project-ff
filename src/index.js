import './pages/index.css';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { api } from './components/api.js';

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'form__input-error'
};

const cardsList = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');
const deleteCardPopup = document.querySelector('.popup_type_delete-card');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const profileForm = editProfilePopup.querySelector('.popup__form');
const cardForm = addCardPopup.querySelector('.popup__form');
const avatarForm = avatarPopup.querySelector('.popup__form');
const deleteForm = deleteCardPopup.querySelector('.popup__form');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');
const placeNameInput = cardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = cardForm.querySelector('.popup__input_type_url');
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_url');

let userId;

const handleImageClick = (name, link) => {
    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;
    openModal(imagePopup);
}

const handleLikeClick = (cardId, likeButton) => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const likeCounter = likeButton.closest('.card__like-container').querySelector('.card__like-counter');

    if (isLiked) {
        api.removeLike(cardId)
            .then((card) => {
                likeButton.classList.remove('card__like-button_is-active');
                likeCounter.textContent = card.likes.length;
            })
            .catch((err) => console.log('Ошибка при снятии лайка:', err));
    } else {
        api.addLike(cardId)
            .then((card) => {
                likeButton.classList.add('card__like-button_is-active');
                likeCounter.textContent = card.likes.length;
            })
            .catch((err) => console.log('Ошибка при добавлении лайка:', err));
    }
}

const handleDeleteClick = (cardId, cardElement) => {
    const handleSubmit = (evt) => {
        evt.preventDefault();
        const submitButton = deleteForm.querySelector('.popup__button');
        submitButton.textContent = 'Удаление...';

        api.deleteCard(cardId)
            .then(() => {
                cardElement.remove();
                closeModal(deleteCardPopup);
            })
            .catch((err) => console.log('Ошибка при удалении карточки:', err))
            .finally(() => {
                submitButton.textContent = 'Да';
                deleteForm.removeEventListener('submit', handleSubmit);
            });
    };

    deleteForm.addEventListener('submit', handleSubmit);
    openModal(deleteCardPopup);
}

const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();

    const nameIsValid = nameInput.validity.valid;
    const jobIsValid = jobInput.validity.valid;

    if (!nameIsValid || !jobIsValid) {
        return;
    }

    const submitButton = profileForm.querySelector('.popup__button');
    submitButton.textContent = 'Сохранение...';

    api.updateUserInfo({
        name: nameInput.value,
        about: jobInput.value
    })
        .then((data) => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            closeModal(editProfilePopup);
        })
        .catch((err) => {
            console.log('Ошибка при обновлении профиля:', err);
        })
        .finally(() => {
            submitButton.textContent = 'Сохранить';
        });
}

const handleCardFormSubmit = (evt) => {
    evt.preventDefault();
    const submitButton = cardForm.querySelector('.popup__button');
    submitButton.textContent = 'Создание...';

    api.addCard({
        name: placeNameInput.value,
        link: placeLinkInput.value
    })
        .then((cardData) => {
            const cardElement = createCard(cardData, handleDeleteClick, handleLikeClick, handleImageClick, userId);
            cardsList.prepend(cardElement);
            closeModal(addCardPopup);
            cardForm.reset();
            clearValidation(cardForm, validationConfig);
        })
        .catch((err) => console.log('Ошибка при добавлении карточки:', err))
        .finally(() => {
            submitButton.textContent = 'Создать';
        });
}

const handleAvatarFormSubmit = (evt) => {
    evt.preventDefault();
    const submitButton = avatarForm.querySelector('.popup__button');
    submitButton.textContent = 'Сохранение...';

    api.updateAvatar({ avatar: avatarLinkInput.value })
        .then((data) => {
            profileImage.style.backgroundImage = `url(${data.avatar})`;
            closeModal(avatarPopup);
            avatarForm.reset();
            clearValidation(avatarForm, validationConfig);
        })
        .catch((err) => console.log('Ошибка при обновлении аватара:', err))
        .finally(() => {
            submitButton.textContent = 'Сохранить';
        });
}

const openEditProfilePopup = () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;

    clearValidation(profileForm, validationConfig);

    const submitButton = profileForm.querySelector('.popup__button');
    submitButton.disabled = false;
    submitButton.classList.remove('popup__button_disabled');

    openModal(editProfilePopup);
}

const openAddCardPopup = () => {
    cardForm.reset();
    clearValidation(cardForm, validationConfig);
    openModal(addCardPopup);
}

const openAvatarPopup = () => {
    avatarForm.reset();
    clearValidation(avatarForm, validationConfig);
    openModal(avatarPopup);
}

profileEditButton.addEventListener('click', openEditProfilePopup);
addCardButton.addEventListener('click', openAddCardPopup);
profileImage.addEventListener('click', openAvatarPopup);
profileForm.addEventListener('submit', handleProfileFormSubmit);
cardForm.addEventListener('submit', handleCardFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

enableValidation(validationConfig);

Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
        userId = userData._id;
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        profileImage.style.backgroundImage = `url(${userData.avatar})`;

        cards.forEach((cardData) => {
            const cardElement = createCard(cardData, handleDeleteClick, handleLikeClick, handleImageClick, userId);
            cardsList.append(cardElement);
        });
    })
    .catch((err) => console.log('Ошибка при загрузке начальных данных:', err));