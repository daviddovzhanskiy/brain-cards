import { createElement } from "../helper/createElement.js"

// Функция createPairs которая принимает в себя элемент app в который будет рендрится все что мы будем в этой функции создавать, а конкретнее пары Pairs
export const createPairs = (app) => {
     // Создаем с помощью импортированной функции createElement - саму секцию для Pairs
    const pairs = createElement('section', {
        className: 'card section-offset',
    });

    // Создаём элемент div - контейнер
    const container = createElement('div', {
        className: 'container card__container',
    });

    // Создаём элемент button для возврата к категориям
    const buttonReturn = createElement('button', {
        className: 'card__return',
        ariaLabel: 'Возврат к категориям',
    });
    
    // Создаём элемент button, который представляет из себя item в котором будет находится как раз пара каких-то слов
    const buttonCard = createElement('button', {
        className: 'card__item',
    });

    // Создаем элемент span для первого слова в паре
    const front = createElement('span', {
        className: 'card__front',
        textContent: 'One',
    });

    // Создаем элемент span для второго слова в паре
    const back = createElement('span', {
        className: 'card__back',
        textContent: 'Two',
    });

    // Вставляем в элемент buttonCard два элемента span - front и back
    buttonCard.append(front, back);
    // Вставляем в элемент div который является контейнером две кнопки, которая является телом карточки и которая возвращает назад к категориям
    container.append(buttonReturn, buttonCard);
    // Вставляем в секцию pairs наш контейнер с элементами
    pairs.append(container);

    // Функция для рендера созданых pairs (пар слов - карточки)
    // Получаем переданные данные data (о категориях) в функцию
    const mount = (data) => {
        // Вставляем секцию pairs в элемент app в котором нужно эту секцию отобразить
        app.append(pairs);
    };

    // Функция для очистки секции pairs
    const unmount = () => {
        // Удаляем секцию pairs
        pairs.remove();
    };

    // Возвращаем из функции createPairs - элемент buttonReturn и функции mount, unmount
    return { buttonReturn, mount, unmount };
};