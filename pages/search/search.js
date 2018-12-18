// pages/search/search.js
const app = getApp()
const HTTP = require("../../utils/http(1).js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RoadName:[],//道路管理员所能获取到的路名
    RoadIdx:[],//路名的编号

    getRoadIndexUser:'',//用户选取的道路编号下标
    UserRoadCode:'',//用户选取的道路编号

    UserRightIf:false,//用来判断用户是否能使用某些权限功能

    //搜索框
    inputShowed: false,//搜索框是否显示
    inputVal: "",//输入框的值



    //是否显示整个页面组件
    loginIf:true
  },


  //搜索框函数
  //需要一个新的接口，包含所有数据的，只有相对应权限的人才能看到此搜索框与使用

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      //inputVal: "",
      inputShowed: false
    });
    //console.log(this.data.inputVal)
    for (let i = 0; i < this.data.RoadName.length ; i++){
      if (this.data.inputVal === this.data.RoadName[i]){
       // console.log(this.data.RoadIdx[i])
      }
    }
   
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  //跳转页面
  readResult:function(e){
    

    var Ind = e.currentTarget.dataset.index
    this.setData({
      getRoadIndexUser: Ind
    })
    // console.log(this.data.RoadIdx[Ind])
    // console.log(this.data.getRoadIndexUser)
    //将用户选取的道路编号存在本地，以供之后的页面使用
    wx.setStorage({
      key:'getRoadIndexUser',//用户选取道路编号
      data: this.data.RoadIdx[Ind]
    })
    //跳转到所选道路页面
    wx.navigateTo({
      url: '../readresult/readresult',
    })

   // console.log(e.currentTarget.dataset.index)
  },

  //根据用户代码和权限请求数据
  GetRoadIdx:function(){
    wx.showLoading({
      title: '加载中',
    })
    var UserCode = wx.getStorageSync('UserCode');
    var UserRight = wx.getStorageSync('UserRight')
    var params = {
      sUserCode: UserCode,
      sUserRight: UserRight,
    }
    HTTP.POST("GetRoadIdx",params).then(result =>{
        if(result.Status === '成功'){
          wx.hideLoading()
        }
      // console.log(result)
      // console.log(result.Data)
      //将请求后的路名添加到路名数组
      
      var getRoadIdx = result.Data
      var getRoadIdxArr = [];
      var getRoadIndex = [];
      for(let i = 0; i < getRoadIdx.length; i++){     
        getRoadIdxArr.push(getRoadIdx[i].RoadName);
        getRoadIndex.push(getRoadIdx[i].RoadIdx)
      }
      this.setData({
        RoadName: getRoadIdxArr,
        RoadIdx: getRoadIndex
      })

      // console.log(this.data.RoadName)
      // console.log(this.data.RoadIdx)
    }).catch(error =>{})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  
    if (app.globalData.userright === '2' || app.globalData.userright === '3'){
      this.setData({
        UserRightIf: true
      })
     
   }
    console.log(this.data.UserRightIf)
    if(app.globalData.login === 'loginIf'){
      this.GetRoadIdx()
    }
  
   
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.GetRoadIdx()

    //上线的时候再打开进行判断，将本地缓存的数据全改到全局变量里面
    // if(app.globalData.login !== 'loginIf'){
    // this.setData({
    //   loginIf:false,//让整个页面组件不显示
    // })
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先登录',
    //     success: function(res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //         // 返回登录界面
    //         wx.redirectTo({
    //           url: '../login/login',
    //         })
    //       } 
    //     },
    //     fail: function(res) {},
    //     complete: function(res) {},
    //   })

    // }
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