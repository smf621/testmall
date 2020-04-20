<template>
<!--  在元素中绑定ref会可以获取到一个元素对象-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props:{
      probeType:{
        type:Number,
        default:0
      },
      pullUpLoad:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        scroll:null
      }
    },
    mounted() {
      //1。创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        click:true,
        probeType:this.probeType,//是否监听滚动
        pullUpLoad:this.pullUpLoad//是否监听上拉刷新
      })
      //2.监听滚动的位置
      if (this.probeType ===2 || this.probeType ===3){
        this.scroll.on('scroll',(position) => {
          // console.log(position);
          this.$emit('scroll',position)
        })
      }
      //3.监听上拉事件
      if (this.pullUpLoad){
        this.scroll.on('pullingUp',()=>{
          // console.log('pullingUp');
          this.$emit('pullingUp')
        })
      }

      this.scroll.refresh()
    },
    methods:{
      scrollTo(x,y,time=300){
        this.scroll && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp(){
        this.scroll.finishPullUp()
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }
    }

  }
</script>

<style scoped>

</style>
