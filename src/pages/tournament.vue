<template>
    <view class = 'PageTournament'>
        <transition name = 'switch'>
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
                        <view class = 'button click' @click = 'tournament.operatorChk(() => { emitter.emit(Const.tournamentInfo); })'>
                            <span>设置</span>
                            <uni-icons type = 'info'></uni-icons>
                        </view>
                        <view class = 'button' @click = 'page.reload()'>
                            <span>刷新</span>
                            <uni-icons type = 'reload'></uni-icons>
                        </view>
                        <view class = 'button' @click = 'page.copyUrl()'>
                            <span>分享</span>
                            <uni-icons type = 'redo'></uni-icons>
                        </view>
                        <view class = 'button' @click = 'page.clear()'>
                            <span>关闭</span>
                            <uni-icons type = 'close'></uni-icons>
                        </view>
                    </view>
                    <br>
                    <view class = 'button_list' >
                        <view class = 'button click' @click = 'tournament.operatorChk(tournament.on)'>
                            <span>{{ tournament.status.text.get(tournament.this.status) }}</span>
                            <uni-icons type = 'circle-filled' :color = 'tournament.status.color.get(tournament.this.status)'></uni-icons>
                        </view>
                        <view class = 'button click' @click = 'tournament.operatorChk(tournament.reset)'>
                            <span>重置</span>
                            <uni-icons type = 'loop'></uni-icons>
                        </view>
                        <view class = 'button click'  @click = 'tournament.operatorChk(tournament.upload)'>
                            <span>上传</span>
                            <uni-icons type = 'cloud-upload'></uni-icons>
                        </view>
                        <view class = 'button click' @click = 'tournament.operatorChk(tournament.del)'>
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
                        :title = '`参与者：${participant.total}`'
                    >
                        <transition name = 'switch'>
                            <uni-list>
                                <uni-list-item
                                    v-show = 'participant.array.length == 0'
                                    title = '暂无选手'
                                >
                                </uni-list-item>
                                <uni-list-item
                                    v-for = '(i, v) in participant.array.slice((participant.page - 1) * 20, participant.page * 20)'
                                    :title = "i.score ? `胜平负：${i.score.win + i.score.bye}-${i.score.draw}-${i.score.lose}` : ''"
                                    :note = "i.score ? `小分：${i.score.score}` : ''"
                                    :clickable = true
                                >
                                    <template v-slot:header>
                                        <view id = 'header'>
                                            <span>{{ i.name }}</span>
                                            <br>
                                            <span class = 'small'>{{ i.score ? i.score.rank : '' }}</span>
                                        </view>
                                    </template>
                                    <template v-slot:footer>
                                        <view  id = 'footer'>
                                            <view
                                                class = 'button'
                                                :style = "{ '--color' : 'gray' }"
                                                v-show = '!i.quit'
                                                @click = 'tournament.operatorChk(participant.upload, [i])'
                                            >
                                                <uni-icons type = 'upload'></uni-icons>
                                            </view>
                                            <view
                                                class = 'button'
                                                :style = "{ '--color' : 'red' }"
                                                @click = 'tournament.operatorChk(participant.del, [v])'
                                                v-show = '!i.quit'
                                            >
                                                <uni-icons type = 'trash' color = 'red'></uni-icons>
                                            </view>
                                            <span v-show = 'i.quit' class = 'small'>已退赛</span>
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
                                                @click = 'tournament.operatorChk(participant.add)'
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
                        :title = '`比赛：${match.total}`'
                    >
                        <view id = 'round'>
                            <div>
                                第
                                <uni-number-box
                                    v-model = 'match.round'
                                    :min = '1'
                                    :max = 'match.maxRound'
                                    :disabled = "tournament.this.status == 'Ready'"
                                ></uni-number-box>
                                轮
                            </div>
                            <view class = 'button' @click = '() => { match.chk = true; match.page = 1; match.search(true); }'>全部轮次</view>
                        </view>
                        <transition name = 'switch'>
                            <uni-list>
                                <uni-list-item
                                    v-show = 'match.array.length == 0'
                                    title = '暂无比赛'
                                >
                                </uni-list-item>
                                <view v-for = '(i, v) in match.array'>
                                    <view
                                        class = 'match'
                                        v-show = "match.submit.page === i && (i.status == 'Running' || i.status == 'Finished')"
                                    >
                                        <view id = 'score'>
                                            <uni-easyinput
                                                :clearable = 'false'
                                                type = 'number'
                                                :placeholder = 'participant.array.find(p => p.id == i.player1Id)?.name'
                                                v-model = 'match.submit.chk[v][0]'
                                                :disabled = "i.status != 'Running'"
                                            ></uni-easyinput>
                                            <view>
                                                <span>:</span>
                                            </view>
                                            <uni-easyinput
                                                :clearable = 'false'
                                                type = 'number'
                                                :placeholder = 'participant.array.find(p => p.id == i.player2Id)?.name'
                                                v-model = 'match.submit.chk[v][1]'
                                                :disabled = "i.status != 'Running'"
                                            ></uni-easyinput>
                                        </view>
                                        <view class = 'button' @click = 'match.submit.on(v)'>{{ i.status == 'Running' ? '提交比分' : i.status == 'Finished' ? '重赛' : '' }}</view>
                                    </view>
                                    <uni-list-item
                                        :clickable = true
                                        @click = 'match.submit.show(v)'
                                        id = 'matchList'
                                    >
                                        <template v-slot:body>
                                            <view id = 'body'>
                                                <view id = 'left'>
                                                    {{ participant.array.find(p => p.id == i.player1Id)?.name }}
                                                    <br>
                                                    <span 
                                                        v-if = '
                                                            // @ts-ignore
                                                            participant.array.find(p => p.id == i.player1Id) && participant.array.find(p => p.id == i.player1Id).score
                                                        '>
                                                        {{
                                                            `${
                                                                // @ts-ignore
                                                                participant.array.find(p => p.id == i.player1Id)?.score.win + participant.array.find(p => p.id == i.player1Id)?.score.bye
                                                            }-${
                                                                participant.array.find(p => p.id == i.player1Id)?.score.draw
                                                            }-${
                                                                participant.array.find(p => p.id == i.player1Id)?.score.lose
                                                            }`
                                                        }}
                                                    </span>
                                                </view>
                                                <view id = 'center'>
                                                    {{ `第${i.round}轮` }}
                                                    <br v-show = 'i.round == match.maxRound'>
                                                    <span class = 'small' v-show = 'i.isThirdPlaceMatch'>季军赛</span>
                                                    <span class = 'small' v-show = '!i.isThirdPlaceMatch && i.round == match.maxRound'>决赛</span>
                                                </view>
                                                <view  id = 'right'>
                                                    {{ participant.array.find(p => p.id == i.player2Id)?.name }}
                                                    <br>
                                                    <span v-if = '
                                                        // @ts-ignore
                                                        participant.array.find(p => p.id == i.player2Id) && participant.array.find(p => p.id == i.player2Id).score
                                                    '>
                                                        {{
                                                            `${
                                                                // @ts-ignore
                                                                participant.array.find(p => p.id == i.player2Id)?.score.win + participant.array.find(p => p.id == i.player2Id)?.score.bye
                                                            }-${
                                                                participant.array.find(p => p.id == i.player2Id)?.score.draw
                                                            }-${
                                                                participant.array.find(p => p.id == i.player2Id)?.score.lose
                                                            }`
                                                        }}
                                                    </span>
                                                </view>
                                            </view>
                                        </template>
                                        <template v-slot:footer>
                                            <view id = 'footer'>
                                                <uni-icons :color = 'match.status.color.get(i.status)' type = 'circle-filled'></uni-icons>
                                            </view>
                                        </template>
                                    </uni-list-item>
                                </view>
                            </uni-list>
                        </transition>
                        <uni-pagination
                            :current = 'match.page'
                            v-model = 'match.page'
                            pageSize = 20
                            :total = 'match.total'
                            @change = 'match.search()'
                        >
                        </uni-pagination>
                    </uni-card>
                </transition>
            </uni-card>
        </transition>
    </view>
