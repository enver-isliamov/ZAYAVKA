// Отправка новой заявки в чат с админом  через бот - ZAYAVKA - 
const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs"; 
const chatId = "96609347";

// Функция для расчета общей стоимости
function calculateTotal() {
    const monthlyPrice = document.getElementById('monthlyPrice').value;
    const tireCount = document.getElementById('tireCount').value;
    const totalPrice = monthlyPrice * tireCount;
    document.getElementById('totalPrice').value = totalPrice;
    generateQRCode();
}

// Функция для генерации номера договора
function generateContractNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2); // Последние 2 цифры года
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулем
    const day = String(currentDate.getDate()).padStart(2, '0'); // День с ведущим нулем
    const hour = String(currentDate.getHours()).padStart(2, '0'); // Часы с ведущим нулем
    const minute = String(currentDate.getMinutes()).padStart(2, '0'); // Минуты с ведущим нулем
    return `${year}.${month}.${day}-${hour}${minute}`; // Формат: ГГ.ММ.ДД-ЧЧММ
}

// Устанавливаем текущую дату
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
document.getElementById('startDate').value = formattedDate;

// Функция для расчета дат
function calculateDate() {
    const tireCount = parseInt(document.getElementById('tireCount').value);
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + tireCount);
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];

    const reminderDate = new Date(endDate);
    reminderDate.setDate(endDate.getDate() - 7);
    document.getElementById('reminderDate').value = reminderDate.toISOString().split('T')[0];
    generateQRCode();
}


// Функция для отправки данных в Telegram
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
❱❱❱❱❱ ✅ КЛИЕНТ Otelshin.tu ✅ ❰❰❰❰❰

${clientName} 
📞${phone}

Марка:❱❱ ${order}
⭕: ❱❱ ${hasDisk} ❱❱ [${sezon}]

⚡Хранение: [${tireCount}мес. ❱ ${startDate} ➽ ${endDate}
---------------
💳 Сумма заказа: ${totalPrice} ${monthlyPrice}р/мес.]
☎️ Напоминание об окончании срока: ${reminderDate} 📞
---------------
Договор: ${contractNumber} (на сайте Otelshin.tu) | Склад: ${storage}
Источник трафика: ${trafficSource}
    `;

    // Создаем временный canvas для QR-кода большего размера
    const tempQrCanvas = document.createElement('canvas');
    tempQrCanvas.width = 500;
    tempQrCanvas.height = 500;

    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${clientName};;;;
FN:${clientName}
TEL:${phone}
NOTE:${message.replace(/\n/g, '\\n')}
END:VCARD
    `.trim();

    QRCode.toCanvas(tempQrCanvas, vCardData, { width: 500 }, (error) => {
        if (error) {
            console.error("Ошибка генерации QR-кода:", error);
            return;
        }

        const dataURL = tempQrCanvas.toDataURL('image/png');
        
        // Отправляем в Telegram
        sendImageWithCaption(dataURL, message)
            .then(() => {
                // После успешной отправки обновляем таблицу
                updateGoogleSheet(clientName, phone, order, hasDisk, sezon, 
                    tireCount, startDate, endDate, totalPrice, monthlyPrice, 
                    reminderDate, contractNumber, storage, trafficSource);
            })
            .catch(error => {
                console.error('Ошибка отправки в Telegram:', error);
                alert('Ошибка при отправке QR-кода в Telegram.');
            });
    });
}

// Функция для отправки изображения с подписью в Telegram
async function sendImageWithCaption(dataURL, caption) {
    return fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('chat_id', chatId); // ВАЖНО: подставить ваш chat_id
            formData.append('photo', blob, 'qrcode.png');
            formData.append('caption', caption);

            return fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, { // ВАЖНО: подставить ваш bot token
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('QR-код с описанием успешно отправлен в Telegram!');
                return true;
            } else {
                alert('Ошибка при отправке QR-кода в Telegram: ' + data.description);
                return false;
            }
        })
        .catch(error => {
            console.error('Ошибка отправки в Telegram:', error);
            alert('Произошла ошибка при отправки QR-кода в Telegram.');
            return false;
        });
}

/**
 * Функция для добавления или обновления клиента в таблице Google Sheets.
 * Работает с листом "WebBase" и колонками (в точном порядке):
 * Chat ID, Имя клиента, Телефон, Номер Авто, Заказ - QR, Цена за месяц,
 * Кол-во шин, Наличие дисков, Начало, Срок, Напомнить, Окончание,
 * Склад хранения, Ячейка, Общая сумма, Долг, Договор, Адрес клиента,
 * Статус сделки, Источник трафика
 * 
 * Входной объект clientData должен содержать соответствующие поля.
 * Chat ID можно передавать пустым или с каким-то значением, если есть.
 */

