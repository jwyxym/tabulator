import { MatchObject } from './type.ts';
import Participant from './participant.ts';

interface player {
    id : number;
    score : number;
    name : string;
    qq : string | undefined;
}

class Match {
    id : number;
    tournamentId : number;
    round : number;
    isThirdPlaceMatch : boolean;
    status : string;
    player1 : player;
    player2 : player;
    winnerId : number | null;
    childMatchId : number;

    constructor(obj : MatchObject, p : Array<Participant>) {
        this.id = obj.id;
        this.tournamentId = obj.tournamentId;
        this.round = obj.round;
        this.isThirdPlaceMatch = obj.isThirdPlaceMatch;
        this.status = obj.status;
        this.player1 = {
            id : obj.player1Id,
            name : p.find(i => i.id == obj.player1Id)?.name ?? '',
            qq : p.find(i => i.id == obj.player1Id)?.qq ?? undefined,
            score : obj.player1Score
        };
        this.player2 = {
            id : obj.player2Id,
            name : p.find(i => i.id == obj.player2Id)?.name ?? '',
            qq : p.find(i => i.id == obj.player2Id)?.qq ?? undefined,
            score : obj.player2Score
        };
        this.winnerId = obj.winnerId as number | null;
        this.childMatchId = obj.childMatchId;
    }
    
}

export default Match;
