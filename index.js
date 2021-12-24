window.onload = () =>{
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    if(todoList && todoList.length > 0){
        document.querySelector(".empty-todo-list-message").style.display = "none";
        renderTodoList(todoList);
    }else{
        localStorage.setItem("todoList", JSON.stringify([]));
    }

    document.querySelector(".add-todo-input").addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            addTodoItem();
        }
    });
}

const addTodoItem = () =>{
    const input = document.querySelector(".add-todo-input");
    if (input.value.trim().length === 0) {
        return document.querySelector(".warning").style.display = "block";
    }else{
        document.querySelector(".warning").style.display = "none";
    }
    const todoList = [...JSON.parse(localStorage.getItem("todoList")), {id: uuid(), todoItem: input.value, isCompleted: false}];
    localStorage.setItem("todoList", JSON.stringify(todoList));
    input.value = "";
    renderTodoList(JSON.parse(localStorage.getItem("todoList")));
}

const editTodo = (id, btn) =>{
    const newVal = btn.parentNode.previousSibling.previousSibling.children[1].value;
    const todoList = JSON.parse(localStorage.getItem("todoList")).map(todo =>{
        if(todo.id === id){
            return {...todo, todoItem: newVal}
        }else{
            return todo;
        }
    })
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList(todoList);
}

const completeTodo = (id) =>{
    const todoList = JSON.parse(localStorage.getItem("todoList")).map(todo =>{
        if(todo.id === id){
            return {...todo, isCompleted: !todo.isCompleted};
        }else{
            return todo;
        }
    })
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList(todoList);
}

const completeAllTodo = () =>{
    const todoList = JSON.parse(localStorage.getItem("todoList")).map(todo => {return {...todo, isCompleted: true}})
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList(todoList);
}

const deleteTodo = (id) =>{
    const todoList = JSON.parse(localStorage.getItem("todoList")).filter(todo => todo.id !== id);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList(todoList);
}

const deleteAllTodo = () =>{
    localStorage.setItem("todoList", JSON.stringify([]));
    renderTodoList([]);
}

const searchTodoItem = () =>{
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    const keyword = document.querySelector(".search-input").value.toLowerCase();
    let result = todoList.filter(todo => todo.todoItem.toLowerCase().includes(keyword));
    renderTodoList(result);
}

const clearSearchText = () =>{
    document.querySelector(".search-input").value = "";
    renderTodoList(JSON.parse(localStorage.getItem("todoList")));
}

const filter = () =>{
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    const selectedFilter = document.getElementById("filter-section").value;

    if (todoList) {
        switch (selectedFilter) {
            case "completed":
                filterProgress(true);
                break;
            case "inProgress":
                filterProgress(false);
                break;
            default:
                renderTodoList(todoList);
                break;
        }
    }
}

const filterProgress = (isCompleted) =>{
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    const completedList = todoList.filter(todo => todo.isCompleted === isCompleted);
    renderTodoList(completedList);
}

const renderTodoList = (todoList) =>{
    const todoItemContainer = document.getElementById("todo-list");
    todoItemContainer.innerHTML = "";
    document.querySelector(".todo-item-number").innerHTML = `Total todo item: ${todoList.length}`;

    for (let todo of todoList) {
        const {id, todoItem, isCompleted} = todo;
        const item = `<li data-id="${id}" class="todo-item">
                    <div class="todo-item-left-container">
                        <input id="completed-checkbox" type="checkbox" ${isCompleted && "checked disabled"} style="${isCompleted && "cursor: default;"}" onClick="completeTodo('${id}')">
                        <input class="todo-item-value" value="${todoItem}" style="${isCompleted && "text-decoration: line-through; cursor: default"}" ${isCompleted && "disabled"} />
                    </div>
                    <div class="todo-item-right-container">
                        <button type="button" id="edit-btn" class="material-icons" ${isCompleted && "disabled"} style="${isCompleted && "cursor: default;"}" onclick="editTodo('${id}',this)">edit</button>
                        <button type="button" id="delete-btn" class="material-icons" onclick="deleteTodo('${id}')">delete</button>
                    </div>
                </li>`;
        todoItemContainer.insertAdjacentHTML("afterbegin", item);
    }
}

const uuid = () =>{
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}