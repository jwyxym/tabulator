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
    import { TournamentFindObject, ruleSettings, UserObject } from '../script/type.ts';
    import {Tabulator, User} from '../script/post.ts';
    import Mycard from '../script/mycard.ts';
    import emitter from '../script/emitter.ts'
    import Const from '../script/const.ts'

    let create = reactive({
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
            settings : {
            } as ruleSettings,
            range : [
                { value: 'SingleElimination', text: '单淘' },
                { value: 'Swiss', text: '瑞士轮' }
            ]
        },
        hasThirdPlaceMatch : {
            select : (e) => {
                create.rule.settings.hasThirdPlaceMatch = e.detail.value.length > 0
            }
        },
        collaborator : '',
        collaborators : [] as Array<UserObject>,
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
            const collaborators = create.collaborators.map(user => user.id);
            if (await Tabulator.Tournament.Create(Mycard.token, {
                    name: create.name,
                    description: create.description,
                    rule: create.rule.select,
                    ruleSettings: create.rule.settings,
                    visibility: create.visibility.select,
                    collaborators: collaborators
                })
            ) {
                emitter.emit(Const.createOff);
                create.clear();
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
                uni.showModal({
                    title : '添加失败',
                    content : error.message,
                    showCancel : false
                });
            } finally {
                create.collaborator = '';
            }
        }
    });
</script>