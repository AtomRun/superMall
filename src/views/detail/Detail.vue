<template>
  <div id="detail">
    <detail-nav-bar/>
    <detail-swiper :top-images="topImages"></detail-swiper>
  </div>
</template>

<script>

  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";

  import {getDetail} from "network/detail";

  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper
    },
    data(){
      return{
        iid:null,
        topImages:[]
      }
    },
    created() {
      //保存传入的iid
      this.iid = this.$route.params.iid

    //  根据iid请求详情数据,做一层封装
      getDetail(this.iid).then(res =>{
        //1. 获取顶部的轮播图数据
        console.log(res);
        this.topImages = res.result.itemInfo.topImages;

      })
    }
  }
</script>

<style scoped>

</style>
