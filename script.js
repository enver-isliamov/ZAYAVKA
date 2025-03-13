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
    return `${year}${month}${day}${hour}`;
}

// Установка текущей даты
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
document.getElementById('startDate').value = formattedDate;

function calculateDate() {
    const tireCount = parseInt(document.getElementById('tireCount').value);
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + tireCount);
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];

    const reminderDate = new Date(endDate);
    reminderDate.setDate(endDate.getDate() - 7);
    document.getElementById('reminderDate').value = reminderDate.toISOString().split('T')[0];
}

window.onload = calculateDate;
document.getElementById('tireCount').addEventListener('input', calculateDate);

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
        range: `${SHEET_NAME}!A:B`
    });

    const rows = response.result.values || [];
    for (let i = 0; i < rows.length; i++) {
        if (rows[i][1] === phone) {
            return i + 1; // 1-based index
        }
    }
    return -1; // Клиент не найден
}

// Обновление существующего клиента
async function updateClient(row, data) {
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
}

// Добавление нового клиента
async function addClient(data) {
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
    const trafficSource = document.getElementById('trafficSource').value;

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
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    }).then(response => response.json())
      .then(data => console.log('Сообщение отправлено в Telegram:', data))
      .catch(error => console.error('Ошибка отправки в Telegram:', error));

    // Отправка в Google Sheets
    try {
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
            console.log('Данные клиента обновлены в Google Sheets');
        } else {
            await addClient(clientData);
            console.log('Новый клиент добавлен в Google Sheets');
        }
    } catch (error) {
        console.error('Ошибка при работе с Google Sheets:', error);
    }
}

// Привязка функции к кнопке (предполагается, что у вас есть кнопка с id="submit")
document.getElementById('submit')?.addEventListener('click', sendToTelegramAndSheets);
