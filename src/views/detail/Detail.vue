<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
  </div>
</template>

<script>

  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";

  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";

  import Scroll from "components/common/scroll/Scroll";
  import {debounce} from "../../common/utils";


  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList
    },
    data(){
      return{
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null
      }
    },
    created() {
      //1. 保存传入的iid
      this.iid = this.$route.params.iid

    //2.  根据iid请求详情数据,做一层封装
      getDetail(this.iid).then(res =>{
        //1. 获取顶部的轮播图数据
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages;

        //2. 获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      //  3. 创建店铺信息对象
        this.shop = new Shop(data.shopInfo)

      //  4. 保存商品的详情数据
        this.detailInfo = data.detailInfo;

      //  5. 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

      //  6. 取出评论信息
        if (data.rate.cRate !==0 ){
          this.commentInfo = data.rate.list[0]
        }
      })

    //  3. 获取推荐数据
      getRecommend().then(res=>{
        // console.log(res);
        this.recommends = res.data.list
      })

      //4. 给getThemeY赋值
      this.getThemeTopY = debounce(()=>{
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);
      })
    },
    methods:{
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
      }
    },
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content{
    height: calc(100% - 44px);
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
