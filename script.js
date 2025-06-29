// --- КОНСТАНТЫ ПРОЕКТА ---
// Токен @KopchekBot Telegram бота. В реальных проектах это должно храниться на сервере, а не в клиенте.
const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs"; 
// ID чата Telegram, куда будут отправляться сообщения.
const chatId = "96609347";
// Ссылка на скрипт развернтываание которое записывает в таблицу 
const googleSheetsWebAppURL = 'https://script.google.com/macros/s/AKfycbz-_ro4L5M9teLjYn3_Rid866MD0QkdYBW7wT3YIXXvFqHIEU2KEgYiD0zqBXTp4wXoUQ/exec'; 
// URL веб-приложения Google Apps Script, которое обрабатывает запись в Google Таблицу.
// ОЧЕНЬ ВАЖНО: Замените этот плейсхолдер на фактический URL, полученный после развертывания Apps Script.
// Пример: 'https://script.google.com/macros/s/AKfycbzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/exec';
const googleSheetsWebAppURL = 'https://script.google.com/macros/s/AKfycbyQKiWT_9Gny27UMex3zFZvP-LHOOnIY_FAYlfP49KcjRX0pXXnL_U7VYiWCCRaHzBctQ/exec'; 

// Базовая месячная цена хранения, до учета дисков. Инициализируется при загрузке страницы.
let baseMonthlyPriceStorage = 0; 

// --- ФУНКЦИЯ ГЕНЕРАЦИИ НОМЕРА ДОГОВОРА ---
// Генерирует уникальный номер договора на основе текущей даты и времени.
function generateContractNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2); // Последние две цифры года (например, 24)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Месяц (01-12)
    const day = String(currentDate.getDate()).padStart(2, '0'); // День (01-31)
    const hour = String(currentDate.getHours()).padStart(2, '0'); // Час (00-23)
    const minute = String(currentDate.getMinutes()).padStart(2, '0'); // Минута (00-59)
    return `${year}.${month}.${day}-${hour}${minute}`; // Формат: ГГ.ММ.ДД-ЧЧММ
}

// --- ФУНКЦИЯ ДЛЯ ВСЕХ РАСЧЕТОВ ---
// Обновляет все зависимые поля формы (цены, даты, общая сумма) при изменении входных данных.
// eventSource: ID элемента, который вызвал обновление, или 'init' для первоначального вызова.
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
    // Это позволяет пользователю вручную задать базовую цену.
    if (eventSource === 'monthlyPriceInput') {
        baseMonthlyPriceStorage = parseFloat(monthlyPriceInput.value) || 0;
    }

    let effectiveMonthlyPrice = baseMonthlyPriceStorage;
    // Если выбрано "Да" для дисков, добавляем 100 к месячной цене.
    if (hasDisk === 'Да') {
        effectiveMonthlyPrice += 100;
    }

    // Обновляем поле "За месяц", если изменение не было инициировано самим полем "За месяц".
    // Это предотвращает бесконечный цикл обновления и позволяет "monthlyPriceInput" быть источником.
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
        // то обновляем поле "Окончание" автоматически. Это позволяет пользователю вручную переопределить дату окончания.
        if (!endDateInput.value || eventSource === 'startDate' || eventSource === 'storage') {
            endDateInput.value = calculatedEndDate.toISOString().split('T')[0]; // Устанавливаем рассчитанную дату (YYYY-MM-DD)
        }
    }
    
    // Используем значение из поля "Окончание" (автоматическое или вручную введенное)
    // для расчета даты напоминания.
    currentEndDate = new Date(endDateInput.value);

    // Если дата окончания валидна, рассчитываем дату напоминания (за 7 дней до окончания)
    if (currentEndDate && !isNaN(currentEndDate.getTime())) {
        const reminderDate = new Date(currentEndDate);
        reminderDate.setDate(currentEndDate.getDate() - 7); // Вычитаем 7 дней
        reminderDateInput.value = reminderDate.toISOString().split('T')[0]; // Устанавливаем дату напоминания (YYYY-MM-DD)
    } else {
        reminderDateInput.value = ''; // Очищаем, если дата окончания невалидна
    }

    // Расчет общей суммы
    const tireSets = Math.ceil(tireCount / 4); // Количество комплектов шин (округляем в большую сторону, 4 шины = 1 комплект)
    const totalPrice = effectiveMonthlyPrice * storageDuration * tireSets; // Общая сумма
    
    // Обновляем поле "Общая сумма" (округляем до целого)
    document.getElementById('totalPrice').value = Math.round(totalPrice);

    // Контрактный номер обновляется напрямую при любом изменении, чтобы всегда быть актуальным.
    document.getElementById('contractNumber').value = generateContractNumber();
}

