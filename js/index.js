'use strict';

const controller = ((mdl, vw) => {
  const { elements } = vw;

  const addController = e => {
      e.preventDefault();
      const title = vw.getInput();
      if (title !== "") {
        vw.clearInput();
        
        const newTodo = mdl.addTodo(title);

        vw.renderTodo(newTodo);
      }
      
  };

  const toggleController = (element, id) => {
    const newTodo = mdl.toggleCompleted(id);
    vw.toggleCompleted(newTodo);
  }

  const deleteController = (element, id) => {
    vw.deleteTodo(element);
    mdl.deleteTodo(id);
  }

  const todoController = e => {
    const liItem = e.target.closest(".todo__item");
    const id = parseInt(liItem.dataset.id, 10);
    if (e.target.matches(".btn__delete")) deleteController(liItem, id);
    else if (e.target.matches(".todo__item, .todo__item *")) toggleController(liItem, id);
  }

  const activeAllController = () => {
    /* Se deben realizar bucles en ambos modules, hallar la manera de realizar un solo bucle aqui. */
    mdl.activeAll();
    vw.activeAll();
  }

  elements.addForm.addEventListener("submit", addController);
  elements.todoList.addEventListener("click", todoController);
  elements.activeAll.addEventListener("click", activeAllController);

  return {
    initializate: () => {
      mdl.retrieveData();
      mdl.getTodos().forEach(todo => {
        vw.renderTodo(todo);
      });
    }
  };
})(model, view);

window.addEventListener("load", controller.initializate);
