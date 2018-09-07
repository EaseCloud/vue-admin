<template>
  <transition name="show-unlock">
    <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
      <div @click="handleClickAvatar" class="unlock-avatar-con" :style="{marginLeft: avatarLeft}">
        <img class="unlock-avatar-img" :src="avatarPath">
        <div class="unlock-avatar-cover">
          <span><x-icon name="fa fa-unlock" :size="30"></x-icon></span>
          <p>解锁</p>
        </div>
      </div>
      <div class="unlock-avatar-under-back" :style="{marginLeft: avatarLeft}"></div>
      <div class="unlock-input-con">
        <div class="unlock-input-overflow-con">
          <div class="unlock-overflow-body" :style="{right: inputLeft}">
            <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码"/>
            <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock"
                    class="unlock-btn">
              <x-icon color="white" name="fa fa-key"></x-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="unlock-locking-tip-con">已锁定</div>
    </div>
  </transition>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    name: 'Unlock',
    data () {
      return {
        avatarLeft: 0,
        inputLeft: '400px',
        password: '',
        check: null
      }
    },
    props: {
      showUnlock: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      avatarPath () {
        return localStorage.avatarImgPath
      }
    },
    methods: {
      validator () {
        return true // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
      },
      handleClickAvatar () {
        this.avatarLeft = '-180px'
        this.inputLeft = '0px'
        this.$refs.inputEle.focus()
      },
      handleUnlock () {
        if (this.validator()) {
          this.avatarLeft = 0
          this.inputLeft = '400px'
          this.password = ''
          Cookies.set('locking', '0')
          this.$emit('on-unlock')
        } else {
          this.$Message.error('密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证')
        }
      },
      unlockMousedown () {
        this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
      },
      unlockMouseup () {
        this.$refs.unlockBtn.className = 'unlock-btn'
      }
    }
  }
</script>

<style lang="less">
  .unlock-body-con {
    position: absolute;
    width: 400px;
    height: 100px;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -200px;
    transform-origin: center center;
    z-index: 10;
    .unlock-avatar-con {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid white;
      cursor: pointer;
      transition: all .5s;
      z-index: 12;
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, .3);
      .unlock-avatar-img {
        width: 100%;
        height: 100%;
        display: block;
        z-index: 7;
      }
      .unlock-avatar-cover {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .6);
        z-index: 11600;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        transition: opacity .2s;
        color: white;
        span {
          display: block;
          margin: 20px auto 5px;
          text-align: center;
        }
        p {
          text-align: center;
          font-size: 16px;
          font-weight: 500;
        }
      }
      &:hover .unlock-avatar-cover {
        opacity: 1;
        transition: opacity .2s;
      }
    }
    .unlock-avatar-under-back {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-45px, -50%);
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #667aa6;
      transition: all .5s;
      z-index: 5;
    }
    .unlock-input-con {
      position: absolute;
      height: 70px;
      width: 350px;
      top: 15px;
      right: 0;
      .unlock-input-overflow-con {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
        .unlock-overflow-body {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          transition: all .5s ease .5s;
          .unlock-input {
            float: left;
            display: block;
            box-sizing: content-box;
            height: 22px;
            width: 230px;
            font-size: 18px;
            outline: none;
            padding: 11px 10px 11px 30px;
            border: 2px solid #e2ddde;
            margin-top: 10px;
          }
          .unlock-btn {
            float: left;
            display: block;
            font-size: 20px;
            padding: 7px 30px;
            cursor: pointer;
            border-radius: 0 25px 25px 0;
            border: 2px solid #e2ddde;
            border-left: none;
            background: #2d8cf0;
            outline: none;
            transition: all .2s;
            margin-top: 10px;
            &:hover {
              background: #5cadff;
              box-shadow: 0 0 10px 3px rgba(255, 255, 255, .2);
            }
          }
          .click-unlock-btn {
            background: #2b85e4 !important;
          }
        }
      }
    }
    .unlock-locking-tip-con {
      width: 100px;
      height: 30px;
      text-align: center;
      position: absolute;
      left: 50%;
      margin-left: -50px;
      bottom: -80px;
      color: white;
      font-size: 18px;
    }
  }

  @keyframes unlock-in {
    0% {
      transform: scale(0);
    }
    80% {
      transform: scale(0);
    }
    88% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes unlock-out {
    0% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(0);
    }
  }

  .show-unlock-enter-active {
    animation: unlock-in 1.4s ease;
  }

  .show-unlock-leave-to {
    opacity: 0;
  }

  .show-unlock-leave-active {
    transition: opacity .2s;
  }

  .unlock-con {
    width: 100%;
    height: 100%;
  }
</style>

