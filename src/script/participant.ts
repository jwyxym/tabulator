import { Score, ParticipantObject } from './type.ts';

class  Participant {
    id : number;
    name : string;
    quit : boolean;
    tournamentId : number;
    score : Score;
    deckbuf : string;

    constructor(obj: ParticipantObject) {
        this.name = obj.name;
        this.tournamentId = obj.tournamentId;
        this.id = obj.id;
        this.score = obj.score;
        this.deckbuf = obj.deckbuf ?? '';
        this.quit = obj.quit ?? false;
    }
}

export default Participant;