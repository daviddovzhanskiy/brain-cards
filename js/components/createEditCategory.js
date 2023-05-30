import { createElement } from "../helper/createElement.js";

// Переменная для заголовка h2 (например написано семья), по умолчанию этот заголовок должен содержать так скажем placeholder, такой текст который будет подсказывать что этот заголовок можно редактировать
// В этой константой вне функции будем опираться на этот title, делать с ним сравнения, чтобы отправлять данные на сервер или нет и т.д.
// По сути этот textContent этого h2. Эта переменная нужна будет для функции где будем этот текст у заголовка как раз задавать
const TITLE = 'Введите название категории';

// Функция createEditCategory которая принимает в себя элемент app
export const createEditCategory = (app) => {
    
    // Создаем с помощью импортированной функции createElement - саму секцию для редактирования категорий
    const editCategory = createElement('section', {
        className: 'edit section-offset',
    });
    
    // Создаём элемент div - контейнер
    const container = createElement('div', {
        className: 'container edit__container',
    });

    // Создаём элемент h2 для заголовка - контейнер
    const title = createElement('h2', {
        className: 'edit__title',
        contentEditable: true,
        title: 'Можно редактировать',
    });

    // Создаём элемент table 
    const table = createElement('table', {
        className: 'edit__table table',
    });

    // Создаём элемент thead для таблицы 
    const thead = createElement('thead');

    // Создаём элемент tr для таблицы 
    const trThead = createElement('tr');

    // Создаём элементы - заголовки в строке таблицы - 'th'
    const tableHeadCellMain = createElement('th', {
        className: 'table__cell',
        textContent: 'main',
    });

    const tableHeadCellSecond = createElement('th', {
        className: 'table__cell',
        textContent: 'second',
    });

    const tableHeadCellEmpty = createElement('th', {
        className: 'table__cell',
    });

    // Создаём элемент tbody для таблицы 
    const tbody = createElement('tbody');

    // Создаём элемент div в котором будут лежать кнопки для управления, добавить пару и тд.
    const btnWrapper = createElement('div', {
        className: 'edit__btn-wrapper',
    });

    // Создаём элементы кнопок внутри div'a
    const btnAddRow = createElement('button', {
        className: 'edit__btn edit__add-row',
        textContent: 'Добавить пару',
    });

    // При создании этой кнопки зададим все свойства кроме дата атрубита (у неё есть дата-атрубут и на этом моменте бы его можем не знать, поэтому задавать не будем, он будет задаваться при рендере)
    const btnSave = createElement('button', {
        className: 'edit__btn edit__save',
        textContent: 'Сохранить категорию',
    });

    const btnCancel = createElement('button', {
        className: 'edit__btn edit__cancel',
        textContent: 'Отмена',
    });

    // Вставляем все элементы таблицы друг в друга

    // Вставляем в секцию контейнер
    editCategory.append(container);
    // Вставляем в table - thead и tbody (оболочку для заголовков таблицы и строчек)
    table.append(thead, tbody);
    // Вставляем в оболочку для заголовков tr в который будем вставлять th
    thead.append(trThead);
    // Вставляем в tr для заголовков th (ячейки с названиями заголовков)
    trThead.append(tableHeadCellMain, tableHeadCellSecond, tableHeadCellEmpty);
    // Вставляем в оболочку кнопок управления - кнопки
    btnWrapper.append(btnAddRow, btnSave, btnCancel);
    // Вставляем в контейнер title перед таблицей, таблицу и кнопки управления
    container.append(title, table, btnWrapper)

    // Функция которая будет создавать строчку в таблице с парами и значком удаления
    // Она в себя будет принимать массив, так как данные хранятся на сервере именно в таком виде
    const createTRCell = (dataArr) => {
        // Создаём элемент tr в который будут помещены ячейки с данными
        const tr = createElement('tr');
        // Создаём элементы td - данные в строке в таблице
        const tableCellMain = createElement('td', {
            className: 'table__cell table__cell_one',
            textContent: dataArr[0],
            contentEditable: true,
        });

        const tableCellSecond = createElement('td', {
            className: 'table__cell table__cell_two',
            textContent: dataArr[1],
            contentEditable: true,
        });

        const tableCellDel = createElement('td', {
            className: 'table__cell',
        });

        // Создаем кнопку внутри td - tableCellDel
        const delRow = createElement('button', {
            className: 'table__del',
            textContent: 'x',
        });

        // Вешаем обработчик события на кнопку удаления всё строки
        delRow.addEventListener('click', () => {
            if (confirm('Вы уверены что хотите удалить строку?')) {
                // Если пользователь нажмет окей, удаляем строку
                tr.remove();
            }
        });

        // Вставляем элементы друг в друга
        tableCellDel.append(delRow);
        tr.append(tableCellMain, tableCellSecond, tableCellDel);

        // Возвращаем из функции createTRCell заполненный данными tr
        return tr;
    };

    //  Функция для очищения заголовка при клике на него (типо плейсхолдер эффект)
    const clearTitle = () => {
        // Если заголовок title равен константе TITLE начальной где нужно ввести категорию, то есть категорию создают, а не редактируют по сути
        if (title.textContent === TITLE) {
            // Очищаем надпись заголовка
            title.textContent = '';
        }
    };

    //  Функция для возвращения начальной надписи заголовка (названия категории), если человек нажал на заголовок, очистил поле, но никак категорию не назвал
    const checkTitle = () => {
        // Если заголовок title равен константе пустоте
        if (title.textContent === '') {
            // Возвращаем имя начального заголовка
            title.textContent = TITLE;
        }
    };

    // Обработчик событий для title таблицы, чтобы про фокусе на него вызывалась функция clearTitle проверки и очистки title если он начальный
    title.addEventListener('focus', clearTitle);
    // Обработчик событий для title таблицы, чтобы про выхода из фокуса от тайтло запускалась функция проверки checkTitle
    title.addEventListener('blur', checkTitle);

    // Обращаемся к кнопке добавить пару и вещаем на него обработчик события клик. 
    btnAddRow.addEventListener('click', () => {
        // Вызываем функцию создания строчки в таблице и передаем в неё пустой массив - помещаем в константу emptyRow
        const emptyRow = createTRCell(['', '']);
        // Вставляем эту пустую строку в элемент tbody таблицы с парами слов
        tbody.append(emptyRow);
    });
    
    // Функция для монтирования в app секции для Edit Category
    // Она принимает данные data, а также задаём этим данным дефолтное значение (по умолчанию)
    // Если данные не передали применятся значения по умолчанию. Т.е. это всё для создания пустой, новой таблицы - заголовок и пустой массив пар со словами
    const mount = (data = { title: TITLE, pairs: [] }) => {
        // Очищаем tbody (строки с данными)
        tbody.textContent = '';
        // Заполняем из переданных даннымх название заголовка таблицы (категории)
        title.textContent = data.title;

        // Если заголовок равен дефолтному - то есть это создание таблицы
        if (title.textContent === TITLE) {
            // Добавляем для красоты класс, в котром прописан бордер для заголовка
            title.classList.add('edit__title_change');
        } else {
            // Иначе удаляю этот класс для красоты
            title.classList.remove('edit__title_change');
            
        };

        // Создаем ячейки через перебор методом map - переданного массива с парами слов pairs
        // Для каждой пары вызывается функция createTRCell, которая наполняет данными из массива строки и создает их
        const rows = data.pairs.map(createTRCell);

        // Вызываем функцию создания строчки в таблице и передаем в неё пустой массив - помещаем в константу emptyRow
        const emptyRow = createTRCell(['', '']);

        // Вставляем в tbody полученные в rows данные заполненных элементов tr (наши пары слов), чтобы передать массив элементов, воспользуемся спрэд оператором "..." и потом передаем константу emptyRow которая создает в конце пустую строку (пару) 
        tbody.append(...rows, emptyRow);

        // Вставляем в app - editCategory, который уже поместил в себя все готовые элементы таблицы
        app.append(editCategory);
    };
    
    // Функция для демонтирования из app - секции которая вывела редактирование категорий
    const unmount = () => {
        // Удаляем секцию editCategory с заполненными данными до этого
        editCategory.remove();
    };

    // Возвращаем из функции createEditCategory - функции mount, unmount
    return { mount, unmount }
}