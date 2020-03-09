<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center" >购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"  @tabClick="tabClick" ref="tabControl1"
                 class="tab-control1"
                  v-show="isTabFixed"/>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <homeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
        <!--这里的banners是从data中取出来通过props传给Home中的组件定义的参数，展示-->
        <homeRecommendView :recommends="recommends"/>
        <homeFeatureView/>
        <tab-control :titles="['流行','新款','精选']"  @tabClick="tabClick" ref="tabControl2"/>
        <goods-list :goods="showGoods"/>
      </scroll>
      <!--组件不能被直接监听，需要使用native修饰符-->
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import HomeFeatureView from "./childComps/HomeFeatureView";


  import NavBar from "components/common/nav/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop': {page:0,list:[]},
          'new': {page:0,list:[]},
          'sell': {page:0,list:[]}
        },
        currentType:'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
    //  进来
      console.log('actived');
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
    //  离开
      console.log('deactived');
      this.saveY = this.$refs.scroll.getScrollY()
      console.log(this.saveY);

    },
    created() {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {

      //1. 图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh,50)
      //  组件创建完就开始监听item的图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
        refresh()
      })

    },
    methods:{
      /**
       * 事件监听的方法
       */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType  = 'pop'
            break
          case 1:
            this.currentType  = 'new'
            break
          case 2:
          this.currentType  = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex=index;
        this.$refs.tabControl2.currentIndex=index;
      },
      backClick(){
        //通过组件访问组件里的属性，方法
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position){
        // console.log(position);
        // 判断backtop是否显示
        this.isShowBackTop = (-position.y) > 1000
      //  2. 判断tabControl是否吸顶
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      //加载更多
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        // console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
       * 网络请求
       */

      //  组件创建成功就发送网络请求
      //  1.请求多个数据，这个接口包含轮播图和其他的数据
      getHomeMultidata(){
          getHomeMultidata().then(res =>{
            // console.log(res);
            //  this在箭头函数中向上找作用域
            this.banners = res.data.banner.list;
            this.recommends = res.data.recommend.list;
          })
      },
      getHomeGoods(type){
        const page = this.goods[type].page +1;
        //请求商品数据
        getHomeGoods(type,page).then( res =>{
          // console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page+=1

        //  完成上拉加载更多
          this.$refs.scroll.finishPullUp();
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    height: 100vh;
    position: relative;
  }

  .home-nav  {
    background-color: var(--color-tint);
    color: #fff;
  }


  .content{
    /*height: 300px;*/
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }

</style>
