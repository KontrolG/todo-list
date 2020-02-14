'use strict';

const view = (() => {
  const elements = {
    addForm: document.querySelector(".add__form"),
    addInput: document.querySelector(".add__input"),
    todoList: document.querySelector(".todos"),
    itemCount: document.querySelector(".items__count"),
    activeAll: document.querySelector(".active"),
    completeAll: document.querySelector(".complete"),
    deleteAll: document.querySelector(".delete"),
  };

  const updateCount = () => {
    /* no contar los completados. */
    const count = document.querySelectorAll(".todo__item").length;
    elements.itemCount.textContent = `${count < 1 ? "No" : count} item${count !== 1 ? "s" : ""} left`;
  };

  return {
    elements,
    getInput: () => elements.addInput.value.trim(),
    clearInput: () => elements.addInput.value = "",
    renderTodo: ({id, title, completed, createdAt, completedAt}) => {
      const markup = `<li class="todo__item ${completed ? "done" : ""}" data-id="${id}">
        <button class="btn__check">
          <i class="ion-checkmark"></i>
        </button>
        <h2>${title}</h2>
        <div class="info">
          <h4 class="created__at">Create at:</h4><p class="created__date">${new Date(createdAt).toLocaleDateString()}</p> <br>
          <h4 class="completed__at">Completed at:</h4><p class="completed__date">${new Date(completedAt).toLocaleDateString()}</p>
        </div>
        <i class="btn__delete ion-close"></i>
      </li>`;
      elements.todoList.insertAdjacentHTML("afterbegin", markup);
      updateCount();
    },
    toggleCompleted: ({id, completedAt}) => {
      const element = document.querySelector(`li.todo__item[data-id="${id}"]`);
      element.classList.toggle("done");
      
      const completedAtElement = document.querySelector(`li.todo__item[data-id="${id}"] .completed__date`);
      completedAtElement.textContent = new Date(completedAt).toLocaleDateString();      
    },
    deleteTodo: (element) => {
      /* Animaciones, etc */
      element.remove();
      updateCount();
    },

    activeAll: () => {
      const liElements = Array.from(document.querySelectorAll(".todo__item.done"));

      liElements.forEach(element => element.classList.remove("done"));

      updateCount();
    }
  };
})();