// --- НОВАЯ ФУНКЦИЯ: СБОР ВСЕХ ДАННЫХ ИЗ ФОРМЫ В ЕДИНЫЙ ОБЪЕКТ ---
// Эта функция собирает все необходимые данные из полей формы и возвращает их в виде объекта.
// Это позволяет избежать дублирования кода при отправке данных в разные системы (Telegram, Google Sheets).
function collectFormData() {
    // Данные клиента
    const clientName = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    // Ищем поле адреса по placeholder'у, так как у него нет ID.
    // Используем опциональную цепочку (?.) и значение по умолчанию (''), чтобы избежать ошибок, если элемент не найден.
    const address = document.querySelector('.user-info input[placeholder="Улица, №-дома "]')?.value.trim() || ''; 

    // Детали услуги
    const carNumber = document.getElementById('car-number-input').value.trim();
    const tireCount = document.getElementById('tireCount').value.trim();
    const hasDisk = document.getElementById('hasDisk').value.trim();
    const sezon = document.getElementById('seZon').value.trim();
    const orderCode = document.getElementById('order').value.trim(); // Код склада/заказа
    // Ищем поле ячейки по placeholder'у, так как у него нет ID.
    const cellCode = document.querySelector('.tag.tag-location input[placeholder="E-45"]')?.value.trim() || '';
    const additionalNotes = document.getElementById('qrContent').value.trim(); // Содержание QR/дополнительные заметки

    // Финансовая информация и даты
    const storageDuration = document.getElementById('storage').value.trim(); // Срок хранения
    const monthlyPrice = document.getElementById('monthlyPrice').value.trim();
    const totalPrice = document.getElementById('totalPrice').value.trim();
    // Ищем поле долга по классу, так как у него нет ID.
    const debt = document.querySelector('.info-row .value.debt .editable')?.value.trim() || '0'; // Значение по умолчанию '0'
    const contractNumber = document.getElementById('contractNumber').value.trim();
    const trafficSource = document.getElementById('trafficSource').value.trim(); // Источник трафика

    // Даты в сыром формате YYYY-MM-DD (для отправки в Google Sheets, где они будут правильно интерпретированы)
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reminderDate = document.getElementById('reminderDate').value;

    // Форматирование дат для читабельного вывода в Telegram (DD.MM.YYYY)
    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString('ru-RU') : 'Не указана';
    const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('ru-RU') : 'Не указана';
    const formattedReminderDate = reminderDate ? new Date(reminderDate).toLocaleDateString('ru-RU') : 'Не указана';

    // Возвращаем объект со всеми собранными данными
    return {
        clientName, phone, address, carNumber, tireCount, hasDisk, sezon, orderCode, cellCode,
        additionalNotes, storageDuration, monthlyPrice, totalPrice, debt, contractNumber, trafficSource,
        startDate, endDate, reminderDate, // Сырые даты
        formattedStartDate, formattedEndDate, formattedReminderDate // Форматированные даты
    };
}


