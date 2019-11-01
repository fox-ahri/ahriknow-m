<template>
    <div id="blog-detail" class="blog-detail">
        <van-popup v-model="showLogin">
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
        <div class="showMenu" @click="goBack">
            <van-icon name="arrow-left" />
        </div>
        <br>
        <div class="comment" v-if="article.comment">
            <div class="item" v-for="i in comment">
                <div class="title">
                    <div class="avatar">
                        <img :src="i.avatar" alt />
                    </div>
                    <div class="tag">
                        <van-tag plain type="success" v-if="article.username == i.username">作者</van-tag>
                    </div>
                    <div class="username">{{ i.username }}</div>
                    <div class="date">{{ i.date.slice(5, 16) }}</div>
                    <div class="btn">
                        <van-button
                            v-if="article.username == user.username || user.role > 90"
                            type="default"
                            size="mini"
                            @click="deleteMsg(i)"
                        >删除</van-button>
                    </div>
                </div>
                <div class="comment" v-html="i.comment"></div>
                <div class="reply" v-for="j in i.reply">
                    <div class="user">
                        <div class="tag">
                            <van-tag plain type="success" v-if="article.username == j.name">作者</van-tag>
                            <van-tag plain type="warning" v-if="j.name == i.username">层主</van-tag>
                        </div>
                        <div class="name">{{ j.name }}</div>
                        <div class="date">{{ j.date.slice(5, 16) }}</div>
                        <div class="btn">
                            <van-button
                                v-if="article.username == i.username || user.role > 90"
                                type="default"
                                size="mini"
                                @click="deleteReply(i, j)"
                            >删除</van-button>
                        </div>
                    </div>
                    <div class="content">{{ j.content }}</div>
                </div>
                <van-field
                    v-model="i.re_cont"
                    v-show="i.show"
                    rows="2"
                    autosize
                    type="textarea"
                    maxlength="50"
                    placeholder="请输入回复"
                    show-word-limit
                />
                <div class="btn" style="text-align: right">
                    <van-button type="default" v-show="!i.show" @click="i.show = true">回复</van-button>
                    <van-button type="default" v-show="i.show" @click="add_reply(i)">提交</van-button>
                    <van-button
                        type="default"
                        v-show="i.show"
                        @click="i.show = false,i.re_cont = ''"
                    >取消</van-button>
                </div>
            </div>
            <van-field
                v-model="message"
                rows="2"
                autosize
                type="textarea"
                maxlength="50"
                placeholder="请输入留言"
                show-word-limit
            />
            <van-button type="default" @click="commit" style="float: right">留言</van-button>
            <br />
            <br />
            <br />
            <br />
        </div>
    </div>
</template>

