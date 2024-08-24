import { Contest, Player } from "./driver.js";

export class PlayerAdded {
    session;
    player;
    constructor(session, player) {
        console.assert(typeof session === 'string');
        console.assert(player instanceof Player);

        this.session = typeof session === 'string' ? session : null;
        this.player = player instanceof Player ? player : null;
    }
}

export class PlayerRemoved {
    session;
    player;
    constructor(session, player) {
        console.assert(typeof session === 'string');
        console.assert(player instanceof Player);

        this.session = typeof session === 'string' ? session : null;
        this.player = player instanceof Player ? player : null;
    }
}

export class PlayerChanged {
    session;
    from;
    to;
    constructor(session, from, to) {
        console.assert(typeof session === 'string');
        console.assert(from instanceof Player);
        console.assert(to instanceof Player);

        this.session = typeof session === 'string' ? session : null;
        this.from = from instanceof Player ? from : null;
        this.to = to instanceof Player ? to : null;
    }
}

export class ContestAdded {
    session;
    contest;
    constructor(session, contest) {
        console.assert(typeof session === 'string');
        console.assert(contest instanceof Contest);

        this.session = typeof session === 'string' ? session : null;
        this.contest = contest instanceof Contest ? contest : null;
    }
}

export class ContestRemoved {
    session;
    contest;
    constructor(session, contest) {
        console.assert(typeof session === 'string');
        console.assert(contest instanceof Contest);

        this.session = typeof session === 'string' ? session : null;
        this.contest = contest instanceof Contest ? contest : null;
    }
}
