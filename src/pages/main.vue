<template>
    <transition name = 'move_right_slow'>
        <view v-show = 'loading' id = 'background'>
            <view id = 'pic'></view>
        </view>
    </transition>
    <Tabulator/>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import Tabulator from './tabulator.vue';
    let loading = ref(true);
    onMounted(async () => {
        await (new Promise(resolve => setTimeout(resolve, 500)));
        loading.value = false;
    });
</script>
<style scoped lang = 'scss'>
    @import '../style/transition.scss';
    #background {
        position: fixed;
        background: linear-gradient(45deg, rgb(0, 162, 255), rgb(0, 72, 255));
        width: 100vw;
        height: 100vh;
        z-index: 2;
        #pic {
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