// --- ФУНКЦИЯ ОТПРАВКИ ТЕКСТОВОГО СООБЩЕНИЯ В TELEGRAM И GOOGLE SHEETS ---
// Эта функция теперь служит координатором: она собирает данные, отправляет их в Telegram,
// а затем вызывает функцию для отправки в Google Таблицу.
function sendToTelegram() {
    // 1. Сбор всех данных из полей формы с помощью вспомогательной функции.
    const data = collectFormData(); 

    // 2. Формирование сообщения для Telegram
    // Используем собранные данные из объекта 'data' для создания сообщения.
    let message = `
❱❱❱❱❱ ✅ КЛИЕНТ Otelshin.tu ✅ ❰❰❰❰❰
------------------------------------------
<b> ${data.clientName || 'Не указано'} </b>
📞 ${data.phone || 'Не указан'}
🚗 Номер Авто:<b>  ${data.carNumber || 'Не указан'}</b>
📍 <b>Адрес:</b> <code> ${data.address || 'Не указан'} </code>
--- ---- ---- ---- ------ ---- ---- ---- ---
-    -    -     <b>ДЕТЕЛИ УСЛУГИ</b>    -    -    -
--- ---- ---- ---- ------ ---- ---- ---- ---
<blockquote>⭕️ ${data.additionalNotes || 'Нет дополнительных заметок.'}
Кол-во шин: <b>${data.tireCount || '0'} шт.</b> Сезон: <b>${data.sezon || 'Не указан'}</b> 
🛞 <b>Диски:</b> ${data.hasDisk || 'Нет'} </blockquote>
--- ---- ---- ---- ------ ---- ---- ---- ---
<blockquote>📦 <b>Склад:</b> ${data.orderCode || 'Не указан'}
⚡️ Хранение: <b>${data.storageDuration || '0'} мес.</b> ❱ ${data.formattedStartDate} ➽ ${data.formattedEndDate}
🔔 Напоминание об окончании срока:<b> ${data.formattedReminderDate}</b></blockquote>
--- ---- ---- ---- ------ ---- ---- ---- ---
<blockquote>💳Сумма заказа: <b>${data.totalPrice || '0'} ₽</b> [${data.monthlyPrice || '0'} ₽/мес.]
🚨 <b>Долг:</b> ${data.debt || '0'} ₽</blockquote>
------------------------------------------
🌐 <i>Источник:</i> <span class="tg-spoiler"> ${data.trafficSource || 'Не указан'} </span>
❱❱❱ Договор: <b>${data.contractNumber || 'Не сгенерирован'}</b> <a href="https://otelshin.ru">на сайте</a> ❰❰❰
    `;

    // 3. Отправка сообщения в Telegram.
    sendMessageToTelegram(message);
    
    // 4. Отправка собранных данных в Google Таблицу.
    sendToGoogleSheets(data);
}

