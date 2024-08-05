// جافاسكريبت
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const completionSound = new Audio('../media/ding-sound-effect_2.mp3');

// تحديث دالة addTask
function addTask(taskText, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item${completed ? ' completed' : ''}`;
    taskItem.innerHTML = `
        <input type="checkbox" class="task-complete" ${completed ? 'checked' : ''}>
        <span class="task-text">${escapeHtml(taskText)}</span>
        <div class="task-actions" style="width: 100px;">
            <button class="editBtn task-edit" title="تعديل">
                <svg height="1em" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                </svg>
            </button>
            <button class="bin-button task-delete" title="حذف">
                <svg class="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                    <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
                </svg>
                <svg class="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-inside-1_8_19" fill="white">
                        <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path>
                    <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
                    <path d="M21 6V29" stroke="white" stroke-width="4"></path>
                </svg>
            </button>
        </div>
    `;
    taskList.appendChild(taskItem);
    attachEventListeners(taskItem);
    saveTasksToLocalStorage();
}


function deleteTask() {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
        const taskItem = this.closest('.task-item');
        taskList.removeChild(taskItem);
        saveTasksToLocalStorage();
    }
}

function editTask() {
    const taskItem = this.closest('.task-item');
    const taskText = taskItem.querySelector('.task-text');
    const newText = prompt('قم بتعديل المهمة', taskText.innerText);
    if (newText !== null && newText.trim() !== '') {
        taskText.innerText = newText.trim();
        saveTasksToLocalStorage();
    }
}

// تحديث دالة completeTask
function completeTask() {
    const taskItem = this.closest('.task-item');
    const wasCompleted = taskItem.classList.contains('completed');
    taskItem.classList.toggle('completed');

    if (!wasCompleted) {
        // تشغيل الصوت فقط عند إكمال المهمة، وليس عند إلغاء إكمالها
        playCompletionSound();
    }

    saveTasksToLocalStorage();
}

// دالة جديدة لتشغيل الصوت
function playCompletionSound() {
    completionSound.currentTime = 0; // إعادة تعيين الصوت إلى البداية
    completionSound.play().catch(error => console.error('فشل تشغيل الصوت:', error));
}

// تحديث دالة attachEventListeners
function attachEventListeners(taskItem) {
    taskItem.querySelector('.task-delete').addEventListener('click', deleteTask);
    taskItem.querySelector('.task-edit').addEventListener('click', editTask);
    taskItem.querySelector('.task-complete').addEventListener('change', completeTask);
}

function saveTasksToLocalStorage() {
    const tasks = Array.from(taskList.children).map(taskItem => ({
        text: taskItem.querySelector('.task-text').innerText,
        completed: taskItem.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        JSON.parse(savedTasks).forEach(task => addTask(task.text, task.completed));
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function init() {
    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const taskText = this.value.trim();
            if (taskText) {
                addTask(taskText);
                this.value = '';
            }
        }
    });

    loadTasksFromLocalStorage();
}

init();

// في ملف JavaScript الرئيسي
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }