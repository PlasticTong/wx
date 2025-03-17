const url_global = "http://127.0.0.1:5555"

function testApi() {
  console.log(123123);

  wx.request({
    url: url_global + '/regist/user/', //仅为示例，并非真实的接口地址
    method: "POST",
    data: {
      x: '123',
      y: "1231231231"
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log('服务器响应:', res.data)
    },
    fail(err) {
      console.error('请求失败:', err)
    }
  })

}


module.exports = {
  testApi
};