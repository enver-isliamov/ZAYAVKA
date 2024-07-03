document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Данные сохранены');
    // Здесь можно добавить логику для сохранения данных на сервер или в локальное хранилище
});

function cancelEdit() {
    window.location.reload();
}
