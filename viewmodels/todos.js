var statusTexts = {
    'pending': 'Új',
    'done': 'Kész',
    'overdue': 'Elmaradt',
};
var statusClasses = {
    'pending': 'info',
    'done': 'success',
    'overdue': 'warning',
};

//Hozzárendeli minden tömbbeli elemhez a megfelelő classokat és állapot neveket, hogy így szépen megkülönböztethetőek legyenek majd az oldalon.
function decorateTodos(todoContainer) {
    return todoContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

module.exports = decorateTodos;