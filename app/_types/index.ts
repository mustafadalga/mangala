import { Timestamp } from "@firebase/firestore";

export interface Gamer {
    id: string | null;
    treasure: Stone[];
    pits: Pit[];
}

export interface GamerRaw extends Omit<Gamer, "pits"> {
    pits: PitsRaw;
}


export interface Room {
    isGameStarted: boolean;
    isGameCompleted: boolean;
    winnerGamer: null | string;
    gameOwner: string,
    moveOrder: string;
    moveStartTimestamp: Timestamp | null;
    gamer1: Gamer;
    gamer2: Gamer;
    exitGame?: {
        userId: string | null
    }
}

export interface RoomRaw extends Omit<Room, "gamer1" | "gamer2"> {
    gamer1: GamerRaw;
    gamer2: GamerRaw;
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

export interface Stone {
    no: number,
    color: string
}

export interface StoneWithPosition {
    stone: Stone,
    position: Position
}

export type Pit = Stone[];
export type Pits = Pit[];
export type PitsRaw = {
    pit1: Pit,
    pit2: Pit,
    pit3: Pit,
    pit4: Pit,
    pit5: Pit,
    pit6: Pit
}
