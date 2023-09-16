"use strict";
// -----------------------------------------------------------------------------------//
// SIDEBAR START
// -----------------------------------------------------------------------------------//
const sideBar = document.querySelector("#sidebar");
const sideBarClose = document.querySelector("#sidbar-hide");
const sideBarOpen = document.querySelector("#sidbar-show");

sideBarClose.addEventListener("click", () => {
    sideBar.classList.add("hidden");
})

sideBarOpen.addEventListener("click", () => {
    sideBar.classList.remove("hidden");
})

// document.onclick = (e) => {
//     if (sideBarOpen.classList.contains("hidden") && 
//         !sideBar.contains(e.target) &&
//         !sideBarOpen.contains(e.target)) {
//             sideBarClose.click();
//     }
// };

// -----------------------------------------------------------------------------------//
// SIDEBAR END
// -----------------------------------------------------------------------------------//


// -----------------------------------------------------------------------------------//
// EVENT LISTENER FUNCTIONS START
// -----------------------------------------------------------------------------------//

// -----------------------------------------------------------------------------------//
// EVENT LISTENER FUNCTIONS END
// -----------------------------------------------------------------------------------//


// -----------------------------------------------------------------------------------//
// HELPER FUNCTIONS START
// -----------------------------------------------------------------------------------//
function findParent(e, tag) {
    let parent = e.target;
    while (parent.tagName !== tag)
    {
        parent = parent.parentElement;
    }
    return parent;
}

function setActiveTaskTitle(title) {
    document.querySelector("#active-task-title").innerText = title;
}

async function createTaskElement(task) {

    let div = document.createElement("DIV")
    let classNames = "bg-gray-100 rounded-md p-3 flex justify-between items-center md:space-x-5 task".split(" ")
    if (task.complete) {
        classNames.push("done")
    }
    if (activeTask && activeTask.id == task.id) {
        div.setAttribute("active", "true");
        setActiveTaskTitle(task.title);

    }
    for (let className of classNames) {
        div.classList.add(className)
    }
    div.innerHTML =`<input type="checkbox" name="" id="${task.id}">
        <p>${task.title}</p>
        <span class="flex space-x-1">
            <span class="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 complete">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>                      
            </span>
            <span class="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 remove">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>                          
            </span>
        </span>`
    return div;
}

async function createStepElement(step) {

    let div = document.createElement("DIV")
    let classNames = "bg-gray-100 rounded-md p-3 flex justify-between items-center step".split(" ")
    if (step.complete) {
        classNames.push("done")
    }
    for (let className of classNames) {
        div.classList.add(className)
    }
    div.innerHTML =`<input type="checkbox" name="" id="">
        <p>${step.title}</p>
        <span class="flex space-x-2">
            <span class="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 complete">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>                      
            </span>
            <span class="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 remove">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>                          
            </span>
        </span>`
    return div;
}

function removeActiveFromSiblings(element) {
    console.log(element)
    let parent = element.parentElement;
    let children = parent.children;
    Array.from(children).forEach((child) => {
        if (child !== element && child.hasAttribute("active")) {
            child.removeAttribute("active");
        }
    })
}

function addListenersToTasks() {
    const tasks = document.querySelectorAll(".task");
    const completeTicks = document.querySelectorAll("#tasks-container .complete");
    const removeBtns = document.querySelectorAll("#tasks-container .remove");

    tasks.forEach((task) => {
        task.addEventListener("click", (e) => {
            let taskDiv = findParent(e, "DIV");
            let id = taskDiv.firstElementChild.id;
            taskDiv.setAttribute("active", "true");
            activeTask = getTask(id)
            setActiveTaskTitle(activeTask.title);
            removeActiveFromSiblings(taskDiv);
            populateSteps();
        })
    })
    

    completeTicks.forEach((tick) => {
        tick.addEventListener("click", (e) => {
            let parent = findParent(e, "DIV");
            let id = parent.firstElementChild.id;
            let task = getTask(id)
            if (!confirm("Are you sure you want to mark as completed?")) {
                return;
            }
            markTaskAsComplete(task);
            saveData();
            populateTasks();
        })
    })

    removeBtns.forEach((remove) => {
        remove.addEventListener("click", (e) => {
            let parent = findParent(e, "DIV");
            let id = parent.firstElementChild.id;
            let task = getTask(id)
            if (!confirm(`Are you sure you want to remove ${task.title}? `)) {
                return;
            }
            data = data.filter((_task) => _task !== task);
            saveData();
            populateTasks();
        })
    })
}

