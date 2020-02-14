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

  const deleteAllController = async () => {
    for (const { id } of mdl.getTodos()) {
      const element = document.querySelector(`.todo__item[data-id="${id}"]`);
      await vw.deleteTodo(element, 500);
      mdl.deleteTodo(id);
    }


     /* mdl.getTodos().forEach(async ({id}) => {
        const element = document.querySelector(`.todo__item[data-id="${id}"]`);
        await vw.deleteTodo(element);
        await new Promise(resolve => setTimeout(resolve, 1000));
        mdl.deleteTodo(id);
        console.log("l")
     }); */
  };

  const allController = activate => {
    mdl.getTodos().forEach(todo => {
      if (!(todo.completed - activate)) {
        mdl.toggleCompleted(todo.id);
        vw.toggleCompleted(todo);
      }
    });
  }

  elements.addForm.addEventListener("submit", addController);
  elements.todoList.addEventListener("click", todoController);
  elements.activeAll.addEventListener("click", allController.bind(null, true));
  elements.completeAll.addEventListener("click", allController.bind(null, false));
  elements.deleteAll.addEventListener("click", deleteAllController);

  return {
    initializate: async () => {
      mdl.retrieveData();
      for (const todo of mdl.getTodos()) {
        await vw.renderTodo(todo, 100);
      }
    },

    write: e => {
      if (e.charCode === 13 && vw.getInput() !== "") addController.call(null, e);
      else if (e.key) vw.write();
    },

    test: () => {
      let now = new Date();
      let secondsCount = 0;
      setInterval(() => {
        if ((new Date() - now) % 1000 <= 10) {
          secondsCount++;
          console.log(`Han pasado ${secondsCount} segundos.`);
        }
      }, 10);
    }
  };
})(model, view);

window.addEventListener("load", controller.initializate);
window.addEventListener("keypress", controller.write);
