<template>
    <view class = 'Pics'>
        <transition name = 'move_right'>
            <uni-card
                v-show = 'deck.participant'
                :title = "`${deck.participant?.name ?? '...'} 的卡组`"
                id = 'main'
                spacing = '0px'
                padding = '0px'
            >
                <view class = 'list'>
                    <view
                        class = 'button'
                        v-show = 'deck.main.length > 0 || deck.side.length > 0'
                        @click = 'deck.download()'
                    >
                        <uni-icons type = 'download'></uni-icons>
                    </view>
                </view>
                <uni-card class = 'deck' :title = "deck.main.length > 0 ? '主卡组' : '暂无主卡组'">
                    <cover-image class = 'deck_cards' v-for = '(i, v) in deck.main' :src = 'getImg(i)' @error = 'changeImg.main(v)'></cover-image>
                </uni-card>
                <uni-card class = 'deck' :title = "deck.side.length > 0 ? '副卡组' : '暂无副卡组'">
                    <cover-image class = 'deck_cards' v-for = '(i, v) in deck.side' :src = 'getImg(i)' @error = 'changeImg.side(v)'></cover-image>
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

    interface CardPic {
        code : number,
        ot : number
    }

    let url = reactive({
        custom : ''
    });

    const getImg = (i : CardPic) : string => {
        switch (i.ot) {
            case (Const.ot.CustomJpg) :
                return `${url.custom}${url.custom.endsWith('/') ? '' : '/'}${i.code}.jpg`;
            case (Const.ot.CustomPng) :
                return `${url.custom}${url.custom.endsWith('/') ? '' : '/'}${i.code}.png`;
            case (Const.ot.Basic) :
                return Math.floor(Math.log10(Math.abs(i.code))) < 8 ? `https://cdn.233.momobako.com/ygopro/pics/${i.code}.jpg!half` : `https://cdn02.moecube.com:444/ygopro-super-pre/data/pics/${i.code}.jpg`;
            default :
                return 'https://cdn.233.momobako.com/ygopro/pics/0.jpg!half';
        }
    };

    const changeImg = {
        main : (v : number) : void => {
            deck.main[v].ot += 1;
        },
        side : (v : number) : void => {
            deck.side[v].ot += 1;
        }
    };

    let deck = reactive({
        participant : undefined as Participant | undefined,
        chk : false,
        main : [] as Array<CardPic>,
        side : [] as Array<CardPic>,
        blob : undefined as Blob | undefined,
        init : async (i : {
            participant : Participant,
            main : Array<number>,
            side : Array<number>,
            blob : Blob,
            url : string
        }) : Promise<void> => {
            if (deck.chk) return;
            const participant = i.participant ?? undefined;
            if (participant && deck.participant == participant) {
                deck.off();
                return;
            }
            if (deck.participant) {
                deck.participant = undefined;
                await (new Promise(resolve => setTimeout(resolve, 500)));
            }
            url.custom = i.url;
            deck.blob = i.blob;
            deck.main.push(...i.main.map(code => ({ code, ot: url.custom ? Const.ot.CustomJpg : Const.ot.Basic })));
            deck.side.push(...i.side.map(code => ({ code, ot: url.custom ? Const.ot.CustomJpg : Const.ot.Basic })));
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
            url.custom = '';
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
    @import '../style/transition.scss';
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
    .list {
        display: grid;
        justify-items: center;
    }
</style>