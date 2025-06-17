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
                <uni-list>
                    <uni-list-chat
                    :avatar-circle = true
                    :title = 'creator.name'
                    time = '举办者'
                    :avatar = 'creator.avatar'
                    >
                    </uni-list-chat>
                </uni-list>
                <br>
                <uni-forms>
                    <view class = 'button_list' >
                        <view class = 'button click' @click = '() => { emitter.emit(Const.tournamentInfo); }'>
                            <span>设置</span>
                            <uni-icons type = 'info'></uni-icons>
                        </view>
                        <view class = 'button' @click = 'page.reload()'>
                            <span>刷新</span>
                            <uni-icons type = 'reload'></uni-icons>
                        </view>
                        <view class = 'button' @click = 'page.copyUrl()'>
                            <span>分享</span>
                            <uni-icons type = 'paperclip'></uni-icons>
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
                        <view class = 'button click'  @click = 'tournament.operatorChk(tournament.shuffle)'>
                            <span>打乱</span>
                            <uni-icons type = 'auth'></uni-icons>
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
                                    :title = "i.score && match.array.findIndex(m => (m.status == 'Finished' || m.status == 'Abandoned') && (m.player1Id == i.id || m.player2Id == i.id)) > -1 ? `胜平负：${i.score.win + i.score.bye}-${i.score.draw}-${i.score.lose}` : ''"
                                    :note = "i.score && match.array.findIndex(m => (m.status == 'Finished' || m.status == 'Abandoned') && (m.player1Id == i.id || m.player2Id == i.id)) > -1 ? `小分：${i.score.score}` : ''"
                                    :clickable = true
                                >
                                    <template v-slot:header>
                                        <view id = 'header'>
                                            <span>{{ i.name }}</span>
                                            <br>
                                            <span class = 'small'>{{ tournament.this.status == 'Ready' ? `${v + 1}` : (i.score ? i.score.rank : '') }}</span>
                                        </view>
                                    </template>
                                    <template v-slot:footer>
                                        <view  id = 'footer'>
                                            <view
                                                class = 'button'
                                                id = 'deckbutton'
                                                :style = "{ '--color' : participant.move.this === i ? '#409eff' : 'gray', 'background-color' : participant.move.this === i ? '#e6e6e6' : 'white'}"
                                                v-show = "!i.quit && tournament.this.status == 'Ready'"
                                                @click = 'tournament.operatorChk(participant.move.start, [i, $event])'
                                            >
                                                <uni-icons :type = "participant.move.this && participant.move.this !== i ? 'pulldown' : 'list'"></uni-icons>
                                            </view>
                                            <view
                                                class = 'button'
                                                id = 'deckbutton'
                                                :style = "{ '--color' : 'gray' }"
                                                v-show = '!i.quit'
                                                @click = 'participant.pics.on(i)'
                                            >
                                                <svgCards/>
                                            </view>
                                            <view
                                                class = 'button'
                                                :style = "{ '--color' : 'gray' }"
                                                v-show = '!i.quit'
                                                @click = 'tournament.operatorChk(participant.upload, [i])'
                                            >
                                                <svgDeck/>
                                            </view>
                                            <view
                                                class = 'button'
                                                :style = "{ '--color' : 'red' }"
                                                @click = 'tournament.operatorChk(participant.del, [i])'
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
                        :sub-title = "tournament.this.rule == 'Swiss' ? `轮数：${match.maxRound}` : ''"
                    >
                        <view id = 'round'>
                            <div>
                                <span>第</span>
                                <uni-number-box
                                    v-model = 'match.round'
                                    :min = '0'
                                    :max = 'match.maxRound'
                                    :disabled = "tournament.this.status == 'Ready'"
                                ></uni-number-box>
                                <span>轮</span>
                            </div>
                            <div>
                                <view class = 'button' @click = '() => { match.round = 0; }'>全部轮次</view>
                                <view class = 'button' @click = 'tournament.copy()'>复制对战表</view>
                            </div>
                        </view>
                        <transition name = 'switch'>
                            <uni-list>
                                <uni-list-item
                                    v-show = 'match.array.length == 0'
                                    title = '暂无比赛'
                                >
                                </uni-list-item>
                                <view
                                    v-for = 'i in (match.round == 0) ? match.array.slice((match.page - 1) * 20, match.page * 20) : match.array.filter(m => m.round == match.round).slice((match.page - 1) * 20, match.page * 20)'
                                >
                                    <view
                                        class = 'match'
                                        v-show = "match.submit.page === i && (i.status == 'Running' || i.status == 'Finished')"
                                    >
                                        <view id = 'score'>
                                            <uni-easyinput
                                                :clearable = 'false'
                                                type = 'number'
                                                :placeholder = 'participant.array.find(p => p.id == i.player1Id)?.name'
                                                v-model = 'match.submit.chk[match.array.findIndex(m => m === i)][0]'
                                                :disabled = "i.status != 'Running'"
                                            ></uni-easyinput>
                                            <view>
                                                <span>:</span>
                                            </view>
                                            <uni-easyinput
                                                :clearable = 'false'
                                                type = 'number'
                                                :placeholder = 'participant.array.find(p => p.id == i.player2Id)?.name'
                                                v-model = 'match.submit.chk[match.array.findIndex(m => m === i)][1]'
                                                :disabled = "i.status != 'Running'"
                                            ></uni-easyinput>
                                        </view>
                                        <view class = 'button' @click = 'match.submit.on(i)'>{{ i.status == 'Running' ? '提交比分' : i.status == 'Finished' ? '重赛' : '' }}</view>
                                    </view>
                                    <uni-list-item
                                        :clickable = true
                                        @click = 'match.submit.show(i)'
                                        id = 'matchList'
                                    >
                                        <template v-slot:body>
                                            <view id = 'body'>
                                                <view id = 'left'>
                                                    <span
                                                        :class = "{ 'winner': i.winnerId == i.player1Id }"
                                                    >{{ participant.array.find(p => p.id == i.player1Id)?.name }}</span>
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
                                                    <span>{{ `第${i.round}轮` }}</span>
                                                    <br v-show = 'i.round == match.maxRound'>
                                                    <span class = 'small' v-show = 'i.isThirdPlaceMatch'>季军赛</span>
                                                    <span class = 'small' v-show = '!i.isThirdPlaceMatch && i.round == match.maxRound'>决赛</span>
                                                </view>
                                                <view  id = 'right'>
                                                    <span
                                                        :class = "{ 'winner': i.winnerId == i.player2Id }"
                                                    >{{ participant.array.find(p => p.id == i.player2Id)?.name }}</span>
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
                            :total = '(match.round == 0) ? match.total : match.array.filter(m => m.round == match.round).length'
                        >
                        </uni-pagination>
                    </uni-card>
                </transition>
                <transition name = 'switch'>
                    <MatchTree
                        v-if = "!page.loading && tournament.this.rule == 'SingleElimination'"
                        v-show = "match.array.length > 0"
                        :matches = 'match.array'
                        :participants = 'participant.array'
                    ></MatchTree>
                </transition>
            </uni-card>
        </transition>
    </view>
