<template>
    <div class="home">
        <van-popup v-model="show">
            <div class="auth">
                <div class="login">
                    <van-cell-group>
                        <van-field
                            v-model="form.username"
                            required
                            clearable
                            label="用户名"
                            placeholder="请输入用户名"
                        />

                        <van-field
                            v-model="form.password"
                            type="password"
                            label="密码"
                            placeholder="请输入密码"
                            required
                        />
                    </van-cell-group>
                    <van-button plain type="info" @click="login">登录</van-button>
                </div>
            </div>
        </van-popup>
        <div class="index">
            <header ref="header">
                <div class="nav">
                    <div class="a">
                        <router-link to="/blog/article">谦受益</router-link>&nbsp;,
                        <router-link to="/book">满招损</router-link>
                    </div>
                    <div class="b">
                        <router-link to="/blog/article">Pride hurts</router-link>&nbsp;,
                        <router-link to="/book">&nbsp;modesty benefits.</router-link>
                    </div>
                    <div class="join">
                        <button v-if="user.role == 0" @click="show = true">登录</button>
                        <button v-if="user.role > 0" @click="exit">{{ user.username }}</button>
                    </div>
                </div>
            </header>
            <nav>
                <div class="item" @click="goto('blog-article')">
                    <i class="iconfont akdocument"></i>
                    <span>文章</span>
                </div>
                <div class="item" @click="goto('blog-category')">
                    <i class="iconfont akcategory"></i>
                    <span>分类</span>
                </div>
                <div class="item" @click="goto('blog-file')">
                    <i class="iconfont akbook1"></i>
                    <span>归档</span>
                </div>
                <div class="item" @click="goto('blog-search')">
                    <i class="iconfont akSearch"></i>
                    <span>搜索</span>
                </div>
            </nav>
        </div>
        <section class="blog">
            <article>
                <div class="title">
                    <span>
                        <van-icon name="coupon-o" />最新文章
                    </span>
                    <span class="more" @click="goto('blog-article')">更多>></span>
                </div>
                <div class="loading" v-show="loading">
                    <van-loading size="50px" type="spinner" color="#1989fa" />
                </div>
                <div class="article" v-for="i in article">
                    <button @click="read(i)">
                        <span>{{ i.name }}</span>&nbsp;--
                        <span>{{ i.username }}</span>
                    </button>
                </div>
            </article>
            <article>
                <div class="title">
                    <span>
                        <van-icon name="notes-o" />分类
                    </span>
                    <span class="more" @click="goto('blog-category')">更多>></span>
                </div>
                <div class="loading" v-show="loading">
                    <van-loading size="50px" type="spinner" color="#1989fa" />
                </div>
                <div class="category" v-for="i in category">
                    <button @click="readByCate(i)">
                        <span>{{ i.name }}</span>&nbsp;--
                        共
                        <span>&nbsp;{{ i.count }}&nbsp;</span>篇
                    </button>
                </div>
            </article>
        </section>
        <footer>
            <div class="c">© 2019-2020 Ahriknow.com 版权所有</div>
            <div class="b">
                <a href="http://www.beian.gov.cn/portal/registerSystemInfo">
                    <img src="../assets/TB2.gif" alt />
                    <img src="../assets/TB1.png" alt />
                    <span>吉ICP备 19000749号</span>
                </a>
            </div>
        </footer>
    </div>
</template>

