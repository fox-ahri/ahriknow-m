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
                <nav>
                    <div class="a">
                        <router-link to="/blog">谦受益</router-link>&nbsp;,
                        <router-link to="/notebook">满招损</router-link>
                    </div>
                    <div>Pride hurts,&nbsp;modesty benefits.</div>
                    <div class="join">
                        <button @click="show = true">加入</button>
                    </div>
                </nav>
            </header>
        </div>
        <section class="blog">
            <article>
                <div class="title">
                    <span>
                        <van-icon name="coupon-o" />最新文章
                    </span>
                    <span class="more">更多>></span>
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
                    <span class="more">更多>></span>
                </div>
                <div class="loading" v-show="loading">
                    <van-loading size="50px" type="spinner" color="#1989fa" />
                </div>
                <div class="category" v-for="i in category">
                    <button @click="readByCate(i)">
                        <span>{{ i.name[0] }}</span>&nbsp;--
                        共
                        <span>&nbsp;{{ i.count }}&nbsp;</span>篇
                    </button>
                </div>
            </article>
        </section>
        <footer></footer>
    </div>
</template>

<script>
import { Icon, Popup, Field, Button, CellGroup, Toast, Loading } from "vant";
export default {
    name: "home",
    data() {
        return {
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
        resize() {
            if (window.orientation == 0) {
                this.$refs.header.style.height = "85%";
            } else {
                this.$refs.header.style.height = "100%";
            }
        },
        read(val) {
            localStorage.setItem("article", JSON.stringify(val));
            this.$router.push({ name: "blog-detail", params: val });
        },
        readByCate(val) {
            localStorage.setItem("cate", val._id);
            this.$router.push({ name: "blog-detail", params: { cate: val._id } });
        },
        login() {
            let self = this;
            this.axios({
                url: self.url + "/api/auth/login/",
                method: "post",
                data: JSON.stringify(self.form),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 200) {
                        Toast.success("登陆成功");
                        self.show = false;
                        self.$store.commit("SAVE_USER", response.data.data);
                        // window.location.reload();
                        self.form.username = "";
                        self.form.password = "";
                    } else if (response.data.code === 300) {
                        Toast.fail("用户被禁用");
                    } else if (response.data.code === 301) {
                        Toast.fail("用户不可用");
                        return;
                        localStorage.setItem(
                            "username",
                            self.ruleForm.username
                        );
                        self.$router.push({
                            name: "auth-verification",
                            params: self.ruleForm.username
                        });
                    } else if (response.data.code === 400) {
                        Toast.fail("用户名或密码错误");
                    } else {
                        console.log(response);
                        Toast.fail("服务器内部错误");
                    }
                },
                function(response) {
                    console.log(response);
                    Toast.fail("客户端错误，请求失败");
                }
            );
        }
    },
    mounted() {
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
            .get(self.url + "/data/ahriblog/article/")
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
            nav {
                width: 100%;
                height: 200px;
                text-align: center;
                font-weight: bold;
                color: #fff;
                .a {
                    font-size: 32px;
                    a {
                        color: #fff;
                    }
                    margin: 20px;
                }
                .join {
                    padding: 40px 0;
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
        width: 100px;
        height: 200px;
    }
}
</style>