// --- ФУНКЦИЯ ОТПРАВКИ ТЕКСТОВОГО СООБЩЕНИЯ В TELEGRAM API ---
// Отправляет сформированное сообщение в указанный чат Telegram.
function sendMessageToTelegram(message) {
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const params = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML' // Использование HTML-разметки для форматирования текста (жирный, курсив и т.д.)
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
            // Опционально: можно добавить очистку полей формы здесь после успешной отправки
            // Например: document.getElementById('clientName').value = '';
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

// --- НОВАЯ ФУНКЦИЯ: ОТПРАВКА ДАННЫХ В GOOGLE ТАБЛИЦУ ЧЕРЕЗ APPS SCRIPT WEB APP ---
// Принимает объект с данными, собранными из формы, и отправляет его в Google Apps Script.
function sendToGoogleSheets(data) {
    // Проверка, настроен ли URL для Google Sheets Web App.
    if (!googleSheetsWebAppURL || googleSheetsWebAppURL === 'ВСТАВЬТЕ_СЮДА_URL_ИЗ_GOOGLE_APPS_SCRIPT') {
        console.error('Google Apps Script Web App URL не настроен. Данные в таблицу не будут отправлены.');
        alert('Ошибка: URL для Google Таблицы не настроен. Пожалуйста, обратитесь к администратору.');
        return;
    }

    // Подготовка объекта payload для отправки.
    // Ключи в этом объекте должны ТОЧНО совпадать с ключами, которые ожидает функция doPost
    // в вашем Google Apps Script для корректного маппинга данных в столбцы.
    // Даты отправляются в формате YYYY-MM-DD, что Google Таблицы хорошо понимают.
    const payload = {
        clientName: data.clientName,
        phone: data.phone,
        address: data.address,
        carNumber: data.carNumber,
        additionalNotes: data.additionalNotes,
        monthlyPrice: data.monthlyPrice,
        tireCount: data.tireCount,
        hasDisk: data.hasDisk,
        startDate: data.startDate, 
        storageDuration: data.storageDuration,
        reminderDate: data.reminderDate, 
        endDate: data.endDate, 
        orderCode: data.orderCode,
        cellCode: data.cellCode,
        totalPrice: data.totalPrice,
        debt: data.debt,
        contractNumber: data.contractNumber,
        // Поле 'sezon' отсутствует в вашей схеме Google Таблицы, поэтому не включаем его в payload.
        trafficSource: data.trafficSource 
    };

    fetch(googleSheetsWebAppURL, {
        method: 'POST', // Метод POST для отправки данных
        headers: {
            'Content-Type': 'application/json' // Важно: указываем, что тело запроса - это JSON
        },
        body: JSON.stringify(payload) // Преобразуем JavaScript объект в JSON строку
    })
    .then(response => response.json()) // Парсим ответ от Apps Script как JSON
    .then(result => {
        if (result.success) {
            console.log('Данные успешно отправлены в Google Таблицу:', result.message);
            // Можно добавить alert, если хотите визуальное подтверждение на странице
            // alert('Данные успешно отправлены в Google Таблицу!'); 
        } else {
            console.error('Ошибка при отправке данных в Google Таблицу:', result.error);
            alert('Произошла ошибка при отправке данных в Google Таблицу: ' + result.error);
        }
    })
    .catch(error => {
        console.error('Произошла сетевая ошибка при отправке данных в Google Таблицу:', error);
        alert('Произошла сетевая ошибка при отправке данных в Google Таблицу. Проверьте консоль для деталей.');
    });
}


// --- БЛОК ИНИЦИАЛИЗАЦИИ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
// Этот блок кода выполняется один раз, когда вся страница и DOM загружены.
window.onload = () => {
    // Инициализация маски для номера телефона с использованием библиотеки IMask.
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00'
        });
    }

    // Установка текущей даты в поле "Начало" при загрузке страницы по умолчанию.
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    document.getElementById('startDate').value = formattedDate;

    // Инициализация базовой месячной цены хранения из значения, установленного в поле 'monthlyPrice'.
    baseMonthlyPriceStorage = parseFloat(document.getElementById('monthlyPrice').value) || 0;

    // Список элементов, изменения в которых должны вызывать пересчет.
    // Добавление 'endDate' важно, так как его ручное изменение влияет на 'reminderDate'.
    const calculationInputs = [
        document.getElementById('storage'),
        document.getElementById('tireCount'),
        document.getElementById('hasDisk'),
        document.getElementById('startDate'),
        document.getElementById('endDate') 
    ];

    // Добавление слушателей событий ('input' и 'change') для автоматического пересчета.
    // 'input' срабатывает при каждом вводе символа, 'change' - при потере фокуса или выборе из списка.
    calculationInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => updateCalculations(e.target.id));
            input.addEventListener('change', (e) => updateCalculations(e.target.id));
        }
    });

    // Отдельный слушатель для поля "За месяц".
    // Его изменение должно обновлять 'baseMonthlyPriceStorage', что требует специального 'eventSource'.
    const monthlyPriceInput = document.getElementById('monthlyPrice');
    if (monthlyPriceInput) {
        monthlyPriceInput.addEventListener('input', () => updateCalculations('monthlyPriceInput'));
    }
   
    // Первоначальный расчет при загрузке страницы.
    // Это гарантирует, что все поля будут рассчитаны и отображены правильно сразу после загрузки.
    updateCalculations('init');

    // Привязка функции sendToTelegram к кнопке "Оформить" (или любой другой кнопке с классом 'action-button').
    // Теперь эта функция вызывает как отправку в Telegram, так и в Google Таблицу.
    const sendButton = document.querySelector('.action-button');
    if(sendButton){
        sendButton.addEventListener('click', sendToTelegram);
    }
};
