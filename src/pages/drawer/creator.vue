<template>
    <uni-card class = 'Create'>
        <uni-easyinput type = 'text' placeholder = '比赛名称' v-model = 'create.name'/>
        <uni-easyinput type = 'text' placeholder = '比赛描述' v-model = 'create.description'/>
        <uni-data-select
            placeholder = '可见性'
            v-model = 'create.visibility.select'
            :localdata = 'create.visibility.range'
        ></uni-data-select>
        <uni-data-select
            placeholder = '规则'
            v-model = 'create.rule.select'
            :localdata = 'create.rule.range'
        ></uni-data-select>
        <view v-show = "create.rule.select == 'Swiss'">
            <uni-easyinput type = 'number' placeholder = '轮数(不填则自动计算)' v-model = 'create.rule.settings.rounds'/>
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
            <checkbox-group @change = 'create.import.select'>
                <label>
                    <checkbox :checked = 'create.import.chk'/>是否继承瑞士轮
                </label>
            </checkbox-group>
            <uni-easyinput
                type = 'number'
                placeholder = '瑞士轮比赛id'
                v-show = 'create.import.chk'
                v-model = 'create.import.id'
            />
            <uni-easyinput
                type = 'number'
                placeholder = '出轮人数'
                v-show = 'create.import.chk'
                v-model = 'create.import.count'
            />
        </view>
        <br>
        <uni-card
            id = 'collaborators'
            title = '协作者'
            :is-full = 'true'
        >
            <uni-list>
                <uni-list-chat
                    v-for = '(i, v) in create.collaborators'
                    :avatarCircle = 'true'
                    :clickable = true
                    :avatar = 'i.avatar'
                    :title = 'i.username'
                    :note = "i.id >= 0 ? i.id.toString() : ''"
                    @click = 'create.remove(v)'
                >
                    <view>
                        <view class = 'button'>
                            <uni-icons type = 'trash'></uni-icons>
                        </view>
                    </view>
                </uni-list-chat>
                <uni-list-item>
                    <template v-slot:header>
                        <uni-forms>
                            <uni-forms-item id = 'header'>
                                <uni-easyinput type = 'text' placeholder = '添加协作者' v-model = 'create.collaborator'/>
                            </uni-forms-item>
                        </uni-forms>
                    </template>
                    <template v-slot:footer>
                        <view  id = 'footer'>
                            <view
                                class = 'button'
                                :style = "{ '--color' : '#409eff' }"
                                @click = 'create.add()'
                            >
                                <uni-icons type = 'personadd'></uni-icons>
                            </view>
                        </view>
                    </template>
                </uni-list-item>
            </uni-list>
        </uni-card>
        <br>
            <uni-easyinput type = 'text' placeholder = '卡图图床（例：https://example.com/api/）' v-model = 'create.pics'/>
        <br>
        <view class = 'button' @click = 'create.clear()'>
            <view>
                <span>清空</span>
                <uni-icons type = 'trash'></uni-icons>
            </view>
        </view>
        <view class = 'button' @click = 'create.update()'>
            <view>
                <span>创建</span>
                <uni-icons type = 'calendar'></uni-icons>
            </view>
        </view>
    </uni-card>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import { ruleSettings, UserObject } from '../../script/type.ts';
    import {Tabulator, User} from '../../script/post.ts';
    import Mycard from '../../script/mycard.ts';
    import emitter from '../../script/emitter.ts'
    import Const from '../../script/const.ts'
    import Tournament from '../../script/tournament.ts';
    import UniApp from '../../script/uniapp.ts';

    let create = reactive({
        name : '',
        description : '',
        pics : '',
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
            settings : {
                hasThirdPlaceMatch : true
            } as ruleSettings,
            range : [
                { value: 'SingleElimination', text: '单淘' },
                { value: 'Swiss', text: '瑞士轮' }
            ]
        },
        hasThirdPlaceMatch : {
            select : (e) => {
                create.rule.settings.hasThirdPlaceMatch = e.detail.value.length > 0;
            }
        },
        import : {
            chk : false,
            id : undefined as undefined | number,
            count : undefined as undefined | number,
            select : (e) => {
                create.import.chk = e.detail.value.length > 0;
            }
        },
        collaborator : '',
        collaborators : [] as Array<UserObject>,
        clear : () : void => {
            create.name = '';
            create.description = '';
            create.visibility.select = '';
            create.rule.select = '';
            create.rule.settings = {
                hasThirdPlaceMatch : true
            } as ruleSettings;
            create.collaborators = [];
            create.import.chk = false;
        },
        update : async() : Promise<void> => {
            try {
                if (!create.visibility.select)
                    create.visibility.select = 'Public';
                if (create.import.chk) {
                    if (!create.import.id || create.import.id <= 0)
                        throw new Error('请填写继承的比赛id');
                    if (!create.import.count || create.import.count <= 0)
                        throw new Error('请填写出轮的人数');
                    const n = Math.log2(create.import.count);
                    if (n > 0 && !Number.isInteger(n) || n <= 0)
                        throw new Error('出轮的人数必须是2的幂');
                }
                if (create.rule.select == 'Swiss') {
                    if (!create.rule.settings.winScore && create.rule.settings.winScore == undefined)
                        throw new Error('请填写胜利分');
                    if (!create.rule.settings.drawScore && create.rule.settings.drawScore == undefined)
                        throw new Error('请填写平局分');
                    if (!create.rule.settings.byeScore && create.rule.settings.byeScore == undefined)
                        throw new Error('请填写轮空分');
                }
                const collaborators = create.collaborators.map(user => user.id);
                const id = await Tabulator.Tournament.Create(Mycard.token, {
                    name: create.name,
                    description: `${create.description}${create.pics ? `\n卡图地址：${create.pics}` : ''}`,
                    rule: create.rule.select,
                    ruleSettings: create.rule.settings,
                    visibility: create.visibility.select,
                    collaborators: collaborators
                });
                if (id >= 0) {
                    if (create.import.chk)
                        // @ts-ignore
                        await Tabulator.Tournament.Import(Mycard.token, id, create.import.id, create.import.count);
                    emitter.emit(Const.createOff, id);
                    create.clear();
                }
            } catch (error) {
                UniApp.error(error.message, '创建失败');
            }
        },
        remove : (v : number) : void => {
            create.collaborators.splice(v, 1);
        },
        add : async() : Promise<void> => {
            try {
                if (create.collaborators.findIndex(i => i.username == create.collaborator) >= 0)
                    throw new Error('协作者已存在');
                const i = await User.Find.Name(create.collaborator);
                if (!i)
                    throw new Error('未搜索到此用户');
                if (Mycard.id == i.id)
                    throw new Error('协作者不可以是比赛创建者');
                create.collaborators.push(i);
            } catch(error) {
                UniApp.error(error.message, '添加失败');
            } finally {
                create.collaborator = '';
            }
        },
        fromSwiss : (obj : {
            t : Tournament,
            value : number
        }) : void => {
            const t = obj.t;
            create.collaborators = [];
            t.collaborators.forEach(async id => {
                const i = await User.Find.Id(id);
                if (i)
                    create.collaborators.push(i);
            });
            create.rule.select = 'SingleElimination'
            create.visibility.select = t.visibility;
            create.import.chk = true;
            create.import.id = t.id;
            create.name = t.name;
            create.description = t.description;
            create.import.count = obj.value > 0 ? obj.value : undefined;
        }
    });

    onBeforeMount(() => {
        // @ts-ignore
        emitter.on(Const.newTournament, create.fromSwiss);
    });

    onUnmounted(() => {
        // @ts-ignore
        emitter.off(Const.newTournament, create.fromSwiss);
    });

    watch(() => { return create.import.chk; }, () => {
        if (!create.import.chk) {
            create.import.id = undefined;
            create.import.count = undefined;
        }
    })

</script>