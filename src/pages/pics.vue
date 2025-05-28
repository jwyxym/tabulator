<template>
    <view class = 'Pics'>
        <transition name = 'move_right'>
            <uni-card
                v-show = 'deck.participant'
                :title = "`${deck.participant?.name ?? '...'} 的卡组`"
            >
                <!-- <view
                    class = 'button'
                    v-show = 'deck.main.length > 0 || deck.side.length > 0'
                    @click = 'deck.download()'
                >
                    <uni-icons type = 'download'></uni-icons>
                </view> -->
                <uni-card :title = "deck.main.length > 0 ? '主卡组' : '暂无主卡组'">
                    <image class = 'deck_cards' v-for = '(i, v) in deck.main' :src = 'getImg(i)' mode = 'aspectFit' @error = 'changeImg.main(v)'></image>
                </uni-card>
                <uni-card :title = "deck.side.length > 0 ? '副卡组' : '暂无副卡组'">
                    <image class = 'deck_cards' v-for = '(i, v) in deck.side' :src = 'getImg(i)' mode = 'aspectFit' @error = 'changeImg.main(v)'></image>
                </uni-card>
            </uni-card>
        </transition>
    </view>
</template>
<script setup lang = 'ts'>
    import { ref, reactive, onMounted, onUnmounted, onBeforeMount, watch} from 'vue';
    import emitter from '../script/emitter.ts'
    import Const from '../script/const.ts'
    import Participant from '../script/participant.ts';
    import Download from '../script/download.js';

    const getImg = (i : number) => {
        return i == 0 || Math.floor(Math.log10(Math.abs(i))) < 8 ? `https://cdn.233.momobako.com/ygopro/pics/${i}.jpg!half` : `https://cdn02.moecube.com:444/ygopro-super-pre/data/pics/${i}.jpg`
    };

    const changeImg = {
        main : (v : number) : void => {
            deck.main[v] = 0;
        },
        side : (v : number) : void => {
            deck.side[v] = 0;
        }
    };

    let deck = reactive({
        participant : undefined as Participant | undefined,
        chk : false,
        main : [] as Array<number>,
        side : [] as Array<number>,
        blob : undefined as Blob | undefined,
        init : (i : {
            participant : Participant,
            main : Array<number>,
            side : Array<number>,
            blob : Blob,
        }) : void => {
            if (deck.chk) return;
            const participant = i.participant ?? undefined;
            if (participant && deck.participant == participant) {
                deck.off();
                return
            }
            deck.main = i.main;
            deck.side = i.side;
            deck.blob = i.blob;
            deck.participant = participant;
        },
        off : async () : Promise<void> => {
            deck.chk = true;
            deck.participant = undefined;
            await (new Promise(resolve => setTimeout(resolve, 500)));
            deck.main = [];
            deck.side = [];
            deck.chk = false;
            deck.blob = undefined;
        },
        clickClear : (e) : void => {
            let element = e.target;
            while (element) {
                if (['deckbutton'].includes(element.id) || element.classList.contains('Pics'))
                    return undefined;
                element = element.parentElement;
            }
            deck.off();
        },
        download : () : void => {
            Download.start(deck.blob, `${deck.participant?.name}`);
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
    .button {
        border: 1px solid #409eff;
        display: flex;
        width: 20%;
        justify-content: center;
        &:hover {
            cursor: pointer;
            background-color: #e6e6e6;
        }
    }
</style>