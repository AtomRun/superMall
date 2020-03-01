<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center" >购物街</div></nav-bar>
    <homeSwiper :banners="banners"/>
    <!--这里的banners是从data中取出来通过props传给Home中的组件定义的参数，展示-->
    <homeRecommendView :recommends="recommends"/>
  </div>
</template>

<script>
  import NavBar from "components/common/nav/NavBar";
  import {getHomeMultidata} from "network/home";
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView
    },
    data() {
      return {
        banners:[],
        recommends:[]
      }
    },
    created() {
    //  组件创建成功就发送网络请求
    //  1.请求多个数据，这个接口包含轮播图和其他的数据
      getHomeMultidata().then(res =>{
        // console.log(res);
      //  this在箭头函数中向上找作用域
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;

      })
    }
  }
</script>

<style scoped>
  .home-nav  {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
