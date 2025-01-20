const cardTemplate = document.querySelector('#card-template').content;

const createCard = (data, handleDeleteClick, handleLikeClick, handleImageClick, userId) => {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCounter = cardElement.querySelector('.card__like-counter');

    likeCounter.textContent = data.likes.length;
    likeButton.after(likeCounter);

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;

    if (data.likes.some(user => user._id === userId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    if (data.owner._id === userId) {
        deleteButton.addEventListener('click', () => handleDeleteClick(data._id, cardElement));
    } else {
        deleteButton.remove();
    }

    cardImage.addEventListener('click', () => handleImageClick(data.name, data.link));
    likeButton.addEventListener('click', () => handleLikeClick(data._id, likeButton, likeCounter));

    return cardElement;
}

export { createCard };