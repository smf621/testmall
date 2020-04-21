<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                  class="tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";


  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from "common/utils"
  import {itemListenerMixin} from "common/mixin";


  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0,
        itemImgListener:null
      }
    },
    components: {
      NavBar,  //最上面导航
      HomeSwiper,//轮播图
      RecommendView,//推荐精品
      FeatureView,//
      TabControl,//文字导航
      GoodsList,//商品列表
      Scroll,//滚动插件
      BackTop,//返回顶部

    },
    computed:{

    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件监听
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mixins:[itemListenerMixin],
    mounted(){
      // //1.监听item中图片加载完成
      // let newRefresh =debounce(this.$refs.scroll.refresh,50)
      //
      // //对监听的事件进行保存
      // this.itemImgListener = () => {
      //   newRefresh(20,30,'abc')
      // }
      // this.$bus.$on('itemImageLoad',  this.itemImgListener)

      // //2.获取到tabControl的offsetTop
      // this.tabOffsetTop = this.$refs.tabControl
    },
    methods: {
      /**
       * 事件 监听相关方法
       **/

      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      /*回到顶部*/
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      /*监听滚动的坐标位置*/
      contentScroll(position){
        // 1.判断BackTop是否显示
       this.isShowBackTop = -(position.y) >1000

        //2.决定tabControl是否吸顶
        this.isTabFixed = -(position.y) >this.tabOffsetTop
      },
      // 上拉加载
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      //获取滚动的距离(position:fixed)
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求相关方法
       * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list) /*将获取到的数据依次加入到godds中的list数组中*/
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp() /*上拉加载完成后刷新  继续加载*/
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    /*padding-top: 44px;*/
    height: 100vh; /*可视高度*/
  }

  .home-nav {
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
    background-color: var(--color-tint);
    color: #ffffff;
  }

  /*.tab-control {*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/

  .content {
    /*height: 300px;*/
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .tab-control{
    position: relative;
    z-index: 9;

  }

  /*.content {*/
  /*  margin-top: 44px;*/
  /*  overflow: hidden;*/
  /*  height: calc(100% - 93px);*/
  /*}*/
</style>
