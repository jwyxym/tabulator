import Tournament from '../script/tournament.ts';
import Participant from '../script/participant.ts';
import Match from '../script/match.ts';
import ApiKey from '../script/apikey.ts';

interface MatchFindObject {
    pageCount ?: number;
    id ?: number;
    tournamentId ?: number;
    round ?: number;
    isThirdPlaceMatch ?: boolean;
    status ?: string;
    player1Id ?: number;
    player1Score ?: number;
    player2Id ?: number;
    player2Score ?: number;
    winnerId ?: number;
    childMatchId ?: number;
    statusIn ?: string
}

interface MatchUpdateObject {
    player1Score : number;
    player2Score : number;
    winnerId : number | null | undefined;
}

interface MatchObject extends MatchUpdateObject {
    id : number;
    tournamentId : number;
    tournament : TournamentObject;
    round : number;
    isThirdPlaceMatch : boolean;
    status : string;
    player1Id : number;
    player1 : ParticipantObject;
    player2Id : number;
    player2 : ParticipantObject;
    winner : ParticipantObject;
    childMatchId : number;
    parentMatches ?: MatchObject;
}

interface ruleSettings {
    rounds : number;
    winScore : number;
    drawScore : number;
    byeScore : number;
    hasThirdPlaceMatch : boolean;
}

interface TournamentCreateObject {
    name : string;
    description : string;
    visibility : string;
    collaborators : Array<number>;
    rule : string;
    ruleSettings : ruleSettings;
}

interface TournamentObject extends TournamentCreateObject {
    id : number;
    status : string;
    creator : number;
    createdAt : string;
    participants : Array<ParticipantObject>;
}

interface TournamentFindObject {
    pageCount ?: number;
    id ?: number;
    creator ?: number;
    name ?: string;
    rule ?: string;
    visibility ?: string;
    status ?: string;
    before ?: Date;
    after ?: Date;
}

interface Score {
    rank : number;
    score : number;
    win : number;
    draw : number;
    lose : number;
    bye : number;
    tieBreaker : number;
}

interface ParticipantFindObject {
    pageCount ?: number;
    id ?: number;
    tournamentId ?: number;
    name ?: string;
    quit ?: boolean;
}

interface ParticipantUpdateObject {
    name : string;
    deckbuf ?: string;
    quit ?: boolean;
}

interface ParticipantCreateObject extends ParticipantUpdateObject {
    tournamentId : number;
}

interface ParticipantObject extends ParticipantCreateObject {
    id : number;
    score : Score;
    tournament ?: Array<TournamentObject>;
}

interface ApiKeyFindObject {
    pageCount ?: number;
    id ?: number;
    userId ?: number;
    name ?: string;
}

interface ApiKeyCreateObject {
    name : string;
    description : string;
    expireAt : string;
}

interface ApiKeyObject extends ApiKeyCreateObject {
    id : number;
    userId : number;
    key : string;
}

interface All {
    total : number;
}

interface AllTournament extends All {
    tournaments : Array<Tournament>;
}

interface AllParticipant extends All {
    participants : Array<Participant>;
}

interface AllMatch extends All {
    matchs : Array<Match>;
}

interface TournamentAParticipant {
    tournament : Tournament | undefined;
    participant : AllParticipant
}

interface UserObject {
    avatar : string
    id : 777668
    username : string
}

export {
    Score,
    TournamentObject,
    TournamentCreateObject,
    TournamentFindObject,
    MatchObject,
    MatchUpdateObject,
    MatchFindObject,
    ParticipantObject,
    ParticipantCreateObject,
    ParticipantUpdateObject,
    ParticipantFindObject,
    ApiKeyObject,
    ApiKeyCreateObject,
    ApiKeyFindObject,
    AllTournament,
    AllParticipant,
    AllMatch,
    ruleSettings,
    UserObject,
    TournamentAParticipant
}