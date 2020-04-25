<template>
  <div class="bottom-bar">

    <div class="check-content">
      <check-button
              class="check-button"
              :is-checked="isSelectAll"
              @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算:{{checkLength}}
    </div>

  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton"


export default {
  name: "CartBottomBar",
  components:{
    CheckButton
  },
  methods:{
    checkClick(){
      if (this.isSelectAll) {
        this.$store.state.cartList.forEach(item => item.checked =false)
      }else{
        this.$store.state.cartList.forEach(item => item.checked =true)
      }
      // this.$store.state.cartList.forEach(item => item.checked =!this.isSelectAll)
    },
    calcClick(){
      if (!this.isSelectAll){
        this.$toast.show('请选择购买的商品',2000)
      }
    }
  },
  computed:{
    totalPrice(){
      return '￥'+ this.$store.state.cartList.filter(item =>{   //filter过滤
        return item.checked     //checked选中的数据
      }).reduce((preValue,item) => { //reduce 汇总   preValue初始值
        return  preValue + parseFloat(item.price)* item.count
      },0)
    },
    checkLength(){
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll(){
      if (this.$store.state.cartList.length){
        // return  !(this.$store.state.cartList.filter(item => !item.checked).length)  //1.判断没有选中
        return  !this.$store.state.cartList.find(item =>!item.checked)  //2.判断没有选中

      }
    }


  }
}
</script>

<style scoped>
  .bottom-bar{
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #eee;
    /*background-color:red;*/
  }
  .check-content{
    display: flex;
    align-items: center;
    width: 60px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  .price{
    margin-left: 20px;
    flex: 1;
  }
  .calculate{
    width: 90px;
    text-align: center;
    background-color:red;
    color: #fff;
  }
</style>
