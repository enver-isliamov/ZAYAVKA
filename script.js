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

⚡Хранение:  ❱ ${startDate} ➽ ${endDate}
---------------
💳 Сумма заказа: ${totalPrice}
[${tireCount}мес. по ${monthlyPrice}р/мес.]
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

⚡Хранение:  ❱ ${startDate} ➽ ${endDate}
---------------
💳 Сумма заказа: ${totalPrice}
[${tireCount}мес. по ${monthlyPrice}р/мес.]
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
        sendImageWithCaption(dataURL, message);
    });
}

// Функция для отправки изображения с подписью в Telegram
function sendImageWithCaption(dataURL, caption) {
    fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'qrcode.png');
            formData.append('caption', caption);

            return fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('QR-код с описанием успешно отправлен в Telegram!');
            } else {
                alert('Ошибка при отправке QR-кода в Telegram: ' + data.description);
            }
        })
        .catch(error => {
            console.error('Ошибка отправки в Telegram:', error);
            alert('Произошла ошибка при отправке QR-кода в Telegram.');
        });
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
