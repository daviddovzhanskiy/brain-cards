// Функция createElement, которая принимает в себя тэг и его атрибуты
export const createElement = (tag, options) => {

    // Создается элемент переданный в функцию
    const element = document.createElement(tag);

    // Переданные в функцию атрибуты записываются в созданный элемент
    Object.assign(element, options);

    // Из функции возвращается созданный и заполненный атрибутами элемент
    return element;
}