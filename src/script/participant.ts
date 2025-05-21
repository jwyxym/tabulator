import { Score, ParticipantObject, Deck } from './type.ts';
import YGOProDeck from 'ygopro-deck-encode';
import { Base64 } from 'js-base64';

class  Participant {
    id : number;
    name : string;
    quit : boolean;
    tournamentId : number;
    score : Score;
    deckbuf : string;
    deck : YGOProDeck | undefined;

    constructor(obj: ParticipantObject) {
        this.name = obj.name;
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
}

export default Participant;