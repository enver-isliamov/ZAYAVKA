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

// Генерация QR-кода
function generateQRCode() {
    // ... (код остается без изменений)
}

function sendToTelegram() {
    // ... (код остается без изменений)
}

function sendImageWithCaption(dataURL, caption) {
    // ... (код остается без изменений)
}

// Инициализация сканера QR-кода
let html5QrcodeScanner;

function startQrScanner() {
    const qrCanvas = document.getElementById('qrCanvas');
    const qrReader = document.getElementById('qr-reader');

    if (!qrCanvas || !qrReader) {
        console.error("Элементы qrCanvas или qrReader не найдены в DOM");
        alert("Ошибка: не найдены элементы для QR-кода или сканера.");
        return;
    }

    qrCanvas.style.display = 'none';
    qrReader.style.display = 'block';
    console.log("Запуск сканера...");

    // Очищаем содержимое qr-reader перед запуском
    qrReader.innerHTML = '';

    html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
    );
    
    html5QrcodeScanner.render((decodedText, decodedResult) => {
        console.log("QR-код распознан:", decodedText);
        let decodedContent = decodedText;
        if (decodedText.includes('BEGIN:VCARD')) {
            const noteMatch = decodedText.match(/NOTE:(.+?)(?=END:VCARD|\n[A-Z]+:|$)/s);
            if (noteMatch && noteMatch[1]) {
                decodedContent = noteMatch[1].replace(/\\n/g, '\n');
            }
        }
        document.getElementById('qrContent').textContent = decodedContent;
        document.getElementById('qrContent').style.display = 'block';
        stopQrScanner();
    }, (error) => {
        console.warn("Ошибка сканирования:", error);
    });
}

function stopQrScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().then(() => {
            console.log("Сканер остановлен");
            const qrCanvas = document.getElementById('qrCanvas');
            const qrReader = document.getElementById('qr-reader');
            qrReader.style.display = 'none';
            qrCanvas.style.display = 'block';
            html5QrcodeScanner = null;
        }).catch(err => {
            console.error("Ошибка остановки сканера:", err);
            alert("Не удалось остановить сканер: " + err);
        });
    } else {
        const qrCanvas = document.getElementById('qrCanvas');
        const qrReader = document.getElementById('qr-reader');
        qrReader.style.display = 'none';
        qrCanvas.style.display = 'block';
    }
}

// Инициализация
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
