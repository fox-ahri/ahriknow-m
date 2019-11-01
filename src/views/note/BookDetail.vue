<template>
    <div id="notebook-bookdetail" class="notebook-bookdetail">
        <div class="showMenu" @click="show = true">
            <van-icon name="wap-nav" />
        </div>
        <div class="showMenu" @click="goBack">
            <van-icon name="arrow-left" />
        </div>
        <van-popup
            v-model="show"
            position="left"
            :style="{ width: '80%', height: '100%' }"
            closeable
        >
            <nav>
                <h3>{{ book.name }}</h3>
                <p v-for="i in catalog">
                    <van-tag plain type="success" @click="read(i)">{{ i.label }}</van-tag>
                </p>
            </nav>
        </van-popup>
        <div class="loading" v-show="loading">
            <van-loading size="50px" type="spinner" color="#1989fa" />
        </div>
        <div class="container" v-show="!loading">
            <div class="markdown-body" v-html="document.html"></div>
        </div>
    </div>
</template>

<script>
import { Popup, Icon, Loading, Tag } from "vant";
export default {
    name: "book-read",
    components: {
        "van-popup": Popup,
        "van-icon": Icon,
        "van-loading": Loading,
        "van-tag": Tag
    },
    data() {
        return {
            show: false,
            book: {
                name: ""
            },
            data: [],
            document: {
                name: "",
                html: ""
            },
            loading: true,
            catalog: []
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: "book-bookshelf" });
        },
        read(data) {
            this.loading = true;
            let self = this;
            this.axios
                .get(self.url + "/data/notebook/document/", {
                    params: {
                        book: self.book._id,
                        _id: data.id
                    }
                })
                .then(response => {
                    if (response.data.code === 200) {
                        self.document = response.data.data;
                        self.document.name = data.label;
                        let tmp = {};
                        for (let i in self.$route.query) {
                            tmp[i] = self.$route.query[i];
                        }
                        tmp.doc = data.id;
                        if (
                            !this.$route.query.hasOwnProperty("doc") ||
                            this.$route.query.doc != data.id
                        ) {
                            self.$router.push({
                                name: "book-read",
                                query: tmp
                            });
                        }
                    } else {
                        console.log(response);
                    }
                    this.loading = false;
                    this.show = false;
                })
                .catch(response => {
                    console.log(response);
                    this.loading = false;
                    this.show = false;
                });
        },
        getById(data, _id) {
            data.forEach(cata => {
                if (cata.id == _id) {
                    this.read(cata);
                    return;
                } else {
                    if (cata.hasOwnProperty("children")) {
                        this.getById(cata.children, _id);
                    }
                }
            });
        },
        showCatalog(catalog) {
            let tmp = [];
            catalog.forEach(cata => {
                tmp.push(cata);
                if (
                    cata.hasOwnProperty("children") &&
                    cata.children.length > 0
                ) {
                    tmp = tmp.concat(this.showCatalog(cata.children));
                }
            });
            return tmp;
        }
    },
    mounted() {
        if (this.$route.query.hasOwnProperty("_id")) {
            this.book._id = this.$route.query._id;
            this.book.name = this.$route.query.name;
        } else {
            this.$router.push({ name: "book-bookshelf" });
            return;
        }
        let self = this;
        this.axios
            .get(self.url + "/data/notebook/catalog/", {
                params: {
                    _id: self.book._id
                }
            })
            .then(response => {
                if (response.data.code === 200) {
                    self.data = response.data.data;
                    self.catalog = self.showCatalog(response.data.data);
                    if (this.$route.query.hasOwnProperty("doc")) {
                        self.getById(self.data, this.$route.query.doc);
                    } else {
                        self.read(self.data[0]);
                    }
                } else if (response.data.code === 400) {
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
#notebook-bookdetail {
    width: 100%;
    height: 100%;
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
        padding: 100px 20px;
        p {
            font-size: 16px;
            margin: 6px 0;
            transition: 0.3s;
            &:active {
                color: #000;
            }
        }
    }
    nav {
        padding: 30px;
        p {
            margin: 12px;
            .van-tag {
                height: 24px;
            }
        }
    }
}
</style>