export interface Gamer {
    id: string | null;
    treasure: number;
    pits: number[];
}

export interface Room {
    isGameStarted: boolean;
    isGameCompleted: boolean;
    winnerGamer: null | string;
    gameOwner: string,
    moveOrder: string;
    gamer1: Gamer;
    gamer2: Gamer;
}

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

export interface Position {
    left: number,
    top: number
}

export interface PositionThreshold {
    minLeft: number,
    minTop: number,
    maxLeft: number,
    maxTop: number
}