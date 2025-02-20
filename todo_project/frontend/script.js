const API_URL = "http://127.0.0.1:8000"; // Change this if your backend is running on a different URL



// SIGNUP FUNCTION
async function signup(event) {
    event.preventDefault();

    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert("Signup successful! You can now log in.");
    } else {
        alert("Signup failed. Try again.");
    }
}

// LOGIN FUNCTION
async function login(event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const responseData = await response.json();

    if (response.ok) {
        localStorage.setItem("access_token", responseData.access);
        localStorage.setItem("refresh_token", responseData.refresh);
        await fetchUserID(responseData.access);
        alert("Login successful!");
        checkLoginStatus();
    } else {
        alert("Login failed. Check your credentials.");
    }
}

// FETCH USER ID
async function fetchUserID(token) {
    const response = await fetch(`${API_URL}/api/user/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user_id", userData.id);
    }
}

// CHECK LOGIN STATUS
function checkLoginStatus() {
    const user_id = localStorage.getItem("user_id");
    const access_token = localStorage.getItem("access_token");

    if (user_id && access_token) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("task-form").style.display = "block";
        loadTasks();
    } else {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("signup-form").style.display = "block";
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("task-form").style.display = "none";
    }
}

// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    alert("Logged out successfully.");
    checkLoginStatus();
}

// ADD TASK FUNCTION
async function addTask(event) {
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("You must log in first!");
        return;
    }

    const taskData = {
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-description").value,
        priority: document.getElementById("task-priority").value,
        deadline: document.getElementById("task-deadline").value,
        user: user_id
    };

    const response = await fetch(`${API_URL}/api/tasks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(taskData)
    });

    if (response.ok) {
        alert("Task added successfully!");
        loadTasks();
    } else {
        const errorData = await response.json();
        alert(`Failed to add task: ${JSON.stringify(errorData)}`);
    }
}

// LOAD TASKS FUNCTION
async function loadTasks() {
    const response = await fetch(`${API_URL}/api/tasks/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
    });

    if (response.ok) {
        const tasks = await response.json();
        const taskContainer = document.getElementById("tasks-container");
        taskContainer.innerHTML = tasks.map(task => `<p>${task.title} - ${task.priority}</p>`).join("");
    } else {
        console.error("Failed to load tasks");
    }
}

// EVENT LISTENERS
document.getElementById("signup-form").addEventListener("submit", signup);
document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("task-form").addEventListener("submit", addTask);

// CHECK LOGIN STATUS ON PAGE LOAD
checkLoginStatus();

const token = localStorage.getItem('accessToken'); // Get the token from localStorage

fetch('http://127.0.0.1:8000/api/tasks/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,  // Include JWT token
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    console.log('Tasks:', data);  // Debugging: Check what the API returns
    displayTasks(data); // Call a function to show tasks on UI
})
.catch(error => console.error('Error fetching tasks:', error));

function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} - ${task.description}`;
        taskList.appendChild(li);
    });
}

localStorage.setItem('accessToken', response.access);
