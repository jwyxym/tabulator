<template>
    <view class = 'Pics'>
        <transition name = 'move_right'>
            <view v-show = 'deck.participant >= 0'>
                <uni-card :title = "deck.main.length > 0 ? '主卡组' : '暂无主卡组'">
                    <image class = 'deck_cards' v-for = '(i, v) in deck.main' :src = '`https://cdn.233.momobako.com/ygopro/pics/${i}.jpg!half`' mode = 'aspectFit' @error = 'changeImg.main(v)'></image>
                </uni-card>
                <uni-card :title = "deck.side.length > 0 ? '副卡组' : '暂无副卡组'">
                    <image class = 'deck_cards' v-for = '(i, v) in deck.side' :src = '`https://cdn.233.momobako.com/ygopro/pics/${i}.jpg!half`' mode = 'aspectFit' @error = 'changeImg.main(v)'></image>
                </uni-card>
            </view>
        </transition>
    </view>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../script/emitter.ts'
    import Const from '../script/const.ts'
import Participant from '../script/participant.ts';

    const changeImg = {
        main : (v : number) : void => {
            deck.main[v] = 0;
        },
        side : (v : number) : void => {
            deck.side[v] = 0;
        }
    };

    let deck = reactive({
        participant : -1 as number,
        main : [] as Array<number>,
        side : [] as Array<number>,
        init : (i : Map<string, Array<number>>) : void => {
            const participant = i.get('Participant')?.[0] ?? -1;
            if (participant && deck.participant == participant) {
                deck.off();
                return
            }
            deck.main = i.get('main') ?? [];
            deck.side = i.get('side') ?? [];
            deck.participant = participant;
        },
        off : async () : Promise<void> => {
            deck.participant = -1;
            await (new Promise(resolve => setTimeout(resolve, 500)));
            deck.main = [];
            deck.side = [];
        },
        clickClear : (e) : void => {
            let element = e.target;
            while (element) {
                if (['body'].includes(element.id) || element.classList.contains('Pics'))
                    return undefined;
                element = element.parentElement;
            }
            deck.off();
        }
    });

    onBeforeMount(() : void => {
        // @ts-ignore
        emitter.on(Const.picsOpen, deck.init);
        document.addEventListener("click", deck.clickClear);
    });

    onUnmounted(() => {
        // @ts-ignore
        emitter.off(Const.picsOpen, deck.init);
        document.removeEventListener("click", deck.clickClear);
    });
</script>
<style scoped lang = 'scss'>
    @import '../style/transition.scss';
</style>