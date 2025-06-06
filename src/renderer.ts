import { v4 as uuid } from 'uuid';
import $ from 'jquery'
import { Task }  from './tasks';

import './index.css';
import { renderSettings } from './settings';

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
    const $catlist = $("#category-list")
    $catlist.html(
        categories.map((c) => `<option value="${c}">`).join('')
    );

    const categoriesList = document.getElementById('categories');
    categoriesList.innerHTML = '';
    if (categoriesList.childElementCount != categories.length)
    {
        categories.sort().forEach((c) => {
            if (savedTasks.some(t => t.category === c && !t.hidden)) {
                const btn = document.createElement('button') as HTMLButtonElement
                btn.className = "category";
                btn.id = `${c}`;
                btn.textContent = `#${c}`;
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    currentFilter = c;

                    render();
                });
                btn.addEventListener('contextmenu', e => {
                    if (!savedTasks.some(t => t.category === c && !t.hidden)) {
                        categories = categories.filter(ct => ct !== c);
                        render();
                    }
                });

                categoriesList.append(btn)
            }
        })
    }

    const list = $('#task-list')
    list.empty()

    categories.filter(c => !currentFilter || currentFilter === c).forEach(cat => {
        const tasks = savedTasks.filter(t => !t.isDone && t.category === cat && !t.hidden);
        if (tasks.length == 0) return;

        const $section = $('<section class="task-section">')
        const $header = $('<h3>').text(cat)
        $section.append($header)

        tasks.forEach((t, i) => {
            const $li = $(`<li id="TASK_${t.id}_${i}" class="task-content"></li>`)
            $li.html(`<input type="checkbox" /><div class="content"><p>${t.content}</p></div>`);

            const $cat = $(`<span class="category">#${cat}</span>`)

            $li.find('.content').append($cat);

            const $check = $li.find('input[type="checkbox"]')
            $check.prop('checked', t.isDone)
            $check.on('change', function() {
                setTaskDone(t, $(this).is(':checked'))
                render();
            })

            $section.append($li);
        })

        list.append($section)
    });

    if (list.children().length === 0) list.text("no tasks!");

    const clear = document.getElementById("clear-filter");
    clear.addEventListener('click', () => {
        currentFilter = '';
        render();
    })
    clear.textContent = `filtering for: ${currentFilter}`;

    clear.hidden = !currentFilter

    const doneList = document.getElementById("done-list");
    const done = savedTasks.filter(t => t.isDone && !t.hidden).slice(0, 5);
    
    const $doneBtn = $( '.done>h3' );
    const doneTxt = `done (${done.length})`;
    $doneBtn.text(doneTxt);
    $doneBtn.on('mouseenter', function() {
        $(this).text("DONE FOR THE DAY?");
    });
    $doneBtn.on('mouseleave', function() {
        $(this).text(doneTxt);
    });

    $doneBtn.on('click', () => {
        hideAllDones(savedTasks);
    });

    doneList.innerHTML = "";
    done.filter(t => !t.hidden).forEach((t, i) => {
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

    renderSettings();
}

function setTaskDone(task: Task, done: boolean) {
    task.isDone = done
    task.doneAt = done ? new Date() : null;
    window.todoAPI.saveTasks(savedTasks);
}

export const hideAllDones = (tasks: Task[]) => {
    const t = tasks.map(t => {
        if (t.isDone && !t.hidden) {
            t.hidden = true;
        }
        return t
    });

    if (t.length == 0) return;

    window.todoAPI.saveTasks(t);
    render();
}
