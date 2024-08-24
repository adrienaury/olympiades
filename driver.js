import { PlayerAdded, PlayerRemoved, PlayerChanged, ContestAdded, ContestRemoved } from "./events.js";

export class Player {
    name;
    team = null;

    constructor(name, team) {
        this.name = name;
        this.team = team;
    }
}

export class Contest {
    name;
    constructor(name) {
        this.name = name;
    }
}

export class Driver {
    onPlayerAdded;
    onPlayerChanged;
    onPlayerRemoved;

    onContestAdded;
    onContestRemoved;

    constructor(onPlayerAdded, onPlayerChanged, onPlayerRemoved, onContestAdded, onContestRemoved) {
        this.onPlayerAdded = onPlayerAdded;
        this.onPlayerChanged = onPlayerChanged;
        this.onPlayerRemoved = onPlayerRemoved;
        this.onContestAdded = onContestAdded;
        this.onContestRemoved = onContestRemoved;
    }

    async listSessions() {
        const dbs = await window.indexedDB.databases();
        return dbs.map(db => new Session(db.name));
    }

    getSession(name) {
        return new Session(name, this.onPlayerAdded, this.onPlayerChanged, this.onPlayerRemoved, this.onContestAdded, this.onContestRemoved);
    }
}

export class Session {
    name;

    onPlayerAdded;
    onPlayerChanged;
    onPlayerRemoved;

    onContestAdded;
    onContestRemoved;

    constructor(name, onPlayerAdded, onPlayerChanged, onPlayerRemoved, onContestAdded, onContestRemoved) {
        this.name = name;
        this.onPlayerAdded = onPlayerAdded;
        this.onPlayerChanged = onPlayerChanged;
        this.onPlayerRemoved = onPlayerRemoved;
        this.onContestAdded = onContestAdded;
        this.onContestRemoved = onContestRemoved;
    }

    open() {
        const request = window.indexedDB.open(this.name, 1);
        request.onerror = (event) => {
            console.error("cannot open session");
        };
        request.onsuccess = (event) => {
            event.target.result;
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("players", { keyPath: "name" });
            db.createObjectStore("contests", { keyPath: "name" });
            db.createObjectStore("scores", { autoIncrement: true });
        };
        return;
    }

    addContest(name) {
        if (name == null || name === "") {
            return;
        }

        const request = window.indexedDB.open(this.name, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("contests").objectStore("contests").get(name).onsuccess = (event) => {
                if (event.target.result) {
                    // nothing
                } else {
                    const contest = new Contest(name);
                    db.transaction("contests", "readwrite").objectStore("contests").add(contest).onsuccess = (event) => {
                        this.onContestAdded(new ContestAdded(this.name, contest));
                    }
                }
            };
        };
    }

    removeContest(name) {
        const request = window.indexedDB.open(this.name, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("contests").objectStore("contests").get(name).onsuccess = (event) => {
                if (event.target.result) {
                    const contest = new Contest(name);
                    db.transaction("contests", "readwrite").objectStore("contests").delete(name).onsuccess = (event) => {
                        this.onContestRemoved(new ContestRemoved(this.name, contest));
                    }
                }
            };
        };
    }

    getContests(callback) {
        const request = window.indexedDB.open(this.name, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("contests").objectStore("contests").getAll().onsuccess = (event) => {
                callback(event.target.result);
            };
        };
    }

    setPlayer(name, team = null) {
        if (name == null || name === "") {
            return;
        }

        if (team === "") {
            team = null;
        }

        const request = window.indexedDB.open(this.name, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("players").objectStore("players").get(name).onsuccess = (event) => {
                if (event.target.result) {
                    if (event.target.result.team != team) {
                        const player = new Player(name, team);
                        const old = new Player(name, event.target.result.team);
                        db.transaction("players", "readwrite").objectStore("players").put(player).onsuccess = (event) => {
                            this.onPlayerChanged(new PlayerChanged(this.name, old, player));
                        }
                    }
                } else {
                    const player = new Player(name, team);
                    db.transaction("players", "readwrite").objectStore("players").add(player).onsuccess = (event) => {
                        this.onPlayerAdded(new PlayerAdded(this.name, player));
                    }
                }
            };
        };
    }

    removePlayer(name) {
        const request = window.indexedDB.open(this.name, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("players").objectStore("players").get(name).onsuccess = (event) => {
                if (event.target.result) {
                    const player = new Player(name, event.target.result.team);
                    db.transaction("players", "readwrite").objectStore("players").delete(name).onsuccess = (event) => {
                        this.onPlayerRemoved(new PlayerRemoved(this.name, player));
                    }
                }
            };
        };
    }

    getPlayers(callback) {
        const request = window.indexedDB.open(this.name, 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("players").objectStore("players").getAll().onsuccess = (event) => {
                callback(event.target.result);
            };
        };
    }
}