<script>
import {
    Popup,
    Icon,
    Loading,
    Tag,
    Field,
    Button,
    CellGroup,
    Notify
} from "vant";
export default {
    name: "blog-detail",
    components: {
        "van-popup": Popup,
        "van-icon": Icon,
        "van-loading": Loading,
        "van-tag": Tag,
        "van-field": Field,
        "van-button": Button,
        "van-cell-group": CellGroup
    },
    data() {
        return {
            show: false,
            article: {},
            cate: "",
            art_list: [],
            loading: true,
            loading2: true,
            from: "home",
            comment: [],
            message: "",
            showLogin: false,
            form: { username: "", password: "" }
        };
    },
    created() {},
    methods: {
        read(val) {
            if (this.$route.query.art != val._id) {
                this.$router.push({
                    name: "blog-detail",
                    query: { art: val._id, cate: val.category }
                });
            }
            this.article = val;
            this.show = false;
            let self = this;
            if (val.comment)
                this.axios
                    .get(self.url + "/data/ahriblog/comment/", {
                        params: {
                            article: val._id
                        }
                    })
                    .then(response => {
                        if (response.data.code === 200) {
                            self.comment = response.data.data;
                        } else {
                        }
                    })
                    .catch(response => {
                        console.log(response);
                    });
        },
        goBack() {
            let self = this;
            this.$router.push({ name: this.from });
        },
        commit() {
            if (this.message == "") {
                Notify({ type: "warning", message: "请输入留言" });
                return;
            }
            if (this.user.role <= 0) {
                this.user = { role: 0 };
                localStorage.removeItem("auth");
                this.showLogin = true;
                return;
            }
            let comment = {
                user_id: this.user._id,
                article: this.article._id,
                comment: this.message
            };
            let self = this;
            this.axios({
                url: self.url + "/data/ahriblog/comment/",
                method: "post",
                data: JSON.stringify(comment),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 0) {
                        self.showLogin = true;
                    } else if (response.data.code === 200) {
                        self.comment.push(response.data.data);
                        self.message = "";
                        Notify({ type: "success", message: "留言成功" });
                    } else {
                        console.log(response);
                    }
                },
                function(response) {
                    console.log(response);
                }
            );
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
                        self.showLogin = false;
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
        deleteMsg(val) {
            let self = this;
            this.axios
                .delete(self.url + "/data/ahriblog/comment/", {
                    data: {
                        user_id: self.user._id,
                        _id: val._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        self.user = { role: 0 };
                        localStorage.removeItem("auth");
                        self.showLogin = true;
                    } else if (response.data.code === 200) {
                        self.comment = self.comment.filter(com => {
                            return com._id != val._id;
                        });
                        Notify({ type: "success", message: "删除成功" });
                    } else {
                        console.log(response.data);
                        Notify({ type: "danger", message: "服务器内部错误" });
                    }
                })
                .catch(response => {
                    console.log(response);
                    Notify({ type: "danger", message: "客户端错误，请求失败" });
                });
        },
        deleteReply(comment, reply) {
            comment.reply = comment.reply.filter(re => {
                return re._id != reply._id;
            });
            this.add_reply(comment, false);
        },
        add_reply(val, add = true) {
            let msg = "删除成功";
            if (add) {
                let reply = {
                    _id: new Date(),
                    name: this.user.username || "匿名",
                    date: this.generateTimeReqestNumber(),
                    content: val.re_cont
                };
                val.reply.push(reply);
                val.re_cont = "";
                val.show = false;
                msg = "回复成功";
            }
            let self = this;
            this.axios
                .put(self.url + "/data/ahriblog/comment/", val)
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        Notify({ type: "success", message: msg });
                    } else {
                        console.log(response.data);
                        Notify({ type: "danger", message: "服务器内部错误" });
                    }
                })
                .catch(response => {
                    console.log(response);
                    Notify({ type: "danger", message: "客户端错误，请求失败" });
                });
        },
        pad2(n) {
            return n < 10 ? "0" + n : n;
        },
        generateTimeReqestNumber() {
            var date = new Date();
            return (
                date.getFullYear().toString() +
                "/" +
                this.pad2(date.getMonth() + 1) +
                "/" +
                this.pad2(date.getDate()) +
                " " +
                this.pad2(date.getHours()) +
                ":" +
                this.pad2(date.getMinutes()) +
                ":" +
                this.pad2(date.getSeconds())
            );
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
        this.from = this.$route.query.from || "home";
        if (this.$route.query.hasOwnProperty("cate")) {
            this.cate = this.$route.query.cate;
        } else {
            this.goBack();
            return;
        }
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/get_by_condition/", {
                params: {
                    category: self.cate
                }
            })
            .then(response => {
                self.art_list = response.data.data;
                self.loading = false;
                if (self.$route.query.hasOwnProperty("art")) {
                    self.art_list.forEach(art => {
                        if (art._id == self.$route.query.art) {
                            self.read(art);
                        }
                    });
                } else {
                    self.$router.push({
                        name: "blog-detail",
                        query: {
                            art: self.art_list[0]._id,
                            cate: self.$route.query.cate
                        }
                    });
                    self.read(self.art_list[0]);
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
    }
};
</script>

<style lang="scss" scoped>
#blog-detail {
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
    .comment {
        padding: 15px;
        .item {
            box-shadow: 0 0 2px 2px #eee;
            margin: 10px 0;
            padding-bottom: 15px;
            .title {
                padding: 10px;
                display: flex;
                box-shadow: 0 0 2px 2px #eee;
                .avatar {
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }
                }
                .tag {
                    line-height: 40px;
                    padding-left: 10px;
                }
                .username {
                    line-height: 40px;
                    padding-left: 10px;
                }
                .date {
                    line-height: 40px;
                    padding-left: 10px;
                }
                .btn {
                    line-height: 34px;
                    padding-left: 10px;
                }
            }
            .comment {
                padding: 10px;
            }
            .reply {
                padding: 10px;
                box-shadow: 0 0 2px 2px #eee;
                margin: 10px 15px;
                .user {
                    display: flex;
                    .tag {
                        line-height: 40px;
                    }
                    .name {
                        line-height: 40px;
                        padding-left: 10px;
                    }
                    .date {
                        line-height: 40px;
                        padding-left: 10px;
                    }
                    .btn {
                        line-height: 34px;
                        padding-left: 10px;
                    }
                }
                .content {
                    padding: 0;
                }
            }
        }
    }
}
</style>