<template>
    <view id = 'page'>
        <view id = 'head'>
            <view>
                <button id = 'search_button' class = 'click' @click = 'page.show.search()'>
                    <uni-icons class = 'click' :type = "page.search ? 'left' : 'search'"></uni-icons>
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
                    class = 'click'
                >
                    <uni-icons class = 'click' :type = "page.user ? 'right' : 'left'"></uni-icons>
                </uni-list-chat>
            </uni-list>
        </view>
        <transition name = 'move_right'>
            <uni-card
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
                class = 'user click'
                @click = '() => {
                    Mycard.id >= 0 ? Mycard.logout() : Mycard.login();
                }'
            ><span class = 'click'>{{ Mycard.id >= 0 ? '退出登陆' : '登陆' }}</span></view>
            </uni-card>
        </transition>
        <transition name = 'move_left'>
            <uni-card
                id = 'search'
                v-show = 'page.search'
                title = '搜索'
                :style = "{ '--size' : `${size.width > size.height ? size.width / 4 : size.width / 2}px` }"
            >
                <uni-datetime-picker type = 'daterange' v-model = 'search.date'/>
                <uni-search-bar
                    placeholder = '组织者id'
                    cancelButton = 'none'
                    v-model = 'search.creator'
                >
                </uni-search-bar>
                <uni-search-bar
                    placeholder = '比赛名称'
                    cancelButton = 'none'
                    v-model = 'search.info.name'
                >
                </uni-search-bar>
                <uni-search-bar
                    placeholder = '比赛id'
                    cancelButton = 'none'
                    v-model = 'search.id'
                >
                </uni-search-bar>
                <uni-data-select
                    placeholder = '比赛规则'
                    v-model = 'search.rule.select'
                    :localdata = 'search.rule.range'
                >
                </uni-data-select>
                <uni-data-select
                    placeholder = '状态'
                    v-model = 'search.status.select'
                    :localdata = 'search.status.range'
                >
                </uni-data-select>
                <uni-data-select
                    placeholder = '可见性'
                    v-model = 'search.visibility.select'
                    :localdata = 'search.visibility.range'
                    v-show = 'Mycard.id >= 0'
                >
                </uni-data-select>
                <br>
                <view id = 'search_button' class = 'click' @click = 'search.on()'>
                    <view class = 'click'>
                        <span class = 'click'>搜索</span>
                        <uni-icons class = 'click' type = 'search'></uni-icons>
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
                            v-for = '(i, v) in search.result.tournaments'
                            :title = 'i.name'
                            :note = 'i.description'
                            :rightText = '`${i.createdAt.toLocaleDateString()}\n${i.count}`'
                            :clickable = true
                            @click = 'page.show.tournament(v)'
                        >
                        </uni-list-item>
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
                    <PageTournament
                        v-show = 'page.tournament'
                    ></PageTournament>
                </transition>
            </view>
        </transition>
    </view>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import { TournamentFindObject } from '../script/type.ts';
    import Uniapp from '../script/uniapp.ts';
    import Tabulator from '../script/post.ts';
    import Tournament from '../script/tournament.ts';
    import ApiKey from '../script/apikey.ts';
    import Mycard from '../script/mycard.ts';
    import emitter from '../script/emitter.ts'
    import { selectTournament } from '../script/const.ts'
    import PageTournament from './tournament.vue';
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc3NjY4LCJpYXQiOjE3NDUzODcwNDksImV4cCI6MTc3NjkyMzA0OX0.pyyGtE_WjU8qtz1r2NKbe3jufsYW1PCk6wnczxuMHmM'

    let page = reactive({
        user : false,
        search : false,
        menu : true,
        tournament : false,
        show : {
            user : () : void => {
                page.user = !page.user;
            },
            search : () : void => {
                page.search = !page.search;
            },
            tournament : async(v : number = 0): Promise<void> => {
                page.menu = false;
                await (new Promise(resolve => setTimeout(resolve, 500)));
                page.tournament = true;
                emitter.emit(selectTournament, search.result.tournaments[v]);
            },
            menu : async(): Promise<void> => {
                page.tournament = false;
                await (new Promise(resolve => setTimeout(resolve, 500)));
                page.menu = true;
            },
            clear : (e) : void => {
                if (!e.target.className.includes('click')) {
                    if (page.user)
                        page.show.user()
                    if (page.search)
                        page.show.search()
                }
            }
        }
    });

    let search = reactive({
        id : '',
        creator : '',
        date : [] as Array<string>,
        rule : {
            select : '',
            range : [
                { value: 0, text: '全部' },
                { value: 1, text: '单淘' },
                { value: 2, text: '瑞士轮' }
            ],
            info : [
                { value: 0, text: '' },
                { value: 1, text: 'SingleElimination' },
                { value: 2, text: 'Swiss' }
            ]
        },
        visibility : {
            select : '',
            range: [
                { value: 0, text: '全部' },
                { value: 1, text: '公开' },
                { value: 2, text: '仅登陆可见' },
                { value: 3, text: '私密' }
            ],
            info : [
                { value: 0, text: '' },
                { value: 1, text: 'Public' },
                { value: 2, text: 'Internal' },
                { value: 3, text: 'Private' }
            ]
        },
        status : {
            select : '',
            range: [
                { value: 0, text: '全部' },
                { value: 1, text: '准备中' },
                { value: 2, text: '进行中' },
                { value: 3, text: '已结束' }
            ],
            info : [
                { value: 0, text: '' },
                { value: 1, text: 'Ready' },
                { value: 2, text: 'Running' },
                { value: 3, text: 'Finished' }
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
            page.search = false;
            if (search.result.total > 0) {
                search.result.total = 0;
            }
            const result = await Tabulator.Tournament.FindALL(Mycard.token, search.info);
            search.result.total = result.total;
            search.result.tournaments = result.tournaments;
        }
    });

    const test = async () => {
        page.user = !page.user;
        // Mycard.login()
        // let response = await Tabulator.Tournament.Create(token, {
        //     name: "string",
        //     description: "暂无介绍。",
        //     rule: "SingleElimination",
        //     ruleSettings: {
        //         rounds: 0,
        //         winScore: 0,
        //         drawScore: 0,
        //         byeScore: 0,
        //         hasThirdPlaceMatch: true
        //     },
        //     visibility: "Public",
        //     collaborators: [
        //         1
        //     ]
        // });
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
        
        // console.log(await Tabulator.Participant.Create(token, { name : 'jwyxym', tournamentId : 5}))
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

    onBeforeMount(() => {
        /*
        if (Mycard.id < 0)
            Mycard.login();
        */
        Uniapp.chkScreen(size.get);
        search.on();
        document.addEventListener("click", page.show.clear);
    });

    onUnmounted(() => {
        document.removeEventListener("click", page.show.clear);
    });

    watch(() => { return search.date; }, () => {
        search.info.after = new Date(search.date[0]);
        search.info.before = new Date(`${search.date[1]}T23:59:59.999`);
    });

    watch(() => { return search.id; }, () => {
        if (search.id == '')
            search.info.id = 0;
        else if (!isNaN(parseInt(search.id)))
            search.info.id = parseInt(search.id);
    });

    watch(() => { return search.creator; }, () => {
        if (search.creator == '')
            search.info.creator = 0;
        else if (!isNaN(parseInt(search.creator)))
            search.info.creator = parseInt(search.creator);
    });

    watch(() => { return search.rule.select; }, () => {
        if (!isNaN(parseInt(search.rule.select)) && search.rule.select != '')
            search.info.rule = search.rule.info[search.rule.select].text;
    });

    watch(() => { return search.visibility.select; }, () => {
        if (!isNaN(parseInt(search.visibility.select)) && search.visibility.select != '')
            search.info.visibility = search.visibility.info[search.visibility.select].text;
    });

    watch(() => { return search.status.select; }, () => {
        if (!isNaN(parseInt(search.status.select)) && search.status.select != '')
            search.info.status = search.status.info[search.status.select].text;
    });

</script>
<style scoped lang = 'scss'>
    @import '../style/style.scss';
    @import '../style/page.scss';

    .switch {
        &-enter-active,
        &-leave-active {
            transition: opacity 0.5s ease;
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
        }

        &-enter-to,
        &-leave-from {
            opacity: 1;
        }
    }

    .move_left {
        &-enter-active,
        &-leave-active {
            transition: transform 0.5s ease;
        }

        &-enter-from,
        &-leave-to {
            transform: translateX(-200%);
        }

        &-enter-to,
        &-leave-from {
            transform: translateX(0%);
        }
    }

    .move_right {
        &-enter-active,
        &-leave-active {
            transition: transform 0.5s ease;
        }

        &-enter-from,
        &-leave-to {
            transform: translateX(200%);
        }

        &-enter-to,
        &-leave-from {
            transform: translateX(0%);
        }
    }
</style>