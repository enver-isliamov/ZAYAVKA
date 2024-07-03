function sendToTelegram() {
            const phoneNumber = ${phoneNumber}; // здесь можно вставить номер телефона клиента
            const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs";
            const chatId = "96609347";
            const message = `
                Имя клиента: Денис Грошев
                Телефон: ${phoneNumber}
                Заказ: ❱ Pirelli Scorpion ➽ 255/55/R16 ➽ Зима ➽ без дисков
                
                Начало: 29.06.2024
                Кол-во шин: 4
                Наличие дисков: Без дисков
                Окончание: 29.08.2024
                ---------------
                Цена за месяц: 600
                Сумма заказа: 1200
                ---------------
                Напоминание об окончании скрока: 22.08.2024
                Договор: 240629
                Склад хранения: ABD13
                Долг: -
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
    
