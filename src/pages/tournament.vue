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
                <view class = 'button_list' >
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
                <br>
                <view class = 'button_list' >
                    <view class = 'button click' @click = 'tournament.on()'>
                        <span>{{ tournament.status.text.get(tournament.this.status) }}</span>
                        <uni-icons type = 'circle-filled' :color = 'tournament.status.color.get(tournament.this.status)'></uni-icons>
                    </view>
                    <view class = 'button click' @click = 'tournament.reset()'>
                        <span>重置</span>
                        <uni-icons type = 'loop'></uni-icons>
                    </view>
                    <view class = 'button click' @click = 'tournament.del()'>
                        <span>删除</span>
                        <uni-icons type = 'trash' color = 'red'></uni-icons>
                    </view>
                </view>
            </uni-forms>
            <br>
            <transition name = 'switch'>
                <uni-card
                    v-show = '!page.loading'
                    :is-full = 'true'
                    title = '参与者'
                >
                    <transition name = 'switch'>
                        <uni-list>
                            <uni-list-item
                                v-show = 'participant.array.length == 0'
                                title = '暂无选手'
                            >
                            </uni-list-item>
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
                                        <view
                                            class = 'button'
                                            :style = "{ '--color' : 'red' }"
                                            @click = 'participant.del(v)'
                                            v-show = '!i.quit'
                                        >
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
                                            <uni-easyinput type = 'text' placeholder = '添加选手' v-model = 'participant.name' :disabled = "tournament.this.status != 'Ready'"/>
                                        </uni-forms-item>
                                    </uni-forms>
                                </template>
                                <template v-slot:footer>
                                    <view  id = 'footer'>
                                        <view
                                            class = 'button'
                                            :style = "{ '--color' : '#409eff' }"
                                            @click = 'participant.add()'
                                        >
                                            <uni-icons type = 'personadd'></uni-icons>
                                        </view>
                                    </view>
                                </template>
                            </uni-list-item>
                        </uni-list>
                    </transition>
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
                    <transition name = 'switch'>
                        <uni-list>
                            <uni-list-item
                                v-show = 'match.array.length == 0'
                                title = '暂无比赛'
                            >
                            </uni-list-item>
                            <uni-list-item
                                v-for = '(i, v) in match.array'
                                v-show = 'participant.array.findIndex(p => p.id == i.player1Id) >= 0'
                                :clickable = true
                            >
                                <template v-slot:header>
                                </template>
                                <template v-slot:body>
                                    <view id = 'body'>
                                        <view id = 'left'>
                                            {{ participant.array.find(p => p.id == i.player1Id)?.name }}
                                            <br>
                                            {{ i.player1Score }}
                                        </view>
                                        <view id = 'center'>
                                            {{ `第${i.round}轮` }}
                                        </view>
                                        <view  id = 'right'>
                                            {{ participant.array.find(p => p.id == i.player2Id)?.name }}
                                            <br>
                                            {{ i.player2Score }}
                                        </view>
                                    </view>
                                </template>
                                <template v-slot:footer>
                                </template>
                            </uni-list-item>
                        </uni-list>
                    </transition>
                    <uni-pagination
                        :current = 'match.page'
                        v-model = 'match.page'
                        pageSize = 20
                        :total = 'match.total'
                    >
                    </uni-pagination>
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
    import {
        selectTournament,
        updateTournament ,
        tournamentInfo,
        tournamentExit,
        tournamentReload
    } from '../script/const.ts'
    import Mycard from '../script/mycard.ts';
    import { AllParticipant, AllMatch, TournamentUpdateObject } from '../script/type.ts'

    let tournament = reactive({
        this : undefined as undefined | Tournament,
        status : {
            text : new Map([
                ['Ready', '开始'],
                ['Running', '结束'],
                ['Finished', '已结束']
            ]) as Map<string, string>,
            color : new Map([
                ['Ready', 'rgb(84, 200, 17)'],
                ['Running', 'red'],
                ['Finished', 'darkgray']
            ]) as Map<string, string>,
        },
        on : () : void => {
            switch(tournament.this?.status) {
                case 'Ready':
                    uni.showModal({
                        title : '确认要开始比赛吗？',
                        success : async (res : UniApp.ShowModalRes) : Promise<void> => {
                            if (!res.confirm) return;
                            // @ts-ignore
                            if (await Tabulator.Tournament.Start(Mycard.token, tournament.this.id))
                                page.reload();
                        }
                    });
                    break;
                case 'Running':
                    uni.showModal({
                        title : '确认要结束比赛吗？',
                        success : async (res : UniApp.ShowModalRes) : Promise<void> => {
                            if (!res.confirm) return;
                            // @ts-ignore
                            if (await Tabulator.Tournament.Finish(Mycard.token, tournament.this.id))
                                page.reload();
                        }
                    });
                    break;
            }
        },
        reset : () : void => {
            uni.showModal({
                title : '确认要重置比赛吗？',
                success : async (res : UniApp.ShowModalRes) : Promise<void> => {
                    if (!res.confirm) return;
                    // @ts-ignore
                    if (await Tabulator.Tournament.Reset(Mycard.token, tournament.this.id))
                        page.reload();
                }
            });
        },
        del : () : void => {
            uni.showModal({
                title : '确认要删除比赛吗？',
                success : async (res : UniApp.ShowModalRes) : Promise<void> => {
                    if (!res.confirm) return;
                    // @ts-ignore
                    if (await Tabulator.Tournament.Delete(Mycard.token, tournament.this.id))
                        page.reload();
                }
            });
        },
    });

    let match = reactive({
        array : [] as Array<Match>,
        total : 0,
        page : 1,
    });

    let participant = reactive({
        name : '',
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
        update : async (Data : TournamentUpdateObject) : Promise<void> => {
            // @ts-ignore
            if (await Tabulator.Tournament.Update(Mycard.token, tournament.this.id, Data))
                page.reload();
        }
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
            match.array = [];
            match.total = 0;
            match.page = 1;
            tournament.this = undefined;
            participant.name = '';
        },
        get : async (t : Tournament) : Promise<void> => {
            tournament.this = t;
            const participants : AllParticipant = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : t.id});
            participant.array = participants.participants;
            participant.total = participants.total;
            const matchs = await Tabulator.Match.FindALL(Mycard.token, {tournamentId : t.id});
            match.array = matchs.matchs;
            match.total = matchs.total;
        },
        reload : async () : Promise<void> => {
            const query = uni.createSelectorQuery().in(this);
            query.select('#PageTournament').boundingClientRect(res => {
                // @ts-ignore
                page.height = res.height ?? 0;
            }).exec();
            page.loading = true;
            participant.name = '';
            // @ts-ignore
            tournament.this = await Tabulator.Tournament.Find(Mycard.token, tournament.this.id);
            // @ts-ignore
            const participants : AllParticipant = await Tabulator.Participant.FindALL(Mycard.token, {tournamentId : tournament.this.id});
            participant.array = participants.participants;
            participant.total = participants.total;
            // @ts-ignore
            const matchs : AllMatch = await Tabulator.Match.FindALL(Mycard.token, {tournamentId : tournament.this.id});
            match.array = matchs.matchs;
            match.total = matchs.total;
            emitter.emit(tournamentReload, tournament.this)
            await (new Promise(resolve => setTimeout(resolve, 500)));
            page.loading = false;
            page.height = 0;
        },
    });

    onBeforeMount(() => {
        // @ts-ignore
        emitter.on(selectTournament, page.get);
        // @ts-ignore
        emitter.on(updateTournament, participant.update);
    });

    onUnmounted(() => {
        // @ts-ignore
        emitter.off(selectTournament, page.get);
        // @ts-ignore
        emitter.off(selectTournament, participant.update);
    });
</script>

<style scoped lang = 'scss'>
    @import '../style/style.scss';
    @import '../style/tournament.scss';
    @import '../style/transition.scss';
</style>