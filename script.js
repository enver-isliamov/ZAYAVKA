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
    QRCode.toCanvas(qrCanvas, vCardData, { width: 300 }, (error) => {
        if (error) console.error(error);
    });

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

// Инициализация сканера QR-кода
let html5QrcodeScanner;

function startQrScanner() {
    const qrCanvas = document.getElementById('qrCanvas');
    const qrReader = document.getElementById('qr-reader');
    qrCanvas.style.display = 'none';
    qrReader.style.display = 'block';

    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    html5QrcodeScanner.start(
        { facingMode: "environment" }, // Задняя камера
        { fps: 10, qrbox: { width: 250, height: 250 } }, // Увеличенная область сканирования 1:1
        (decodedText) => {
            // Отображаем содержимое любого QR-кода
            let decodedContent = decodedText;

            // Если это vCard, извлекаем поле NOTE
            if (decodedText.includes('BEGIN:VCARD')) {
                const noteMatch = decodedText.match(/NOTE:(.+?)(?=END:VCARD|\n[A-Z]+:|$)/s);
                if (noteMatch && noteMatch[1]) {
                    decodedContent = noteMatch[1].replace(/\\n/g, '\n');
                }
            }

            document.getElementById('qrContent').textContent = decodedContent;
            document.getElementById('qrContent').style.display = 'block';
            stopQrScanner();
        },
        (error) => {
            console.warn(`Ошибка сканирования: ${error}`);
        }
    ).catch((err) => {
        console.error(`Не удалось запустить сканер: ${err}`);
        alert('Ошибка запуска камеры. Убедитесь, что разрешён доступ к камере.');
    });
}

function stopQrScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop().then(() => {
            const qrCanvas = document.getElementById('qrCanvas');
            const qrReader = document.getElementById('qr-reader');
            qrReader.style.display = 'none';
            qrCanvas.style.display = 'block';
            html5QrcodeScanner.clear();
            html5QrcodeScanner = null;
        }).catch((err) => {
            console.error(`Ошибка остановки сканера: ${err}`);
        });
    }
}

// Инициализация
window.onload = () => {
    calculateDate();
    document.getElementById('contractNumber').value = generateContractNumber();
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

    document.getElementById('scanQrCode').addEventListener('click', () => {
        const qrReader = document.getElementById('qr-reader');
        if (qrReader.style.display === 'none') {
            startQrScanner();
        } else {
            stopQrScanner();
        }
    });

    document.getElementById('closeScanner').addEventListener('click', () => {
        stopQrScanner();
    });
};

document.getElementById('tireCount').addEventListener('input', calculateDate);
document.getElementById('monthlyPrice').addEventListener('change', calculateTotal);
document.getElementById('startDate').addEventListener('change', calculateDate);
