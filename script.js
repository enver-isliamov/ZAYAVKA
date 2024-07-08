        const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs";
        const chatId = "96609347";

        function calculateTotal() {
            const monthlyPrice = document.getElementById('monthlyPrice').value;
            const tireCount = document.getElementById('tireCount').value;
            const totalPrice = monthlyPrice * tireCount;
            document.getElementById('totalPrice').value = totalPrice;
        }

        function generateContractNumber() {
            const currentDate = new Date();
            const year = currentDate.getFullYear().toString().slice(-2);
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hour = String(currentDate.getHours()).padStart(2, '0');
            const contractNumber = `${year}${month}${day}${hour}`;
            return contractNumber;
        }

        function sendToTelegram() {
            const clientName = document.getElementById('clientName').value;
            const phone = document.getElementById('phone').value;
            const order = document.getElementById('order').value;
            const monthlyPrice = document.getElementById('monthlyPrice').value;
            const tireCount = document.getElementById('tireCount').value;
            const hasDisk = document.getElementById('hasDisk').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const reminderDate = document.getElementById('reminderDate').value;
            const storage = document.getElementById('storage').value;
            const sezon = document.getElementById('seZon').value;
            const totalPrice = document.getElementById('totalPrice').value;
            const contractNumber = document.getElementById('contractNumber').value;
            const trafficSource = document.getElementById('trafficSource').value;

            const message = `
❱❱❱❱❱ ✅ КЛИЕНТ ✅ ❰❰❰❰❰

${clientName} ${phone}
🛞: ${tireCount}шт.❱❱${hasDisk} ❱❱ [${sezon}]
Марка:❱❱ ${order}


🗓Хранение: ❱${startDate} ➽ ${endDate}
---------------
💳 Сумма заказа: ${totalPrice} [${monthlyPrice}мес.]
☎️ Напоминание об окончании скрока: ${reminderDate} 📞
---------------
Договор: ${contractNumber} | Склад: ${storage}
Источник трафика: ${trafficSource}
            `;

            fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert('Данные успешно отправлены в Telegram!');
                } else {
                    alert('Ошибка при отправке данных в Telegram.');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке данных в Telegram.');
            });

            // Отправка копии на номер телефона
            const phoneNumber = document.getElementById('phone').value;
            const smsMessage = `
Уважаемый ${clientName}, Ваши данные были отправлены в Telegram:
Заказ: ${order}
Цена за месяц: ${monthlyPrice}
Кол-во шин: ${tireCount}
Сумма заказа: ${totalPrice}
`;
            // Здесь нужно реализовать логику отправки SMS-сообщения на указанный номер
            console.log(`SMS-сообщение отправлено на номер ${phoneNumber}: ${smsMessage}`);
        }

        // Генерируем номер договора при загрузке страницы
        document.getElementById('contractNumber').value = generateContractNumber();
