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
🛞: ${tireCount}мес.❱❱${hasDisk} ❱❱ [${sezon}]
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
