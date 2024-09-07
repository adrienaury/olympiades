import { Driver } from "./driver.js";

function classement() {
    const classement = document.getElementById("classement");
    const scores = document.getElementById("scoresBody");
    const ranks = new Map();

    classement.innerText="";

    let maxScore = 0;
    
    scores.childNodes.forEach(score => {
        // const contest = score.childNodes[0].innerText;
        const player = score.childNodes[1].innerText;
        const points = score.childNodes[2].innerText;

        let rank = ranks.get(player);
        if (!rank) {
            rank = 0;
        }

        let total = rank + Number(points);

        if (total > maxScore) {
            maxScore = total;
        }

        ranks.set(player, total);
    });
    
    new Map([...ranks.entries()].sort((a, b) => b[1] - a[1])).forEach((points, player) => {
        let row = classement.insertRow();
        row.insertCell(0).outerHTML = `<th scope="row">${player}</th>`;
        row.insertCell(1).outerHTML = `<td style="--size: calc( ${points} / ${maxScore} )">${points}</td>`;
    });
}

function insertSession(session) {
    const table = document.getElementById("sessionsBody");
    let row = table.insertRow();
    let name = row.insertCell(0);
    name.innerHTML = session.name;
    let action = row.insertCell(1);
    action.classList.add("shrink");
    let buttons = document.createElement("div");
    buttons.role = "group";
    buttons.style = "margin: 0";
    action.appendChild(buttons);
    let button = document.createElement("button");
    button.textContent = "Ouvrir";
    button.onclick = () => { loadSession(session.name); };
    buttons.appendChild(button);
    let button2 = document.createElement("button");
    button2.textContent = "Supprimer";
    button2.onclick = () => { deleteSession(session.name); };
    buttons.appendChild(button2);

    // const sessionList = document.getElementById("sessionsList");
    // let option = document.createElement("li");
    // let optionLink = document.createElement("a");
    // optionLink.innerText = session.name;
    // optionLink.href = "#page1";
    // optionLink.onclick = () => { loadSession(session.name); };
    // sessionList.appendChild(option);
    // option.appendChild(optionLink);
    // sessionList.parentElement.removeAttribute('open');
}

function insertPlayer(player) {
    const table = document.getElementById("playersBody");
    let row = table.insertRow();
    row.id = player.name;
    let name = row.insertCell(0);
    name.innerHTML = player.name;
    let team = row.insertCell(1);
    team.innerHTML = player.team;
    let action = row.insertCell(2);
    action.classList.add("shrink");
    let button = document.createElement("button");
    button.textContent = "Supprimer";
    button.onclick = () => { removePlayer(player.name); };
    action.appendChild(button);

    const playerList = document.getElementById("playersList");
    let option = document.createElement("option");
    option.value = player.name;
    playerList.appendChild(option);
}

function insertContest(contest) {
    const table = document.getElementById("contestsBody");
    let row = table.insertRow();
    row.id = contest.name;
    let name = row.insertCell(0);
    name.innerHTML = contest.name;
    let action = row.insertCell(1);
    action.classList.add("shrink");
    let button = document.createElement("button");
    button.textContent = "Supprimer";
    button.onclick = () => { removeContest(contest.name); };
    action.appendChild(button);

    const contestList = document.getElementById("contestsList");
    let option = document.createElement("option");
    option.value = contest.name;
    contestList.appendChild(option);
}

function insertScore(score) {
    const table = document.getElementById("scoresBody");
    let row = table.insertRow(0);
    let contest = row.insertCell(0);
    contest.innerHTML = score.contest;
    let player = row.insertCell(1);
    player.innerHTML = score.player;
    let points = row.insertCell(2);
    points.innerHTML = score.points;
    classement();
}

function onPlayerAdded(event) {
    console.log("Player added on session [" + event.session + "] : name=[" + event.player.name +"] ; team=[" + event.player.team + "]");
    insertPlayer(event.player);
}

function onPlayerChanged(event) {
    console.log("Player changed on session [" + event.session + "] : name=[" + event.to.name +"] ; team=[" + event.from.team + "] => [" + event.to.team + "]");
    const row = document.getElementById(event.from.name);
    row.childNodes[1].innerHTML = event.to.team;
}

function onPlayerRemoved(event) {
    console.log("Player removed on session [" + event.session + "] : name=[" + event.player.name +"] ; team=[" + event.player.team + "]");
    const row = document.getElementById(event.player.name);
    row.remove();
}

function onContestAdded(event) {
    console.log("Contest added on session [" + event.session + "] : name=[" + event.contest.name +"]");
    insertContest(event.contest);
}

function onContestRemoved(event) {
    console.log("Contest removed on session [" + event.session + "] : name=[" + event.contest.name +"]");
    const row = document.getElementById(event.contest.name);
    row.remove();
}

function onScoreAdded(event) {
    console.log("Score added on session [" + event.session + "] : player=[" + event.score.player +"] ; contest=[" + event.score.contest + "] ; points=[" + event.score.points + "]");
    insertScore(event.score);
}

function loadPlayer(players) {
    console.log("Loaded players")
    document.getElementById("playersBody").innerText="";
    players.forEach(insertPlayer);
}

function loadContests(contests) {
    console.log("Loaded contests")
    document.getElementById("contestsBody").innerText="";
    contests.forEach(insertContest);
}

function loadScores(scores) {
    console.log("Loaded scores")
    document.getElementById("scoresBody").innerText="";
    scores.forEach(insertScore);
}

let driver = new Driver(onPlayerAdded, onPlayerChanged, onPlayerRemoved, onContestAdded, onContestRemoved, onScoreAdded);
driver.listSessions().then(sessions => sessions.forEach(insertSession));

let session = null;
location.hash = "#page0";

function loadSession(name) {
    console.log("Loading session %s", name)
    session = driver.getSession(name);
    session.open();
    session.getPlayers(loadPlayer);
    session.getContests(loadContests);
    session.getScores(loadScores);
    classement();
    document.getElementsByName("displaySessionName").forEach(e => e.innerText = name);
    location.hash = "#page1";
}

document.getElementById("addSession").onclick = () => {
    const nameInput = document.getElementById("createSessionName");
    loadSession(nameInput.value);
    insertSession(session);
};
document.getElementById("addPlayer").onclick = () => {
    const nameInput = document.getElementById("createPlayerName");
    const teamInput = document.getElementById("createPlayerTeam");
    session.setPlayer(nameInput.value, teamInput.value);
};
document.getElementById("addContest").onclick = () => {
    const nameInput = document.getElementById("createContestName");
    session.addContest(nameInput.value);
};
document.getElementById("addScore").onclick = () => {
    const playerInput = document.getElementById("createScorePlayer");
    const contestInput = document.getElementById("createScoreContest");
    const scoreInput = document.getElementById("createScoreValue");
    session.addScore(playerInput.value, contestInput.value, scoreInput.value);
};

function removePlayer(name) {
    session.removePlayer(name);
}

function removeContest(name) {
    session.removeContest(name);
}
