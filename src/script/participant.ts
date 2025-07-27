import { Score, ParticipantObject, Deck } from './type.ts';
import YGOProDeck from 'ygopro-deck-encode';
import { Base64 } from 'js-base64';
import Match from './match.ts';
import Tournament from './tournament.ts';

class  Participant {
    id : number;
    name : string;
    qq : string | undefined;
    quit : boolean;
    tournamentId : number;
    score : Score;
    deckbuf : string;
    deck : YGOProDeck | undefined;

    constructor(obj: ParticipantObject) {
        const name = obj.name.split(/[\+\uFF0B]/);
        this.name = (name.length == 2 && !Number.isNaN(name[0]) && name[0].length > 3) ? name[1] : obj.name;
        this.qq = (name.length == 2 && !Number.isNaN(name[0]) && name[0].length > 3) ? name[0] : undefined;
        this.tournamentId = obj.tournamentId;
        this.id = obj.id;
        this.deckbuf = obj.deckbuf ?? '';
        this.quit = obj.quit ?? false;
        if (obj.deckbuf)
            this.deck = YGOProDeck.fromUpdateDeckPayload(Base64.toUint8Array(this.deckbuf));
    }

    updateDeck = (ydk : string) : void => {
        this.deck = YGOProDeck.fromYdkString(ydk);
        this.deckbuf = Base64.fromUint8Array(this.deck.toUpdateDeckPayload());
        this.deck.main = [...this.deck.main, ...this.deck.extra]
    }

    getDeck = () : Deck => {
        return {
            main : this.deck?.main.slice() ?? [],
            extra : this.deck?.extra.slice() ?? [],
            side : this.deck?.side.slice() ?? [],
        };
    }

    Blob = () : Blob => {
        const data = this.deck?.toYdkString() ?? '';
        return new Blob([data], { type: 'text/plain' });
    }

    getScore = (matches : Array<Match>, t : Tournament) : void => {
        const m = {
            win : matches.filter(i => this.id == i.winnerId).length,
            draw : matches.filter(i => (this.id == i.player1.id || this.id == i.player2.id) && Number.isNaN(i.winnerId)).length,
            lose : matches.filter(i => (this.id == i.player1.id || this.id == i.player2.id) && !Number.isNaN(i.winnerId) && i.winnerId != this.id).length,
            bye : Math.max(...matches.filter(i => i.status == 'Finished' || i.status == 'Running').map(i => i.round)) - matches.filter(i => this.id == i.player1.id || this.id == i.player2.id).length
        };
        this.score = {
            score : m.win * t.ruleSettings.winScore + m.draw * t.ruleSettings.drawScore + m.bye * t.ruleSettings.byeScore,
            win : m.win,
            draw : m.draw,
            bye : m.bye,
            lose : m.lose
        }
    }

    getTieBreaker = (participants : Array<Participant>, matches : Array<Match>) : void => {
        let tieBreaker = 0;
        matches.filter(i => this.id == i.player1.id || this.id == i.player2.id).forEach(i => {
            const id = this.id == i.player1.id ? i.player2.id : i.player1.id;
            const p = participants.find(p => p.id == id )?.score.score ?? 0;
            tieBreaker += p;
        });
        this.score.tieBreaker = tieBreaker;
    }
}

export default Participant;
