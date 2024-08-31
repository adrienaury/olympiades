import { Driver } from "./driver.js";

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
    let player = row.insertCell(0);
    player.innerHTML = score.player;
    let contest = row.insertCell(1);
    contest.innerHTML = score.contest;
    let points = row.insertCell(2);
    points.innerHTML = score.points;
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
    players.forEach(insertPlayer);
}

function loadContests(contests) {
    console.log("Loaded contests")
    contests.forEach(insertContest);
}

function loadScores(scores) {
    console.log("Loaded contests")
    scores.forEach(insertScore);
}

let driver = new Driver(onPlayerAdded, onPlayerChanged, onPlayerRemoved, onContestAdded, onContestRemoved, onScoreAdded);
let session = driver.getSession("test");

session.open();

session.setPlayer("Thierry", "Rouge");
session.setPlayer("Claire", "Jaune");
session.setPlayer("Samuel", "Bleu");
session.setPlayer("Thibault", "Jaune");
session.setPlayer("Nadège", "Rouge");
session.setPlayer("Adrien", "Bleu");
session.addContest("Mot commun");
session.addContest("Toucher");
session.addContest("Quizz");
session.addContest("Boîtes");
session.addContest("Fléchettes");
session.addContest("Basket");
session.addContest("Quilles");

session.getPlayers(loadPlayer);
session.getContests(loadContests);
session.getScores(loadScores);

document.getElementById("addPlayer").onclick = () => {session.setPlayer(prompt("Nom du joueur"), prompt("Equipe du joueur"))};
document.getElementById("addContest").onclick = () => {session.addContest(prompt("Nom de l'épreuve"))};
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
