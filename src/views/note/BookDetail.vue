<template>
    <div id="notebook-bookdetail" class="notebook-bookdetail">
        <van-popup v-model="show" position="left" :style="{ width: '80%', height: '100%' }" closeable>
            123
        </van-popup>
        <van-button icon="wap-nav" color="#7232dd22" @click="show = true" />
        <div v-html="html"></div>
    </div>
</template>

<script>
import { Popup, Button } from "vant";
export default {
    name: "notebook-bookdetail",
    components: {
        "van-popup": Popup,
        "van-button": Button
    },
    data() {
        return {
            show: true,
            html: ""
        };
    },
    created() {},
    methods: {},
    mounted() {
        if (this.$route.params.hasOwnProperty("_id")) {
            this.html = this.$route.params;
        } else {
            if (localStorage.getItem("book")) {
                this.html = JSON.parse(localStorage.getItem("book"));
            } else {
                this.$router.push({ name: "notebook-survey" });
                return;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#notebook-bookdetail {
    width: 100%;
    height: 100%;
}
</style>