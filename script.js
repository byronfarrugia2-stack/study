// ===== DARK MODE =====

const darkModeBtn = document.getElementById("darkModeBtn");

if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark");
}

darkModeBtn?.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

});

// ===== TIMETABLE =====

const plannerBody =
document.getElementById("plannerBody");

let currentActivity = "study";

const activities =
document.querySelectorAll(".activity");

activities.forEach(activity => {

    activity.addEventListener("click", () => {

        activities.forEach(a =>
            a.classList.remove("selected")
        );

        activity.classList.add("selected");

        currentActivity =
        activity.dataset.type;

    });

});

if(activities[0]){
    activities[0].classList.add("selected");
}

function createPlanner(){

    if(!plannerBody) return;

    for(let hour=4; hour<=23; hour++){

        const row =
        document.createElement("tr");

        const time =
        document.createElement("td");

        let displayHour =
        hour > 12 ? hour - 12 : hour;

        let suffix =
        hour >= 12 ? "PM" : "AM";

        time.textContent =
        `${displayHour}:00 ${suffix}`;

        row.appendChild(time);

        for(let day=0; day<7; day++){

            const cell =
            document.createElement("td");

            cell.dataset.day = day;
            cell.dataset.hour = hour;

            cell.addEventListener(
                "click",
                () => paintCell(cell)
            );

            row.appendChild(cell);

        }

        plannerBody.appendChild(row);

    }

}

function paintCell(cell){

    const types = [
        "study",
        "sleep",
        "school",
        "commute",
        "social",
        "meal",
        "exercise",
        "chore",
        "entertainment",
        "downtime"
    ];

    types.forEach(type =>
        cell.classList.remove(type)
    );

    cell.classList.add(
        currentActivity
    );

    savePlanner();
}

function savePlanner(){

    const cells =
    document.querySelectorAll(
        "#plannerTable td"
    );

    const data = [];

    cells.forEach(cell => {

        data.push({
            day:cell.dataset.day,
            hour:cell.dataset.hour,
            className:cell.className
        });

    });

    localStorage.setItem(
        "plannerData",
        JSON.stringify(data)
    );

}

function loadPlanner(){

    const saved =
    JSON.parse(
        localStorage.getItem(
            "plannerData"
        )
    );

    if(!saved) return;

    saved.forEach(item => {

        const cell =
        document.querySelector(
            `[data-day="${item.day}"][data-hour="${item.hour}"]`
        );

        if(cell){
            cell.className =
            item.className;
        }

    });

}

// ===== ASSIGNMENTS =====

const tasks =
JSON.parse(
    localStorage.getItem("tasks")
) || [];

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

function renderTasks(){

    const container =
    document.getElementById("taskList");

    if(!container) return;

    container.innerHTML = "";

    tasks.forEach(task => {

        const card =
        document.createElement("div");

        card.className =
        "assignment-item";

        card.innerHTML = `
            <strong>${task.subject}</strong><br>
            ${task.name}<br>
            Weighting: ${task.weight}%<br>
            Due: ${task.due}
        `;

        container.appendChild(card);

    });

    const count =
    document.getElementById(
        "assignmentCount"
    );

    if(count){
        count.textContent =
        tasks.length;
    }

}

document
.getElementById("addTask")
?.addEventListener("click", () => {

    const subject =
    document.getElementById("subject").value;

    const name =
    document.getElementById("taskName").value;

    const weight =
    document.getElementById("weighting").value;

    const due =
    document.getElementById("dueDate").value;

    if(!subject || !name || !due){
        return;
    }

    tasks.push({
        subject,
        name,
        weight,
        due
    });

    saveTasks();
    renderTasks();

});

// ===== FLASHCARDS =====

const flashcards =
JSON.parse(
localStorage.getItem(
"flashcards"
)
) || [];

function renderFlashcards(){

    const container =
    document.getElementById(
        "flashcards"
    );

    if(!container) return;

    container.innerHTML = "";

    flashcards.forEach(card => {

        const div =
        document.createElement("div");

        div.className =
        "flashcard";

        div.innerHTML =
        `<strong>${card.question}</strong>`;

        div.addEventListener(
            "click",
            () => {

                div.innerHTML =
                div.innerHTML.includes(
                    card.question
                )
                ? card.answer
                : `<strong>${card.question}</strong>`;

            }
        );

        container.appendChild(div);

    });

}

document
.getElementById(
"addFlashcard"
)
?.addEventListener(
"click",
() => {

    const question =
    document
    .getElementById(
    "flashQuestion"
    ).value;

    const answer =
    document
    .getElementById(
    "flashAnswer"
    ).value;

    if(!question || !answer) return;

    flashcards.push({
        question,
        answer
    });

    localStorage.setItem(
        "flashcards",
        JSON.stringify(
            flashcards
        )
    );

    renderFlashcards();

});

// ===== POMODORO =====

let timerSeconds = 1500;
let interval;

const timer =
document.getElementById(
"timer"
);

function updateTimer(){

    let mins =
    Math.floor(
        timerSeconds / 60
    );

    let secs =
    timerSeconds % 60;

    timer.textContent =
    `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

}

document
.getElementById("startTimer")
?.addEventListener("click", () => {

    clearInterval(interval);

    interval = setInterval(() => {

        timerSeconds--;

        updateTimer();

        if(timerSeconds <= 0){

            clearInterval(
                interval
            );

            alert(
                "Pomodoro Complete!"
            );

        }

    },1000);

});

document
.getElementById("pauseTimer")
?.addEventListener("click", () => {

    clearInterval(interval);

});

document
.getElementById("resetTimer")
?.addEventListener("click", () => {

    clearInterval(interval);

    timerSeconds = 1500;

    updateTimer();

});

// ===== STARTUP =====

createPlanner();
loadPlanner();
renderTasks();
renderFlashcards();
updateTimer();