function addListenersToSteps() {
    const completeTicks = document.querySelectorAll("#steps-container .complete");
    const removeBtns = document.querySelectorAll("#steps-container .remove");

    completeTicks.forEach((completeTick) => {
        completeTick.addEventListener("click", (e) => {
            let parent = findParent(e, "DIV");
            let title = parent.firstElementChild.nextElementSibling.innerText;
            let checkbox = parent.firstElementChild;
            if (!confirm("Are you sure you want to mark as completed?")) {
                return;
            }
            if (parent.classList.contains("done") && !checkbox.checked)
            {
                checkbox.click();
            }
            let index = getActiveTaskIndex()
            for (let step of data[index].steps) {
                if (step.title === title ) {
                    step.complete = true;
                }
            }
            saveData();
            populateSteps();
        });
    })

    removeBtns.forEach((removeBtn) => {
        removeBtn.addEventListener("click", (e) => {
            let parent = findParent(e, "DIV");
            let title = parent.firstElementChild.nextElementSibling.innerText;
            if (!confirm("Are you sure you want to remove this step?")) {
                return;
            }
            let index = getActiveTaskIndex()
            data[index].steps = data[index].steps.filter((step) => {
                return step.title !== title
            })
            saveData();
            parent.remove();
        });
    })

}

function getTask(id) {
    for (let task of data)
    {
        if (task.id == id) {
            return task
        }
    }
}

function getActiveTaskIndex() {
    let i = 0;
    for (let task of data) {
        if (task.id == activeTask.id) {
            return i;
        }
        i++;
    }
}

function markTaskAsComplete(task) {
    task.complete = true;
    for (let step of task.steps) {
        step.complete = true;
    }
}

function getSelectedTasksIds() {
    let tasks = tasksContainer.children;
    let ids = [];
    for (let task of tasks) {
        let checkbox = task.firstElementChild;
        if (checkbox.checked) {
            ids.push(checkbox.id);
        }
    }
    return ids;
}

function getSelectedStepsTitles() {
    let steps = stepsContainer.children;
    let titles = [];
    for (let step of steps) {
        let checkbox = step.firstElementChild;
        let title = checkbox.nextElementSibling.innerText;
        if (checkbox.checked) {
            titles.push(title);
        }
    }
    return titles;
}
// -----------------------------------------------------------------------------------//
// HELPER FUNCTIONS END
// -----------------------------------------------------------------------------------//


// -----------------------------------------------------------------------------------//
// MAIN FUNCTIONS START
// -----------------------------------------------------------------------------------//

// GENERAL
function saveData() {
    localStorage.setItem("data", JSON.stringify(data));
    console.log(data);
}

function loadData() {
    data = JSON.parse(localStorage.getItem("data")) ?? [];
}

async function populateTasks() {
    tasksContainer.innerHTML =""
    loadData()
    for (let task of data) {
        let t = await createTaskElement(task)
        tasksContainer.appendChild(t);
    }
    addListenersToTasks();
}

async function populateSteps() {
    stepsContainer.innerHTML = "";
    loadData();
    if (activeTask) {
        let steps = activeTask.steps; 
        let emptyStepsInfo = document.querySelector("#empty-steps")
        if (steps.length === 0) {
            emptyStepsInfo.classList.remove("hidden");
        } else {
            emptyStepsInfo.classList.add("hidden");
        }
        for (let step of steps) {
            let s = await createStepElement(step)
            stepsContainer.appendChild(s);
        }
        addListenersToSteps();
    }
}


// TASK ACTIONS
const addTaskBtn = document.querySelector("#add-task");
addTaskBtn.addEventListener("click", () => {
    let task = {};
    let taskTitle = prompt("Enter task title");
    if (taskTitle.length === 0) {
        return;
    }
    let taskId = Math.floor(Math.random() * 2000);
    task = {
        id: taskId,
        complete: false,
        title: taskTitle,
        steps: []
    };

    data.push(task);
    saveData();
    populateTasks();
})

//remove all
const removeAllTasksBtn = document.querySelector("#remove-all-tasks");
removeAllTasksBtn.addEventListener("click", () => {
    if (!confirm("This will erase all the tasks")) {
        return;
    }
    data = [];
    saveData();
    populateTasks();
    activeTask = null;
    populateSteps()
})

