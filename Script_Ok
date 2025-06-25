// --- КОНСТАНТЫ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ ---
const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs";
const chatId = "96609347";

let baseMonthlyPriceStorage = 0; // Базовая месячная цена хранения, до учета дисков

// --- ФУНКЦИЯ ГЕНЕРАЦИИ НОМЕРА ДОГОВОРА ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ ---
function generateContractNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2); // Последние две цифры года
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Месяц (01-12)
    const day = String(currentDate.getDate()).padStart(2, '0'); // День (01-31)
    const hour = String(currentDate.getHours()).padStart(2, '0'); // Час (00-23)
    const minute = String(currentDate.getMinutes()).padStart(2, '0'); // Минута (00-59)
    return `${year}.${month}.${day}-${hour}${minute}`; // Формат: ГГ.ММ.ДД-ЧЧММ
}

// --- ФУНКЦИЯ ДЛЯ ВСЕХ РАСЧЕТОВ (ВОССТАНОВЛЕНА ИЗ ОРИГИНАЛА) ---
function updateCalculations(eventSource) {
    // Получение ссылок на необходимые поля ввода
    const monthlyPriceInput = document.getElementById('monthlyPrice');
    const storageDuration = parseInt(document.getElementById('storage').value) || 0; // Срок хранения в месяцах
    const tireCount = parseInt(document.getElementById('tireCount').value) || 0; // Количество шин
    const hasDisk = document.getElementById('hasDisk').value; // Наличие дисков ('Да'/'Нет')
    const startDateInput = document.getElementById('startDate'); // Дата начала хранения
    const endDateInput = document.getElementById('endDate'); // Дата окончания хранения
    const reminderDateInput = document.getElementById('reminderDate'); // Дата напоминания

    const startDate = new Date(startDateInput.value); // Преобразование даты начала в объект Date

    // Логика обновления цены "За месяц" с учетом дисков
    // Если изменение вызвано полем "За месяц", обновляем базовую цену хранения.
    if (eventSource === 'monthlyPriceInput') {
        baseMonthlyPriceStorage = parseFloat(monthlyPriceInput.value) || 0;
    }

    let effectiveMonthlyPrice = baseMonthlyPriceStorage;
    // Если есть диски, добавляем 100 к месячной цене
    if (hasDisk === 'Да') {
        effectiveMonthlyPrice += 100;
    }

    // Обновляем поле "За месяц", если изменение не было инициировано самим полем "За месяц"
    if (eventSource !== 'monthlyPriceInput') {
        monthlyPriceInput.value = effectiveMonthlyPrice;
    }

    // Расчет даты окончания и даты напоминания
    let currentEndDate;
    // Если дата начала и срок хранения указаны
    if (startDateInput.value && storageDuration > 0) {
        const calculatedEndDate = new Date(startDate);
        calculatedEndDate.setMonth(startDate.getMonth() + storageDuration); // Прибавляем месяцы

        // Если поле "Окончание" пустое ИЛИ изменение вызвано "Началом" / "Сроком хранения",
        // то обновляем поле "Окончание" автоматически.
        if (!endDateInput.value || eventSource === 'startDate' || eventSource === 'storage') {
            endDateInput.value = calculatedEndDate.toISOString().split('T')[0]; // Устанавливаем рассчитанную дату
        }
    }
    
    // Используем значение из поля "Окончание" (автоматическое или вручную введенное)
    // для расчета даты напоминания.
    currentEndDate = new Date(endDateInput.value);

    // Если дата окончания валидна, рассчитываем дату напоминания (за 7 дней до окончания)
    if (currentEndDate && !isNaN(currentEndDate.getTime())) {
        const reminderDate = new Date(currentEndDate);
        reminderDate.setDate(currentEndDate.getDate() - 7); // Вычитаем 7 дней
        reminderDateInput.value = reminderDate.toISOString().split('T')[0]; // Устанавливаем дату напоминания
    } else {
        reminderDateInput.value = ''; // Очищаем, если дата окончания невалидна
    }

    // Расчет общей суммы
    const tireSets = Math.ceil(tireCount / 4); // Количество комплектов шин (округляем в большую сторону)
    const totalPrice = effectiveMonthlyPrice * storageDuration * tireSets; // Общая сумма

    // Обновляем поле "Общая сумма"
    document.getElementById('totalPrice').value = Math.round(totalPrice);

    // Контрактный номер обновляется напрямую при любом изменении
    document.getElementById('contractNumber').value = generateContractNumber();
}


