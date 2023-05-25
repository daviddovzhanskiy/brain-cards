import { createCategory } from "./components/createCategory.js";
import { createHeader } from "./components/createHeader.js";
import { createElement } from "./helper/createElement.js";
import { fetchCategories } from "./service/api.service.js";

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

    // Записываем в константу categories - выполненный результат функции fetchCategories
    // Используем await чтобы дождаться ответа от сервера и получить ответ уже в виде обработанных данных из функции fetchCategories
    // Т.е. мы получаем массив объектов (каждый объект это категория)
    const categories = await fetchCategories();

    // Функция returnIndex для сброса названия заголовка в дефолтное
    // И запуска функции создания блока с карточками
    const returnIndex = async (e) => {
        // Сбрасываем чтобы по клику ничего не происходило (перезагрузка страницы и тд)
        // В асинхронной функции будет ошибка, что нет такого метода preventDefault
        // Для этого после "e" ставим "?", чтобы привент дефолт вызывался только тогда когда он есть
        e?.preventDefault();
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
        headerObj.updateHeaderTitle('Категории')

        // Вызываем функцию mount для создания блока с карточками и передаем туда данные categories
        categoryObj.mount(categories);
    };

    // Вызываем функцию returnIndex, чтобы один раз эотт вызов произошел в начале самостоятельно
    returnIndex();

    // На логотип добавляем событие по клику, которое вызывает функцию returnIndex
    headerObj.headerLogoLink.addEventListener('click', returnIndex);

    // На кнопку 'Добавить категорию' добавляем событие по клику
    headerObj.headerBtn.addEventListener('click', () => {
        // Вызываем функцию unmount чтобы удалить блок с карточками
        categoryObj.unmount();
        // Записываем (сбрасываем предыдущее) в элемент-заголовок HeaderTitle значение-текст 'Новая категория'
        headerObj.updateHeaderTitle('Новая категория')
    })
};

// Вызываем главную функцию initApp для запуска приложения
initApp();