/**
 * Функция для добавления или обновления клиента в Google Sheets.
 * Работает с листом "WebBase". Генерирует номер договора, если он отсутствует.
 */
async function updateGoogleSheet(clientData) {
    const SHEET_ID = '1QwNDSkkpDp1kBW9H1C3v1gdvlrHc2OS4WR8HVOXZKh0'; // ID таблицы
    const API_KEY = 'AIzaSyBWBa0hhrcGx6rESZeLCXZ7-73U4lJAR0E'; // Ваш API-ключ
    const SHEET_NAME = 'WebBase'; // Название листа в таблице

    try {
        // 1. Получаем существующие записи из таблицы (строки A2:T1000)
        const getResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:T1000?key=${API_KEY}`
        );
        const sheetData = await getResponse.json();

        let rowIndex = -1; // Индекс строки, если клиент найден

        if (sheetData.values) {
            for (let i = 0; i < sheetData.values.length; i++) {
                const row = sheetData.values[i];
                const nameInRow = row[1] || '';
                const phoneInRow = row[2] || '';

                if (nameInRow === clientData.clientName && phoneInRow === clientData.phone) {
                    rowIndex = i + 2; // +2, т.к. A2 — начало
                    break;
                }
            }
        }

        // 2. Генерация номера договора, если он не указан
        if (!clientData.contractNumber || clientData.contractNumber.trim() === '') {
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const rand = Math.floor(1000 + Math.random() * 9000); // случайное 4-значное число
            clientData.contractNumber = `ДОГ-${datePart}-${rand}`;
        }

        // 3. Формируем значения по колонкам A-T (всего 20 штук)
        const values = [
            clientData.chatId || '',
            clientData.clientName || '',
            clientData.phone || '',
            clientData.carNumber || '',
            clientData.orderQR || '',
            clientData.monthlyPrice || '',
            clientData.tireCount || '',
            clientData.hasDisk || '',
            clientData.startDate || '',
            clientData.term || '',
            clientData.reminderDate || '',
            clientData.endDate || '',
            clientData.storage || '',
            clientData.cell || '',
            clientData.totalPrice || '',
            clientData.debt || '',
            clientData.contractNumber || '',
            clientData.clientAddress || '',
            clientData.dealStatus || '',
            clientData.trafficSource || ''
        ];

        if (rowIndex > 0) {
            // 4. Обновление существующей строки
            const updateRange = `${SHEET_NAME}!A${rowIndex}:T${rowIndex}`;
            const updateResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(updateRange)}?valueInputOption=USER_ENTERED&key=${API_KEY}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        range: updateRange,
                        majorDimension: 'ROWS',
                        values: [values]
                    })
                }
            );

            if (updateResponse.ok) {
                console.log(`✅ Данные клиента обновлены: ${clientData.clientName}`);
            } else {
                console.error('❌ Ошибка обновления:', await updateResponse.text());
            }
        } else {
            // 5. Добавление новой строки
            const appendRange = `${SHEET_NAME}!A2:T2`;
            const appendResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(appendRange)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ values: [values] })
                }
            );

            if (appendResponse.ok) {
                console.log(`🆕 Новый клиент добавлен: ${clientData.clientName}`);
            } else {
                console.error('❌ Ошибка добавления:', await appendResponse.text());
            }
        }
    } catch (error) {
        console.error('⚠️ Ошибка работы с таблицей:', error);
        alert('Произошла ошибка при работе с таблицей. Проверьте API-ключ и доступы.');
    }
}
