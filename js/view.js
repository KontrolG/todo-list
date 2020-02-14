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

  let toRight = true;

  const updateCount = () => {
    /* no contar los completados. */
    const allCount = document.querySelectorAll(".todo__item").length;
    const completeCount = document.querySelectorAll(".todo__item.done").length;

    const count = allCount - completeCount;
    elements.itemCount.textContent = `${count < 1 ? "No" : count} item${count !== 1 ? "s" : ""} left`;
  };

  const getTimeString = (count, unit) => `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  const getDateString = (count) => count === 1 ? "yesterday" : `${count} days ago`;

  const calculateTimeUnits = miliSeconds => {
    const seconds = Math.floor(miliSeconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return [seconds, minutes, hours, days];
  }

  const getString = (seconds, minutes, hours, days) => {
    if (days) return getDateString(days);
    if (hours) return getTimeString(hours, "hour");
    if (minutes) return getTimeString(minutes, "minute");
    if (seconds) return getTimeString(seconds, "second");
    else return "a moment ago";
  };

  const timeDifference = date => {
    const miliSeconds = new Date() - new Date(date ? date : "");
    return getString(...calculateTimeUnits(miliSeconds));  
  }

  return {
    elements,

    getInput: () => elements.addInput.value.trim(),

    clearInput: () => elements.addInput.value = "",

    renderTodo: async ({id, title, completed, createdAt, completedAt}, ms = 800) => {
      const markup = `<li class="todo__item ${completed ? "done" : ""}" data-id="${id}" style="animation: delete${toRight ? "Right" : "Left"}Animation ${ms / 1000}s reverse">
        <button class="btn__check">
          <i class="ion-checkmark"></i>
        </button>
        <h2>${title}</h2>
        <div class="info">
          <h4 class="created__at">Created:</h4><p class="created__date">${timeDifference(createdAt)}</p> <br>
          <h4 class="completed__at">Completed:</h4><p class="completed__date">${timeDifference(completedAt)}</p>
        </div>
        <i class="btn__delete ion-close"></i>
      </li>`;
      elements.todoList.insertAdjacentHTML("afterbegin", markup);
      toRight = Boolean(Math.floor(Math.random() * 2));
      await new Promise(resolve => setTimeout(resolve, ms));
      updateCount();
    },

    toggleCompleted: ({id, completedAt}) => {
      const element = document.querySelector(`li.todo__item[data-id="${id}"]`);
      element.classList.toggle("done");
      
      const completedAtElement = document.querySelector(`li.todo__item[data-id="${id}"] .completed__date`);
      completedAtElement.textContent = timeDifference(completedAt);    
      updateCount();
    },

    deleteTodo: async (element, ms = 1000) => {
      element.style.animation = `delete${toRight ? "Right" : "Left"}Animation ${ms / 1000}s`;
      toRight = !toRight;
      await new Promise(resolve => setTimeout(resolve, ms));
      element.remove();
      updateCount();   
    },

    activeAll: () => {
      const liElements = Array.from(document.querySelectorAll(".todo__item.done"));

      liElements.forEach(element => element.classList.remove("done"));

      updateCount();
    },

    write: () => {
      elements.addInput.focus();
    }
  };
})();