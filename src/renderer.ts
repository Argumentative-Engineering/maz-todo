import { v4 as uuid } from 'uuid';

import './index.css';

type Task = {
    id: string,
    content: string,
    category: string,
    dateAdded: Date,
    isDone: boolean
    doneAt: Date,
}

let currentFilter: string = "";
let savedTasks: Task[] = []
let categories: string[] = []

window.addEventListener('DOMContentLoaded', () => {
    let tasks = loadTasks();

    const input = document.getElementById("task-input") as HTMLInputElement;
    const category = document.getElementById("task-category") as HTMLInputElement;

    const form = document.getElementById("task-form") as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const val = input.value.trim()
        if (val) {
            const c = category.value.trim()
            addTask(val, c);
            render();

            form.reset();
        }
    });

    $( "#task-category" ).autocomplete({
        source: categories
    });

    // render tasks
    render();
});

// @Todo load from file
function loadTasks(): Task[] {
    return savedTasks
}

function addTask(content: string, category: string): [Task, boolean] {
    if (content)
    {
        const t: Task = {
            id: uuid(),
            content: content,
            dateAdded: new Date(),
            isDone: false,
            category: category,
        }

        if (category) {
            if (!categories.includes(category)) {
                categories.push(category)
            }
        }

        savedTasks.push(t)
        save();

        return [t, true];
    }

    return [undefined, false];
}

function save(): boolean {
    return false;
}

function render() {
    loadTasks();

    const list = document.getElementById("task-list")
    list.innerHTML = '';

    if (savedTasks.length === 0) list.textContent = "no tasks!";
    savedTasks.filter(t => !t.isDone && (currentFilter ? t.category === currentFilter : true)).forEach((t, i) => {
        const id = `TASK_${t.id}_${i}`;

        const li = document.createElement('li');
        li.className = "task-content"
        li.id = id
        li.innerHTML = `<input type="checkbox" /><div class="content">${t.content}</div>`;

        if (t.category) {
            const category = document.createElement('span')
            category.className = 'category'
            category.innerText = `#${t.category}`;
            li.querySelector(".content").append(category)
        }

        const check = li.querySelector("input") as HTMLInputElement
        check.checked = t.isDone
        check.addEventListener('change', () => {
            setTaskDone(t, check.checked)
            render()
        })

        if (t.isDone) li.classList.add('done');

        list.append(li)
    })

    const categoriesList = document.getElementById('categories');
    categoriesList.innerHTML = '';
    if (categoriesList.childElementCount != categories.length)
    {
        categories.forEach((c) => {
            const btn = document.createElement('button') as HTMLButtonElement
            btn.className = "category";
            btn.id = `${c}`;
            btn.textContent = `#${c}`;
            btn.addEventListener('click', e => {
                e.preventDefault();
                currentFilter = c;

                render();
            });

            categoriesList.append(btn)
        })

    }

    const clear = document.getElementById("clear-filter");
    clear.addEventListener('click', () => {
        currentFilter = '';
        render();
    })
    clear.textContent = `filtering for: ${currentFilter}`;

    clear.hidden = !currentFilter

    const doneList = document.getElementById("done-list");
    doneList.innerHTML = "";
    savedTasks.filter(t => t.isDone).forEach((t, i) => {
        const id = `TASK_${t.id}_${i}`;

        const li = document.createElement('li');
        li.className = "task-content"
        li.id = id
        li.innerHTML = `<input type="checkbox" /><div class="content">${t.content}</div>`;

        if (t.category) {
            const category = document.createElement('span')
            category.className = 'category'
            category.innerText = `#${t.category}`;
            li.querySelector(".content").append(category)
        }

        const check = li.querySelector("input") as HTMLInputElement
        check.checked = t.isDone
        check.addEventListener('change', () => {
            setTaskDone(t, check.checked)
            render()
        })

        if (t.isDone) li.classList.add('done');

        doneList.append(li)
    });

}

function setTaskDone(task: Task, done: boolean)
{
    task.isDone = done
    task.doneAt = done ? new Date() : null;
}
