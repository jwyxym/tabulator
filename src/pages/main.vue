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
    @import '../style/style.scss';

    #main_page {
        .background {
            position: fixed;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            .pic {
                white-space: pre;
                line-height: 1;
                letter-spacing: 0;
            }
        }
        .Tabulator {
            position: fixed;
            z-index: 1;
        }
    }
</style>