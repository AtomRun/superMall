<template>
  <div class="cart">

    <!--导航-->
    <NavBar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </NavBar>

    <!--商品列表-->
    <cart-list/>

    <!--底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/nav/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components:{
      CartList,
      NavBar,
      CartBottomBar
    },
    computed:{
      // ...mapGetters(['cartLength','cartList'])
      ...mapGetters({
        length:'cartLength'
      })
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;

  }
  .nav-bar{
    background-color: var(--color-tint);
    color: white;
    /*font-weight: 700;*/
  }
</style>
