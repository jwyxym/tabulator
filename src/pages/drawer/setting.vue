<template>
    <uni-card class = 'Setting' v-if = 'tournament'>
        <uni-easyinput type = 'text' placeholder = '比赛名称' v-model = 'tournament.name' :disabled = 'tournament.operatorChk()'/>
        <uni-easyinput type = 'text' placeholder = '比赛描述' v-model = 'tournament.description' :disabled = 'tournament.operatorChk()'/>
        <uni-data-select
            placeholder = '可见性'
            v-model = 'tournament.visibility.select'
            :localdata = 'tournament.visibility.range'
            :disabled = 'tournament.operatorChk()'
        ></uni-data-select>
        <uni-data-select
            placeholder = '规则'
            v-model = 'tournament.rule.select'
            :localdata = 'tournament.rule.range'
            :disabled = "tournament.this?.status != 'Ready' || tournament.operatorChk()"
        ></uni-data-select>
        <view v-show = "tournament.rule.select == 'Swiss'">
            <uni-easyinput type = 'number' placeholder = '轮数' v-model = 'tournament.rule.settings.rounds' :disabled = "tournament.this?.status != 'Ready' || tournament.operatorChk()"/>
            <uni-easyinput type = 'number' placeholder = '胜利分' v-model = 'tournament.rule.settings.winScore' :disabled = "tournament.this?.status != 'Ready' || tournament.operatorChk()"/>
            <uni-easyinput type = 'number' placeholder = '平局分' v-model = 'tournament.rule.settings.drawScore' :disabled = "tournament.this?.status != 'Ready' || tournament.operatorChk()"/>
            <uni-easyinput type = 'number' placeholder = '轮空分' v-model = 'tournament.rule.settings.byeScore' :disabled = "tournament.this?.status != 'Ready' || tournament.operatorChk()"/>
        </view>
        <view v-show = "tournament.rule.select == 'SingleElimination'">
            <checkbox-group @change = 'tournament.hasThirdPlaceMatch.select'>
                <label>
                    <checkbox :checked = 'tournament.rule.settings.hasThirdPlaceMatch' :disabled = "tournament.this?.status != 'Ready' || tournament.operatorChk()"/>季军赛
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
                    v-for = '(i, v) in tournament.collaborators'
                    :avatarCircle = 'true'
                    :clickable = true
                    :avatar = 'i.avatar'
                    :title = 'i.username'
                    :note = "i.id >= 0 ? i.id.toString() : ''"
                    @click = 'tournament.remove(v)'
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
                                <uni-easyinput type = 'text' placeholder = '添加协作者' v-model = 'tournament.collaborator' :disabled = 'tournament.operatorChk()'/>
                            </uni-forms-item>
                        </uni-forms>
                    </template>
                    <template v-slot:footer>
                        <view  id = 'footer'>
                            <view
                                class = 'button'
                                :style = "{ '--color' : '#409eff' }"
                                @click = 'tournament.add()'
                            >
                                <uni-icons type = 'personadd'></uni-icons>
                            </view>
                        </view>
                    </template>
                </uni-list-item>
            </uni-list>
        </uni-card>
        <br>
        <view class = 'button' @click = 'tournament.update()'>
            <view>
                <span>设置</span>
                <uni-icons type = 'calendar'></uni-icons>
            </view>
        </view>
    </uni-card>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../../script/emitter.ts';
    import Const from '../../script/const.ts'

    let tournament;

    const init = (t) : void => {
        tournament = t;
    };

    onBeforeMount(() : void => {
        emitter.on(Const.settingInit, init)
    });
    onUnmounted(() : void => {
        emitter.off(Const.settingInit, init)
    });
</script>