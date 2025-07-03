// client.js
function collectFormData() {
  const get = id => document.getElementById(id)?.value.trim() || '';
  const getByPlaceholder = placeholder => document.querySelector(`input[placeholder="${placeholder}"]`)?.value.trim() || '';
  const getByClass = selector => document.querySelector(selector)?.value.trim() || '0';

  const startDate = get('startDate');
  const endDate = get('endDate');
  const reminderDate = get('reminderDate');

  return {
    clientName: get('clientName'),
    phone: get('phone'),
    address: getByPlaceholder('Улица, №-дома '),
    carNumber: get('car-number-input'),
    tireCount: get('tireCount'),
    hasDisk: get('hasDisk'),
    sezon: get('seZon'),
    orderCode: get('order'),
    cellCode: getByPlaceholder('E-45'),
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
    formattedReminderDate: reminderDate ? new Date(reminderDate).toLocaleDateString('ru-RU') : 'Не указана',
  };
}

function formatTelegramMessage(data) {
  return `
<b>${data.clientName || 'Не указано'}</b>
📞 ${data.phone || 'Не указан'}
🚗 ${data.carNumber || 'Не указан'}
📍 Адрес: ${data.address}
🛞 Кол-во шин: ${data.tireCount || '0'} | Диски: ${data.hasDisk || 'Нет'}
📦 Склад: ${data.orderCode} | Срок: ${data.storageDuration} мес
💰 Сумма: ${data.totalPrice} ₽ | Долг: ${data.debt} ₽
Договор: ${data.contractNumber}
`;
}

function sendFormSecurely() {
  const data = collectFormData();
  const payload = {
    ...data,
    message: formatTelegramMessage(data),
  };

  fetch('https://tzkehkqpjyzddzvnvxhez.supabase.co/functions/v1/send-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        alert('✅ Успешно отправлено!');
      } else {
        alert('❌ Ошибка: ' + res.error);
      }
    })
    .catch(err => {
      console.error('Ошибка:', err);
      alert('Сетевая ошибка. Проверьте консоль.');
    });
}

window.onload = () => {
  const btn = document.querySelector('.action-button');
  if (btn) {
    btn.addEventListener('click', sendFormSecurely);
  }
};
