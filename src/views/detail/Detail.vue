<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3"
    >
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="getRecommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart" class="bottom-nav"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <toast :message="message" :show="show"/>

  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar"
import DetailSwiper from "./childComps/DetailSwiper"
import DetailBaseInfo from "./childComps/DetailBaseInfo"
import DetailShopInfo from "./childComps/DetailShopInfo"
import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
import DetailParamInfo from "./childComps/DetailParamInfo"
import DetailCommentInfo from "./childComps/DetailCommentInfo"
import DetailBottomBar from "./childComps/DetailBottomBar"


import Scroll from "components/common/scroll/Scroll"
import GoodsList from "components/content/goods/GoodsList"
import BackTop from "components/content/backTop/BackTop"
import Toast from "components/common/toast/Toast"

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"
import {itemListenerMixin} from "common/mixin"

import {mapActions} from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
    Toast
  },
  mixins: [itemListenerMixin],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      getRecommends: [],
      itemImgListener: null,
      themeTopYs: [],
      currentIndex: 0,
      isShowBackTop: false,/*是否显示返回顶部按钮*/
      message: '',
      show: false,
    }
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad () {
      this.newRefresh()

      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE) //最大值
      console.log(this.themeTopYs);
    },
    //点击头部信息
    titleClick (index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    //返回顶部
    backClick () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll (position) {
      // 1.获取y值
      const positionY = -position.y

      //2.positionY与主题中的值进行对比
      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {
        // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
        //   console.log(i);
        //}
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
        // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])||(i===length - 1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i;
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }
      //3.是否显示返回顶部
      this.isShowBackTop = -(position.y) > 1000
    },
    addToCart () {
      //1.获取购物车需要展示的信息
      const product = {}
      product.iid = this.iid;
      product.image = this.topImages[0]; //商品图片
      product.title = this.goods.title;//商品标题
      product.desc = this.goods.desc; //描述信息
      product.price = this.goods.realPrice //价格

      // 2.将商品添加到购物车里面
      // this.$store.cartList.push(product)
      this.addCart(product).then( res => {

        this.show = true;
        this.message = res;
        setTimeout(() => {
          this.show = false
          this.message = ''
        }, 1500)

      })

      // this.$store.dispatch('addCart', product).then(res => {
      //
      // })


    }

  },
  created () {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      //1.获取顶部的图片轮播数据
      // console.log(res);
      const data = res.result
      this.topImages = data.itemInfo.topImages

      //2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      //4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      //5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // this.$nextTick(() =>{
      //   this.themeTopYs =[]
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopYs);
      // })

    })
    //3.请求推荐数据
    getRecommend().then(res => {
      this.getRecommends = res.data.list
    })
  },
  mounted () {
  },
  destroyed () {
    this.$bus.$off('itemImgLoad', this.itemImgListener)

  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 58px);
  }


</style>
