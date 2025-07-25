<template>
    <uni-card class = 'Setting' v-if = 'tournament'>
        <uni-easyinput type = 'text' placeholder = '比赛名称' v-model = 'tournament.name' :disabled = '!operatorChk()'/>
        <uni-easyinput type = 'text' placeholder = '比赛描述' v-model = 'tournament.description' :disabled = '!operatorChk()'/>
        <uni-data-select
            placeholder = '可见性'
            v-model = 'tournament.visibility.select'
            :localdata = 'tournament.visibility.range'
            :disabled = '!operatorChk()'
        ></uni-data-select>
        <uni-data-select
            placeholder = '规则'
            v-model = 'tournament.rule.select'
            :localdata = 'tournament.rule.range'
            :disabled = "tournament.this?.status != 'Ready' || !operatorChk()"
        ></uni-data-select>
        <view v-show = "tournament.rule.select == 'Swiss'">
            <uni-easyinput type = 'number' placeholder = '轮数' v-model = 'tournament.rule.settings.rounds' :disabled = "tournament.this?.status != 'Ready' || !operatorChk()"/>
            <uni-easyinput type = 'number' placeholder = '胜利分' v-model = 'tournament.rule.settings.winScore' :disabled = "tournament.this?.status != 'Ready' || !operatorChk()"/>
            <uni-easyinput type = 'number' placeholder = '平局分' v-model = 'tournament.rule.settings.drawScore' :disabled = "tournament.this?.status != 'Ready' || !operatorChk()"/>
            <uni-easyinput type = 'number' placeholder = '轮空分' v-model = 'tournament.rule.settings.byeScore' :disabled = "tournament.this?.status != 'Ready' || !operatorChk()"/>
        </view>
        <view v-show = "tournament.rule.select == 'SingleElimination'">
            <checkbox-group @change = 'tournament.hasThirdPlaceMatch.select'>
                <label>
                    <checkbox :checked = 'tournament.rule.settings.hasThirdPlaceMatch' :disabled = "tournament.this?.status != 'Ready' || !operatorChk()"/>季军赛
                </label>
            </checkbox-group>
        </view>
        <br>
        <view v-show = 'operatorChk()'>
            <view class = 'button' @click = 'emit.on()'>
                <span>{{ `切换状态：${status.text.get(tournament.this.status)}` }}</span>
                <uni-icons type = 'circle-filled' :color = 'status.color.get(tournament.this.status)'></uni-icons>
            </view>
            <view class = 'button' @click = 'emit.reset()'>
                <span>重置比赛</span>
                <uni-icons type = 'loop'></uni-icons>
            </view>
            <view class = 'button'  @click = 'emit.shuffle()'>
                <span>打乱选手</span>
                <uni-icons type = 'auth'></uni-icons>
            </view>
            <view class = 'button'  @click = 'emit.upload()'>
                <span>上传选手</span>
                <uni-icons type = 'cloud-upload'></uni-icons>
            </view>
            <view class = 'button' @click = 'emit.empty()'>
                <span>清空选手</span>
                <uni-icons type = 'spinner-cycle' color = 'red'></uni-icons>
            </view>
            <view class = 'button' @click = 'emit.del()'>
                <span>删除比赛</span>
                <uni-icons type = 'trash' color = 'red'></uni-icons>
            </view>
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
                <uni-list-item v-show = 'operatorChk()'>
                    <template v-slot:header>
                        <uni-forms>
                            <uni-forms-item id = 'header'>
                                <uni-easyinput type = 'text' placeholder = '添加协作者' v-model = 'tournament.collaborator' :disabled = 'tournament.operatorChk()'/>
                            </uni-forms-item>
                        </uni-forms>
                    </template>
                    <template v-slot:footer>
                        <view id = 'footer'>
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
            <uni-easyinput v-show = 'operatorChk()' type = 'text' placeholder = '卡图图床（例：https://example.com/api/）' v-model = 'tournament.pics'/>
        <br>
        <view class = 'button' @click = 'tournament.update()' v-show = 'operatorChk()'>
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
    import Mycard from '../../script/mycard.ts';

    let tournament;

    const operatorChk = () : boolean => {
        return Mycard.id >= 0 && (Mycard.id == tournament.this?.creator || (tournament.this?.collaborators.includes(Mycard.id) ?? false));
    }

    const init = (t) : void => {
        tournament = t;
    };

    const status = {
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
    }

    const emit = {
        on : () : void => {
            emitter.emit(Const.tournamentOn);
        },
        reset : () : void => {
            emitter.emit(Const.tournamentReset);
        },
        shuffle : () : void => {
            emitter.emit(Const.tournamentShuffle);
        },
        upload : () : void => {
            emitter.emit(Const.tournamentUpload);
        },
        empty : () : void => {
            emitter.emit(Const.tournamentEmpty);
        },
        del : () : void => {
            emitter.emit(Const.tournamentDel);
        }
    };

    onBeforeMount(() : void => {
        emitter.on(Const.settingInit, init)
    });
    onUnmounted(() : void => {
        emitter.off(Const.settingInit, init)
    });
</script>
<style lang = 'scss' scoped>
    .button {
        display: flex !important;
        width: 100%;
        justify-content: center !important;
        font-size: 16px;
        gap: 5%
    }
</style>