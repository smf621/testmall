<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <scroll class="content">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"/>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>

  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";


  import {getHomeMultidata, getHomeGoods} from 'network/home'


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

    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      // 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
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
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    padding-top: 44px;
    height: 100vh;/*可视高度*/
  }

  .home-nav {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    background-color: var(--color-tint);
    color: #ffffff;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content{
    /*height: 300px;*/
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  /*.content {*/
  /*  margin-top: 44px;*/
  /*  overflow: hidden;*/
  /*  height: calc(100% - 93px);*/
  /*}*/
</style>
