<template>
    <div id="blog-file" class="blog-file">
        <div class="showMenu" @click="goBack">
            <van-icon name="arrow-left" />
        </div>
        <div class="loading" v-show="loading">
            <van-loading size="50px" type="spinner" color="#1989fa" />
        </div>
        <div class="container" v-show="!loading">
            <van-steps direction="vertical" :active="-1">
                <van-step v-for="i in data">
                    <h2>{{ i.date }}</h2>
                    <p v-for="j in i.allData" @click="read(j)">{{ j.name }}&nbsp;--&nbsp;{{ j.username }}</p>
                </van-step>
            </van-steps>
        </div>
    </div>
</template>

<script>
import { Popup, Icon, Loading, Step, Steps } from "vant";
export default {
    name: "blog-file",
    components: {
        "van-popup": Popup,
        "van-icon": Icon,
        "van-loading": Loading,
        "van-steps": Steps,
        "van-step": Step
    },
    data() {
        return {
            loading: true,
            data: []
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: "home" });
        },
        read(val){
            this.$router.push({
                name: "blog-detail",
                query: { cate: val.category, art: val._id, from: "blog-file" }
            });
        },
        classificate(article) {
            let data = this.sort_pro(article, "date");
            data.sort((a, b) => {
                return a.date > b.date ? -1 : 1;
            });
            this.data = data;
        },
        sort_pro(data, name) {
            let c = [];
            let d = {};
            data.forEach(element => {
                if (!d[element[name].substr(0, 10)]) {
                    c.push({
                        [name]: element[name].substr(0, 10),
                        allData: [element]
                    });
                    d[element[name].substr(0, 10)] = element;
                } else {
                    c.forEach(ele => {
                        if (
                            ele[name].substr(0, 10) ==
                            element[name].substr(0, 10)
                        ) {
                            ele.allData.push(element);
                        }
                    });
                }
            });
            return c;
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/list_articles/")
            .then(response => {
                self.classificate(response.data.data);
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
#blog-file {
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