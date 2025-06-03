<template>
    <transition name = 'move_right'>
        <view v-show = 'loading.end' class = 'background' :style = "{ '--index' : index.end }">
            <view class = 'pic'></view>
        </view>
    </transition>
    <transition name = 'move_left'>
        <view v-show = 'loading.start' class = 'background' :style = "{ '--index' : index.start }">
            <view class = 'pic'></view>
        </view>
    </transition>
    <Tabulator/>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import Tabulator from './tabulator.vue';
    import emitter from '../script/emitter.ts';
    import Const from '../script/const.ts';

    let loading = reactive({
        start : false,
        end : true
    });

    let index = reactive({
        start : 100,
        end : 99
    });

    const changeUrl = async (url : string) : Promise<void> => {
        loading.start = true;
        await (new Promise(resolve => setTimeout(resolve, 500)));
        window.location.replace(url);
    }

    const show =  async () : Promise<void> => {
        if (loading.start) {
            loading.end = true;
            await (new Promise(resolve => setTimeout(resolve, 500)));
            index.end = 100;
            index.start = 99;
            loading.start = false;
            await (new Promise(resolve => setTimeout(resolve, 500)));
            loading.end = false;
            index.end = 99;
            index.start = 100;
            return;
        }
        await (new Promise(resolve => setTimeout(resolve, 500)));
        loading.end = false;
    }

    onBeforeMount(() : void => {
        // @ts-ignore
        emitter.on(Const.changeUrl, changeUrl);
        emitter.on(Const.show, show);
    })

    onUnmounted(() : void => {
        // @ts-ignore
        emitter.off(Const.changeUrl, changeUrl);
        emitter.off(Const.show, show);
    });
</script>
<style scoped lang = 'scss'>
    @import '../style/transition.scss';
    .background {
        position: fixed;
        // background: linear-gradient(45deg, rgb(0, 162, 255), rgb(0, 72, 255));
        width: 100vw;
        height: 100vh;
        z-index: var(--index);
        .pic {
            // background-image: url("./static/pic.png");
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
    .Tabulator {
        position: fixed;
        z-index: 1;
    }
</style>