import { createElement } from "../helper/createElement.js"
import { showAlert } from "./showAlert.js";

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

    // Функция контроллер за карточкой со словами
    const cardController = (data) => {
        // Задаем переменной index значение 0, значение будет изменяться, чтобы шагать по тем данным data которые нам приходят с севрера (бегать по индексам)
        let index = 0;

        // Для карточки front подставляем textContent из переданных данных БД data и индекс указываем с помошью переменной index и как по индексу подключились к нужной паре слов указываем нулевой индекс чтобы обратиться к первому слову из этой пары
        front.textContent = data[index][0];

        // Для карточки back подставляем textContent из переданных данных БД data и индекс указываем с помошью переменной index и как по индексу подключились к нужной паре слов указываем первый индекс чтобы обратиться ко второму слову из этой пары
        back.textContent = data[index][1];

        // Функция для переворачивания карточки
        const flipCard = () => {
            // Добавляем элементу buttonCard класс card__item_flipped
            buttonCard.classList.add('card__item_flipped');

            // Удаляем обработчик события с клика по карточке, чтобы после первого клика как мы зашли в функцию flipCard нельзя было многократно прокликивать слова и они мелькали бы без анимаций
            buttonCard.removeEventListener('click', flipCard);

            // Запускаем setTimeout, чтобы переворачивать карту обратно с back на front, нужно задать адекватное время, чтобы человек успел прочитать текст и карточка перевернулась. Сет таймаут принимает два параметра, функцию и потом время
            setTimeout(() => {
                // Удаляем класс card__item_flipped который переворачивает карточку посредством css, тогда карточка перевернется назад на переднюю часть
                buttonCard.classList.remove('card__item_flipped');
                // Создаем вложенный setTimeout чтобы в момент переворачивания карточки обратно уже было подставлено следующее слова из следующей пары и это не было заметно глазу
                // В css анимация для rotate задается с помощью transition и оно 0.2s, значит тут нужно чтобы было ровно половина, то есть 100 мс
                setTimeout(() => {
                    // Увеличиваем значение переменной index на 1
                    index += 1;
                    // Если индекс обошел все пары в категории
                    if (index === data.length) {
                        // Когда мы закончили обходить наши пары слов - пишем на карточке что мы закончили
                        front.textContent = 'Вы молодец! Категория пройдена! Вы всегда сможете проверить себя и пройти её заново';
                        // Вызываем алерт с помощью функции showAlert о том что сейчас вернемся к списку категорий
                        // Последняя надпись на карточке будет держаться 5 секунд, поэтому сделаем чтобы алерт появился через 3 секунды и исчез через 2, чтобы одновременно произошел переход к категориям и пропал алерт
                        setTimeout(() => {
                            showAlert('Вернемся к категориям!', 2000);
                        }, 3000)
                        // Задаем таймаут, что с паузой выполнить действие
                        setTimeout(() => {
                            // Делаем автоматический клик по кнопке "назад", чтобы вернутся к категориями
                            buttonReturn.click();
                        }, 5000);
                        // Чтобы дальше никуда по функции выполнять ничего не шли и не могло произойти что-то лишнее
                        return
                    }

                    // Записываем новые значения в карточки (из следующей пары, так как индекс уже увеличился на 1)
                    front.textContent = data[index][0];
                    back.textContent = data[index][1];
                    
                    // Создаем ещё один таймаут для того чтобы обработчик события по клику на карточку не сразу опять становился активным для переключения карточки (чтобы не было так, что можно спамить по карточке и быстро они бы переворачивались)
                    setTimeout(() => {
                        // Возвращаем обработчик события по клику на карточку, так как анимация для одной пары уже закончилась и можно кликать менять на следующую
                        buttonCard.addEventListener('click', flipCard);
                    }, 250);
                }, 100);
            }, 1000)
        };

        // Добавляем обработчик события по клику на карточку и вызываем функцию flipCard
        buttonCard.addEventListener('click', flipCard);
    };

    // Функция для рендера созданых pairs (пар слов - карточки)
    // Получаем переданные данные data (о категориях) в функцию
    const mount = (data) => {
        // Вставляем секцию pairs в элемент app в котором нужно эту секцию отобразить
        app.append(pairs);
        // Вызываем функцию cardController для переворачивания карточек и передаем в неё data.pairs из базы данных (именно список этих пар, смысла передавать весь объект пришедший из БД нет, можно сразу указать что нам нужны только pairs)
        cardController(data.pairs);
    };

    // Функция для очистки секции pairs
    const unmount = () => {
        // Удаляем секцию pairs
        pairs.remove();
    };

    // Возвращаем из функции createPairs - элемент buttonReturn и функции mount, unmount
    return { buttonReturn, mount, unmount };
};