<script>
import {
    Icon,
    Popup,
    Field,
    Button,
    CellGroup,
    Loading,
    Dialog,
    Notify
} from "vant";
export default {
    name: "home",
    data() {
        return {
            user: {
                role: 0
            },
            category: [],
            article: [],
            show: false,
            form: { username: "", password: "" },
            loading: true
        };
    },
    components: {
        "van-icon": Icon,
        "van-popup": Popup,
        "van-field": Field,
        "van-button": Button,
        "van-cell-group": CellGroup,
        "van-loading": Loading
    },
    methods: {
        goto(path) {
            this.$router.push({ name: path });
        },
        resize() {
            if (window.orientation == 0) {
                this.$refs.header.style.height = "85%";
            } else {
                this.$refs.header.style.height = "100%";
            }
        },
        read(val) {
            this.$router.push({
                name: "blog-detail",
                query: { cate: val.category, art: val._id }
            });
        },
        readByCate(val) {
            this.$router.push({
                name: "blog-detail",
                query: { cate: val._id }
            });
        },
        login() {
            let self = this;
            this.axios({
                url: self.url + "/verification/auth/login/",
                method: "post",
                data: JSON.stringify(self.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        Notify({ type: "success", message: "登陆成功" });
                        self.show = false;
                        self.$store.commit("SAVE_USER", response.data.data);
                        self.user = JSON.parse(response.data.data);
                        self.form.username = "";
                        self.form.password = "";
                    } else if (response.data.code === 300) {
                        Notify({ type: "warning", message: "用户被禁用" });
                    } else if (response.data.code === 301) {
                        Notify({ type: "warning", message: "用户不可用" });
                        return;
                    } else if (response.data.code === 400) {
                        Notify({
                            type: "warning",
                            message: "用户名或密码错误"
                        });
                    } else {
                        console.log(response);
                        Notify({ type: "warning", message: "服务器内部错误" });
                    }
                },
                function(response) {
                    console.log(response);
                    Notify({
                        type: "warning",
                        message: "客户端错误，请求失败"
                    });
                }
            );
        },
        exit() {
            Dialog.confirm({
                title: "退出",
                message: "退出登录?"
            })
                .then(() => {
                    this.user = { role: 0 };
                    localStorage.removeItem("auth");
                    Notify({ type: "primary", message: "已退出" });
                })
                .catch(() => {
                    Notify({ type: "primary", message: "取消" });
                });
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
        }
        this.resize();
        let self = this;
        window.addEventListener(
            "orientationchange",
            function() {
                self.resize();
            },
            false
        );
        this.axios
            .get(self.url + "/data/ahriblog/get_by_condition/", {
                params: {
                    limit: 5,
                    cate: "1"
                }
            })
            .then(response => {
                self.article = response.data.data[0];
                self.category = response.data.data[1];
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
.home {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .van-popup {
        width: 80%;
        padding: 0 1px;
        .auth {
            .login {
                background: #eee;
                button {
                    width: 100%;
                }
            }
        }
    }
    .index {
        width: 100%;
        height: 100%;
        header {
            width: 100%;
            height: 80%;
            background: url("../assets/bg.jpg") no-repeat;
            background-size: cover;
            display: flex;
            align-items: center;
            .icon {
                color: #fff;
            }
            .nav {
                width: 100%;
                height: 200px;
                text-align: center;
                font-weight: bold;
                color: #fff;
                margin: 20px;
                .a {
                    font-size: 32px;
                    a {
                        color: #fff;
                        text-decoration: underline;
                        transition: 0.3s;
                        &:active {
                            color: #aaa;
                        }
                    }
                }
                .b {
                    font-size: 18px;
                    margin: 20px;
                    a {
                        color: #fff;
                        text-decoration: underline;
                        transition: 0.3s;
                        &:active {
                            color: #aaa;
                        }
                    }
                }
                .join {
                    padding: 20px 0;
                    button {
                        width: 120px;
                        height: 40px;
                        background: none;
                        border: #fff solid 2px;
                        &:active {
                            background: #fff4;
                        }
                    }
                }
            }
        }
        nav {
            display: flex;
            justify-content: space-around;
            padding: 30px;
            .item {
                display: flex;
                flex-direction: column;
                transition: 0.3s;
                i {
                    font-size: 34px;
                }
                &:active {
                    color: #888;
                }
            }
        }
    }
    section.blog {
        width: 100%;
        background: url("../assets/map.svg") no-repeat;
        background-size: cover;
        article {
            width: 100%;
            min-height: 300px;
            padding: 40px;
            .title {
                font-size: 20px;
                margin: 20px 0;
                display: flex;
                justify-content: space-between;
                .van-icon {
                    font-size: 32px;
                    transform: translateY(8px);
                }
                .more {
                    font-size: 14px;
                    transform: translateY(12px);
                    text-decoration: underline;
                    &:active {
                        color: #777;
                    }
                }
            }
            .loading {
                width: 100%;
                height: 200px;
                text-align: center;
                line-height: 200px;
            }
            .article {
                padding: 4px 14px;
                button {
                    border: none;
                    background: none;
                    color: #2c3e50;
                    text-decoration: underline;
                    &:active {
                        color: #777;
                    }
                }
            }
            .category {
                padding: 4px 14px;
                button {
                    border: none;
                    background: none;
                    color: #2c3e50;
                    text-decoration: underline;
                    &:active {
                        color: #777;
                    }
                }
            }
        }
    }
    footer {
        margin-top: 50px;
        height: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .b {
            a {
                img {
                    width: 20px;
                    transform: translateY(5px);
                }
            }
        }
    }
}
</style>
