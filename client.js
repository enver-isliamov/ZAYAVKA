// !!! ВСТАВЬТЕ СЮДА URL ВАШЕГО РАЗВЕРНУТОГО GOOGLE APPS SCRIPT ВЕБ-ПРИЛОЖЕНИЯ !!!
// Этот URL вы получите после развертывания скрипта как веб-приложения.
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz-_ro4L5M9teLjYn3_Rid866MD0QkdYBW7wT3YIXXvFqHIEU2KEgYiD0zqBXTp4wXoUQ/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');

    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            // Собираем данные из всех полей формы
            const data = {
                chatId: document.getElementById('chatId')?.value || '', // Может быть пустым, если скрыто
                clientName: document.getElementById('clientName')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                carNumber: document.getElementById('carNumber')?.value || '', // id изменено
                qrContent: document.getElementById('qrContent')?.value || '',
                monthlyPrice: document.getElementById('monthlyPrice')?.value || '',
                tireCount: document.getElementById('tireCount')?.value || '',
                hasDisk: document.getElementById('hasDisk')?.value || '',
                startDate: document.getElementById('startDate')?.value || '',
                storageDuration: document.getElementById('storage')?.value || '', // id "storage"
                reminderDate: document.getElementById('reminderDate')?.value || '',
                endDate: document.getElementById('endDate')?.value || '',
                storageLocation: document.getElementById('storageLocation')?.value || '', // id изменено
                cellCode: document.getElementById('cellCode')?.value || '', // Добавлен id
                totalPrice: document.getElementById('totalPrice')?.value || '',
                debt: document.getElementById('debt')?.value || '', // Добавлен id
                contractNumber: document.getElementById('contractNumber')?.value || '',
                address: document.getElementById('address')?.value || '', // Добавлен id
                dealStatus: document.getElementById('dealStatus')?.value || 'Новый', // Может быть пустым, если скрыто
                trafficSource: document.getElementById('trafficSource')?.value || ''
            };

            console.log('Отправляемые данные:', data);

            try {
                const response = await fetch(GAS_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Важно для обхода CORS на стороне клиента. Google Apps Script справится с этим.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // Поскольку 'no-cors' не позволяет читать ответ, мы можем только проверить, что запрос был отправлен.
                // Для получения ответа от сервера (success/error) потребуется настройка CORS на стороне Apps Script,
                // но для GitHub Pages это обычно не требуется, достаточно просто отправить данные.
                console.log('Запрос отправлен. Проверьте логи Apps Script для подтверждения.');
                alert('Заявка успешно отправлена! Проверьте Google Таблицу.');
                // Опционально: очистить форму после успешной отправки
                // resetForm(); 

            } catch (error) {
                console.error('Ошибка при отправке данных:', error);
                alert('Произошла ошибка при отправке заявки: ' + error.message);
            }
        });
    }

    // Пример функции для очистки формы (можно реализовать по своему усмотрению)
    function resetForm() {
        document.getElementById('clientName').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('address').value = '';
        document.getElementById('carNumber').value = '';
        document.getElementById('qrContent').value = '';
        document.getElementById('monthlyPrice').value = '600'; // Возвращаем к дефолту
        document.getElementById('tireCount').value = '4';     // Возвращаем к дефолту
        document.getElementById('hasDisk').value = 'Нет';     // Возвращаем к дефолту
        document.getElementById('startDate').value = new Date().toISOString().slice(0,10); // Текущая дата
        document.getElementById('storage').value = '4';       // Возвращаем к дефолту
        document.getElementById('reminderDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('storageLocation').value = 'ABD13'; // Возвращаем к дефолту
        document.getElementById('cellCode').value = '';
        document.getElementById('totalPrice').value = '';
        document.getElementById('debt').value = '0';
        document.getElementById('contractNumber').value = '';
        document.getElementById('trafficSource').value = '';
        // Скрытые поля можно не сбрасывать, если они заполняются динамически
        // document.getElementById('chatId').value = ''; 
        // document.getElementById('dealStatus').value = 'Новый';
    }

    // Если у вас есть скрипт для масок (imask), он должен быть подключен раньше client.js
    // Например, для телефона:
    const phoneInput = document.getElementById('phone');
    if (phoneInput && typeof IMask !== 'undefined') {
        IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00'
        });
    }

    // Обновление total price при изменении monthlyPrice или storageDuration
    const monthlyPriceInput = document.getElementById('monthlyPrice');
    const storageDurationInput = document.getElementById('storage');
    const totalPriceInput = document.getElementById('totalPrice');

    function calculateTotalPrice() {
        const monthly = parseFloat(monthlyPriceInput.value) || 0;
        const duration = parseFloat(storageDurationInput.value) || 0;
        const total = monthly * duration;
        totalPriceInput.value = total.toFixed(0); // Округление до целых, если нужно
    }

    if (monthlyPriceInput) monthlyPriceInput.addEventListener('input', calculateTotalPrice);
    if (storageDurationInput) storageDurationInput.addEventListener('input', calculateTotalPrice);
    
    // Вызвать при загрузке, чтобы установить начальное значение
    calculateTotalPrice();

    // Добавляем автоматическое заполнение даты начала на текущую дату при загрузке
    const startDateInput = document.getElementById('startDate');
    if (startDateInput && !startDateInput.value) {
        startDateInput.value = new Date().toISOString().slice(0, 10);
    }
});
