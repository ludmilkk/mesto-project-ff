const handleCardDelete = card => card.remove();

const createCard = (cardData, handleDelete) => {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    const deleteButton = cardElement.querySelector('.card__delete-button');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardImage = cardElement.querySelector('.card__image');

    cardTitle.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.alt || cardData.name;

    deleteButton.addEventListener('click', () => {
        handleDelete(cardElement);
    });

    return cardElement;
}

const renderCards = (cardsArray, cardsContainer) => {
    cardsArray.forEach(cardData => {
        const cardElement = createCard(cardData, handleCardDelete);
        cardsContainer.append(cardElement);
    })
}

const cardsList = document.querySelector('.places__list');
renderCards(initialCards, cardsList);