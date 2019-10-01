<template>
    <div id="blog-detail" class="blog-detail">
        <van-popup
            v-model="show"
            position="left"
            :style="{ width: '80%', height: '100%' }"
            closeable
        >
            <div class="loading" v-show="loading">
                <van-loading size="50px" type="spinner" color="#1989fa" />
            </div>
            <div class="item" v-for=" i in art_list">
                <button @click="read(i)">
                    {{ i.name }}&nbsp;--&nbsp;
                    <span>{{ i.date }}</span>
                </button>
            </div>
        </van-popup>
        <div class="showMenu" @click="show = true">
            <van-icon name="wap-nav" />
        </div>
        <div class="showMenu" @click="goBack">
            <van-icon name="arrow-left" />
        </div>
        <div class="loading2" v-show="loading2">
            <van-loading size="50px" type="spinner" color="#1989fa" />
        </div>
        <div class="content markdown-body" v-html="article.html"></div>
    </div>
</template>

<script>
import { Popup, Icon, Loading } from "vant";
export default {
    name: "blog-detail",
    components: {
        "van-popup": Popup,
        "van-icon": Icon,
        "van-loading": Loading
    },
    data() {
        return {
            show: false,
            article: {},
            cate: "",
            art_list: [],
            loading: true,
            loading2: true
        };
    },
    created() {},
    methods: {
        read(val) {
            localStorage.setItem("article", JSON.stringify(val));
            this.article = val;
            this.show = false;
        },
        goBack() {
            this.$router.push({ name: "home" });
        }
    },
    mounted() {
        if (this.$route.params.hasOwnProperty("_id")) {
            this.article = this.$route.params;
            this.cate = this.article.category;
            this.loading2 = false;
        } else {
            if (localStorage.getItem("article")) {
                this.article = JSON.parse(localStorage.getItem("article"));
                this.cate = this.article.category;
                this.loading2 = false;
            }
        }
        if (this.$route.params.hasOwnProperty("cate")) {
            this.cate = this.$route.params.cate;
        } else {
            if (localStorage.getItem("cate")) {
                this.cate = localStorage.getItem("cate");
            }
        }
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/article/", {
                params: {
                    category: self.cate
                }
            })
            .then(response => {
                self.art_list = response.data.data;
                self.loading = false;
                if (self.$route.params.hasOwnProperty("cate") || localStorage.getItem("cate")) {
                    self.article = self.art_list[0];
                }
                self.loading2 = false;
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
                self.loading = false;
            });
    },
    beforeRouteLeave(to, from, next) {
        try {
            localStorage.removeItem("article");
            localStorage.removeItem("cate");
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#blog-detail {
    .showMenu {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 48px;
        font-size: 24px;
        float: left;
        &:active {
            background: #ccc;
        }
    }
    .loading2 {
        height: 200px;
        line-height: 200px;
        margin: 0 auto;
        width: 50px;
    }
    .content {
        padding: 50px 25px;
    }
    .van-popup {
        padding: 50px 20px;
        .loading {
            width: 100%;
            height: 200px;
            text-align: center;
            line-height: 200px;
        }
        .item {
            margin: 6px 0;
            overflow: hidden;
            white-space: nowrap;
            button {
                border: none;
                background: none;
                text-decoration: underline;
                font-size: 18px;
                &:active {
                    color: #888;
                }
                span {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>