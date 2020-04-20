<template>
  <div id="detail">

  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'


  export default {
    name: "Detail",
    components:{
      NavBar
    },
    data(){
      return{
        iid:null
      }
    },
    created() {
      this.iid = this.$route.params.iid
    }
  }
</script>

<style scoped>

</style>
