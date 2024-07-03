function sendToTelegram() {
            const phoneNumber = "+79780703665"; // здесь можно вставить номер телефона клиента
            const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs";
            const chatId = "96609347";
            const message = `
                Имя клиента: Денис Грошев
                Телефон: ${phoneNumber}
                Заказ: ❱ Pirelli Scorpion ➽ 255/55/R16 ➽ Зима ➽ без дисков
                Цена за месяц: 600
                Кол-во шин: 4
                Наличие дисков: Без дисков
                Начало: 29.06.2024
                Напомнить: 22.08.2024
                Окончание: 29.08.2024
                Склад хранения: ABD13
                Сумма заказа: 1200
                Долг: -
                Договор: 240629
                Статус: Активный
                Источник трафика: ❰AVITO❱
            `;
            const encodedMessage = encodeURIComponent(message);
            const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}`;
            
            fetch(telegramUrl)
                .then(response => response.json())
                .then(data => {
                    alert('Данные успешно отправлены в Telegram!');
                })
                .catch(error => {
                    console.error('Ошибка при отправке данных в Telegram:', error);
                    alert('Произошла ошибка при отправке данных в Telegram.');
                });
        }
    
