import { PlayerAction, PlayerActionTypes } from "@/types/player";
import { ITrack } from "@/types/track";

export const playTrack = (): PlayerAction => {
    return {type: PlayerActionTypes.PLAY}
}

export const pauseTrack = (): PlayerAction => {
    return {type: PlayerActionTypes.PAUSE}
}

export const setVolume = (volume: number): PlayerAction => {
    return {type: PlayerActionTypes.SET_VOLUME, payload: volume}
}

export const setDuration = (duration: number): PlayerAction => {
    return {type: PlayerActionTypes.SET_DURATION, payload: duration}
}

export const setCurrentTime = (currentTime: number): PlayerAction => {
    return {type: PlayerActionTypes.SET_CURRENT_TIME, payload: currentTime}
}

export const setActiveTrack = (payload: ITrack): PlayerAction => {
    return {type: PlayerActionTypes.SET_ACTIVE, payload}
}