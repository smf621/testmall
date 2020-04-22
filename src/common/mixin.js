import {debounce} from "common/utils";

export const itemListenerMixin = {
  data(){
    newRefresh:null
  },

  mounted(){
    this.newRefresh =debounce(this.$refs.scroll.refresh,50)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
    // console.log('我是混入');
  }
}
