import { TournamentObject, ParticipantObject } from './type.ts';
import Participant from '../script/participant.ts';

class Tournament {
    id : number;
    name : string;
    description : string;
    pics : string;
    rule : string;
    ruleSettings : {
        rounds : number;
        winScore : number;
        drawScore : number;
        byeScore : number;
        hasThirdPlaceMatch : boolean;
    }
    visibility : string;
    status : string;
    creator : number;
    collaborators : Array<number>;
    createdAt : Date;
    count : Number;

    constructor(obj : TournamentObject) {
        this.name = obj.name;
        const description = obj.description.split('\n卡图地址：');
        this.description = description[0];
        this.pics = description[1] ?? '';
        this.visibility = obj.visibility;
        this.collaborators = obj.collaborators;
        this.rule = obj.rule;
        this.ruleSettings = obj.ruleSettings;
        this.id = obj.id;
        this.status = obj.status;
        this.creator = obj.creator;
        this.createdAt = new Date(obj.createdAt);
        this.count = obj.participants.length;
        if (Number.isNaN(this.ruleSettings.winScore)) this.ruleSettings.winScore = 3;
        if (Number.isNaN(this.ruleSettings.drawScore)) this.ruleSettings.drawScore = 1;
        if (Number.isNaN(this.ruleSettings.byeScore)) this.ruleSettings.byeScore = 3;
    }
}

export default Tournament;