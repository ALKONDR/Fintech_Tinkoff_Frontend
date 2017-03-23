"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;


var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

var showAllTodosButton = getFilterWithAttribute('all');
var showDoneTodosButton = getFilterWithAttribute('done');
var showUndoneTodosButton = getFilterWithAttribute('todo');

// сформируем задачки
var todoList = [
    {
        name: 'Позвонить в сервис',
        status: 'todo'
    },
    {
        name: 'Купить хлеб',
        status: 'done'
    },
    {
        name: 'Захватить мир',
        status: 'todo'
    },
    {
        name: 'Добавить тудушку в список',
        status: 'todo'
    }
];

var doneTodoList = []
var undoneTodoList = []

// функция по генерации элементов
function addTodoFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status === 'todo');

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    var target = event.target;
    var element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        let todoName = element.children[1].textContent;
        changeTodoStatusByName(todoName, !element.classList.contains('task_todo'));
        updateDoneAndUndoneLists();
        if (getFilterWithAttribute('all').classList.contains('filters__item_selected'))
            changeTodoStatus(element);
        else {
            deleteTodo(element);
            if (getFilterWithAttribute('done').classList.contains('filters__item_selected'))
                changeStats(+1, -1, 0);
            else
                changeStats(+1, +1, 0);
        }
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        let todoName = element.children[1].textContent;
        removeTodoByName(todoName);
        updateDoneAndUndoneLists();
        deleteTodo(element);
    }
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function changeTodoStatus(element) {
    var isTodo = element.classList.contains('task_todo');
    setTodoStatusClassName(element, !isTodo);
    if (isTodo)
        changeStats(0, +1, -1);
    else
        changeStats(0, -1, +1);
}

function deleteTodo(element) {
    var isTodo = element.classList.contains('task_todo');
    if (isTodo)
        changeStats(-1, 0, -1);
    else
        changeStats(-1, -1, 0);
    listElement.removeChild(element);
}

function onInputKeydown(event) {
    if (event.keyCode !== 13) {
        return;
    }

    var ENTER_KEYCODE = 13;
    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    var todo = createNewTodo(todoName);
    todoList.push(todo);
    updateDoneAndUndoneLists();
    loadAllTodosTable();
    // insertTodoElement(addTodoFromTemplate(todo));
    inputElement.value = '';
    changeStats(+1, 0, +1);
}

function checkIfTodoAlreadyExists(todoName) {
    var todoElements = listElement.querySelectorAll('.task__name');
    var namesList = Array.prototype.map.call(todoElements, function (element) {
        return element.textContent;
    });
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: 'todo'
    }
}

function removeTodoByName(todoName) {
    todoList.forEach(element => {
        if (element.name === todoName) {
            todoList.splice(todoList.indexOf(element), 1);
            return;
        }
    });
}

function changeTodoStatusByName(todoName, changeStatusOnToDo) {
    todoList.forEach(element => {
        if (element.name === todoName){
            if (changeStatusOnToDo && !(element.status === 'todo'))
                element.status = 'todo';
            else
                element.status = 'done';
        }
    });
}

function changeGivenStat(statisticElement, increaseValue) {
    let newValue = parseInt(statisticElement.textContent) + increaseValue;
    statisticElement.textContent = String(newValue);
}

function changeStats(increaseAllTodos, increaseDoneTodos, increaseUndoneTodos) {
    let allTodos = document.querySelector('.statistic__total');
    let doneTodos = document.querySelector('.statistic__done');
    let undoneTodos = document.querySelector('.statistic__left');

    changeGivenStat(allTodos, increaseAllTodos);
    changeGivenStat(doneTodos, increaseDoneTodos);
    changeGivenStat(undoneTodos, increaseUndoneTodos);
}

function unselectGivenFilter(filter) {
    if (filter.classList.contains('filters__item_selected'))
        filter.classList.remove('filters__item_selected');
}

function unselectAllFilters() {
    let allFilters = document.querySelector('.filters').children;
    Array.prototype.map.call(allFilters, unselectGivenFilter);
}

function getFilterWithAttribute(dataFilterValue) {
    let filters = document.querySelector('.filters').children;
    let ansFilter;
    Array.prototype.forEach.call(filters, (element) => {
        if (element.attributes[0].value === dataFilterValue)
            ansFilter = element;
    });
    return ansFilter;
}

function clearTodoTable() {
    document.querySelector('.list').innerHTML = '';
}

function prepareTableForLoading(dataFilterValue) {
    clearTodoTable();
    unselectAllFilters();
    getFilterWithAttribute(dataFilterValue).classList.add('filters__item_selected');
}

function loadGivenList(listOfTodosToLoad) {
    listOfTodosToLoad.map(addTodoFromTemplate).forEach(insertTodoElement);
}

function loadAllTodosTable() {
    prepareTableForLoading('all');
    loadGivenList(todoList);
}

function loadDoneTodosTable() {
    prepareTableForLoading('done');
    loadGivenList(doneTodoList);
}

function loadUndoneTodosTable() {
    prepareTableForLoading('todo');
    loadGivenList(undoneTodoList);
}

function updateDoneAndUndoneLists(){
    doneTodoList = todoList.filter(el => el.status === 'done');
    undoneTodoList = todoList.filter(el => el.status === 'todo');
}

updateDoneAndUndoneLists();

loadAllTodosTable();

listElement.addEventListener('click', onListClick);

showAllTodosButton.addEventListener('click', loadAllTodosTable);
showDoneTodosButton.addEventListener('click', loadDoneTodosTable);
showUndoneTodosButton.addEventListener('click', loadUndoneTodosTable);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

function insertTodoElement(elem) {
    listElement.insertBefore(elem, listElement === [] ? null : listElement.firstChild);
}
