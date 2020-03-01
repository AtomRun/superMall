module.exports = {
//    配置别名

    //表示要配置webpack的config
    configureWebpack:{
    //    配置resolve
        resolve:{
            //配置别名
            alias:{
                //默认配置了src为@
                'assets': '@/assets',
                'components': '@/components',
                'common': '@/common',
                'network': '@/network'

            //    router和store不需要，因为任何地方都可以用$store和$router拿到对象，不需要引入
            }
            // 配置后缀名，配置之后可以不写后缀，默认配置过了
            // extensions:[]
        }
    }
}