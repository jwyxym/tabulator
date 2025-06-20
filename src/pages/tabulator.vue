<template>
    <view id = 'page'>
        <view id = 'really' class = 'click head'>
            <view>
                <button
                    :style = "size.width > size.height ? { width: '30%' } : {}"
                    class = 'button'
                    @click = 'page.show.drawer()'
                >
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
        <view class = 'click head'><uni-list><uni-list-chat></uni-list-chat></uni-list></view>
        <Pics
            :style = "{
                '--maxsize' : `${size.width > size.height ? size.width / 2 : size.width / 1.2}px`,
                '--minsize' : `${size.width / 2}px`,
                '--height' : `${size.width > size.height ? 10 : 25}%`,
            }"
        ></Pics>
        <transition name = 'move_right'>
            <uni-card
                class = 'click'
                id = 'user'
                v-show = 'page.user'
                :title = 'Mycard.username'
                :sub-title = 'Mycard.email'
                :thumbnail = 'Mycard.avatar'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 2 : size.width / 1.2}px`, '--minsize' : `${size.width > size.height ? size.width / 4 : size.width / 2.4}px` }"
            >
            <view v-show = 'Mycard.id >= 0'><h2><span>{{ Mycard.id }}</span></h2></view>
            <hr v-show = 'Mycard.id >= 0'>
            <view
                v-show = 'Mycard.id >= 0'
                class = 'user'
                @click = 'page.show.api()'
            ><span>api_key</span></view>
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
            <Searcher
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.menu && !(page.create || page.apikey)'
                title = '搜索'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            ></Searcher>
        </transition>
        <transition name = 'move_left'>
            <Setting
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.tournament && !(page.create || page.apikey)'
                title = '比赛设置'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            ></Setting>
        </transition>
        <transition name = 'move_left'>
            <Create
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.create'
                title = '比赛创建'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            >
            </Create>
        </transition>
        <transition name = 'move_left'>
            <API
                class = 'click'
                id = 'drawer'
                v-show = 'page.drawer && page.apikey'
                title = '我的api密钥'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            >
            </API>
        </transition>
        <br>
        <transition name = 'switch'>
            <view
                id = 'body'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 2 : size.width}px` }"
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
                            @click = 'page.show.tournament(i.id)'
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
                        @change = 'search.on()'
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
    import { TournamentFindObject, TournamentCreateObject, ruleSettings, UserObject } from '../script/type.ts';
    import UniApp from '../script/uniapp.ts';
    import { Tabulator, User} from '../script/post.ts';
    import Tournament from '../script/tournament.ts';
    import Mycard from '../script/mycard.ts';
    import emitter from '../script/emitter.ts'
    import Const from '../script/const.ts'
    import PageTournament from './tournament.vue';
    import Create from './drawer/creator.vue';
    import Pics from './pics.vue';
    import Setting from './drawer/setting.vue';
    import Searcher from './drawer/searcher.vue';
    import API from './drawer/api.vue';
    
    let page = reactive({
        user : false,
        drawer : false,
        menu : true,
        tournament : false,
        create : false,
        apikey : false,
        show : {
            user : () : void => {
                page.user = !page.user;
            },
            drawer : () : void => {
                page.drawer = !page.drawer;
                if (!page.drawer && page.create)
                    page.create = false;
                if (!page.drawer && page.apikey)
                    page.apikey = false;
                if (!page.drawer && page.tournament)
                    tournament.init(tournament.this as Tournament);
            },
            tournament : (id : number = 0): void => {
                const url = window.location.href.split('/?');
                const hash = url[0].replace(/\/#\/\d+\/?/, '/#');
                emitter.emit(Const.changeUrl, `${hash.endsWith('/') ? hash : `${hash}/`}${id}${url[1] ? `/?${url[1]}` : ''}`);
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
            api : async(): Promise<void> => {
                if (page.drawer) {
                    page.show.drawer();
                    await (new Promise(resolve => setTimeout(resolve, 500)));
                }
                page.apikey = true;
                page.show.drawer();
            },
            clear : (e) : void => {
                let element = e.target;
                let chk = false;
                let inPage = false;
                let uniElement = false;
                while (element) {
                    if (['head', 'user', 'drawer', 'newTournament'].includes(element.id) || element.classList.contains('click'))
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
            before : undefined,
            after : undefined,
            name : '',
            rule : '',
            visibility : '',
            status : ''
        } as TournamentFindObject,
        result : {
            total : 0,
            tournaments : [] as Array<Tournament>
        },
        on : async (Data : TournamentFindObject = search.info) : Promise<void> => {
            page.drawer = false;
            if (search.result.total > 0) {
                search.result.total = 0;
            }
            const result = await Tabulator.Tournament.FindALL(Mycard.token, Data);
            search.result.total = result.total;
            search.result.tournaments = result.tournaments;
        },
        mine : () => {
            search.creator = Mycard.id >= 0 ? Mycard.id.toString() : '';
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
        collaborator : '',
        collaborators : [] as Array<UserObject>,
        init : async (t : Tournament) : Promise<void> => {
            if (!t) return;
            tournament.this = t;
            tournament.name = t.name;
            tournament.description = t.description;
            tournament.visibility.select = t.visibility;
            tournament.rule.select = t.rule;
            tournament.rule.settings = Object.assign({}, t.ruleSettings);
            let collaborators : Array<UserObject> = [];
            for (const id of t.collaborators) {
                const i = tournament.collaborators.find(i => i.id == id) ?? await User.Find.Id(id);
                if (i) collaborators.push(i);
            }
            tournament.collaborators = collaborators;
        },
        updateRounds : (round : number) : void => {
            tournament.rule.settings.rounds = round;
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
            if (!tournament.visibility.select)
                // @ts-ignore
                tournament.visibility.select = tournament.this.visibility;

            const collaborators = tournament.collaborators.map(user => user.id);
            emitter.emit(Const.updateTournament, {
                name: tournament.name,
                description: tournament.description,
                visibility: tournament.visibility.select,
                collaborators : collaborators,
                rule : tournament.this?.status == 'Ready' ? tournament.rule.select : undefined,
                ruleSettings : tournament.this?.status == 'Ready' ? tournament.rule.settings : undefined
            } as TournamentCreateObject);
        },
        remove : (v : number) : void => {
            tournament.collaborators.splice(v, 1);
        },
        add : async() : Promise<void> => {
            try {
                if (tournament.collaborators.findIndex(i => i.username == tournament.collaborator) >= 0)
                    throw new Error('协作者已存在');
                const i = await User.Find.Name(tournament.collaborator);
                if (!i)
                    throw new Error('未搜索到此用户');
                if (tournament.this?.creator == i.id)
                    throw new Error('协作者不可以是比赛创建者');
                tournament.collaborators.push(i);
            } catch(error) {
                UniApp.error(error.message, '添加失败');
            } finally {
                tournament.collaborator = '';
            }
        },
        operatorChk : () : boolean => {
            if (!tournament.this)
                return true
            return !(Mycard.id >= 0 && (Mycard.id == tournament.this?.creator || tournament.this?.collaborators.includes(Mycard.id)))
        }
    });

    const creator = {
        off : async (id : number) : Promise<void> => {
            page.show.drawer();
            if (page.tournament)
                page.show.tournament(id);
            else {
                search.mine();
                await search.on();
            }
        }
    };

    let size = reactive({
        width : 0,
        height : 0,
        get : () => {
            // @ts-ignore
            size.width = uni.getSystemInfoSync().windowWidth;
            size.height = uni.getSystemInfoSync().windowHeight;
        }
    });

    const loading = async () : Promise<void> => {
        const url = window.location.hash.match(/#\/(.*?)(?:\?|$)/);
        if (url) {
            if (!isNaN(parseInt(url[1]))) {
                page.menu = false;
                page.tournament = true;
                emitter.emit(Const.showTournament);
            } else if (url[1].length == 0) {
                if (window.location.href.includes('/?') && window.location.hash.endsWith('#/')) {
                    const i = window.location.href.split('/?');
                    window.location.replace(`${i[0].replace('#/', '')}/#${i[1] ? `/?${i[1].replace('#/', '')}` : '/'}`);
                    return;
                }
                page.tournament = false;
                page.menu = true;
                search.mine();
                search.info.creator = search.creator == '' ? 0 : parseInt(search.creator);
                await search.on();
                emitter.emit(Const.show, false);
            }
        } else {
            const i = window.location.href.split('/?');
            emitter.emit(Const.changeUrl, `${window.location.origin}/#${i[1] ? `/?${i[1]}` : '/'}`);
        }
    };

    onBeforeMount(() : void => {
        loading();
        UniApp.chkScreen(size.get);
        document.addEventListener("click", page.show.clear);
        emitter.on(Const.tournamentInfo, page.show.drawer);
        emitter.on(Const.newTournament, page.show.create);
        // @ts-ignore
        emitter.on(Const.tournamentReload, tournament.init);
        // @ts-ignore
        emitter.on(Const.updateRounds, tournament.updateRounds);
        // @ts-ignore
        emitter.on(Const.createOff, creator.off);
        window.addEventListener('hashchange', loading);
    });

    onMounted(() => {
        emitter.emit(Const.settingInit, tournament);
        emitter.emit(Const.searcherInit, search);
    });

    onUnmounted(() => {
        document.removeEventListener("click", page.show.clear);
        emitter.off(Const.tournamentInfo, page.show.drawer);
        emitter.off(Const.newTournament, page.show.create);
        // @ts-ignore
        emitter.off(Const.tournamentReload, tournament.init);
        // @ts-ignore
        emitter.off(Const.updateRounds, tournament.updateRounds);
        // @ts-ignore
        emitter.off(Const.createOff, creator.off);
        window.removeEventListener('hashchange', loading);
    });

    watch(() => { return search.date; }, () => {
        const toDate = () => {
            search.info.after = new Date(search.date[0]);
            search.info.before = new Date(`${search.date[1]}T23:59:59.999`);
        };
        const toUndefined = () => {
            search.info.after = undefined;
            search.info.before = undefined;
        };
        search.date.length > 0 ? toDate() : toUndefined();
    });

    watch(() => { return search.id; }, () => {
        search.info.id = search.id == '' ? 0 : parseInt(search.id);
    });

    watch(() => { return search.creator; }, () => {
        search.info.creator = search.creator == '' ? 0 : parseInt(search.creator);
    });

</script>
<style scoped lang = 'scss'>
    @import '../style/page.scss';
    @import '../style/transition.scss';
    @import '../style/style.scss';
</style>