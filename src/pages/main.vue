<template>
    <view id = 'page'>
        <view id = 'head' class = 'click'>
            <view>
                <button class = 'button' @click = 'page.show.drawer()'>
                    <uni-icons :type = "page.menu ? page.drawer ? 'left' : 'search' : page.drawer ? 'left' : 'info'"></uni-icons>
                </button>
            </view>
            <view>&nbsp;</view>
            <view>&nbsp;</view>
            <view>&nbsp;</view>
            <uni-list>
                <uni-list-chat
                    :avatar-circle = true
                    :title = 'Mycard.username'
                    :note = 'Mycard.email'
                    :clickable = true
                    :avatar = 'Mycard.avatar'
                    @click = 'page.show.user()'
                >
                    <uni-icons :type = "page.user ? 'right' : 'left'"></uni-icons>
                </uni-list-chat>
            </uni-list>
        </view>
        <transition name = 'move_right'>
            <uni-card
                class = 'click'
                id = 'user'
                v-show = 'page.user'
                :title = 'Mycard.username'
                :sub-title = 'Mycard.email'
                :thumbnail = 'Mycard.avatar'
                :style = "{ '--size' : `${size.width / 2}px` }"
            >
            <view v-show = 'Mycard.id >= 0'><h2>{{ Mycard.id }}</h2></view>
            <hr v-show = 'Mycard.id >= 0'>
            <view
                v-show = 'Mycard.id >= 0'
                class = 'user'
            ><span>获取api_key</span></view>
            <hr v-show = 'Mycard.id >= 0'>
            <view
                v-show = 'Mycard.id >= 0'
                class = 'user'
                @click = 'page.show.create()'
            ><span>新建比赛</span></view>
            <hr v-show = 'Mycard.id >= 0'>
            <view
                class = 'user'
                @click = '() => {
                    Mycard.id >= 0 ? Mycard.logout() : Mycard.login();
                }'
            ><span>{{ Mycard.id >= 0 ? '退出登陆' : '登陆' }}</span></view>
            </uni-card>
        </transition>
        <transition name = 'move_left'>
            <uni-card
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.menu && !page.create'
                title = '搜索'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            >
                <uni-datetime-picker type = 'daterange' v-model = 'search.date'/>
                <uni-easyinput
                    prefixIcon = 'search'
                    type = 'number'
                    placeholder = '组织者id'
                    cancelButton = 'none'
                    v-model = 'search.creator'
                ></uni-easyinput>
                <view class = 'button' @click = 'search.mine()'>
                    我组织的比赛
                </view>
                <uni-easyinput
                    prefixIcon = 'search'
                    type = 'text'
                    placeholder = '比赛名称'
                    cancelButton = 'none'
                    v-model = 'search.info.name'
                ></uni-easyinput>
                <uni-easyinput
                    prefixIcon = 'search'
                    type = 'number'
                    placeholder = '比赛id'
                    cancelButton = 'none'
                    v-model = 'search.id'
                ></uni-easyinput>
                <uni-data-select
                    placeholder = '比赛规则'
                    v-model = 'search.info.rule'
                    :localdata = 'search.rule.range'
                >
                </uni-data-select>
                <uni-data-select
                    placeholder = '状态'
                    v-model = 'search.info.status'
                    :localdata = 'search.status.range'
                >
                </uni-data-select>
                <uni-data-select
                    placeholder = '可见性'
                    v-model = 'search.info.visibility'
                    :localdata = 'search.visibility.range'
                    v-show = 'Mycard.id >= 0'
                >
                </uni-data-select>
                <br>
                <view class = 'button' @click = 'search.on()'>
                    <view>
                        <span>搜索</span>
                        <uni-icons type = 'search'></uni-icons>
                    </view>
                </view>
            </uni-card>
        </transition>
        <transition name = 'move_left'>
            <uni-card
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.tournament && !page.create'
                title = '比赛设置'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            >
                <uni-easyinput type = 'text' placeholder = '比赛名称' v-model = 'tournament.name'/>
                <uni-easyinput type = 'text' placeholder = '比赛描述' v-model = 'tournament.description'/>
                <uni-data-select
                    placeholder = '可见性'
                    v-model = 'tournament.visibility.select'
                    :localdata = 'tournament.visibility.range'
                ></uni-data-select>
                <uni-data-select
                    placeholder = '规则'
                    v-model = 'tournament.rule.select'
                    :localdata = 'tournament.rule.range'
                    :disabled = "tournament.this?.status != 'Ready'"
                ></uni-data-select>
                <view v-show = "tournament.rule.select == 'Swiss'">
                    <uni-easyinput type = 'number' placeholder = '轮数' v-model = 'tournament.rule.settings.rounds' :disabled = "tournament.this?.status != 'Ready'"/>
                    <uni-easyinput type = 'number' placeholder = '胜利分' v-model = 'tournament.rule.settings.winScore' :disabled = "tournament.this?.status != 'Ready'"/>
                    <uni-easyinput type = 'number' placeholder = '平局分' v-model = 'tournament.rule.settings.drawScore' :disabled = "tournament.this?.status != 'Ready'"/>
                    <uni-easyinput type = 'number' placeholder = '轮空分' v-model = 'tournament.rule.settings.byeScore' :disabled = "tournament.this?.status != 'Ready'"/>
                </view>
                <view v-show = "tournament.rule.select == 'SingleElimination'">
                    <checkbox-group @change = 'tournament.hasThirdPlaceMatch.select'>
                        <label>
                            <checkbox :checked = 'tournament.rule.settings.hasThirdPlaceMatch' :disabled = "tournament.this?.status != 'Ready'"/>季军赛
                        </label>
                    </checkbox-group>
                </view>
                <br>
                <view class = 'button' @click = 'tournament.update()'>
                    <view>
                        <span>设置</span>
                        <uni-icons type = 'calendar'></uni-icons>
                    </view>
                </view>
            </uni-card>
        </transition>
        <transition name = 'move_left'>
            <uni-card
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.create'
                title = '比赛创建'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            >
                <uni-easyinput type = 'text' placeholder = '比赛名称' v-model = 'create.name'/>
                <uni-easyinput type = 'text' placeholder = '比赛描述' v-model = 'create.description'/>
                <uni-data-select
                    placeholder = '可见性'
                    v-model = 'create.visibility.select'
                    :localdata = 'tournament.visibility.range'
                ></uni-data-select>
                <uni-data-select
                    placeholder = '规则'
                    v-model = 'create.rule.select'
                    :localdata = 'tournament.rule.range'
                ></uni-data-select>
                <view v-show = "create.rule.select == 'Swiss'">
                    <!-- <uni-easyinput type = 'number' placeholder = '轮数' v-model = 'create.rule.settings.rounds'/> -->
                    <uni-easyinput type = 'number' placeholder = '胜利分' v-model = 'create.rule.settings.winScore'/>
                    <uni-easyinput type = 'number' placeholder = '平局分' v-model = 'create.rule.settings.drawScore'/>
                    <uni-easyinput type = 'number' placeholder = '轮空分' v-model = 'create.rule.settings.byeScore'/>
                </view>
                <view v-show = "create.rule.select == 'SingleElimination'">
                    <checkbox-group @change = 'create.hasThirdPlaceMatch.select'>
                        <label>
                            <checkbox :checked = 'create.rule.settings.hasThirdPlaceMatch'/>季军赛
                        </label>
                    </checkbox-group>
                </view>
                <br>
                <view class = 'button' @click = 'create.update()'>
                    <view>
                        <span>创建</span>
                        <uni-icons type = 'calendar'></uni-icons>
                    </view>
                </view>
            </uni-card>
        </transition>
        <br>
        <transition name = 'switch'>
            <view
                id = 'body'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 2 : size.width / 1.2}px` }"
            >
                <transition name = 'switch'>
                    <uni-list
                        v-show = 'search.result.total > 0 && page.menu'
                    >
                        <uni-list-item
                            id = 'list'
                            v-for = '(i, v) in search.result.tournaments'
                            :title = 'i.name'
                            :note = 'search.rule.note.get(i.rule)'
                            :rightText = '`${i.createdAt.toLocaleDateString()}\n${i.count}`'
                            :clickable = true
                            @click = 'page.show.tournament(v)'
                        ></uni-list-item>
                    </uni-list>
                </transition>
                <transition name = 'switch'>
                    <uni-pagination
                        :current = 'search.info.pageCount'
                        v-model = 'search.info.pageCount'
                        pageSize = 20
                        :total = 'search.result.total'
                        v-show = 'page.menu'
                    >
                    </uni-pagination>
                </transition>
                <transition name = 'switch'>
                    <PageTournament v-if = 'page.tournament'/>
                </transition>
            </view>
        </transition>
    </view>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import { TournamentFindObject, TournamentCreateObject, ruleSettings } from '../script/type.ts';
    import Uniapp from '../script/uniapp.ts';
    import Tabulator from '../script/post.ts';
    import Tournament from '../script/tournament.ts';
    import ApiKey from '../script/apikey.ts';
    import Mycard from '../script/mycard.ts';
    import emitter from '../script/emitter.ts'
    import {
        updateTournament ,
        tournamentInfo,
        tournamentReload
    } from '../script/const.ts'
    import PageTournament from './tournament.vue';
    
    let page = reactive({
        user : false,
        drawer : false,
        menu : true,
        tournament : false,
        create : false,
        show : {
            user : () : void => {
                page.user = !page.user;
            },
            drawer : () : void => {
                page.drawer = !page.drawer;
                if (!page.drawer && page.create)
                    page.create = false;
                if (!page.drawer && page.tournament)
                    tournament.init(tournament.this as Tournament);
            },
            tournament : async(v : number = 0): Promise<void> => {
                page.menu = false;
                await (new Promise(resolve => setTimeout(resolve, 500)));
                page.tournament = true;
                const url = window.location.href.split('/?');
                window.location.replace(`${url[0].replace(/\/?$/, '')}/tournament/${search.result.tournaments[v].id}${url[1] ? `/?${url[1]}` : ''}`);
            },
            menu : async(): Promise<void> => {
                page.tournament = false;
                tournament.clear();
                await search.on();
                await (new Promise(resolve => setTimeout(resolve, 500)));
                page.menu = true;
            },
            create : async(): Promise<void> => {
                if (page.drawer) {
                    page.show.drawer();
                    await (new Promise(resolve => setTimeout(resolve, 500)));
                }
                page.create = true;
                page.show.drawer();
            },
            clear : (e) : void => {
                let element = e.target;
                let chk = false;
                let inPage = false;
                let uniElement = false;
                while (element) {
                    if (['head', 'user', 'drawer'].includes(element.id) || element.classList.contains('click'))
                        chk = true;
                    if (element.id == 'page')
                        inPage = true;
                    if (typeof element.className == 'string' && element.className.includes('uni'))
                        uniElement = true;
                    element = element.parentElement;
                }
                if (chk || (!inPage && uniElement))
                    return undefined;
                if (page.user)
                    page.show.user();
                if (page.drawer)
                    page.show.drawer();
            }
        }
    });

    let search = reactive({
        id : '',
        creator : '',
        date : [] as Array<string>,
        rule : {
            range : [
                { value: ' ', text: '全部' },
                { value: 'SingleElimination', text: '单淘' },
                { value: 'Swiss', text: '瑞士轮' }
            ],
            note : new Map([
                ['SingleElimination' , '单淘'],
                ['Swiss' , '瑞士轮']
            ]) as Map<string, string>
        },
        visibility : {
            range: [
                { value: ' ', text: '全部' },
                { value: 'Public', text: '公开' },
                { value: 'Internal', text: '仅登陆可见' },
                { value: 'Private', text: '私密' }
            ]
        },
        status : {
            range: [
                { value: ' ', text: '全部' },
                { value: 'Ready', text: '准备中' },
                { value: 'Running', text: '进行中' },
                { value: 'Finished', text: '已结束' }
            ]
        },
        info : {
            pageCount : 1,
            id : 0,
            creator : 0,
            name : '',
            rule : '',
            visibility : '',
            status : ''
        } as TournamentFindObject,
        result : {
            total : 0,
            tournaments : [] as Array<Tournament>
        },
        on : async () : Promise<void> => {
            page.drawer = false;
            if (search.result.total > 0) {
                search.result.total = 0;
            }
            const result = await Tabulator.Tournament.FindALL(Mycard.token, search.info);
            search.result.total = result.total;
            search.result.tournaments = result.tournaments;
        },
        mine : () => {
            search.creator = Mycard.id.toString();
        }
    });

    let tournament = reactive({
        this : undefined as undefined | Tournament,
        name : '',
        description : '',
        visibility : {
            select : '',
            range : [
                { value: 'Public', text: '公开' },
                { value: 'Internal', text: '仅登陆可见' },
                { value: 'Private', text: '私密' }
            ]
        },
        rule : {
            select : '',
            range : [
                { value: 'SingleElimination', text: '单淘' },
                { value: 'Swiss', text: '瑞士轮' }
            ],
            settings : {
            } as ruleSettings
        },
        hasThirdPlaceMatch : {
            select : (e) => {
                tournament.rule.settings.hasThirdPlaceMatch = e.detail.value.length > 0
            }
        },
        collaborators : [] as Array<number>,
        init : (t : Tournament) : void => {
            if (!t) return;
            tournament.this = t;
            tournament.name = t.name;
            tournament.description = t.description;
            tournament.visibility.select = t.visibility;
            tournament.rule.select = t.rule;
            tournament.rule.settings = Object.assign({}, t.ruleSettings);
            tournament.collaborators = t.collaborators;
        },
        clear : () : void => {
            tournament.this = undefined;
            tournament.name = '';
            tournament.description = '';
            tournament.visibility.select = '';
            tournament.rule.select = '';
            tournament.rule.settings = {} as ruleSettings;
            tournament.collaborators = [];
        },
        update : () : void => {
            if (tournament.visibility.select == '')
            // @ts-ignore
                tournament.visibility.select = tournament.this.visibility;
            emitter.emit(updateTournament, {
                name: tournament.name,
                description: tournament.description,
                visibility: tournament.visibility.select,
                collaborators : tournament.collaborators,
                rule : tournament.rule.select,
                ruleSettings : tournament.rule.settings
            } as TournamentCreateObject);
        }
    });

    let create = reactive({
        name : '',
        description : '',
        visibility : {
            select : ''
        },
        rule : {
            select : '',
            settings : {
            } as ruleSettings
        },
        hasThirdPlaceMatch : {
            select : (e) => {
                create.rule.settings.hasThirdPlaceMatch = e.detail.value.length > 0
            }
        },
        collaborators : [] as Array<number>,
        clear : () : void => {
            create.name = '';
            create.description = '';
            create.visibility.select = '';
            create.rule.select = '';
            create.rule.settings = {} as ruleSettings;
            create.collaborators = [];
        },
        update : async() : Promise<void> => {
            if (create.visibility.select == '')
            // @ts-ignore
                create.visibility.select = 'SingleElimination';
            if (await Tabulator.Tournament.Create(Mycard.token, {
                    name: create.name,
                    description: create.description,
                    rule: create.rule.select,
                    ruleSettings: create.rule.settings,
                    visibility: create.visibility.select,
                    collaborators: create.collaborators
                })
            ) {
                page.show.drawer();
                if (page.tournament)
                    page.show.menu();
                create.clear();
                await search.on();
            }
        }
    });

    const test = async () => {
        let response = await Tabulator.Tournament.Create(Mycard.token, {
            name: "test",
            description: "暂无介绍。",
            rule: "SingleElimination",
            ruleSettings: {
                rounds: 0,
                winScore: 0,
                drawScore: 0,
                byeScore: 0,
                hasThirdPlaceMatch: true
            },
            visibility: "Public",
            collaborators: [
                1
            ]
        });
        // await Tabulator.Tournament.Delete(token, 3);
        // await Tabulator.Tournament.FindALL(token, {});
        // await Tabulator.Tournament.Update(token, 3, {
        //     name: "update",
        //     description: "update",
        //     visibility: "Public",
        //     collaborators : [
        //         1
        //     ]
        // });
        
        // console.log(await Tabulator.Tournament.Create(Mycard.token, { name : 'test'}))
        // console.log(await Tabulator.Tournament.FindALL(token, {}))
        // console.log(await Tabulator.Match.FindALL(token, { id : 5 }))
        // console.log(await Tabulator.Participant.FindALL(token))
        // let response = await Tabulator.Tournament.Find(token, 3);
        // await Tabulator.Tournament.Start(token, 4);
    }

    let size = reactive({
        width : 0,
        height : 0,
        get : () => {
            // @ts-ignore
            size.width = uni.getSystemInfoSync().windowWidth;
            size.height = uni.getSystemInfoSync().windowHeight;
        }
    });

    onBeforeMount(() : void => {
        Uniapp.chkScreen(size.get);
        document.addEventListener("click", page.show.clear);
        emitter.on(tournamentInfo, page.show.drawer);
        // @ts-ignore
        emitter.on(tournamentReload, tournament.init);

        const url = window.location.pathname.match(/\/tournament\/([^\/]+)(?=\/|$)/);
        if (url && !isNaN(parseInt(url[1]))) {
            page.menu = false;
            page.tournament = true;
        } else {
            if (window.location.pathname.length > 1)
                window.location.replace(window.location.href.replace(window.location.pathname, ''))
            else
                search.on();
        }
    });

    onUnmounted(() => {
        document.removeEventListener("click", page.show.clear);
        emitter.off(tournamentInfo, page.show.drawer);
        // @ts-ignore
        emitter.off(tournamentReload, tournament.init);
    });

    watch(() => { return search.date; }, () => {
        search.date.length > 0 ? () => {
            search.info.after = new Date(search.date[0]);
            search.info.before = new Date(`${search.date[1]}T23:59:59.999`);
        } : () => {
            search.info.after = undefined;
            search.info.before = undefined;
        }

    });

    watch(() => { return search.id; }, () => {
        search.info.id = search.id == '' ? 0 : parseInt(search.id);
    });

    watch(() => { return search.creator; }, () => {
        search.info.creator = search.creator == '' ? 0 : parseInt(search.creator);
    });

</script>
<style scoped lang = 'scss'>
    @import '../style/style.scss';
    @import '../style/page.scss';
    @import '../style/transition.scss';
</style>