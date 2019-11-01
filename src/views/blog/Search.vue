<template>
    <div id="blog-search" class="blog-search">
        <div class="showMenu" @click="goBack">
            <van-icon name="arrow-left" />
        </div>
        <div class="loading" v-show="loading">
            <van-loading size="50px" type="spinner" color="#1989fa" />
        </div>
        <div class="container" v-show="!loading">
            <div>
                <van-cell-group>
                    <van-field v-model="input" center clearable label="搜索" placeholder="请输入搜索内容">
                        <van-button slot="button" size="small" type="primary" @click="search">搜索</van-button>
                    </van-field>
                </van-cell-group>
                <van-steps direction="vertical" :active="-1">
                    <van-step>
                        <h2>文章:</h2>
                        <p
                            v-for="i in article"
                            @click="read(i)"
                        >{{ i.name }}&nbsp;--&nbsp;{{ i.date }}</p>
                    </van-step>
                    <van-step>
                        <h2>分类:</h2>
                        <p
                            v-for="i in category"
                            @click="readByCate(i)"
                        >{{ i.name }}&nbsp;--&nbsp;{{ i.date }}</p>
                    </van-step>
                </van-steps>
            </div>
        </div>
    </div>
</template>

<script>
import {
    CellGroup,
    Field,
    Button,
    Icon,
    Loading,
    Notify,
    Step,
    Steps
} from "vant";
export default {
    name: "blog-search",
    components: {
        "van-cell-group": CellGroup,
        "van-field": Field,
        "van-button": Button,
        "van-icon": Icon,
        "van-loading": Loading,
        "van-steps": Steps,
        "van-step": Step
    },
    data() {
        return {
            loading: true,
            input: "",
            article: [],
            category: []
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
        },
        search() {
            this.loading = true;
            let self = this;
            this.axios
                .get(self.url + "/data/ahriblog/search/", {
                    params: {
                        search: self.input
                    }
                })
                .then(response => {
                    self.article = response.data.data.article;
                    self.category = response.data.data.category;
                    self.loading = false;
                })
                .catch(response => {
                    console.log(response);
                    self.loading = false;
                });
        },
        readByCate(val) {
            if (val.count <= 0) {
                Notify({ type: "warning", message: "该分类没有文章" });
                return;
            }
            this.$router.push({
                name: "blog-detail",
                query: {
                    cate: val._id,
                    from: "blog-search"
                }
            });
        },
        read(val) {
            this.$router.push({
                name: "blog-detail",
                query: {
                    cate: val.category,
                    art: val._id,
                    from: "blog-search"
                }
            });
        }
    },
    mounted() {
        this.search();
    }
};
</script>

<style lang="scss" scoped>
#blog-search {
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