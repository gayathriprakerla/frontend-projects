// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', () => {
        if (taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target.parentElement.getAttribute('data-id'));
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(e.target.parentElement.getAttribute('data-id'));
        } else if (e.target.classList.contains('complete-btn')) {
            toggleCompletion(e.target.parentElement.getAttribute('data-id'));
        }
    });

    function addTask(taskText) {
        const taskId = Date.now().toString();
        const task = {
            id: taskId,
            text: taskText,
            completed: false
        };
        saveTaskToLocalStorage(task);
        renderTask(task);
    }

    function saveTaskToLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => renderTask(task));
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function deleteTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.querySelector(`[data-id='${taskId}']`).remove();
    }

    function editTask(taskId) {
        const taskText = prompt('Edit Task:', document.querySelector(`[data-id='${taskId}']`).querySelector('span').textContent);
        if (taskText) {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks = tasks.map(task => {
                if (task.id === taskId) {
                    task.text = taskText;
                }
                return task;
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            document.querySelector(`[data-id='${taskId}']`).querySelector('span').textContent = taskText;
        }
    }

    function toggleCompletion(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const taskElement = document.querySelector(`[data-id='${taskId}']`);
        taskElement.classList.toggle('completed');
        taskElement.querySelector('.complete-btn').textContent = taskElement.classList.contains('completed') ? 'Undo' : 'Complete';
    }
});
