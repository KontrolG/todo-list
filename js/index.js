'use strict';

const controller = ((mdl, vw) => {
  const { elements } = vw;

  const submitController = e => {
      e.preventDefault();
      const title = vw.getInput();
      if (title !== "") {
        vw.clearInput();
        addController(title);
      }
      
  };

  const addController = title => {
    const newTodo = mdl.addTodo(title);
    vw.renderTodo(newTodo);
  }

  const toggleController = id => {
    const newTodo = mdl.toggleCompleted(id);
    vw.toggleCompleted(newTodo);
  }

  const deleteController = async id => {
    await vw.deleteTodo(id);
    mdl.deleteTodo(id);
  }

  const todoController = e => {
    const id = parseInt(e.target.closest(".todo__item").dataset.id, 10);
    if (e.target.matches(".btn__delete")) deleteController(id);
    else if (e.target.matches(".todo__item, .todo__item *")) toggleController(id);
  }

  const deleteAllController = async () => {
    for (const { id } of mdl.getTodos()) await deleteController(id);
  };

  const allController = activate => {
    mdl.getTodos().forEach(({id, completed}) => {
      if (!(completed - activate)) toggleController(id);
    });
  }

  elements.addForm.addEventListener("submit", submitController);
  elements.todoList.addEventListener("click", todoController);
  elements.activeAll.addEventListener("click", allController.bind(null, true));
  elements.completeAll.addEventListener("click", allController.bind(null, false));
  elements.deleteAll.addEventListener("click", deleteAllController);

  return {
    initializate: async () => {
      mdl.retrieveData();
      for (const todo of mdl.getTodos()) {
        await vw.renderTodo(todo, 350);
      }
    },

    write: e => {
      if (e.charCode === 13 && vw.getInput() !== "") submitController.call(null, e);
      else if (e.key) vw.write();
    }
  };
})(model, view);

window.addEventListener("load", controller.initializate);
window.addEventListener("keypress", controller.write);
