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
    button.textContent = "Remove";
    button.onclick = () => { removePlayer(player.name); };
    action.appendChild(button);
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
    button.textContent = "Remove";
    button.onclick = () => { removeContest(contest.name); };
    action.appendChild(button);
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

function loadPlayer(players) {
    console.log("Loaded players")
    const table = document.getElementById("playersBody");
    players.forEach(insertPlayer);
}

function loadContests(contests) {
    console.log("Loaded contests")
    const table = document.getElementById("contestsBody");
    contests.forEach(insertContest);
}

let driver = new Driver(onPlayerAdded, onPlayerChanged, onPlayerRemoved, onContestAdded, onContestRemoved);
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

document.getElementById("addPlayer").onclick = () => {session.setPlayer(prompt("Nom du joueur"), prompt("Equipe du joueur"))};
document.getElementById("addContest").onclick = () => {session.addContest(prompt("Nom de l'épreuve"))};

function removePlayer(name) {
    session.removePlayer(name);
}

function removeContest(name) {
    session.removeContest(name);
}
