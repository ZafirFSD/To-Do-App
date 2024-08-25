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
}

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

    document.querySelectorAll(".delete").forEach(button => {
        button.onclick = () => {
            taskToDelete = button.parentNode;
            modal.style.display = 'flex';
        }
    });

    document.querySelectorAll(".edit").forEach(button => {
        button.onclick = (e) => {
            let taskElement = e.target.closest(".task");
            if (!taskElement.querySelector(".task-check").checked) {
                newTaskInput.value = taskElement.querySelector(".taskname").innerText;
                taskElement.remove();
                taskCount--;
                displayCount(taskCount);
            }
        };
    });

    document.querySelectorAll(".task-check").forEach(checkbox => {
        checkbox.onchange = () => {
            checkbox.nextElementSibling.classList.toggle("completed");
            taskCount += checkbox.checked ? -1 : 1;
            displayCount(taskCount);
        };
    });

    taskCount++;
    displayCount(taskCount);
    newTaskInput.value = "";
};

confirmDeleteButton.addEventListener('click', () => {
    if (taskToDelete) {
        if (!taskToDelete.querySelector(".task-check").checked) {
            taskCount--;
            displayCount(taskCount);
        }
        taskToDelete.remove();
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
    taskCount = 0;
    displayCount(taskCount);
    newTaskInput.value = "";
}
