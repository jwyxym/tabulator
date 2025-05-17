<template>
    <view class = 'PageTournament'>
        <uni-card
            id = 'PageTournament'
            :style = "page.height > 0 ? { height: `${page.height}px` } : { height: '100%' }"
            v-if = 'tournament.this'
            :is-full = 'true'
            :title = 'tournament.this.name'
            :sub-title = 'tournament.this.description'
            :extra = 'tournament.this.createdAt.toLocaleDateString()'
        >
            <uni-forms>
                <view class = button_list >
                    <view class = 'button click' @click = 'emitter.emit(tournamentInfo)'>
                        <span>设置</span>
                        <uni-icons type = 'info'></uni-icons>
                    </view>
                    <view class = 'button' @click = 'page.reload()'>
                        <span>刷新</span>
                        <uni-icons type = 'reload'></uni-icons>
                    </view>
                    <view class = 'button' @click = 'page.clear()'>
                        <span>关闭</span>
                        <uni-icons type = 'close'></uni-icons>
                    </view>
                </view>
                <!-- <view class = 'button' @click = 'participant.add()'>
                    <uni-icons type = 'personadd'></uni-icons>
                </view> -->
            </uni-forms>
            <br>
            <transition name = 'switch'>
                <uni-card
                    v-show = '!page.loading'
                    :is-full = 'true'
                    title = '参与者'
                >
                    <uni-list>
                        <uni-list-item
                            v-for = '(i, v) in participant.array'
                            :note = "i.score ? i.score.rank : ''"
                            :title = "i.score ? `${i.score.score}\n${i.score.win + i.score.bye}-${i.score.draw}-${i.score.lose}` : ''"
                            :clickable = true
                        >
                            <template v-slot:header>
                                <view id = 'header'>
                                    <span>{{ i.name }}</span>
                                    <br>
                                    <span class = 'rank'>{{ i.score ? i.score.rank : '' }}</span>
                                </view>
                            </template>
                            <template v-slot:footer>
                                <view  id = 'footer'>
                                    <view class = 'button' @click = 'participant.del(v)' v-show = '!i.quit'>
                                        <uni-icons type = 'trash' color = 'red'></uni-icons>
                                    </view>
                                    <span v-show = 'i.quit'>已退赛</span>
                                </view>
                            </template>
                        </uni-list-item>
                        <uni-list-item>
                            <template v-slot:header>
                                <uni-forms>
                                    <uni-forms-item id = 'header'>
                                        <uni-easyinput type = 'text' placeholder = '添加选手' v-model = 'participant.name'/>
                                    </uni-forms-item>
                                </uni-forms>
                            </template>
                            <template v-slot:footer>
                                <view  id = 'footer'>
                                    <view class = 'button' @click = 'participant.add()'>
                                        <uni-icons type = 'personadd'></uni-icons>
                                    </view>
                                </view>
                            </template>
                        </uni-list-item>
                    </uni-list>
                    <uni-pagination
                        :current = 'participant.page'
                        v-model = 'participant.page'
                        pageSize = 20
                        :total = 'participant.total'
                    >
                    </uni-pagination>
                </uni-card>
            </transition>
            <transition name = 'switch'>
                <uni-card
                    v-show = '!page.loading'
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
            </transition>
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
    import { selectTournament, tournamentInfo, tournamentExit } from '../script/const.ts'
    import Mycard from '../script/mycard.ts';
    import { AllParticipant } from '../script/type.ts'

    let tournament = reactive({
        this : undefined as undefined | Tournament,
        matchs : [] as Array<Match>,
    });

    let participant = reactive({
        array : [] as Array<Participant>,
        total : 0,
        page : 1,
        add : async() : Promise<void> => {
            const name = participant.name;
            // @ts-ignore
            if (await Tabulator.Participant.Create(Mycard.token, { name : participant.name, tournamentId : tournament.this.id}, participant.array)) {
                participant.name = '';
                await (new Promise(resolve => setTimeout(resolve, 200)));
                // @ts-ignore
                const participants : AllParticipant = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : tournament.this.id});
                participant.array = participants.participants;
                participant.total = participants.total;
            }
        },
        del : async(v : number) : Promise<void> => {
            const del = async() : Promise<boolean> => {
                // @ts-ignore
                return await Tabulator.Participant.Delete(Mycard.token, participant.array[v].id);
            }
            const update = async() : Promise<boolean> => {
                return await Tabulator.Participant.Update(Mycard.token, participant.array[v].id, {
                    name : participant.array[v].name,
                    quit : true
                });
            }
            // @ts-ignore
            if (tournament.this.status == 'Ready' ? await del() : await update()) {
                await (new Promise(resolve => setTimeout(resolve, 200)));
                // @ts-ignore
                const participants : AllParticipant = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : tournament.this.id});
                participant.array = participants.participants;
                participant.total = participants.total;
            }
        },
        name : ''
    });

    let page = reactive({
        height : 0,
        loading : false,
        clear : async() : Promise<void> => {
            emitter.emit(tournamentExit);
            await (new Promise(resolve => setTimeout(resolve, 500)));
            participant.array = [];
            participant.total = 0;
            participant.page = 1;
            tournament.this = undefined;
        },
        get : async (t : Tournament) : Promise<void> => {
            tournament.this = t;
            tournament.matchs = await Tabulator.Match.FindALL(Mycard.token, {tournamentId : t.id});
            const participants : AllParticipant = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : t.id});
            participant.array = participants.participants;
            participant.total = participants.total;
        },
        reload : async () : Promise<void> => {
            const query = uni.createSelectorQuery().in(this);
            query.select('#PageTournament').boundingClientRect(res => {
                // @ts-ignore
                page.height = res.height ?? 0;
            }).exec();
            page.loading = true;
            // @ts-ignore
            tournament.matchs = await Tabulator.Match.FindALL(Mycard.token, {tournamentId : tournament.this.id});
            // @ts-ignore
            const participants : AllParticipant = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : tournament.this.id});
            participant.array = participants.participants;
            participant.total = participants.total;
            await (new Promise(resolve => setTimeout(resolve, 500)));
            page.loading = false;
            page.height = 0;
        },
    });

    onBeforeMount(() => {
        // @ts-ignore
        emitter.on(selectTournament, page.get);
    });

    onUnmounted(() => {
        // @ts-ignore
        emitter.off(selectTournament, page.get);
    });
</script>

<style scoped lang = 'scss'>
    @import '../style/style.scss';
    @import '../style/tournament.scss';
    @import '../style/transition.scss';
</style>