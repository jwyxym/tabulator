<template>
    <uni-card
        :is-full = 'true'
        title = '对阵图'
    >
    </uni-card>
</template>
<script setup lang = 'ts'>
    import { defineProps, onMounted, watch } from 'vue';
    import Match from '../script/match';
    import Participant from '../script/participant';

    const props = defineProps(['matches', 'participants']) as {
        matches : Array<Match>,
        participants : Array<Participant>
    };

    const getName = (id : number) : string => {
        const p = props.participants.find(i => i.id == id);
        return p?.name ?? '';
    }
</script>
<style scoped lang = 'scss'>
</style>