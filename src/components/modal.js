const closeModalEsc = (evt) => {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
};

const closeModal = (popup) => {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeModalEsc);
};

const openModal = (popup) => {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeModalEsc);
};


document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target.classList.contains('popup__close') || evt.target === popup) {
            closeModal(popup);
        }
    });
});

export { openModal, closeModal };