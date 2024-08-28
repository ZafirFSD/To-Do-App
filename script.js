const addButton = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const taskContainer = document.querySelector("#tasks");
const error = document.getElementById('error');
const countValue = document.querySelector(".count-value");
const modal = document.getElementById('confirmation-modal');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');
let taskCount = 0;
let taskToDelete = null;

const displayCount = (count) => {
    countValue.innerText = count;
};

const saveTasksToLocalStorage = () => {
    const tasks = [];
    document.querySelectorAll(".task").forEach(taskElement => {
        const taskName = taskElement.querySelector(".taskname").innerText;
        const isChecked = taskElement.querySelector(".task-check").checked;
        tasks.push({ name: taskName, completed: isChecked });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskHTML = `
            <div class="task">
                <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
                <span class="taskname ${task.completed ? "completed" : ""}">${task.name}</span>
                <button class="edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        taskContainer.insertAdjacentHTML("beforeend", taskHTML);
        if (!task.completed) taskCount++;
    });
    displayCount(taskCount);

    addEventListenersToTasks();
};

const addTask = () => {
    const taskName = newTaskInput.value.trim();
    error.style.display = 'none';

    if (!taskName) {
        setTimeout(() => {
            error.style.display = 'block';
        }, 200);
        return;
    }

    const taskHTML = `
        <div class="task">
            <input type="checkbox" class="task-check">
            <span class="taskname">${taskName}</span>
            <button class="edit">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    taskContainer.insertAdjacentHTML("beforeend", taskHTML);

    taskCount++;
    displayCount(taskCount);
    saveTasksToLocalStorage();
    newTaskInput.value = "";

    addEventListenersToTasks();
};

const addEventListenersToTasks = () => {
    document.querySelectorAll(".delete").forEach(button => {
        button.onclick = () => {
            taskToDelete = button.parentNode;
            modal.style.display = 'flex';
        };
    });

    document.querySelectorAll(".edit").forEach(button => {
        button.onclick = (e) => {
            let taskElement = e.target.closest(".task");
            if (!taskElement.querySelector(".task-check").checked) {
                newTaskInput.value = taskElement.querySelector(".taskname").innerText;
                taskElement.remove();
                taskCount--;
                displayCount(taskCount);
                saveTasksToLocalStorage();
            }
        };
    });

    document.querySelectorAll(".task-check").forEach(checkbox => {
        checkbox.onchange = () => {
            checkbox.nextElementSibling.classList.toggle("completed");
            taskCount += checkbox.checked ? -1 : 1;
            displayCount(taskCount);
            saveTasksToLocalStorage();
        };
    });
};

confirmDeleteButton.addEventListener('click', () => {
    if (taskToDelete) {
        if (!taskToDelete.querySelector(".task-check").checked) {
            taskCount--;
            displayCount(taskCount);
        }
        taskToDelete.remove();
        saveTasksToLocalStorage();
        taskToDelete = null;
    }
    modal.style.display = 'none';
});

cancelDeleteButton.addEventListener('click', () => {
    taskToDelete = null;
    modal.style.display = 'none';
});

addButton.addEventListener("click", addTask);

newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask();
    }
});

window.onload = () => {
    loadTasksFromLocalStorage();
    newTaskInput.value = "";
};
