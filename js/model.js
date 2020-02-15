'use strict';

const model = (() => {
  const todos = [];

  const getID = function () {
    const actualID = localStorage.getItem("id");
    const newID = actualID ? parseInt(actualID, 10) + 1 : 0;
    
    localStorage.setItem("id", newID);

    return newID;
  }

  const persistData = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }


  return {
    getTodos: () => [...todos],

    addTodo: title => {
      const newTodo = {
        id: getID(),
        title,
        createdAt: new Date(),
        completed: false,
        completedAt: null
      };
      todos.push(newTodo);
      persistData();
      return newTodo;
    },

    toggleCompleted: id => {
      const todo = todos.find(todo => todo.id === id);
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date() : null;
      persistData();
      return todo;
    },

    deleteTodo: id => {
      const index = todos.findIndex(todo => todo.id === id);
      todos.splice(index, 1);
      persistData();
    },

    retrieveData: () => {
      const storage = JSON.parse(localStorage.getItem("todos"));
      if (storage) todos.push(...storage);
    }
  };
})();