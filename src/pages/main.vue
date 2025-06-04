<template>
    <view id = 'main_page'>
        <transition name = 'page'>
            <view v-show = 'loading' class = 'background'>
                <view class = 'pic' v-html = 'Const.pic.hajimi'></view>
            </view>
        </transition>
        <Tabulator/>
    </view>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import Tabulator from './tabulator.vue';
    import emitter from '../script/emitter.ts';
    import Const from '../script/const.ts';

    let loading = ref(true);

    const changeUrl = async (url : string) : Promise<void> => {
        loading.value = !loading.value;
        await (new Promise(resolve => setTimeout(resolve, 500)));
        window.location.replace(url);
    }

    const show =  async () : Promise<void> => {
        await (new Promise(resolve => setTimeout(resolve, 500)));
        loading.value = !loading.value;
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
    #main_page {
        background: linear-gradient(to right, rgb(255, 228, 230), white, white, white, rgb(204, 251, 241));
        height: 100%;
        min-height: 100vh;
        width: 100%;
        .background {
            position: fixed;
            background: linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234));
            width: 100%;
            height: 100vh;
            z-index: 100;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            .pic {
                color: white;
                white-space: pre;
                line-height: 1;
                letter-spacing: 0;
                font-size: 12px;
            }
        }
        .Tabulator {
            position: fixed;
            z-index: 1;
        }
    }
</style>