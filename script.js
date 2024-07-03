document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Собираем данные из формы
    const formData = new FormData(event.target);
    const data = {
        phone: formData.get('phone'),
        order: formData.get('order'),
        price: formData.get('price'),
        quantity: formData.get('quantity'),
        disks: formData.get('disks'),
        start: formData.get('start'),
        duration: formData.get('duration'),
        remind: formData.get('remind'),
        end: formData.get('end'),
        storage: formData.get('storage'),
        cell: formData.get('cell'),
        total: formData.get('total'),
        debt: formData.get('debt'),
        contract: formData.get('contract'),
        source: formData.get('source')
    };

    // Отправка данных в Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbyu8TTf7tNHDQn-YkoSe1X1m_7KDBdMsj6dntgO-pSOnm9eiuMh4m5cTofGuJK71B9g/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Данные сохранены');
        } else {
            alert('Ошибка при сохранении данных');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Ошибка при сохранении данных');
    });
});

function cancelEdit() {
    window.location.reload();
}