</template>
<script setup lang = 'ts'>
    import {ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../script/emitter.ts'
    import UniApp from '../script/uniapp.ts';
    import {Tabulator, User} from '../script/post.ts';
    import Tournament from '../script/tournament.ts';
    import Participant from '../script/participant.ts';
    import Match from '../script/match.ts';
    import Const from '../script/const.ts'
    import Mycard from '../script/mycard.ts';
    import {TournamentCreateObject, MatchUpdateObject, TournamentGet, ParticipantUpdateObject} from '../script/type.ts'
    import MatchTree from './matchTree.vue';
    import svgDeck from './svg/svgDeck.vue';
    import svgCards from './svg/svgCards.vue';

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
        search : async () : Promise<boolean> => {
            const url = window.location.hash.match(/#\/(.*?)(?:\?|$)/);
            // @ts-ignore
            const id = url[1];
            // @ts-ignore
            const t : TournamentGet = await Tabulator.Tournament.Find(Mycard.token, id);
            if (t.tournament) {
                tournament.this = t.tournament;
                const participants = t.participant;
                participant.array = participants.participants;
                participant.total = participants.total;
                const matches = t.match;
                match.array = matches.matches;
                match.total = matches.total;
                emitter.emit(Const.tournamentReload, tournament.this);
                return true;
            }
            return false;
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
        shuffle : () : void => {
            if (tournament.this?.status != 'Ready') return;
            uni.showModal({
                title : '确认要打乱次序吗？',
                success : async (res : UniApp.ShowModalRes) : Promise<void> => {
                    if (!res.confirm) return;
                    // @ts-ignore
                    if (await Tabulator.Tournament.Shuffle(Mycard.token, tournament.this.id))
                        tournament.search();
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
        upload : async () : Promise<void> => {
            const f = async (res : UniApp.ChooseFileSuccessCallbackResult) : Promise<void> => {
                let del_list : Array<Participant> = [];
                // @ts-ignore
                res.tempFiles.forEach(i => {
                    const p = participant.array.filter(p => p.name == i.name.replace(/\.[^/.]+$/, ""));
                    del_list.push(...p);
                });

                // @ts-ignore
                if (await Tabulator.Tournament.UpdateYdk(Mycard.token, tournament.this.id, res)) {
                    for (const i of del_list)
                        await participant.del(i);
                    await tournament.search();
                }
            };
            await UniApp.selectFile(['.ydk', '.txt'], f);
        },
        copy : () : void => {
            if (!tournament.this) return;
            let string = `<--- ${tournament.this.name} - [${tournament.this.rule == 'SingleElimination' ? '淘汰赛' : '瑞士轮'}]${tournament.this.ruleSettings.rounds ? `[${tournament.this.ruleSettings.rounds}轮]` : ''}[${tournament.this.count ?? 0}人] --->\n`
            for (let round = 1; round <= match.maxRound; round ++) {
                if (match.round > 0 && match.round != round) continue;
                string += `---------------------------------------------\n第[ ${round} ]轮对决战况表\n---------------------------------------------\n`
                match.array.filter(i => i.round == round).forEach((i, v) => {
                    if (i.player1Id || i.player2Id) {
                        string += `[${v + 1}]组\n`;
                        string += `\t[选手A][${participant.array.find(p => p.id == i.player1Id)?.name ?? ''}]\n`;
                        string += `\t[比 分][${i.status == 'Finished' ? `${i.player1Score} : ${i.player2Score}` : 'VS'}]\n`;
                        string += `\t[选手B][${participant.array.find(p => p.id == i.player2Id)?.name ?? ''}]\n`;
                    }
                });
            }
            string += '---------------------------------------------';
            UniApp.copy(string);
        }
    });

    let match = reactive({
        array : [] as Array<Match>,
        total : 0,
        page : 1,
        round : 0,
        maxRound : 0,
        status : {
            color : new Map([
                ['Running', 'rgb(84, 200, 17)'],
                ['Finished', 'darkgray'],
                ['Abandoned', 'red']
            ]) as Map<string, string>
        },
        submit : {
            page : undefined as Match | undefined,
            show : (i : Match) : void => {
                match.submit.page = match.submit.page === i ? undefined : i;
                if (!match.submit.page)
                    match.submit.chk = match.array.map(i => [i.player1Score ?? 0, i.player2Score ?? 0]);
            },
            on : async (i : Match) : Promise<void> => {
                const v = match.array.findIndex(m => m === i);
                switch (i.status) {
                    case 'Running':
                        const player1 : number = match.submit.chk[v][0] ?? 0;
                        const player2 : number = match.submit.chk[v][1] ?? 0;
                        const id : null | number = player1 > player2 ? i.player1Id : player1 == player2 ? null : i.player2Id
                        // @ts-ignore
                        if (await Tabulator.Match.Update(Mycard.token, i.id, {
                            player1Score : player1,
                            player2Score : player2,
                            winnerId : id
                        } as MatchUpdateObject))
                            await page.reload();
                        break;
                    case 'Finished':
                        // @ts-ignore
                        if (await Tabulator.Match.Update(Mycard.token, i.id, {
                            player1Score : 0,
                            player2Score : 0,
                            winnerId : undefined
                        } as MatchUpdateObject))
                            await page.reload();
                        break;
                }
            },
            chk : [] as Array<Array<number>>
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
                await tournament.search();
            }
        },
        del : async(i : Participant) : Promise<void> => {
            const del = async() : Promise<boolean> => {
                // @ts-ignore
                return await Tabulator.Participant.Delete(Mycard.token, i.id);
            }
            const update = async() : Promise<boolean> => {
                return await Tabulator.Participant.Update(Mycard.token, i.id, {
                    name : i.name,
                    quit : true
                });
            }
            // @ts-ignore
            if (tournament.this.status == 'Ready' ? await del() : await update())
                await tournament.search();
        },
        update : async (Data : TournamentCreateObject) : Promise<void> => {
            // @ts-ignore
            if (await Tabulator.Tournament.Update(Mycard.token, tournament.this.id, Data))
                page.reload();
        },
        upload : async (i : Participant) : Promise<void> => {
            const f = async (res : UniApp.ChooseFileSuccessCallbackResult) : Promise<void> => {
                if (res.tempFiles[0].size < Const.maxSize) {
                    i.updateDeck(await UniApp.readFile(res.tempFiles[0]));
                    if (await Tabulator.Participant.Update(Mycard.token, i.id, {
                        name : i.name,
                        deckbuf : i.deckbuf
                    } as ParticipantUpdateObject))
                        await tournament.search();
                }
            };
            await UniApp.selectFile(['.ydk', '.txt'], f, 1);
        },
        pics : {
            on : (i : Participant) => {
                emitter.emit(Const.picsOpen, {
                    participant : i,
                    main : i.getDeck().main,
                    side : i.getDeck().side,
                    blob : i.Blob()
                })
            }
        },
        move : {
            this : undefined as Participant | undefined,
            start : (i : Participant, e : TouchEvent) : void => {
                const on = () : void => {
                    participant.move.this = i;
                };
                const end = async () : Promise<void> => {
                    if (participant.move.this === i) {
                        participant.move.this = undefined;
                        return;
                    }
                    const v1 = participant.array.findIndex(p => { return p === i; });
                    const v2 = participant.array.findIndex(p => { return p === participant.move.this; });
                    participant.move.this = undefined;
                    if (v1 - v2 != 1) {
                        // @ts-ignore
                        if (await participant.move.change(participant.array[v1].id, v2 >= 1 ? participant.array[v2 - 1].id : 0) && await participant.move.change(participant.array[v2].id, v1 >= 1 ? participant.array[v1 - 1].id : 0))
                            await tournament.search();
                    } else {
                        const v = v1 > v2 ? v1 : v2;
                        await participant.move.down(participant.array[v - 1].id, participant.array[v].id);
                    }
                };
                participant.move.this ? end() : on();
            },
            change : async (from : number, to : number) : Promise<void> => {
                // @ts-ignore
                return await Tabulator.Tournament.Drag(Mycard.token, tournament.this?.id, from, to);
            },
            down : async (from : number, to : number) : Promise<void> => {
                // @ts-ignore
                if (await Tabulator.Tournament.Drag(Mycard.token, tournament.this?.id, from, to))
                    await tournament.search();
            }
        }
    });

    let page = reactive({
        height : 0,
        loading : false,
        clear : (chk = false) : void => {
            const i = window.location.href.split('/?');
            if (chk)
                window.location.replace(`${window.location.origin}/#${i[1] ? `/?${i[1]}` : '/'}`);
            else
                emitter.emit(Const.changeUrl, `${window.location.origin}/#${i[1] ? `/?${i[1]}` : '/'}`);
        },
        show : () : void => {
            emitter.emit(Const.show);
        },
        get : async () : Promise<void> => {
            if (await tournament.search())
                page.show();
            else
                page.clear(true);
        },
        reload : async () : Promise<void> => {
            const query = uni.createSelectorQuery().in(this);
            query.select('#PageTournament').boundingClientRect(res => {
                // @ts-ignore
                page.height = res.height ?? 0;
            }).exec();
            page.loading = true;
            participant.name = '';
            if (await tournament.search()) {
                match.round = 0;
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
            UniApp.copy(`${window.location.href.split('/?')[0]}`);
        }
    });

    let creator = reactive({
        name : '',
        avatar : ''
    });

    const loading = () : void => {
        const url = window.location.hash.match(/#\/(.*?)(?:\?|$)/);
        url && !isNaN(parseInt(url[1])) ? page.get() : page.clear();
    };

    onBeforeMount(() => {
        loading();
        document.addEventListener("click", page.clickClear);
        // @ts-ignore
        emitter.on(Const.updateTournament, participant.update);
        emitter.on(Const.showTournament, loading);
    });

    onUnmounted(() => {
        document.removeEventListener("click", page.clickClear);
        // @ts-ignore
        emitter.off(Const.updateTournament, participant.update);
        emitter.off(Const.showTournament, loading);
    });

    watch(() => { return match.round; }, () : void => {
        match.page = 1;
    });

    watch(() => { return match.array; }, async () : Promise<void> => {
        match.submit.chk = match.array.map(i => [i.player1Score ?? 0, i.player2Score ?? 0]);
        if (match.array.length > 0)
            match.maxRound = match.array.reduce((a, b) => (a.round > b.round) ? a : b)?.round ?? 0;
        else match.maxRound = 0;
    }, {deep : true});

    watch(() => { return match.maxRound; }, async () : Promise<void> => {
        if (!Number.isNaN(tournament.this?.ruleSettings.rounds ?? 0))
            emitter.emit(Const.updateRounds, match.maxRound);
    });

    watch(() => { return tournament.this?.creator; }, async (n = -1) => {
        if (n >= 0) {
            const response = await User.Find.Id(n);
            if (response) {
                creator.name = response.username;
                creator.avatar = response.avatar;
            }
        }
    }, {immediate : true});

</script>

<style scoped lang = 'scss'>
    @import '../style/tournament.scss';
    @import '../style/transition.scss';
</style>