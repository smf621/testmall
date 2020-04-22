<template>
  <div>

    <scroll @scroll="contentScroll">

    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  export default {
    name: "Category",
    data(){
      return{
        isShowBackTop:false,/*是否显示返回顶部按钮*/
      }
    },
    components:{
      Scroll,
      BackTop
    },
    methods:{
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position) {
        //3.是否显示返回顶部
        this.isShowBackTop = -(position.y) >1000

      }
    }
  }
</script>

<style scoped>

</style>
