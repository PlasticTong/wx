// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    inputValue: ''
  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  handleClick() {
    wx.showToast({
      title: '崔童好帅',
      icon: 'none',
      duration: 2000
    })
  }
})
