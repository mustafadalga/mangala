import { Timestamp } from "@firebase/firestore";

/**
 * Describes a gamer's state and properties.
 */
export interface Gamer {
    id: string | null;
    treasure: Stone[];
    pits: Pit[];
}

/**
 * Represents the raw format of a gamer with pits stored in a structured format.
 */
export interface GamerRaw extends Omit<Gamer, "pits"> {
    pits: PitsRaw;
}

/**
 * Describes the state and properties of a game room.
 */
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

/**
 * Represents the raw format of a room with gamers' data in a structured format.
 */
export interface RoomRaw extends Omit<Room, "gamer1" | "gamer2"> {
    gamer1: GamerRaw;
    gamer2: GamerRaw;
}

/**
 * Represents the user profile information.
 */
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

/**
 * Represents a 2D position with left and top coordinates.
 */
export interface Position {
    left: number,
    top: number
}

/**
 * Describes the threshold values for a position.
 */
export interface PositionThreshold {
    minLeft: number,
    minTop: number,
    maxLeft: number,
    maxTop: number
}

/**
 * Represents a stone with its properties.
 */
export interface Stone {
    no: number,
    color: string
}

/**
 * Represents a stone with its associated position.
 */
export interface StoneWithPosition {
    stone: Stone,
    position: Position
}

/** Represents a pit which is an array of stones. */
export type Pit = Stone[];

/** Represents multiple pits. */
export type Pits = Pit[];

/**
 * Represents the raw format of pits with each pit defined explicitly.
 */
export type PitsRaw = {
    pit1: Pit,
    pit2: Pit,
    pit3: Pit,
    pit4: Pit,
    pit5: Pit,
    pit6: Pit
}
