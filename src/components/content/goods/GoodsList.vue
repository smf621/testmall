<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item"/>

  </div>
</template>

<script>
  import GoodsListItem from "./GoodsListItem";

  export default {
    name: "GoodsList",
    components:{
      GoodsListItem,
    },
    props:{
      goods:{
        type:Array,
        default(){
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods{
    display: flex;
    flex-wrap:wrap; /*需要配合子组件内容设置宽度*/
    justify-content: space-around;/*均等分布*/
    padding: 2px ;
  }
</style>
