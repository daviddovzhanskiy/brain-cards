import { createHeader } from "./components/createHeader.js";

// Главная функция initApp
const initApp = () => {

    // Создаём переменную headerParent и помещаем в неё элемент с классом .header
    const headerParent = document.querySelector('.header');

    // Создаём переменную app и помещаем в неё элемент id которого app
    const app = document.querySelector('#app');

    // Вызываем функцию createHeader и передаем в неё элемент headerParent
    // И записываем в константу headerObj всё что возвращается из функции createHeader
    const headerObj = createHeader(headerParent);

    // Функция returnIndex для сброса названия заголовка в дефолтное
    const returnIndex = (e) => {
        // сбрасываем чтобы по клику ничего не происходило (перезагрузка страницы и тд)
        e.preventDefault();
        // записываем (сбрасываем предыдущее) в элемент-заголовок HeaderTitle основное, главное значение-текст 'Категории' 
        headerObj.updateHeaderTitle('Категории')
    };

    // На логотип добавляем событие по клику, которое вызывает функцию returnIndex
    headerObj.headerLogoLink.addEventListener('click', returnIndex);

    // На кнопку 'Добавить категорию' добавляем событие по клику
    headerObj.headerBtn.addEventListener('click', () => {
        // записываем (сбрасываем предыдущее) в элемент-заголовок HeaderTitle значение-текст 'Новая категория'
        headerObj.updateHeaderTitle('Новая категория')
    })
};

// Вызываем главную функцию initApp для запуска приложения
initApp();