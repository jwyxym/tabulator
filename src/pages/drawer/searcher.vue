<template>
    <uni-card class = 'Searcher' v-if = 'search'>
        <uni-datetime-picker type = 'daterange' v-model = 'search.date'/>
        <uni-easyinput
            prefixIcon = 'search'
            type = 'number'
            placeholder = '组织者id'
            cancelButton = 'none'
            v-model = 'search.creator'
        ></uni-easyinput>
        <view class = 'button' @click = 'search.mine()'>
            <span>我组织的比赛</span>
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
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../../script/emitter.ts';
    import Const from '../../script/const.ts'
    import Mycard from '../../script/mycard.ts';

    let search;

    const init = (s) : void => {
        search = s;
    };

    onBeforeMount(() : void => {
        emitter.on(Const.searcherInit, init)
    });
    onUnmounted(() : void => {
        emitter.off(Const.searcherInit, init)
    });
</script>