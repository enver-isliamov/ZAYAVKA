document.getElementById('submitBtn').addEventListener('click', function() {
    // Собираем данные с редактируемых полей
    let clientName = document.querySelector('.client-name').textContent.trim();
    let phone = document.querySelector('p:nth-child(2) span').textContent.trim();
    let order = document.querySelector('p:nth-child(3) span').textContent.trim();
    let price = document.querySelector('p:nth-child(4) span').textContent.trim();
    let quantity = document.querySelector('p:nth-child(5) span').textContent.trim();
    let availability = document.querySelector('p:nth-child(6) span').textContent.trim();
    let startDate = document.querySelector('p:nth-child(7) span').textContent.trim();
    let duration = document.querySelector('p:nth-child(8) span').textContent.trim();
    let remindDate = document.querySelector('p:nth-child(9) span').textContent.trim();
    let endDate = document.querySelector('p:nth-child(10) span').textContent.trim();
    let storage = document.querySelector('p:nth-child(11) span').textContent.trim();
    let cell = document.querySelector('p:nth-child(12) span').textContent.trim();
    let orderAmount = document.querySelector('p:nth-child(13) span').textContent.trim();
    let debt = document.querySelector('p:nth-child(14) span').textContent.trim();
    let contract = document.querySelector('p:nth-child(15) span').textContent.trim();
    let trafficSource = document.querySelector('p:nth-child(16) span').textContent.trim();
    
    // Формируем сообщение для отправки в Telegram
    let message = `
    Имя клиента: ${clientName}
    Телефон: ${phone}
    Заказ: ${order}
    Цена за месяц: ${price} руб.
    Количество шин: ${quantity}
    Наличие дисков: ${availability}
    Начало: ${startDate}
    Срок: ${duration} месяца
    Напомнить: ${remindDate}
    Окончание: ${endDate}
    Склад хранения: ${storage}
    Ячейка: ${cell}
    Сумма заказа: ${orderAmount} руб.
    Долг: ${debt}
    Договор: ${contract}
    Источник трафика: ${trafficSource}
    `;

    // Отправка данных в Telegram бота
    fetch(`https://api.telegram.org/bot<7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs>/sendMessage?chat_id=<96609347>&text=${encodeURIComponent(message)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка отправки данных в Telegram');
            }
            alert('Данные успешно отправлены в Telegram!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных в Telegram.');
        });
});
