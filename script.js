const telegramBotToken = "7134836219:AAFOKRDl_f7_nft2Q52UxXFx244Gpqs7DPs";
const chatId = "96609347";

function calculateTotal() {
    const monthlyPrice = document.getElementById('monthlyPrice').value;
    const tireCount = document.getElementById('tireCount').value;
    const totalPrice = monthlyPrice * tireCount;
    document.getElementById('totalPrice').value = totalPrice;
    generateQRCode();
}

function generateContractNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    return `${year}${month}${day}${hour}`;
}

// Устанавливаем текущую дату
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
document.getElementById('startDate').value = formattedDate;

// Подсчет дат
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

// Генерация QR-кода в формате vCard
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
    const contractNumber = document.getElementById('contractNumber').value;
    const trafficSource = document.getElementById('trafficSource').value;

    // Текст для Telegram и поля NOTE в vCard
    const noteText = `
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

    // Формат vCard
    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${clientName};;;;
FN:${clientName}
TEL:${phone}
NOTE:${noteText.replace(/\n/g, '\\n')}  // Экранируем переносы строк
END:VCARD
    `.trim();

    const qrCanvas = document.getElementById('qrCanvas');
    QRCode.toCanvas(qrCanvas, vCardData, { width: 200 }, (error) => {
        if (error) console.error(error);
    });

    // Обновляем содержимое для кнопки "Показать содержимое"
    document.getElementById('qrContent').textContent = noteText;
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

    const qrCanvas = document.getElementById('qrCanvas');
    const dataURL = qrCanvas.toDataURL('image/png');
    sendImageWithCaption(dataURL, message);
}

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
                alert('Ошибка при отправке QR-кода с описанием в Telegram.');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке QR-кода с описанием в Telegram.');
        });
}

// Инициализация
window.onload = () => {
    calculateDate();
    document.getElementById('contractNumber').value = generateContractNumber();
    generateQRCode();

    // Обработчики для всех полей ввода
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', generateQRCode);
        input.addEventListener('change', generateQRCode);
    });

    // Обработчик для кнопки "Показать содержимое QR-кода"
    document.getElementById('showQrContent').addEventListener('click', () => {
        const qrContent = document.getElementById('qrContent');
        qrContent.style.display = qrContent.style.display === 'none' ? 'block' : 'none';
    });
};

// Обработчики событий для ключевых полей
document.getElementById('tireCount').addEventListener('input', calculateDate);
document.getElementById('monthlyPrice').addEventListener('change', calculateTotal);
document.getElementById('startDate').addEventListener('change', calculateDate);
