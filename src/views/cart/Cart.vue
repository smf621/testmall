<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!--商品列表-->
    <cart-list />
    <!--底部汇总-->
    <cart-bottom-bar/>

  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartBottomBar from "./childComps/CartBottomBar"

import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components:{
      NavBar,/*导航*/
      CartList,//商品列表
      CartBottomBar,//底部结算

    },
    computed:{
      // cartLength(){
      //   // return this.$store.getters.cartLength()
      //   return this.$store.getters.cartLength
      // }
      ...mapGetters(['cartLength', 'cartList'])
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;

  }
</style>
