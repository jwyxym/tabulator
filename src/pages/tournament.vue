<template>
    <view class = 'PageTournament'>
        <!-- <uni-card
            v-if = 'tournament.tournament'
            :is-full = 'true'
            :title = 'tournament.tournament.name'
            :sub-title = 'tournament.tournament.description'
            :extra = 'tournament.tournament.createdAt.toLocaleDateString()'
        > -->
        <uni-card>
            <uni-forms>
                <uni-forms-item>
                    <uni-easyinput type = 'text' placeholder = '添加选手' v-model = 'participant.name'/>
                </uni-forms-item>
                <view class = 'button' @click = 'participant.add()'>
                    <uni-icons type = 'personadd'></uni-icons>
                </view>
                <!-- <view class = 'button' @click = 'participant.add()'>
                    <uni-icons type = 'personadd'></uni-icons>
                </view> -->
            </uni-forms>
            <br>
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
                            <br>
                            {{ i.player1Score }}
                        </template>
                        <template v-slot:body>
                        </template>
                        <template v-slot:footer>
                            {{ i.player2Id }}
                            <br>
                            {{ i.player2Score }}
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

    let participant = reactive({
        add : async() : Promise<void> => {
            // @ts-ignore
            if (await Tabulator.Participant.Create(Mycard.token, { name : participant.name, tournamentId : tournament.tournament.id})) {
                await (new Promise(resolve => setTimeout(resolve, 500)));
                // @ts-ignore
                tournament.participants = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : tournament.tournament.id});
            }
        },
        name : ''
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

<style scoped lang = 'scss'>
    @import '../style/style.scss';
    @import '../style/tournament.scss';
</style>