async function updateGoogleSheet(clientData) {
    const SHEET_ID = '1QwNDSkkpDp1kBW9H1C3v1gdvlrHc2OS4WR8HVOXZKh0';
    const API_KEY = 'AIzaSyBWBa0hhrcGx6rESZeLCXZ7-73U4lJAR0E';
    const SHEET_NAME = 'WebBase';

    try {
        // 1) Получаем данные листа, чтобы найти клиента (строки с 2 и ниже)
        const getResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:T1000?key=${API_KEY}`
        );
        const sheetData = await getResponse.json();

        let rowIndex = -1; // индекс строки, если клиент найден

        if (sheetData.values) {
            for (let i = 0; i < sheetData.values.length; i++) {
                const row = sheetData.values[i];
                // Имена клиента (колонка B, индекс 1) и Телефон (колонка C, индекс 2)
                const nameInRow = row[1] || '';
                const phoneInRow = row[2] || '';

                if (nameInRow === clientData.clientName && phoneInRow === clientData.phone) {
                    rowIndex = i + 2; // +2, т.к. данные начинаются с A2
                    break;
                }
            }
        }

        // 2) Формируем массив значений для записи в таблицу
        // Важно: Колонки A-T (20 колонок), заполняем в точном порядке
        // Если каких-то данных нет — ставим пустую строку ''
        const values = [
            clientData.chatId || '',            // Chat ID — колонка A (0)
            clientData.clientName || '',       // Имя клиента — B (1)
            clientData.phone || '',            // Телефон — C (2)
            clientData.carNumber || '',        // Номер Авто — D (3)
            clientData.orderQR || '',          // Заказ - QR — E (4)
            clientData.monthlyPrice || '',     // Цена за месяц — F (5)
            clientData.tireCount || '',        // Кол-во шин — G (6)
            clientData.hasDisk || '',          // Наличие дисков — H (7)
            clientData.startDate || '',        // Начало — I (8)
            clientData.term || '',             // Срок — J (9)
            clientData.reminderDate || '',     // Напомнить — K (10)
            clientData.endDate || '',          // Окончание — L (11)
            clientData.storage || '',          // Склад хранения — M (12)
            clientData.cell || '',             // Ячейка — N (13)
            clientData.totalPrice || '',       // Общая сумма — O (14)
            clientData.debt || '',             // Долг — P (15)
            clientData.contractNumber || '',   // Договор — Q (16)
            clientData.clientAddress || '',    // Адрес клиента — R (17)
            clientData.dealStatus || '',       // Статус сделки — S (18)
            clientData.trafficSource || ''     // Источник трафика — T (19)
        ];

        if (rowIndex > 0) {
            // 3а) Обновляем существующую запись по найденной строке
            const updateRange = `${SHEET_NAME}!A${rowIndex}:T${rowIndex}`; // 20 колонок A-T

            const updateResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(updateRange)}?valueInputOption=USER_ENTERED&key=${API_KEY}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        range: updateRange,
                        majorDimension: 'ROWS',
                        values: [values]
                    })
                }
            );

            if (updateResponse.ok) {
                console.log(`Данные клиента "${clientData.clientName}" обновлены успешно.`);
            } else {
                console.error('Ошибка обновления данных:', await updateResponse.text());
            }
        } else {
            // 3б) Добавляем новую запись в таблицу
            const appendRange = `${SHEET_NAME}!A2:T2`; // вставка в колонки A-T начиная со строки 2

            const appendResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ values: [values] })
                }
            );

            if (appendResponse.ok) {
                console.log(`Новая запись клиента "${clientData.clientName}" добавлена успешно.`);
            } else {
                console.error('Ошибка добавления новой записи:', await appendResponse.text());
            }
        }
    } catch (error) {
        console.error('Ошибка при работе с Google Sheets API:', error);
        alert('Ошибка обновления таблицы. Проверьте API-ключ и права доступа.');
    }
}



// Инициализация при загрузке страницы
window.onload = () => {
    calculateDate();
    generateQRCode();

    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', generateQRCode);
        input.addEventListener('change', generateQRCode);
    });

    document.getElementById('showQrContent').addEventListener('click', () => {
        const qrContent = document.getElementById('qrContent');
        qrContent.style.display = qrContent.style.display === 'none' ? 'block' : 'none';
    });
};

// Добавляем обработчики событий
document.getElementById('tireCount').addEventListener('input', calculateDate);
document.getElementById('monthlyPrice').addEventListener('change', calculateTotal);
document.getElementById('startDate').addEventListener('change', calculateDate);
