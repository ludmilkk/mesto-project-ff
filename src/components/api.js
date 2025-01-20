const config = {
    baseUrl: 'https://nomoreparties.co/v1/cohort-mag-4',
    headers: {
        authorization: '01bd0287-b411-4416-9351-26d4720ce478',
        'Content-Type': 'application/json'
    }
};

const checkResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

const api = {
    getUserInfo() {
        return fetch(`${config.baseUrl}/users/me`, {
            headers: config.headers
        })
            .then(checkResponse);
    },

    getInitialCards() {
        return fetch(`${config.baseUrl}/cards`, {
            headers: config.headers
        })
            .then(checkResponse);
    },

    updateUserInfo({ name, about }) {
        return fetch(`${config.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: config.headers,
            body: JSON.stringify({
                name,
                about
            })
        })
            .then(checkResponse);
    },

    addCard(data) {
        return fetch(`${config.baseUrl}/cards`, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(data)
        })
            .then(checkResponse);
    },

    deleteCard(cardId) {
        return fetch(`${config.baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: config.headers
        })
            .then(checkResponse);
    },

    addLike(cardId) {
        return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: config.headers
        })
            .then(checkResponse);
    },

    removeLike(cardId) {
        return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: config.headers
        })
            .then(checkResponse);
    },

    updateAvatar(data) {
        return fetch(`${config.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: config.headers,
            body: JSON.stringify(data)
        })
            .then(checkResponse);
    }
};

export { api };