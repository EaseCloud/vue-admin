<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <card :bordered="false">
        <p slot="title">
          <icon type="log-in"></icon>
          欢迎登录
        </p>
        <div class="form-con">
          <i-form ref="loginForm" :model="form" :rules="rules">
            <form-item prop="userName">
              <i-input v-model="form.userName" placeholder="请输入用户名">
                <span slot="prepend"><icon :size="16" type="person"></icon></span>
              </i-input>
            </form-item>
            <form-item prop="password">
              <i-input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend"><icon :size="14" type="locked"></icon></span>
              </i-input>
            </form-item>
            <form-item>
              <i-button @click="handleSubmit" type="primary" long>登录</i-button>
            </form-item>
          </i-form>
          <p class="login-tip">{{config.name}} {{config.version}}</p>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit () {
        const vm = this
        vm.$refs.loginForm.validate((valid) => {
          if (valid) {
            // Cookies.set('user', this.form.userName)
            // Cookies.set('password', this.form.password)
            // this.$store.commit('setAvatar', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg')
            // if (this.form.userName === 'iview_admin') {
            //   Cookies.set('access', 0)
            // } else {
            //   Cookies.set('access', 1)
            // }
            // this.$router.push({
            //   name: 'home_index'
            // })
            vm.login(vm.form.userName, vm.form.password)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .login {
    width: 100%;
    height: 100%;
    background-image: url('https://file.iviewui.com/iview-admin/login_bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con {
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;
      &-header {
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }
      .form-con {
        padding: 10px 0 0;
      }
      .login-tip {
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }
</style>
