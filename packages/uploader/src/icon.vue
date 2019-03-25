<template>
    <svg  class="g-icon" @click="$emit('click',$event)">
        <use :xlink:href="`#icon-${iconname}`"></use>
    </svg>
</template>

<script>
    import './svg'
    export default {
        name: "g-icon",
        props:['iconname']
    }
</script>
<style lang="less" scoped>
    .g-icon {
        width: 1.3em;
        height: 1.3em;
    }
</style>