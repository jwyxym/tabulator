<template>
    <view class = 'PageTournament'>
        <uni-card
            v-if = 'tournament.tournament'
            :is-full = 'true'
            :title = 'tournament.tournament.name'
            :sub-title = 'tournament.tournament.description'
            :extra = 'tournament.tournament.createdAt.toLocaleDateString()'
        >
            <uni-card
                :is-full = 'true'
                title = '参与者'
            >
                <uni-list>
                    <uni-list-item
                        v-for = '(i, v) in tournament.participants'
                        :title = 'i.name'
                        :note = "i.score ? i.score.rank : ''"
                        :rightText = "i.score ? `${i.score.score}\n${i.score.win + i.score.bye}-${i.score.draw}-${i.score.lose}` : ''"
                        :clickable = true
                    ></uni-list-item>
                </uni-list>
            </uni-card>
            <uni-card
                :is-full = 'true'
                title = '比赛'
            >
                <uni-list>
                    <uni-list-item
                        v-for = '(i, v) in tournament.matchs'
                        :clickable = true
                    >
                        <template v-slot:header>
                            {{ i.player1Id }}
                        </template>
                        <template v-slot:body>
                            {{ i.player1Id }}
                        </template>
                        <template v-slot:footer>
                            {{ i.player2Id }}
                        </template>
                    </uni-list-item>
                </uni-list>
            </uni-card>
        </uni-card>
    </view>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../script/emitter.ts'
    import Tabulator from '../script/post.ts';
    import Tournament from '../script/tournament.ts';
    import Participant from '../script/participant.ts';
    import Match from '../script/match.ts';
    import { selectTournament } from '../script/const.ts'
    import Mycard from '../script/mycard.ts';

    let tournament = reactive({
        tournament : undefined as undefined | Tournament,
        matchs : [] as Array<Match>,
        participants : [] as Array<Participant>,
        get : async (t : Tournament) : Promise<void> => {
            tournament.tournament = t;
            tournament.matchs = await Tabulator.Match.FindALL(Mycard.token, {tournamentId : t.id});
            tournament.participants = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : t.id});
        }
    });

    onMounted(() => {
        // @ts-ignore
        emitter.on(selectTournament, tournament.get);
    });

    onUnmounted(() => {
        // @ts-ignore
        emitter.off(selectTournament, tournament.get);
    });
</script>