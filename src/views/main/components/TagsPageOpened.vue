<template>
  <div ref="scrollCon"
       @DOMMouseScroll="handleScroll"
       @mousewheel="handleScroll"
       class="tags-outer-scroll-con">
    <div class="close-all-tag-con">
      <dropdown transfer @on-click="handleTagsOption">
        <i-button size="small" type="primary">
          标签选项
          <icon type="md-arrow-dropdown"></icon>
        </i-button>
        <dropdown-menu slot="list">
          <dropdown-item name="clearAll">关闭所有</dropdown-item>
          <dropdown-item name="clearOthers">关闭其他</dropdown-item>
        </dropdown-menu>
      </dropdown>
    </div>
    <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
      <transition-group name="taglist-moving-animation">
        <tag
          type="dot"
          v-for="(page, i) in $store.state.app.pagesOpened"
          ref="tagsPageOpened"
          :key="page.name || i"
          :name="page.name"
          @on-close="closePage(i)"
          @click.native="$router.push(page.route)"
          :closable="!(page.meta && page.meta.locked)"
          :color="i===$store.state.app.currentPageIndex?'primary':'default'">
          {{ itemTitle(page) }}
        </tag>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueI18n from 'vue-i18n'

  Vue.use(VueI18n)

  export default {
    name: 'TagsPageOpened',
    data () {
      return {
        currentPageName: this.$route.name,
        tagBodyLeft: 0,
        refsTag: [],
        tagsCount: 1
      }
    },
    computed: {
      title () {
        return this.$store.state.app.currentTitle
      },
      tagsList () {
        return this.$store.state.app.pagesOpened
      }
    },
    methods: {
      itemTitle (item) {
        if (typeof item.title === 'object') {
          return this.$t(item.title.i18n)
        } else {
          return item.title
        }
      },
      handleScroll (e) {
        let type = e.type
        let delta = 0
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
          delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
        }
        let left = 0
        if (delta > 0) {
          left = Math.min(0, this.tagBodyLeft + delta)
        } else {
          if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
            if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
              left = this.tagBodyLeft
            } else {
              left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100)
            }
          } else {
            this.tagBodyLeft = 0
          }
        }
        this.tagBodyLeft = left
      },
      handleTagsOption (type) {
        const vm = this
        if (type === 'clearAll') {
          vm.$store.commit('closeAllPages')
          vm.$router.push(vm.config.home_route)
          vm.tagBodyLeft = 0
        } else if (type === 'clearOthers') {
          vm.$store.commit('closeOtherPages')
          vm.tagBodyLeft = 0
        }
      },
      // ---- 定版的分割线 ----
      moveToView (tag) {
        if (tag.offsetLeft < -this.tagBodyLeft) {
          // 标签在可视区域左侧
          this.tagBodyLeft = -tag.offsetLeft + 10
        } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
          // 标签在可视区域
          this.tagBodyLeft = Math.min(0, this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth - tag.offsetLeft - 20)
        } else {
          // 标签在可视区域右侧
          this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20)
        }
      }
    },
    mounted () {
      // debugger
      // this.refsTag = this.$refs.tagsPageOpened
      setTimeout(() => {
        this.refsTag.forEach((item, index) => {
          if (this.$route.name === item.name) {
            let tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      }, 1) // 这里不设定时器就会有偏移bug
      this.tagsCount = this.tagsList.length
    },
    watch: {
      $route (to) {
        const vm = this
        vm.currentPageName = to.name
        vm.$nextTick(() => {
          vm.refsTag.forEach((item, index) => {
            if (to.name === item.name) {
              let tag = vm.refsTag[index].$el
              vm.moveToView(tag)
            }
          })
        })
        vm.tagsCount = vm.tagsList.length
      }
    }
  }
</script>