// remove partial
const removeSelectedTasksBtn = document.querySelector("#remove-selected-tasks");
removeSelectedTasksBtn.addEventListener("click", () => {
    if (!confirm("This will erase selected the tasks")) {
        return;
    }
    let ids = getSelectedTasksIds();
    console.log(ids);
    data = data.filter((task) => {
        return !ids.includes(String(task.id))
    })
    saveData()
    populateTasks()
})
// mark partial as completed
const markSelectedTasksBtn = document.querySelector("#mark-selected-tasks");
markSelectedTasksBtn.addEventListener("click", () => {
    if (!confirm("This will mark selected the tasks as completed")) {
        return;
    }
    let ids = getSelectedTasksIds();
    console.log(ids);
    for (let task of data) {
        if (ids.includes(String(task.id))) {
            markTaskAsComplete(task);
        }
    }
    saveData()
    populateTasks()
})

// mark all as completed
const markAllTasksBtn = document.querySelector("#mark-all-tasks");
markAllTasksBtn.addEventListener("click", () => {
    if (!confirm("This will mark all the tasks as completed")) {
        return;
    }
    for (let task of data) {
        markTaskAsComplete(task);
    }
    saveData()
    populateTasks();
})

// STEPS ACTIONS

// add step
const addStepBtn = document.querySelector("#add-step");
addStepBtn.addEventListener("click", () => {
    let step = {};
    if (!activeTask) {
        alert("Please select a task first!");
        return;
    }
    let stepTitle = prompt(`Enter Step for ${activeTask.title}`) ?? "";
    if (stepTitle.length === 0) {
        return;
    }
    step = {
        complete: false,
        title: stepTitle,
    };
    for (let s of activeTask.steps) {
        if (s.title === step.title) {
            alert("That step already exists!");
            return;
        }
    }
    if (activeTask) {
        activeTask.steps.push(step);
        activeTask.complete = false;
        let i = getActiveTaskIndex();
        data[i] = activeTask;
        saveData();
        populateSteps();
        populateTasks();
    } else {
        console.log("no active");
    }
})
// remove all
const removeAllStepsBtn = document.querySelector("#remove-all-steps");
removeAllStepsBtn.addEventListener("click", () => {
    if (!confirm(`This will erase all the steps for ${activeTask.title}`)) {
        return;
    }
    activeTask.steps = [];
    activeTask.complete = false;
    let i = getActiveTaskIndex(activeTask.id);
    data[i] = activeTask;   
    saveData();
    populateSteps();
    populateTasks();
})

// remove partial
const removeSelectedStepsBtn = document.querySelector("#remove-selected-steps");
removeSelectedStepsBtn.addEventListener("click", () => {
    if (!confirm(`This will erase selected the steps for ${activeTask.title}`)) {
        return;
    }

    let titles = getSelectedStepsTitles()
    activeTask.steps = activeTask.steps.filter((step) => !titles.includes(step.title))
    let i = getActiveTaskIndex(activeTask.id);
    data[i] = activeTask;   
    saveData();
    populateSteps();
})
// mark partial as completed
const markSelectedStepsBtn = document.querySelector("#mark-selected-steps");
markSelectedStepsBtn.addEventListener("click", () => {
    if (!confirm(`This will mark selected steps for ${activeTask.title} as completed`)) {
        return;
    }

    let titles = getSelectedStepsTitles()
    activeTask.steps = activeTask.steps.map((step) => {
        if (titles.includes(step.title)) {
            step.complete = true;
        }
        return step;
    })
    let i = getActiveTaskIndex(activeTask.id);
    data[i] = activeTask;   
    saveData();
    populateSteps();
})
// mark all as completed
const markAllStepsBtn = document.querySelector("#mark-all-steps");
markAllStepsBtn.addEventListener("click", () => {
    if (!confirm(`This will mark all the steps for ${activeTask.title} as completed`)) {
        return;
    }
    markTaskAsComplete(activeTask);
    let i = getActiveTaskIndex();
    data[i] = activeTask;   
    saveData();
    populateSteps();
    populateTasks();
})

// -----------------------------------------------------------------------------------//
// MAIN FUNCTIONS END
// -----------------------------------------------------------------------------------//


// -----------------------------------------------------------------------------------//
// INITIALIZATION START
// -----------------------------------------------------------------------------------//
let activeTask = null;
let data;
loadData();

const tasksContainer = document.querySelector("#tasks-container");
const stepsContainer = document.querySelector("#steps-container");
populateTasks();

// -----------------------------------------------------------------------------------//
// INITIALIZATION END
// -----------------------------------------------------------------------------------//



// taskId: int {
//     id: int
//     complete: bool,
//     title: str,
//     tasks: [
//              {
//                 complete: bool;
//                 title: str
//              },
//     ]
// }



