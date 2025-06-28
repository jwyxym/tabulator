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

    constructor(obj : MatchObject) {
        this.id = obj.id;
        this.tournamentId = obj.tournamentId;
        this.round = obj.round;
        this.isThirdPlaceMatch = obj.isThirdPlaceMatch;
        this.status = obj.status;
        const name1 = obj.player1?.name.split(/[\+\uFF0B]/) ?? [];
        this.player1 = {
            id : obj.player1Id,
            name : (name1.length == 2 && !Number.isNaN(name1[0]) && name1[0].length > 3) ? name1[1] : obj.player1?.name ?? '',
            qq : (name1.length == 2 && !Number.isNaN(name1[0]) && name1[0].length > 3) ? name1[0] : undefined,
            score : obj.player1Score
        };
        const name2 = obj.player2?.name.split(/[\+\uFF0B]/) ?? [];
        this.player2 = {
            id : obj.player2Id,
            name : (name2.length == 2 && !Number.isNaN(name2[0]) && name2[0].length > 3) ? name2[1] : obj.player2?.name ?? '',
            qq : (name2.length == 2 && !Number.isNaN(name2[0]) && name2[0].length > 3) ? name1[0] : undefined,
            score : obj.player2Score
        };
        this.winnerId = obj.winnerId as number | null;
        this.childMatchId = obj.childMatchId;
    }
    
}

export default Match;
