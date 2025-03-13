const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs";
const chatId = "96609347";

// Настройки Google Sheets
const SPREADSHEET_ID = '1IBBn38ZD-TOgzO9VjYAyKz8mchg_RwWyD6kZ0Lu729A';
const SHEET_NAME = 'Актуальные клиенты';
const API_KEY = 'AIzaSyCfufjRxEecMLqO8MGsODu1tXYSjmhUHJU';
const CLIENT_ID = '613236074236-938866s3a34k53fik0dq6rsiurk36t8h.apps.googleusercontent.com';

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

// Подсчет дат
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

// Аутентификация Google API
async function authenticate() {
    try {
        console.log('Инициализация Google API...');
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        });
        console.log('Google API успешно инициализирован');
    } catch (error) {
        console.error('Ошибка аутентификации Google API:', error);
        throw error;
    }
}

// Поиск клиента в таблице
async function findClient(phone) {
    try {
        console.log(`Поиск клиента с телефоном: ${phone}`);
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:B`
        });
        const rows = response.result.values || [];
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][1] === phone) {
                console.log(`Клиент найден в строке ${i + 1}`);
                return i + 1;
            }
        }
        console.log('Клиент не найден');
        return -1;
    } catch (error) {
        console.error('Ошибка при поиске клиента:', error);
        throw error;
    }
}

// Обновление клиента
async function updateClient(row, data) {
    try {
        console.log(`Обновление клиента в строке ${row}`);
        const range = `${SHEET_NAME}!A${row}:O${row}`;
        const values = [[
            data.name, data.phone, data.totalPrice, data.monthlyPrice, data.tireCount,
            data.hasDisk, data.sezon, data.order, data.size || '', data.condition || '',
            data.startDate, data.endDate, data.reminderDate, data.contractNumber,
            data.storage
        ]];
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            resource: { values }
        });
        console.log('Данные клиента успешно обновлены');
    } catch (error) {
        console.error('Ошибка при обновлении клиента:', error);
        throw error;
    }
}

// Добавление нового клиента
async function addClient(data) {
    try {
        console.log('Добавление нового клиента');
        const values = [[
            data.name, data.phone, data.totalPrice, data.monthlyPrice, data.tireCount,
            data.hasDisk, data.sezon, data.order, data.size || '', data.condition || '',
            data.startDate, data.endDate, data.reminderDate, data.contractNumber,
            data.storage
        ]];
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: SHEET_NAME,
            valueInputOption: 'RAW',
            resource: { values }
        });
        console.log('Новый клиент успешно добавлен');
    } catch (error) {
        console.error('Ошибка при добавлении клиента:', error);
        throw error;
    }
}

// Основная функция отправки данных
async function sendToTelegramAndSheets() {
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
    const contractNumber = document.getElementById('contractNumber').value || generateContractNumber();

    // Формируем сообщение для Telegram
    const message = `
${clientName} ${phone}
💳 Сумма заказа: ${totalPrice}₽ [${monthlyPrice}₽/мес.]
🛞: ${tireCount}шт.❱❱${hasDisk}❱❱ [${sezon}]
Марка:❱❱ ${order} · · 
🗓Хранение: ❱${startDate} ➽ ${endDate}
---------------
☎️ Напоминание об окончании срока: ${reminderDate}
---------------
Договор: ${contractNumber} (на сайте Otelshin.tu) | Склад: ${storage}
`;

    // Отправка в Telegram
    try {
        console.log('Отправка сообщения в Telegram...');
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        const telegramData = await telegramResponse.json();
        if (telegramData.ok) {
            console.log('Сообщение успешно отправлено в Telegram:', telegramData);
        } else {
            console.error('Ошибка Telegram API:', telegramData);
        }
    } catch (error) {
        console.error('Ошибка при отправке в Telegram:', error);
    }

    // Отправка в Google Sheets
    try {
        console.log('Загрузка Google API...');
        await new Promise((resolve) => gapi.load('client', resolve));
        await authenticate();

        const clientData = {
            name: clientName,
            phone: phone,
            totalPrice: totalPrice,
            monthlyPrice: monthlyPrice,
            tireCount: tireCount,
            hasDisk: hasDisk,
            sezon: sezon,
            order: order,
            startDate: startDate,
            endDate: endDate,
            reminderDate: reminderDate,
            contractNumber: contractNumber,
            storage: storage
        };

        const clientRow = await findClient(phone);
        if (clientRow !== -1) {
            await updateClient(clientRow, clientData);
        } else {
            await addClient(clientData);
        }
    } catch (error) {
        console.error('Ошибка при работе с Google Sheets:', error);
    }
}

// Привязка к кнопке
document.getElementById('submit')?.addEventListener('click', sendToTelegramAndSheets);
