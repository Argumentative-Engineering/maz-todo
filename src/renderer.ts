import { v4 as uuid } from 'uuid';
import { Task }  from './tasks';

import './index.css';

let currentFilter: string = "";
let savedTasks: Task[] = []
let categories: string[] = []

window.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();

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

async function loadTasks() {
    const t = await window.todoAPI.loadTasks();
    savedTasks = t;

    savedTasks.forEach(task => {
        addCategory(task.category);
    });
}

function addTask(content: string, category: string): [Task, boolean] {
    if (content) {
        const t: Task = {
            id: uuid(),
            content: content,
            dateAdded: new Date(),
            isDone: false,
            category: category,
            doneAt: undefined
        }

        addCategory(category);

        savedTasks.push(t)
        window.todoAPI.saveTasks(savedTasks);

        return [t, true];
    }

    return [undefined, false];
}

function addCategory(category: string) {
    if (category && !categories.includes(category)) {
        categories.push(category)
    }
}

function render() {
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
        categories.sort().forEach((c) => {
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
    const done = savedTasks.filter(t => t.isDone).slice(0, 5);
    
    $( '.done>h3' ).text(`done (${done.length})`);

    doneList.innerHTML = "";
    done.forEach((t, i) => {
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

    const btnOnTop = $( "#btn-keep-on-top" )
    btnOnTop.on( 'click', async () => {
        const curr = await window.windowAPI.toggleOnTop();
        btnOnTop.text(curr ? `[ON TOP]` : 'ON TOP');
    });
}

function setTaskDone(task: Task, done: boolean) {
    task.isDone = done
    task.doneAt = done ? new Date() : null;
    window.todoAPI.saveTasks(savedTasks);
}
