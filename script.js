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

// Функция для генерации QR-кода
function generateQRCode() {
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
    const contractNumber = generateContractNumber();
    const trafficSource = document.getElementById('trafficSource').value;

    document.getElementById('contractNumber').value = contractNumber;

    const noteText = `
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

    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${clientName};;;;
FN:${clientName}
TEL:${phone}
NOTE:${noteText.replace(/\n/g, '\\n')}
END:VCARD
    `.trim();

    const qrCanvas = document.getElementById('qrCanvas');
    qrCanvas.width = 300;  // Устанавливаем ширину канваса
    qrCanvas.height = 300; // Устанавливаем высоту канваса

    QRCode.toCanvas(qrCanvas, vCardData, { width: 300 }, (error) => {
        if (error) console.error("Ошибка генерации QR-кода:", error);
    });

    document.getElementById('qrContent').textContent = noteText;
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

// Функция для работы с Google Sheets
async function updateGoogleSheet(clientName, phone, order, hasDisk, sezon, 
    tireCount, startDate, endDate, totalPrice, monthlyPrice, 
    reminderDate, contractNumber, storage, trafficSource) {
    
    // ВАЖНО: подставить ваши данные
    const SHEET_ID = '1QwNDSkkpDp1kBW9H1C3v1gdvlrHc2OS4WR8HVOXZKh0'; // Получить через URL таблицы
    const API_KEY = 'AIzaSyBWBa0hhrcGx6rESZeLCXZ7-73U4lJAR0E'; // Получить в Google Cloud Console
    const RANGE = 'База!A2:K100'; // Диапазон для поиска/записи
    
    try {
        // Поиск существующего клиента
        const searchResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:search?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    range: RANGE,
                    valueRenderOption: 'UNFORMATTED_VALUE',
                    valueInputOption: 'USER_ENTERED',
                    searchBody: {
                        location: {
                            sheetId: 0,
                            dimension: 'ROWS'
                        },
                        query: `${clientName} 📞${phone}`
                    }
                })
            }
        );

        const searchData = await searchResponse.json();
        
        if (searchData.includedRange) {
            // Обновляем существующую запись
            const updateResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        majorDimension: 'ROWS',
                        values: [
                            [
                                clientName,
                                phone,
                                order,
                                hasDisk,
                                sezon,
                                tireCount,
                                startDate,
                                endDate,
                                totalPrice,
                                monthlyPrice,
                                reminderDate,
                                contractNumber,
                                storage,
                                trafficSource
                            ]
                        ]
                    })
                }
            );
            
            if (updateResponse.ok) {
                console.log('Данные клиента обновлены');
            } else {
                console.error('Ошибка обновления:', await updateResponse.text());
            }
        } else {
            // Добавляем новую запись
            const appendResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        majorDimension: 'ROWS',
                        values: [
                            [
                                clientName,
                                phone,
                                order,
                                hasDisk,
                                sezon,
                                tireCount,
                                startDate,
                                endDate,
                                totalPrice,
                                monthlyPrice,
                                reminderDate,
                                contractNumber,
                                storage,
                                trafficSource
                            ]
                        ]
                    })
                }
            );
            
            if (appendResponse.ok) {
                console.log('Новая запись добавлена');
            } else {
                console.error('Ошибка добавления:', await appendResponse.text());
            }
        }
    } catch (error) {
        console.error('Ошибка работы с Google Sheets:', error);
        alert('Ошибка обновления таблицы. Проверьте API-ключи и доступ к таблице.');
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
