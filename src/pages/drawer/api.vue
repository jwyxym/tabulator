<template>
    <uni-card class = 'API'>
        <uni-list>
            <uni-list-item
                v-show = 'api.list.length == 0'
                title = '暂无密钥'
            >
            </uni-list-item>
            <view v-for = '(i, v) in api.list'>
                <uni-list-item
                    
                    :clickable = true
                >
                    <template v-slot:header>
                        <view id = 'header'>
                            <span>{{ i.name }}</span>
                            <br>
                            <span class = 'small'>{{ i.description }}</span>
                            <br v-if = 'i.expireAt'>
                            <span class = 'small' v-if = 'i.expireAt'>{{ `过期时间：${new Date(i.expireAt).toLocaleString()}` }}</span>
                        </view>
                    </template>
                    <template v-slot:footer>
                        <view id = 'footer'>
                            <view
                                class = 'button'
                                @click = 'api.change(v)'
                            >
                                <uni-icons :type = "api.changing == v ? 'closeempty' : 'settings'"></uni-icons>
                            </view>
                            <view
                                class = 'button'
                                @click = 'api.copy(i)'
                            >
                                <uni-icons type = 'redo'></uni-icons>
                            </view>
                            <view
                                class = 'button'
                                style = "border: 1px solid red;"
                                @click = 'api.del(i)'
                            >
                                <uni-icons type = 'trash' color = 'red'></uni-icons>
                            </view>
                        </view>
                    </template>
                </uni-list-item>
                <uni-forms v-show = 'api.changing == v'>
                    <uni-datetime-picker type = 'datetime' v-model = 'api.changeInfo.date'/>
                    <uni-easyinput type = 'text' placeholder = '名称' v-model = 'api.changeInfo.name'/>
                    <uni-easyinput type = 'text' placeholder = '描述' v-model = 'api.changeInfo.description'/>
                    <view
                        class = 'button'
                        @click = 'api.update(i.id, v)'
                    >
                        <uni-icons type = 'upload'></uni-icons>
                    </view>
                </uni-forms>
            </view>
            <br>
            <hr>
            <view>
                <br>
                <h2>添加密钥</h2>
                <br>
                <uni-forms>
                    <uni-forms-item>
                        <uni-datetime-picker type = 'datetime' v-model = 'api.date'/>
                        <uni-easyinput type = 'text' placeholder = '名称' v-model = 'api.info.name'/>
                        <uni-easyinput type = 'text' placeholder = '描述' v-model = 'api.info.description'/>
                    </uni-forms-item>
                    <view
                        class = 'button'
                        @click = 'api.add()'
                    >
                        <uni-icons type = 'plusempty'></uni-icons>
                    </view>
                </uni-forms>
            </view>
        </uni-list>
        <br>
        <uni-pagination
            :current = 'api.page'
            v-model = 'api.page'
            pageSize = 20
            :total = 'api.total'
            @change = 'api.search()'
        >
        </uni-pagination>
    </uni-card>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../../script/emitter.ts';
    import Const from '../../script/const.ts'
    import Mycard from '../../script/mycard.ts';
    import ApiKey from '../../script/apikey.ts';
    import UniApp from '../../script/uniapp.ts';
    import { Tabulator} from '../../script/post.ts';
    import { ApiKeyCreateObject, ApiKeyFindObject} from '../../script/type.ts';

    let api = reactive({
        list : [] as Array<ApiKey>,
        page : 1,
        total : 0,
        search : async () : Promise<void> => {
            if (Mycard.id < 0) return;
            const res = await Tabulator.ApiKey.FindALL(Mycard.token, {
                pageCount : api.page,
                userId : Mycard.id
            });
            api.list = res.api;
            api.total = res.total;
        },
        del : async (i : ApiKey) : Promise<void> => {
            if (await Tabulator.ApiKey.Delete(Mycard.token, i.id))
                api.search();
        },
        add : async () : Promise<void> => {
            if (await Tabulator.ApiKey.Create(Mycard.token, api.info)) {
                api.clear();
                api.search();
            }
        },
        clear : () : void => {
            api.info = {
                name : '',
                description : '',
                expireAt : undefined as undefined | Date
            } as ApiKeyCreateObject;
            api.date = '';
        },
        copy : (i : ApiKey) : void => {
            UniApp.copy(i.key);
        },
        change : (v : number) : void => {
            if (api.changing == v) {
                api.changing = -1;
                api.changeInfo = {
                    date : '',
                    name : '',
                    description : '',
                    expireAt : undefined as undefined | Date
                };
            } else {
                const i = api.list[v];
                api.changeInfo = {
                    date : i.expireAt,
                    name : i.name,
                    description : i.description,
                    expireAt : new Date(i.expireAt)
                };
                api.changing = v;
            }
        },
        update : async (id : number, v : number) : Promise<void> => {
            if (await Tabulator.ApiKey.Update(Mycard.token, id, {
                name : api.changeInfo.name,
                description : api.changeInfo.description,
                expireAt : api.changeInfo.expireAt
            } as ApiKeyCreateObject))
                api.search();
        },
        info : {
            name : '',
            description : '',
            expireAt : undefined as undefined | Date
        } as ApiKeyCreateObject,
        date : '',
        changing : -1,
        changeInfo : {
            date : '',
            name : '',
            description : '',
            expireAt : undefined as undefined | Date
        }
    });

    watch(() => { return api.date; }, () => {
        const toDate = () => {
            api.info.expireAt = new Date(api.date);
        };
        const toUndefined = () => {
            api.info.expireAt = undefined;
        };
        api.date.length > 0 ? toDate() : toUndefined();
    });

    watch(() => { return api.list; }, () => {
        api.changing = -1;
        api.changeInfo = {
            date : '',
            name : '',
            description : '',
            expireAt : undefined as undefined | Date
        };
    }, { deep : true });

    watch(() => { return api.changeInfo.date; }, () => {
        const toDate = () => {
            api.changeInfo.expireAt = new Date(api.changeInfo.date);
        };
        const toUndefined = () => {
            api.changeInfo.expireAt = undefined;
        };
        api.changeInfo.date?.length ?? 0 > 0 ? toDate() : toUndefined();
    });

    onBeforeMount(() : void => {
        api.search();
    });

    onUnmounted(() : void => {
    });
    
</script>
<style lang = 'scss'>
    #footer {
        display: flex;
        justify-content: center;
        justify-items: center;
        align-items: center;
        column-gap: 10%;
    }
    .small {
        margin-top: 6px;
        color: #999;
        font-size: 12px;
        overflow: hidden;
    }
</style>