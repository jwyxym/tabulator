import { Score, ParticipantObject, Deck } from './type.ts';
import YGOProDeck from 'ygopro-deck-encode';
import { Base64 } from 'js-base64';

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
        this.score = obj.score;
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
}

export default Participant;
