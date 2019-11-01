<template>
    <div id="blog-article" class="blog-article">
        <div class="showMenu" @click="goBack">
            <van-icon name="arrow-left" />
        </div>
        <div class="loading" v-show="loading">
            <van-loading size="50px" type="spinner" color="#1989fa" />
        </div>
        <div class="container" v-show="!loading">
            <div>
                <van-cell-group>
                    <van-field v-model="filter" placeholder="请输入搜索内容" />
                </van-cell-group>
                <p v-for="i in article.filter(art => !filter || art.name.includes(filter))" @click="read(i)">{{ i.name }}&nbsp;--&nbsp;{{ i.username }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { CellGroup, Field, Icon, Loading } from "vant";
export default {
    name: "blog-article",
    components: {
        "van-cell-group": CellGroup,
        "van-field": Field,
        "van-icon": Icon,
        "van-loading": Loading
    },
    data() {
        return {
            loading: true,
            filter: "",
            article: []
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
        },
        read(val) {
            this.$router.push({
                name: "blog-detail",
                query: { cate: val.category, art: val._id, from: "blog-article" }
            });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/list_articles/")
            .then(response => {
                self.article = response.data.data;
                self.loading = false;
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#blog-article {
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
    .loading {
        height: 200px;
        line-height: 200px;
        margin: 0 auto;
        width: 50px;
    }
    .container {
        padding: 100px 0;
        display: flex;
        justify-content: center;
        p {
            font-size: 16px;
            margin: 6px 0;
            transition: 0.3s;
            &:active {
                color: #000;
            }
        }
    }
}
</style>