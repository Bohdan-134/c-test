function saveLocalStorage(row) {
    try {
        const historyData = JSON.parse(localStorage.getItem('history')) || [];

        historyData.push(row);

        localStorage.setItem('history', JSON.stringify(historyData));

    } catch (error) {
        console.error('Произошла ошибка при парсинге данных', error);
    }
}

function updateLocalStorage(id) {
    try {
        const historyData = JSON.parse(localStorage.getItem('history')) || [];

        const updatedData = historyData.filter(
            (item) => item.id !== id
        );

        localStorage.setItem('history', JSON.stringify(updatedData));

    } catch (error) {
        console.error('Произошла ошибка при парсинге данных', error);
    }
}

export { saveLocalStorage, updateLocalStorage }