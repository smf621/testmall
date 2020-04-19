module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'views': '@/views',
        'components': '@/components',
        'network': '@/network',
        'common': '@/common',
        'assets': '@/assets',
      }
    }
  }
}
// module.exports={
//   configureWebpack:{
//     resolve:{
//       alias:{
//         'assets':'@/assets',
//         'common':'@/common',
//         'components':'@/components',
//         'network':'@/network',
//         'views':'@/views' ,
//       }
//     }
//   }
// }
