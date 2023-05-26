import { createElement } from "../helper/createElement.js";

// Функция createHeader которая принимает в себя элемент header
export const createHeader = (parent) => {

    // Создали элемент container
    const headerContainer = createElement('div', {
        className: 'container header__container',
    });
    // headerContainer.className = 'container header__container';

    // Добавили элемент headerContainer в header
    parent.append(headerContainer);

    // Создали элемент headerLogoLink
    const headerLogoLink = createElement('a', {
        className: 'header__logo-link',
        href: '#',
    });

    // Создали элемент headerLogo
    const headerLogo = createElement('img', {
        src: './img/logo.svg',
        className: 'header__logo',
        alt: 'Логотип сервиса Brain Cards',
    });

    // Добавили элемент logo в headerLogoLink
    headerLogoLink.append(headerLogo);

    // Создали элемент headerTitle
    const headerTitle = createElement('h2', {
        className: 'header__subtitle',
        textContent: 'Категории',
    });

    // Создали элемент headerBtn
    const headerBtn = createElement('button', {
        className: 'header__btn',
        textContent: 'Добавить категорию',
    });

    // Добавили элементы headerLogoLink, headerTitle, headerBtn в headerContainer 
    headerContainer.append(headerLogoLink, headerTitle, headerBtn);

    // Функция updateHeaderTitle которая принимает в себя какой-то переданный текст 'title' и перезаписывает (меняет) textContent у элемента headerTitle
    const updateHeaderTitle = (title) => { 
        headerTitle.textContent = title;
    };

    // Из функции возвращаются элемент с логотипом и элемент с кнопкой 'Добавить категорию', чтобы потом отдельно при импорте этой функции повесить какой-то функционал на эти элементы в другом месте (не прописывать здесь)
    // Также из функции createHeader возвращается функция updateHeaderTitle
    return { headerLogoLink, headerBtn, updateHeaderTitle };

};