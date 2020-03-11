<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button @click.native="checkClick" :is-checked="isSelectAll" class="check-button"/>
      <span>全选</span>
    </div>

    <div class="totalPrice">
      合计{{totalPrice}}
    </div>

    <div class="calculate" @click="calculateClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'

  export default {
    name: "CartButtonBar",
    data(){
      return{
        realPrice:0
      }
    },
    components:{
      CheckButton
    },
    methods:{
      checkClick(){
        // console.log('---');
        if (this.isSelectAll){//全部选中
          this.cartList.forEach(item => item.checked= false)
        }else {
          //有部分或者全部不选中
          this.cartList.forEach(item => item .checked = true)
        }
      },
      calculateClick(){
        if (!this.isSelectAll){
          this.$toast.show("请选择购买的商品")
        }
      }
    },
    computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥'+ this.cartList.filter(item =>{
          return item.checked
        }).reduce((preValue,item)=>{
          // console.log(item.price.substring(1));
          this.realPrice = item.price.substring(1)
          return preValue+this.realPrice * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item =>item.checked).length
      },
      isSelectAll(){
        // return !(this.cartList.filter(item => !item.checked).length)
        if (this.cartList.length == 0){
          return false
        }
        return !this.cartList.find(item => !item.checked)
      }
    }
  }
</script>

<style scoped>

  .bottom-bar {
    height: 40px;
    position: relative;
    bottom: 40px;
    display: flex;
    background-color: #eee;
    font-size: 14px;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .totalPrice{
    margin-top: 12px;
    margin-left: 40px;
    flex: 1;
  }
  .calculate{
    line-height: 40px;
    text-align: center;
    width: 90px;
    color: #ffffff;
    background-color: var(--color-tint);
  }
</style>
