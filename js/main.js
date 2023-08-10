import { createCategory } from "./components/createCategory.js";
import { createEditCategory } from "./components/createEditCategory.js";
import { createHeader } from "./components/createHeader.js";
import { createPairs } from "./components/createPairs.js";
import { showAlert } from "./components/showAlert.js";
import { createElement } from "./helper/createElement.js";
import { fetchCards, fetchCategories, fetchCreateCategory, fetchDeleteCategory, fetchEditCategory } from "./service/api.service.js";

// Главная функция initApp
const initApp = async () => {

    // Создаём переменную headerParent и помещаем в неё элемент с классом .header
    const headerParent = document.querySelector('.header');

    // Создаём переменную app и помещаем в неё элемент id которого app
    const app = document.querySelector('#app');

    // Вызываем функцию createHeader и передаем в неё элемент headerParent
    // И записываем в константу headerObj всё что возвращается из функции createHeader
    const headerObj = createHeader(headerParent);

    // Вызываем функцию createCategory и передаем в неё элемент app
    // И записываем в константу categoryObj всё что возвращается из функции createCategory
    const categoryObj = createCategory(app);

    
    // Вызываем функцию createEditCategory и передаем в неё элемент app
    // И записываем в константу editCategoryObj всё что возвращается из функции createEditCategory
    const editCategoryObj = createEditCategory(app);

    // Вызываем функцию createPairs и передаем в неё элемент app
    // И записываем в константу pairsObj всё что возвращается из функции createPairs
    const pairsObj = createPairs(app);

    // Функция которая берет все секции categoryObj, editCategoryObj, pairsObj и выполняет к ним функцию unmount (очистки)
    const allSectionUnmount = () => {
        // Создаем массив из этих объектов, перебераем его через forEach и у каждой секции (obj) выполняет функцию unmount (которая написано внутри obj, т.е. каждой функции по которой проходится forEach)
        [categoryObj, editCategoryObj, pairsObj].forEach(obj => obj.unmount());
        // categoryObj.unmount();
        // editCategoryObj.unmount();
    };

    // Функция postHandler для записи новых данных (пар слов) из новой созданной категории
    const postHandler = async () => {
        // Получаем данные из функции editCategoryObj и обращаемся к функции ParseData из которой получаем объект с массивом данных (пар слов)
        const data = editCategoryObj.parseData();
        // Записываем в переменную dataCategories полученные данные из сервера с помощью функции fetchCreateCategory, которая после сохранения новой категории, обратиться к серверу и получит от туда уже обновленные данные включая новую категорию
        const dataCategories = await fetchCreateCategory(data);
        
        // Если в dataCategory есть ошибка - показываем сообщение об ошибке
        if (dataCategories.error) {
            showAlert(dataCategories.error.message);
            return;
        }

        // Вызываем alert о том, что новая категория добавлена и данные отправлены на сервер
        showAlert(`Новая категория ${data.title} была добавлена`);
        // Вызываем функцию allSectionUnmount чтобы очистить секции перед отображением категорий уже включая новую
        allSectionUnmount();
        // Меняем заголовок у header на надпись "категории" для общего обозначения всех представленных категорий в секции
        headerObj.updateHeaderTitle("Категории");
        // Вызываем функцию mount для создания блока с карточками и передаем туда данные с сервера записанные в переменную dataCategories
        categoryObj.mount(dataCategories);   
    }

    // Функция patchHandler для обновления данных (пар слов) редактируемой категории со словами
    const patchHandler = async () => {
        // Получаем данные из функции editCategoryObj и обращаемся к функции ParseData из которой получаем объект с массивом данных (пар слов)
        const data = editCategoryObj.parseData();
        // Записываем в переменную dataCategories полученные данные из сервера с помощью функции fetchEditCategory, которая после редактирования какой-либо категории, обратиться к серверу и получит от туда уже обновленные данные включая обновленную отредактированную категорию с её наполнением (парами слов и так далее)
        // По мимо data в эту функцию мы также передаем id кнопки "Сохранить"
        const dataCategories = await fetchEditCategory(editCategoryObj.btnSave.dataset.id, data);
        // Если в dataCategory есть ошибка - показываем сообщение об ошибке
        if (dataCategories.error) {
            showAlert(dataCategories.error.message);
            return;
        }

        // Вызываем alert о том, что текущая категория была изменена (отредактирована) и обновленные данные отправлены на сервер
        showAlert(`Категория ${data.title} обновлена`);
        // Вызываем функцию allSectionUnmount чтобы очистить секции перед отображением категорий уже включая текущую со всеми изменениями
        allSectionUnmount();
        // Меняем заголовок у header на надпись "категории" для общего обозначения всех представленных категорий в секции
        headerObj.updateHeaderTitle("Категории");
        // Вызываем функцию mount для создания блока с карточками и передаем туда данные с сервера записанные в переменную dataCategories
        categoryObj.mount(dataCategories);   
    }

    // Функция cancelChange которая возвращает пользователя на главную страницу и не применяет никакие внесенные изменения (которые до этого не отправились на сервер)
    const cancelChange = () => {
        // Запрос пользователю. Уверен ли он, что хочет отменить ещё несохраненные внесённые им изменения и вернуться на главную страницу?
        if (confirm('Вы хотите не сохранять изменения и вернуться на главную страницу?')) {
            // Если пользователь ответил что Да
            // Вызываем функцию renderIndex(); которая вернёт его на главную страницу
            renderIndex();
            // Вызываем alert (оповещение) о том что пользователь успешно отменил несохраненные до этого изменения и вернулся на главную страницу
            showAlert('Вы вернулись на главную страницу!');
        }

        return;
    }


    // Функция renderIndex для сброса названия заголовка в дефолтное
    // И запуска функции создания блока с карточками
    const renderIndex = async (e) => {
        // Сбрасываем чтобы по клику ничего не происходило (перезагрузка страницы и тд)
        // В асинхронной функции будет ошибка, что нет такого метода preventDefault
        // Для этого после "e" ставим "?", чтобы привент дефолт вызывался только тогда когда он есть
        e?.preventDefault();
        // Выполняем функцию allSectionUnmount - то есть очищаем секции перед отображением категорий
        allSectionUnmount();
        // Записываем в константу categories - выполненный результат функции fetchCategories
        // Используем await чтобы дождаться ответа от сервера и получить ответ уже в виде обработанных данных из функции fetchCategories
        // Т.е. мы получаем массив объектов (каждый объект это категория)
        const categories = await fetchCategories();
        // Меняем заголовок у header на надпись "категории" для общего обозначения всех представленных категорий в секции
        headerObj.updateHeaderTitle("Категории");
        // Если при получении категорий из сервера произошла ошибка
        if(categories.error) {
            // Создаём элемент p и добавляем в него текст-оповещение об ошибке
            const errorText = createElement('p', {
                className: 'server-error',
                textContent: 'Ошибка сервера, попробуйте зайти позже'
            });
            // Добавляем созданный p с текстом ошибки в элемент app, чтобы ошибка отобразилась на странице загрузки
            app.append(errorText);
            // Просто прерываем функцию с помощью return, так как дальше уже ничего произойти не может, что-то случилось с сервером
            return;
        }

        // Записываем (сбрасываем предыдущее) в элемент-заголовок HeaderTitle значение-текст 'Категории'
        headerObj.updateHeaderTitle('Категории');

        // Вызываем функцию mount для создания блока с карточками и передаем туда данные categories
        categoryObj.mount(categories);
    };

    // Вызываем функцию renderIndex, чтобы один раз эотт вызов произошел в начале самостоятельно
    renderIndex();

    // На логотип добавляем событие по клику, которое вызывает функцию renderIndex
    headerObj.headerLogoLink.addEventListener('click', renderIndex);

    // На кнопку 'Добавить категорию' добавляем событие по клику
    headerObj.headerBtn.addEventListener('click', () => {
        // Вызываем функцию allSectionUnmount чтобы очистить сенкцию с выводом карточек
        allSectionUnmount();
        // Записываем (сбрасываем предыдущее) в элемент-заголовок HeaderTitle значение-текст 'Новая категория'
        headerObj.updateHeaderTitle('Новая категория');
        // Вызываем функцию mount из константы editCategoryObj в которой лежит всё что возвращено из функции createEditCategory
        // Она будет монтировать нашу таблицу с добавлением категорий
        editCategoryObj.mount();
        // Вешаем обработчик событий на кнопку "Сохранить"
        // Когда мы на неё нажимаем вызывается функция postHandler для сохранения новых данных (пар слов) из созданной новой категории
        editCategoryObj.btnSave.addEventListener('click', postHandler);
        // Удаляем обработчик события с кнопки сохранить, который мог быть установлен при редактировании категории, тогда у нас будет работать только обработчик события на сохранение данных, а не обновление
        editCategoryObj.btnSave.removeEventListener('click', patchHandler);
        // Вешаем обработчик событий на кнопку "Отмена"
        // Когда мы на неё нажимаем вызывается функция cancelChange которая отменит внесенные и несохраненные до этого пользователем изменения и перенаправит его на главную страницу
        editCategoryObj.btnCancel.addEventListener('click', cancelChange);
    });

    // Вешаем обработчик события по клику на categoryList (список с карточками категорий)
    // И делаем выборку по event target'y 
    // Функция должна быть асинхронная так как бы в ней будем использовать await для получчения данных от сервера (данные из категории - пары слов в ней)
    categoryObj.categoryList.addEventListener('click', async (e) => {
        // Получаем event target и помещаем его в константу таргет
        const target = e.target;
        // Выясняем на какую карточку произошел клик
        // Используем метод closest и передаем туда класс нашей карточки. target это тот элемент на который мы кликнули, closest начинаент поиск указанного селектора с того элемента на который мы кликнули, а потом начинает подниматься наверх пока этот элемент не встретит и как встретит завернёт его в переменную categoryItem, если не встретит - вернёт null
        const categoryItem = target.closest('.category__item');

        // Если клик произошел по значку редактировать карточку 
        if (target.closest('.category__edit')) {
            // Берём данные этой категории (пары слов занесенные в эту категорию)
            // Записываем в константу dataCards - выполненный результат функции fetchCards
            // В функцию fetchCards передаем id категории по которой кликнули для редактирования с помощью обращения к константе categoryItem которая по сути является тем на что кликнули и представляет из себя li элемент у которого есть дата атрибут data-id
            // Используем await именно, чтобы должаться нормального ответа с сервера, чтобы получить не промис, а объект
            const dataCards = await fetchCards(categoryItem.dataset.id);
            // Выполняем для всех секции функцию очистики allSectionUnmount
            allSectionUnmount();
            // Меняем заголовок у header на редактирование
            headerObj.updateHeaderTitle('Редактирование');
            // Обращаемся к editCategory и методу mount и туда внутрь передаем dataCards, чтобы вывести данные с сервера о парах слов составленных в этой категории
            editCategoryObj.mount(dataCards);
            // Вешаем обработчик событий на кнопку "Сохранить"
            // Когда мы на неё нажимаем вызывается функция patchHandler (для обновления данных в редактируемой категории)
            editCategoryObj.btnSave.addEventListener('click', patchHandler);
            // Удаляем обработчик события с кнопки сохранить, который мог быть установлен при создании категории, тогда у нас будет работать только обработчик события на обновление данных, а не сохранение
            editCategoryObj.btnSave.removeEventListener('click', postHandler);
            // Вешаем обработчик событий на кнопку "Отмена"
            // Когда мы на неё нажимаем вызывается функция cancelChange которая отменит внесенные и несохраненные до этого пользователем изменения и перенаправит его на главную страницу
            editCategoryObj.btnCancel.addEventListener('click', cancelChange);

            return;
        };

        // Если клик произошел по значку удалить карточку 
        if (target.closest('.category__del')) {
            // Запрос пользователю, уверен ли он что хочет удалить выбранную категорию?
            if (confirm('Вы уверены что хотите удалить категорию?')) {
                // Если пользователь ответил что Да
                // Вызываем функцию FetchDeleteCategory для удаления категории и передаем в неё id категории которую нужно удалить
                // Результат помещаем в переменную result
                const result = fetchDeleteCategory(categoryItem.dataset.id);
           
                // Если в result прилетел error, выводим alert с этой ошибкой
                if (result.error) {
                    showAlert(result.error.message);
                    // Пропишем return чтобы не записывать else
                    return;
                }
                
                // Если ошибки никакой вызвано не было и всё успешно удалилось, вызываем alert о том что удаление произошло успешно
                showAlert('Категория удалена!');
                // Так как при успешном выполнении функции мы получим пустой массив
                // Удалим и со страницы categoryItem, т.е. тело карточки категории
                categoryItem.remove()
            }

            // Заканчиваем выполнение
            return;
        };

        // Если клик был именно по самой карточке, а не по элементам редактировать или удалить
        if (categoryItem) {
            // Берём данные этой категории (пары слов занесенные в эту категорию)
            // Записываем в константу dataCards - выполненный результат функции fetchCards
            // В функцию fetchCards передаем id категории по которой кликнули чтобы открыть первую карточки с парой слов из этой категории с помощью обращения к константе categoryItem которая по сути является тем на что кликнули и представляет из себя li элемент у которого есть дата атрибут data-id
            // Используем await именно, чтобы должаться нормального ответа с сервера, чтобы получить не промис, а объект
            const dataCards = await fetchCards(categoryItem.dataset.id);
            // Закрываем все секции которые были открыты
            allSectionUnmount();
            // Меняем заголовок у header на название категории по которой кликнули
            headerObj.updateHeaderTitle(dataCards.title);
            // Рендерим карточку с парой слов с помощью вызова функции mount у pairsObj передавая в неё данные о категориях полученных из базы данных
            pairsObj.mount(dataCards);
        };
    });

    // Вещаем обработчик события на кнопку для возвращения к категориям из секции с карточкой, чтобы вернуться назад
    // Обращаемся к кнопке buttonReturn из pairsObj и по клику вызываем функцию renderIndex, которая выведет главное окно с категориями
    pairsObj.buttonReturn.addEventListener('click', renderIndex);
};

// Вызываем главную функцию initApp для запуска приложения
initApp();