</template>
<script setup lang = 'ts'>
    import {ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import YGOProDeck from 'ygopro-deck-encode';
    import emitter from '../script/emitter.ts'
    import UniApp from '../script/uniapp.ts';
    import {Tabulator, User} from '../script/post.ts';
    import Tournament from '../script/tournament.ts';
    import Participant from '../script/participant.ts';
    import Match from '../script/match.ts';
    import Const from '../script/const.ts'
    import Mycard from '../script/mycard.ts';
    import {TournamentCreateObject, MatchUpdateObject, TournamentAParticipant, ParticipantUpdateObject} from '../script/type.ts'

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
                    if (await Tabulator.Tournament.Reset(Mycard.token, tournament.this.id)) {
                        for (const i of participant.array) {
                            if (i.quit)
                                await Tabulator.Participant.Delete(Mycard.token, i.id)
                        }
                        page.reload();
                    }
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
                        page.clear();
                }
            });
        },
        operatorChk : (f : Function, para : Array<any> = []) : void => {
            if (Mycard.id >= 0 && (Mycard.id == tournament.this?.creator || tournament.this?.collaborators.includes(Mycard.id)))
                f(...para);
            else
                uni.showModal({
                    title : '缺少权限',
                    content : '请先登陆或联系比赛主办方',
                    showCancel : false
                });
        },
        upload : async (i : Participant) : Promise<void> => {
            const f = async (res : UniApp.ChooseFileSuccessCallbackResult) : Promise<void> => {
                // @ts-ignore
                if (await Tabulator.Participant.UpdateYdk(Mycard.token, tournament.this.id, res.tempFiles[0], i.name))
                    await participant.search();
            };
            await UniApp.selectFile(['.ydk', '.txt'], f);
        }
    });

    let match = reactive({
        array : [] as Array<Match>,
        total : 0,
        page : 1,
        round : 1,
        maxRound : 2,
        chk : false,
        status : {
            color : new Map([
                ['Running', 'rgb(84, 200, 17)'],
                ['Finished', 'darkgray'],
                ['Abandoned', 'red']
            ]) as Map<string, string>
        },
        submit : {
            page : undefined as Match | undefined,
            show : (v : number) : void => {
                match.submit.page = match.submit.page == match.array[v] ? undefined : match.array[v];
                if (!match.submit.page)
                    match.submit.chk = match.array.map(i => [i.player1Score ?? 0, i.player2Score ?? 0]);
            },
            on : async (v : number) : Promise<void> => {
                switch (match.array[v].status) {
                    case 'Running':
                        const player1 : number = match.submit.chk[v][0] ?? 0;
                        const player2 : number = match.submit.chk[v][1] ?? 0;
                        const id : null | number = player1 > player2 ? match.array[v].player1Id : player1 == player2 ? null : match.array[v].player2Id
                        // @ts-ignore
                        if (await Tabulator.Match.Update(Mycard.token, match.array[v].id, {
                            player1Score : player1,
                            player2Score : player2,
                            winnerId : id
                        } as MatchUpdateObject))
                            await page.reload();
                        break;
                    case 'Finished':
                        // @ts-ignore
                        if (await Tabulator.Match.Update(Mycard.token, match.array[v].id, {
                            player1Score : 0,
                            player2Score : 0,
                            winnerId : undefined
                        } as MatchUpdateObject))
                            await page.reload();
                        break;
                }
            },
            chk : [] as Array<Array<number>>
        },
        search : async (chk : boolean = match.chk) : Promise<void> => {
            // @ts-ignore
            const matchs = await Tabulator.Match.FindALL(Mycard.token, {tournamentId : tournament.this.id, statusIn : 'Running,Finished', pageCount : match.page, round : chk ? undefined : match.round});
            match.array = matchs.matchs;
            match.total = matchs.total;
        }
    });

    let participant = reactive({
        name : '',
        array : [] as Array<Participant>,
        total : 0,
        page : 1,
        add : async() : Promise<void> => {
            // @ts-ignore
            if (await Tabulator.Participant.Create(Mycard.token, { name : participant.name, tournamentId : tournament.this.id}, participant.array)) {
                participant.name = '';
                await participant.search();
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
            if (tournament.this.status == 'Ready' ? await del() : await update())
                await participant.search();
        },
        update : async (Data : TournamentCreateObject) : Promise<void> => {
            // @ts-ignore
            if (await Tabulator.Tournament.Update(Mycard.token, tournament.this.id, Data))
                page.reload();
        },
        search : async () : Promise<boolean> => {
            const url = window.location.pathname.match(/\/tournament\/([^\/]+)(?=\/|$)/);
            // @ts-ignore
            const id = url[1];
            // @ts-ignore
            const t : TournamentAParticipant = await Tabulator.Tournament.Find(Mycard.token, id);
            if (t.tournament) {
                tournament.this = t.tournament;
                emitter.emit(Const.tournamentReload, tournament.this)
                const participants = t.participant;
                participant.array = participants.participants;
                participant.total = participants.total;
                return true;
            }
            return false;
        },
        upload : async (i : Participant) : Promise<void> => {
            const f = async (res : UniApp.ChooseFileSuccessCallbackResult) : Promise<void> => {
                if (res.tempFiles[0].size < Const.maxSize) {
                    i.updateDeck(await UniApp.readFile(res.tempFiles[0]));
                    if (await Tabulator.Participant.Update(Mycard.token, i.id, {
                        name : i.name,
                        deckbuf : i.deckbuf
                    } as ParticipantUpdateObject))
                        await participant.search();
                }
            };
            await UniApp.selectFile(['.ydk', '.txt'], f, 1);
        }
    });

    let page = reactive({
        height : 0,
        loading : false,
        clear : async () : Promise<void>=> {
            tournament.this = undefined;
            await (new Promise(resolve => setTimeout(resolve, 450)));
            window.location.replace(window.location.href.replace(window.location.pathname, ''))
        },
        get : async () : Promise<void> => {
            if (await participant.search()) 
                await match.search();
             else 
                page.clear();
        },
        reload : async () : Promise<void> => {
            const query = uni.createSelectorQuery().in(this);
            query.select('#PageTournament').boundingClientRect(res => {
                // @ts-ignore
                page.height = res.height ?? 0;
            }).exec();
            page.loading = true;
            participant.name = '';
            if (await participant.search()) {
                await match.search();
                await (new Promise(resolve => setTimeout(resolve, 500)));
                page.loading = false;
                page.height = 0;
            } else
                uni.showModal({
                    title : '刷新失败',
                    content : '请重试或检查网络设置',
                    showCancel : false
                });

        },
        clickClear : (e) : void => {
            let element = e.target;
            while (element) {
                if (['body'].includes(element.id) || element.classList.contains('match'))
                    return undefined;
                element = element.parentElement;
            }
            match.submit.page = undefined;
            match.submit.chk = match.array.map(i => [i.player1Score ?? 0, i.player2Score ?? 0]);
        },
        copyUrl : () => {
            uni.setClipboardData({
                data : `${window.location.href.split('/?')[0]}`,
                success : () => {
                    uni.showToast({
                        title : '复制成功'
                    })
                }
            })
        }
    });

    onBeforeMount(() => {
        const url = window.location.pathname.match(/\/tournament\/([^\/]+)(?=\/|$)/);
        url && !isNaN(parseInt(url[1])) ? page.get() : page.clear();
        document.addEventListener("click", page.clickClear);
        // @ts-ignore
        emitter.on(updateTournament, participant.update);
    });

    onUnmounted(() => {
        document.removeEventListener("click", page.clickClear);
        // @ts-ignore
        emitter.off(updateTournament, participant.update);
    });

    watch(() => { return match.round; }, async () : Promise<void> => {
        match.page = 1;
        match.chk = false;
        await match.search();
    });

    watch(() => { return match.array; }, async () : Promise<void> => {
        match.submit.chk = match.array.map(i => [i.player1Score ?? 0, i.player2Score ?? 0]);
        match.maxRound = match.array.find(i => i.isThirdPlaceMatch)?.round ?? match.round + 1;
    }, {deep : true});
</script>

<style scoped lang = 'scss'>
    @import '../style/tournament.scss';
    @import '../style/transition.scss';
</style>