// pages/login/login.js
const app = getApp()
const HTTP = require("../../utils/http(1).js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {

    UserCode:'', //用户代码
    UserPwd:'', //登录密码

    UserRight:'',//返回的用户权限，决定用户的操作内容
    SuserPwd:''//返回的用户密码和登录密码进行比对

  },
  //进行数据请求
  GetUserRightAndPwdByUserCode:function(){
    wx.showLoading({
      title: '请求中',
    })
 
    var params = {
      sUserCode:this.data.UserCode,
    }
    HTTP.POST("GetUserRightAndPwdByUserCode",params).then(result =>{
      //console.log(result)
      if(result.Status === '成功'){
        wx.hideLoading()
        app.globalData.userright = result.Data[0].UserRight
       // console.log(app.globalData.userright)
      }
      this.setData({
        SuserPwd: result.Data[0].UserPwd,
        UserRight:result.Data[0].UserRight
      })
      wx.setStorage({
        key: 'UserRight',
        data: this.data.UserRight
      }) 
     
      if (this.data.UserPwd === this.data.SuserPwd) {
        //console.log('匹配成功')
        wx.switchTab({
          url: '../search/search',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '密码或用户名不正确,请重新输入~',
        })
      }     
    }).catch(error =>{})
  },
  //用户输入完账号密码，更改data数据
  userSet:function(e){
  
    this.setData({
      UserCode:e.detail.value
    })
    console.log(this.data.UserCode)
  },
  
  passSet:function(e){
    this.setData({
      UserPwd:e.detail.value
    })
  }, 

  //点击登陆
  login:function(){ 
    this.GetUserRightAndPwdByUserCode() 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.login = 'loginIf'  
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})