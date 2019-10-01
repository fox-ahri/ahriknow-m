<template>
    <div id="notebook-survey" class="notebook-survey">
        <router-link to="/notebook/bookdetail">Bookdetail</router-link>
        <van-button v-for="i in books" plain @click="read(i)" type="primary">朴素按钮</van-button>
    </div>
</template>

<script>
import { Popup, Button } from "vant";
export default {
    name: "notebook-survey",
    components: {
        "van-button": Button
    },
    data() {
        return {
            books: []
        };
    },
    created() {},
    methods: {
        read(val) {
            localStorage.setItem("book", JSON.stringify(val));
            this.$router.push({ name: "notebook-bookdetail", params: val });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/notebook/book/")
            .then(response => {
                if (response.data.code === 0) {
                    localStorage.removeItem("auth");
                    self.$router.push("/auth/login");
                } else if (response.data.code === 200) {
                    self.books = response.data.data;
                    console.log(self.books);
                } else {
                    console.log(response);
                }
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#notebook-survey {
}
</style>