// --- ФУНКЦИЯ ОТПРАВКИ ТЕКСТОВОГО СООБЩЕНИЯ В TELEGRAM (ОБНОВЛЕНА) ---
function sendToTelegram() {
    // --- 1. Сбор данных из полей формы ---
    // Данные клиента
    const clientName = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    // Ищем поле адреса по placeholder'у, так как у него нет ID
    const address = document.querySelector('.user-info input[placeholder="Улица, №-дома "]').value.trim();

    // Детали услуги
    const carNumber = document.getElementById('car-number-input').value.trim(); // Номер Авто
    const tireCount = document.getElementById('tireCount').value.trim();
    const hasDisk = document.getElementById('hasDisk').value.trim();
    const sezon = document.getElementById('seZon').value.trim();
    const orderCode = document.getElementById('order').value.trim(); // Код склада/заказа
    // Ищем поле ячейки по placeholder'у, так как у него нет ID
    const cellCode = document.querySelector('.tag.tag-location input[placeholder="E-45"]').value.trim();
    const additionalNotes = document.getElementById('qrContent').value.trim(); // Содержание QR/дополнительные заметки

    // Финансовая информация и даты
    const storageDuration = document.getElementById('storage').value.trim(); // Срок хранения
    const monthlyPrice = document.getElementById('monthlyPrice').value.trim();
    const totalPrice = document.getElementById('totalPrice').value.trim();
    // Ищем поле долга по классу, так как у него нет ID
    const debt = document.querySelector('.info-row .value.debt .editable').value.trim();
    const contractNumber = document.getElementById('contractNumber').value.trim();
    const trafficSource = document.getElementById('trafficSource').value.trim(); // Источник трафика

    // Даты для форматирования
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reminderDate = document.getElementById('reminderDate').value;

    // Форматирование дат для читабельного вывода
    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('ru-RU') : 'Не указана';
    const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('ru-RU') : 'Не указана';
    const formattedReminderDate = reminderDate ? new Date(reminderDate).toLocaleDateString('ru-RU') : 'Не указана';

    // --- 2. Формирование сообщения для Telegram ---
    let message = `
❱❱❱❱❱ ✅ КЛИЕНТ Otelshin.tu ✅ ❰❰❰❰❰
------------------------------------------
<b> ${clientName || 'Не указано'} </b>
📞 ${phone || 'Не указан'}
🚗 Номер Авто:<b>  ${carNumber || 'Не указан'}</b>
📍 <b>Адрес:</b> <code> ${address || 'Не указан'} </code>
--- ---- ---- ---- ------ ---- ---- ---- ---
-    -    -     <b>ДЕТЕЛИ УСЛУГИ</b>    -    -    -
--- ---- ---- ---- ------ ---- ---- ---- ---
<blockquote>⭕️ ${additionalNotes || 'Нет дополнительных заметок.'}
Кол-во шин: <b>${tireCount || '0'} шт.</b> Сезон: <b>${sezon || 'Не указан'}</b> 
🛞 <b>Диски:</b> ${hasDisk || 'Нет'} </blockquote>
--- ---- ---- ---- ------ ---- ---- ---- ---
<blockquote>📦 <b>Склад:</b> ${orderCode || 'Не указан'}
⚡️ Хранение: <b>${storageDuration || '0'} мес.</b> ❱ ${formattedStartDate} ➽ ${formattedEndDate}
🔔 Напоминание об окончании срока:<b> ${formattedReminderDate}</b></blockquote>
--- ---- ---- ---- ------ ---- ---- ---- ---
<blockquote>💳Сумма заказа: <b>${totalPrice || '0'} ₽</b> [${monthlyPrice || '0'} ₽/мес.]
🚨 <b>Долг:</b> ${debt || '0'} ₽</blockquote>
------------------------------------------
🌐 <i>Источник:</i> <span class="tg-spoiler"> ${trafficSource || 'Не указан'} </span>
❱❱❱ Договор: <b>${contractNumber || 'Не сгенерирован'}</b> <a href="https://otelshin.ru">на сайте</a> ❰❰❰
    `;

    // Отправляем сообщение в Telegram (только текст)
    sendMessageToTelegram(message);
}

// --- НОВАЯ ФУНКЦИЯ: ОТПРАВКА ТЕКСТОВОГО СООБЩЕНИЯ В TELEGRAM API ---
function sendMessageToTelegram(message) {
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const params = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML' // Использование HTML-разметки для жирного текста (<b>)
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('Заказ успешно отправлен в Telegram!');
            // Очистка полей формы после успешной отправки (опционально)
            // document.getElementById('clientName').value = '';
            // и т.д.
        } else {
            alert('Ошибка при отправке заказа в Telegram: ' + data.description);
            console.error('Telegram API error:', data.description);
        }
    })
    .catch(error => {
        console.error('Ошибка отправки в Telegram:', error);
        alert('Произошла ошибка при отправке заказа в Telegram. Проверьте консоль для деталей.');
    });
}

// --- БЛОК ИНИЦИАЛИЗАЦИИ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
window.onload = () => {
    // Инициализация маски для номера телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00'
        });
    }

    // Установка текущей даты в поле "Начало" при загрузке страницы
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('startDate').value = formattedDate;

    // Инициализация базовой месячной цены хранения
    baseMonthlyPriceStorage = parseFloat(document.getElementById('monthlyPrice').value) || 0;

    // Список элементов, изменения в которых должны вызывать пересчет
    const calculationInputs = [
        document.getElementById('storage'),
        document.getElementById('tireCount'),
        document.getElementById('hasDisk'),
        document.getElementById('startDate'),
        document.getElementById('endDate') // Добавляем endDate, т.к. его изменение влияет на reminderDate
    ];

    // Добавление слушателей событий для автоматического пересчета
    calculationInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => updateCalculations(e.target.id));
            input.addEventListener('change', (e) => updateCalculations(e.target.id));
        }
    });

    // Отдельный слушатель для поля "За месяц", чтобы оно могло быть источником базовой цены
    const monthlyPriceInput = document.getElementById('monthlyPrice');
    if (monthlyPriceInput) {
        monthlyPriceInput.addEventListener('input', () => updateCalculations('monthlyPriceInput'));
    }
   
    // Первоначальный расчет при загрузке страницы
    updateCalculations('init');

    // Привязка функции sendToTelegram к кнопке "Оформить"
    const sendButton = document.querySelector('.action-button');
    if(sendButton){
        sendButton.addEventListener('click', sendToTelegram);
    }
};
