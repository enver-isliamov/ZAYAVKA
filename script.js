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

// Получаем текущую дату
const today = new Date();
// Форматируем дату в формате YYYY-MM-DD
const formattedDate = today.toISOString().split('T')[0];
// Устанавливаем значение в input
document.getElementById('startDate').value = formattedDate;

//***** ПОДСЧЕТ ДАТ ***** //
function calculateDate() {
    // Получаем выбранное количество месяцев
    const tireCount = parseInt(document.getElementById('tireCount').value);
    // Получаем дату начала
    const startDate = new Date(document.getElementById('startDate').value);
    // Увеличиваем дату начала на количество месяцев
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + tireCount);
    // Устанавливаем значение в поле "Дата окончания"
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];

    // Устанавливаем дату напоминания на 7 дней раньше "Дата окончания"
    const reminderDate = new Date(endDate);
    reminderDate.setDate(endDate.getDate() - 7);
    document.getElementById('reminderDate').value = reminderDate.toISOString().split('T')[0];
}

// Вызываем функцию при загрузке страницы для инициализации значений
window.onload = calculateDate;

// Добавляем обработчик события input для tireCount
document.getElementById('tireCount').addEventListener('input', calculateDate);

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

    // Получаем изображение из canvas
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');

    // Формируем сообщение
    const message = `
❱❱❱❱❱ ✅ КЛИЕНТ Otelshin.tu ✅ ❰❰❰❰❰

${clientName} ${phone}
🛞: ${tireCount}шт.❱❱${hasDisk} ❱❱ [${sezon}]
Марка:❱❱ ${order}

🗓Хранение: ❱${startDate} ➽ ${endDate}
---------------
💳 Сумма заказа: ${totalPrice} [${monthlyPrice}мес.]
☎️ Напоминание об окончании срока: ${reminderDate} 📞
---------------
Договор: ${contractNumber} (на сайте Otelshin.tu) | Склад: ${storage}
Источник трафика: ${trafficSource}
    `;

    // Отправляем изображение с текстом в качестве описания
    sendImageWithCaption(dataURL, message);
}

function sendImageWithCaption(dataURL, caption) {
    // Преобразуем изображение в Blob
    fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'signature.png');
            formData.append('caption', caption); // Добавляем текст в качестве описания

            return fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Изображение с описанием успешно отправлено в Telegram!');
            } else {
                alert('Ошибка при отправке изображения с описанием в Telegram.');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке изображения с описанием в Telegram.');
        });
}

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

// Генерируем номер договора при загрузке страницы
document.getElementById('contractNumber').value = generateContractNumber();

//ПОДПИСЬ ///////////////
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Устанавливаем размеры canvas
canvas.width = document.getElementById('signature-pad').clientWidth;
canvas.height = document.getElementById('signature-pad').clientHeight;

// Настройка стилей рисования
ctx.strokeStyle = "#000"; // Цвет линии
ctx.lineWidth = 2; // Ширина линии

// Начало рисования
function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
}

// Рисование
function draw(e) {
    if (drawing) {
        ctx.lineTo(getX(e), getY(e));
        ctx.stroke();
    }
}

// Окончание рисования
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// Получение координат X
function getX(e) {
    return e.offsetX !== undefined ? e.offsetX : e.touches[0].clientX - canvas.getBoundingClientRect().left;
}

// Получение координат Y
function getY(e) {
    return e.offsetY !== undefined ? e.offsetY : e.touches[0].clientY - canvas.getBoundingClientRect().top;
}

// Обработчики событий мыши
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

// Обработчики событий касания для мобильных устройств
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Очистка canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
//ПОДПИСЬ <-- ///////////////


// --------------------------- ТЕСТОВАЯ ФУНКЦИЯ ОБНОВЛЕНИЕ ДАННЫХ Клиента --------
// Настройки - замените на свои значения
const SPREADSHEET_ID = '1IBBn38ZD-TOgzO9VjYAyKz8mchg_RwWyD6kZ0Lu729A'; // ID вашей Google таблицы
const SHEET_NAME = 'Актуальные клиенты'; // Название листа
const API_KEY = 'AIzaSyCfufjRxEecMLqO8MGsODu1tXYSjmhUHJU'; // API ключ Google
const CLIENT_ID = '613236074236-938866s3a34k53fik0dq6rsiurk36t8h.apps.googleusercontent.com'; // Client ID из Google Cloud Console

