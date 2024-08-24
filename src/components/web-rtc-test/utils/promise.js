// src/utils/promise.js
export const promise = function(socket) {
    return function request(type, data = {}) {
        return new Promise((resolve, reject) => {
            socket.emit(type, data, (response) => {
                if (response && response.error) {
                    reject(response.error);
                } else {
                    resolve(response);
                }
            });
        });
    };
};