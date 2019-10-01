<template>
    <div id="notebook" class="notebook">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "notebook",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {}
};
</script>

<style lang="scss" scoped>
#notebook {
    width: 100%;
    height: 100%;
}
</style>