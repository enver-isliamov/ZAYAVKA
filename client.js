// Сбор данных из формы, как раньше
function collectFormData() {
    const get = (id) => document.getElementById(id)?.value.trim() || '';
    const getPlaceholder = (placeholder) => document.querySelector(`input[placeholder="${placeholder}"]`)?.value.trim() || '';
    const getByClass = (selector) => document.querySelector(selector)?.value.trim() || '0';

    const startDate = get('startDate');
    const endDate = get('endDate');
    const reminderDate = get('reminderDate');

    return {
        clientName: get('clientName'),
        phone: get('phone'),
        address: getPlaceholder('Улица, №-дома '),
        carNumber: get('car-number-input'),
        tireCount: get('tireCount'),
        hasDisk: get('hasDisk'),
        sezon: get('seZon'),
        orderCode: get('order'),
        cellCode: getPlaceholder('E-45'),
        additionalNotes: get('qrContent'),
        storageDuration: get('storage'),
        monthlyPrice: get('monthlyPrice'),
        totalPrice: get('totalPrice'),
        debt: getByClass('.info-row .value.debt .editable'),
        contractNumber: get('contractNumber'),
        trafficSource: get('trafficSource'),
        startDate,
        endDate,
        reminderDate,
        formattedStartDate: startDate ? new Date(startDate).toLocaleDateString('ru-RU') : 'Не указана',
        formattedEndDate: endDate ? new Date(endDate).toLocaleDateString('ru-RU') : 'Не указана',
        formattedReminderDate: reminderDate ? new Date(reminderDate).toLocaleDateString('ru-RU') : 'Не указана'
    };
}

function formatTelegramMessage(data) {
    return `
❱❱❱❱❱ ✅ КЛИЕНТ Otelshin.tu ✅ ❰❰❰❰❰\n------------------------------------------\n<b> ${data.clientName || 'Не указано'} </b>\n📞 ${data.phone || 'Не указан'}\n🚗 Номер Авто:<b>  ${data.carNumber || 'Не указан'}</b>\n📍 <b>Адрес:</b> <code> ${data.address || 'Не указан'} </code>\n--- ---- ---- ---- ------ ---- ---- ---- ---\n-    -    -     <b>ДЕТЕЛИ УСЛУГИ</b>    -    -    -\n--- ---- ---- ---- ------ ---- ---- ---- ---\n<blockquote>⭕️ ${data.additionalNotes || 'Нет дополнительных заметок.'}\nКол-во шин: <b>${data.tireCount || '0'} шт.</b> Сезон: <b>${data.sezon || 'Не указан'}</b>\n🛞 <b>Диски:</b> ${data.hasDisk || 'Нет'} </blockquote>\n--- ---- ---- ---- ------ ---- ---- ---- ---\n<blockquote>📦 <b>Склад:</b> ${data.orderCode || 'Не указан'}\n⚡️ Хранение: <b>${data.storageDuration || '0'} мес.</b> ❱ ${data.formattedStartDate} ➽ ${data.formattedEndDate}\n🔔 Напоминание об окончании срока:<b> ${data.formattedReminderDate}</b></blockquote>\n--- ---- ---- ---- ------ ---- ---- ---- ---\n<blockquote>💳Сумма заказа: <b>${data.totalPrice || '0'} ₽</b> [${data.monthlyPrice || '0'} ₽/мес.]\n🚨 <b>Долг:</b> ${data.debt || '0'} ₽</blockquote>\n------------------------------------------\n🌐 <i>Источник:</i> <span class="tg-spoiler"> ${data.trafficSource || 'Не указан'} </span>\n❱❱❱ Договор: <b>${data.contractNumber || 'Не сгенерирован'}</b> <a href="https://otelshin.ru">на сайте</a> ❰❰❰`;
}

function sendFormSecurely() {
    const data = collectFormData();
    const fullPayload = {
        ...data,
        message: formatTelegramMessage(data)
    };

    fetch('https://tzkehqpiyzddzvnwxhez.supabase.co/functions/v1/send-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullPayload)
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            alert('Успешно отправлено в Telegram и Google Таблицу!');
        } else {
            alert('Ошибка: ' + res.error);
            console.error('Ошибка:', res);
        }
    })
    .catch(err => {
        alert('Сетевая ошибка. Проверьте консоль.');
        console.error(err);
    });
}

// Привязка к кнопке оформления
window.onload = () => {
    const sendButton = document.querySelector('.action-button');
    if (sendButton) {
        sendButton.addEventListener('click', sendFormSecurely);
    }
};
