<template>
    <uni-card
        :is-full = 'true'
        title = '对阵图'
    >
        <bracket :flat-tree = 'matches'>
            <template #player = ' { player }'>
                <view
                    class = 'player'
                    :style = "{ '--size' : `${size.width > size.height ? 10 : 20}vw`}"
                >
                    {{ player.name }}
                </view>
            </template>
        </bracket>
    </uni-card>
</template>
<script setup lang = 'ts'>
    import { defineProps, onBeforeMount, reactive, watch } from 'vue';
    import Match from '../script/match';
    import UniApp from '../script/uniapp.ts';
    import Participant from '../script/participant';
    import Bracket from "vue-tournament-bracket";

    const props = defineProps(['matches', 'participants']) as {
        matches : Array<Match>,
        participants : Array<Participant>
    };

    const getName = (id : number) : string => {
        const p = props.participants.find(i => i.id == id);
        return p?.name ?? '';
    }

    let size = reactive({
        width : 0,
        height : 0,
        get : () => {
            // @ts-ignore
            size.width = uni.getSystemInfoSync().windowWidth;
            size.height = uni.getSystemInfoSync().windowHeight;
        }
    });

    interface player {
        id : string;
        name : string;
        winner ?: boolean;
    }

    let matches : Array<{
        id : number;
        player1 : player;
        player2 : player;
        next ?: number;
    }> = reactive([]);

    onBeforeMount(() : void => {
        UniApp.chkScreen(size.get);
    });

    watch(() => { return props.matches; }, () => {
        props.matches.forEach(i => {
            matches.push({
                id : i.id,
                next : i.childMatchId,
                player1: {
                    id: i.player1.id ? i.player1.id.toString() : '',
                    name: i.player1.id ? getName(i.player1.id) : '',
                    winner: i.winnerId ? i.player1.id == i.winnerId : undefined
                },
                player2: {
                    id: i.player2.id ? i.player2.id.toString() : '',
                    name: i.player2.id ? getName(i.player2.id) : '',
                    winner: i.winnerId ? i.player2.id == i.winnerId : undefined
                }
            });
        });
        matches.forEach(i => {
            if (!i.player1.id || !i.player1.id) {
                const parents = matches.filter(m => m.next == i.id).sort((a, b) => a.id - b.id);
                if (parents) {
                    if (!i.player1.id && parents.length > 0) {
                        i.player1.id = parents[0].player1.winner ? parents[0].player1.id : parents[0].player2.winner ? parents[0].player2.id : '';
                        i.player1.name = parents[0].player1.winner ? parents[0].player1.name : parents[0].player2.winner ? parents[0].player2.name : '';
                    }
                    if (!i.player2.id && parents.length > 1) {
                        i.player2.id = parents[1].player1.winner ? parents[1].player1.id : parents[1].player2.winner ? parents[1].player2.id : '';
                        i.player2.name = parents[1].player1.winner ? parents[1].player1.name : parents[1].player2.winner ? parents[1].player2.name : '';
                    }
                }
            }
        });
    }, { immediate : true, deep : true });

</script>
<style scoped lang = 'scss'>
    .uni-card {
        min-width: 100%;
        overflow-x: auto;
        :deep(.player) {
            width: var(--size);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
</style>