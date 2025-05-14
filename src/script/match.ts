import { MatchObject } from './type.ts';
import Participant from './participant.ts'

class Match {
    id : number;
    tournamentId : number;
    round : number;
    isThirdPlaceMatch : boolean;
    status : string;
    player1Score : number;
    player2Score : number;
    player1Id : number;
    player2Id : number;
    winnerId : number;
    childMatchId : number;

    constructor(obj : MatchObject) {
        this.id = obj.id;
        this.tournamentId = obj.tournamentId;
        this.round = obj.round;
        this.isThirdPlaceMatch = obj.isThirdPlaceMatch;
        this.status = obj.status;
        this.player1Id = obj.player1Id;
        this.player2Id = obj.player2Id;
        this.player1Score = obj.player1Score;
        this.player2Score = obj.player2Score;
        this.winnerId = obj.winnerId;
        this.childMatchId = obj.childMatchId;
    }
    
}

export default Match;