// Функция для парсинга данных из сообщения Telegram
function parseOrderData(message) {
    const data = {
        name: message.match(/^[^\n]+/)[0].split(' +')[0],
        phone: message.match(/\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/)[0],
        amount: message.match(/Сумма заказа: (\d+)₽/)[1],
        amountPerMonth: message.match(/\[(\d+)₽\/мес\.\]/)[1],
        quantity: message.match(/🛞: (\d+)шт\./)[1],
        disks: message.match(/❱❱(.+?) ❱❱/)[1],
        season: message.match(/\[(.+?)\]/)[1],
        brand: message.match(/Марка:❱❱ (.+?) ·/)[1],
        size: message.match(/· (.+?) ·/)[1],
        condition: message.match(/· (.+?)$/m)[1],
        storageStart: message.match(/🗓Хранение: ❱(.+?) ➽/)[1],
        storageEnd: message.match(/➽ (.+?)$/m)[1],
        reminder: message.match(/Напоминание об окончании срока: (.+?)$/m)[1],
        contract: message.match(/Договор: (\d+)/)[1],
        storageLocation: message.match(/Склад: (.+?)$/)[1]
    };
    return data;
}

// Аутентификация Google API
async function authenticate() {
    return gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets'
    });
}

// Поиск клиента в таблице
async function findClient(phone) {
    const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:B` // Предполагаем, что телефон во второй колонке
    });

    const rows = response.result.values || [];
    for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === phone) {
            return i + 1; // Возвращаем номер строки (1-based)
        }
    }
    return -1; // Клиент не найден
}

// Обновление существующего клиента
async function updateClient(row, data) {
    const range = `${SHEET_NAME}!A${row}:O${row}`;
    const values = [[
        data.name, data.phone, data.amount, data.amountPerMonth, data.quantity,
        data.disks, data.season, data.brand, data.size, data.condition,
        data.storageStart, data.storageEnd, data.reminder, data.contract,
        data.storageLocation
    ]];

    await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        resource: { values }
    });
}

// Добавление нового клиента
async function addClient(data) {
    const values = [[
        data.name, data.phone, data.amount, data.amountPerMonth, data.quantity,
        data.disks, data.season, data.brand, data.size, data.condition,
        data.storageStart, data.storageEnd, data.reminder, data.contract,
        data.storageLocation
    ]];

    await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
        valueInputOption: 'RAW',
        resource: { values }
    });
}

// Основная функция обработки заявки
async function processOrder(message) {
    try {
        // Загрузка Google API
        await new Promise((resolve) => {
            gapi.load('client', resolve);
        });

        await authenticate();
        
        const orderData = parseOrderData(message);
        const clientRow = await findClient(orderData.phone);

        if (clientRow !== -1) {
            // Клиент найден - обновляем данные
            await updateClient(clientRow, orderData);
            console.log('Данные клиента обновлены');
        } else {
            // Новый клиент - добавляем строку
            await addClient(orderData);
            console.log('Новый клиент добавлен');
        }
    } catch (error) {
        console.error('Ошибка при обработке заявки:', error);
    }
}

// Пример использования
const telegramMessage = `Борис Кейдун +7 (978) 751-97-92
💳 Сумма заказа: 2400₽ [600₽/мес.]
🛞: 4шт.❱❱Без дисков ❱❱ [Лето]
Марка:❱❱ Pirelli Cinturato P7 · 205/55/R16 · Без латок · 
🗓Хранение: ❱2024-11-29 ➽ 2025-03-29
---------------
☎️ Напоминание об окончании срока: 2025-03-22 
---------------
Договор: 24112921 (на сайте Otelshin.tu) | Склад: ABD13`;

// Вызов функции (раскомментируйте для использования)
// processOrder(telegramMessage);

