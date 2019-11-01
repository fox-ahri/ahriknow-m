<template>
    <div id="notebook-survey" class="notebook-survey">
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
                <p
                    v-for="i in books.filter(book => !filter || book.name.includes(filter))"
                    @click="read(i)"
                >{{ i.name }}&nbsp;--&nbsp;{{ i.username }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { CellGroup, Loading, Icon, Field } from "vant";
export default {
    name: "notebook-survey",
    components: {
        "van-cell-group": CellGroup,
        "van-loading": Loading,
        "van-icon": Icon,
        "van-field": Field
    },
    data() {
        return {
            loading: true,
            books: [],
            filter: ""
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
        },
        read(val) {
            this.$router.push({
                name: "book-read",
                query: { _id: val._id, name: val.name }
            });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/notebook/book/")
            .then(response => {
                if (response.data.code === 200) {
                    self.books = response.data.data;
                } else {
                    console.log(response);
                }
                self.loading = false;
            })
            .catch(response => {
                console.log(response);
                self.loading = false;
            });
    }
};
</script>

<style lang="scss" scoped>
#notebook-survey {
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