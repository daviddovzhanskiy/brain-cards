import { createElement } from "../helper/createElement.js"
import { declOfNum } from "../helper/declOfNum.js";

// Функция createCategory которая принимает в себя элемент app
export const createCategory = (app) => {

    // Создаем элемент section
    const category = createElement('section', {
        className: 'category section-offset',
    });

    // Создаем элемент container
    const categoryContainer = createElement('div', {
        className: 'container',
    });

    // Добавяем элемент container в section
    category.append(categoryContainer);

    // Создаем элемент ul (список)
    const categoryList = createElement('ul', {
        className: 'category__list',
    });

    // Добавляем в контейнер элемент ul в котором будут лежать карточки
    categoryContainer.append(categoryList);

    // Функция для создания карточки (li элементов по сути), которая принимает данные на основе которых формирует карточку
    const createCategoryCard = (data) => {
        // Создаём элемент li (который будет наполнять, чтобы сделать из этого карточку)
        const item = createElement ('li', {
            className: 'category__item',
        });

        // Дата-атрибуты добавлять как способом выше неудобно, поэтому
        // Мы в li (item) используем специальный объект dataset (который содержит дата-атрибуты)
        // И задаём атрибуту data-id айди из переданных data (данных которые мы передаем в функцию, например разделы title, id у категории)
        item.dataset.id = data.id;

        // Добавляем в список ul где будут храниться все карточки li, элемент item (li-карточку) 
        categoryList.append(item);

        // Создаём элемент button который входит в состав элемента li (карточки)
        const itemButtonTitle = createElement ('button', {
            className: 'category__card',
        });

        // Создаём элемент button который входит в состав элемента li (карточки)
        const itemButtonEdit = createElement ('button', {
            className: 'category__btn category__edit',
            ariaLabel: 'редактировать',
        });

        // Создаём элемент button который входит в состав элемента li (карточки)
        const itemButtonDelete = createElement ('button', {
            className: 'category__btn category__del',
            ariaLabel: 'удалить',
        });

        // Добавляем в карточку li её составные элементы button 
        item.append(itemButtonTitle, itemButtonEdit, itemButtonDelete);

        // Создаём элемент span который входит в состав элемента li (карточки)
        const itemSpanTitle = createElement ('span', {
            className: 'category__title',
            textContent: data.title,
        });

        // Создаём элемент span который входит в состав элемента li (карточки)
        const itemSpanPairs = createElement ('span', {
            className: 'category__pairs',
            // Вызываем функцию declOfNum в которую передаем количество пар слов и массив с возможными склонениями слова "пара"
            // Она соответственно заполняет в верном склонении относительно числительного - количество пар слов в категории с карточками
            textContent: declOfNum(data.length, ['пара', 'пары', 'пар']),
        });

        // Добавляем в button title её составные элементы span
        itemButtonTitle.append(itemSpanTitle, itemSpanPairs);

        // Возвращаем из функции созданный, заполненный item (карточку)
        return item;
    }

    // Функция для добавления блока с карточками
    const mount = (data) => {
        // Очищаем список карточек, вдруг там уже какие-то карточки сформировались до этого
        categoryList.textContent = '';
        // Добавляем секцию category в элемент app
        app.append(category);
        // Создаем карточки исходя из данных, которые поступили в функцию mount
        // Перебераем данные с помощью метода map и вызываем функцию createCategoryCard
        // Таким образом функция createCategoryCard будет вызываться столько раз сколько данных в переданных данных в функцию mount - data
        const cards = data.map(createCategoryCard);
        // В константе cards у нас оказался массив с данными (элементами)
        // Добавляем созданные карточки в список с карточками
        // Чтобы передать массив элементов в список, воспользуемся спрэд оператором "..."
        categoryList.append(...cards);
    }

    // Функция для удаления блока с карточками
    const unmount = () => {
        // Удаляем элемент (секцию) категорий со страницы с помощью метода remove
        category.remove();
    }

    // Возвращаем из функции createCategory, функции mount, unmount и categoryList (чтобы потом на него повесить обработчик событий)
    return { mount, unmount, categoryList };
}