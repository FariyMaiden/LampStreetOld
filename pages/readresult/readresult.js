// pages/readresult/readresult.js
const app = getApp()
const HTTP = require("../../utils/http(1).js") 
//import * as echarts from "../../echarts.min.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {

    // ec: {
    //   onInit: initChart
    // } ,//折线图定义

    getRoadIndexUser:'',//用户选取的道路编号
    LampChinese:["灯具编号","灯杆号","路灯电平","路灯电流","路灯功率","当前状态","路灯电压",
    "心跳时间"],//列表的中文名

    LampCode: '',//灯具编号
    LampPoleId: '',//灯杆号 
    LightBright:'',//路灯电平
    LightCurrent:'',//路灯电流
    LightPower:'',//路灯功率
    LightStatus:'',//路灯当前状态
    LightVoltage:'',//路灯电压
    R_TimeStamp:'',//上报时间间隔（心跳时间）

    //灯具信息列表
    LampPoleIds:[],//灯杆编号集合
    LampMessageS:[],//灯杆信息集合
    LampStatus:[],//当前有异常路灯状态集合
    LampStatusNum:[],//异常信息集合数量
    LampStatusNumber:[],//异常路灯异常的各个类型的数量集合

    indexLamp:'',//用户点击灯杆下标
    
    show:false,//判断是否显示灯具详情
    showAbnormal:false,//判断是否显示异常信息
    // showAbnormalNum:false,//判断是否显示异常信息类型及数量
    showLightList:true,//显示路灯集合列表

    //搜索框
    inputShowed: false,//搜索框是否显示
    inputVal: "",//输入框的值

  },

  //搜索框函数

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
   // console.log(this.data.inputVal)
    for (let i in this.data.LampMessageS){
      console.log(this.data.LampMessageS[i].LampPoleId1)
      if (this.data.inputVal === this.data.LampMessageS[i].LampPoleId1){
       // console.log(this.data.LampMessageS[i])
       // console.log(i)
        this.setData({
          indexLamp: i,
          show: true,
          showAbnormal: false,
          showLightList: false,//隐藏路灯列表
      // showAbnormalNum: false,//判断是否显示异常信息类型及数量
        })
      } else{
        wx.showModal({
          title: '提示',
          content: '并未查询到此路灯~',
        })
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


  //是否隐藏路灯列表
  showLightList:function(){
    this.setData({
      showLightList: true,//显示路灯集合列表
      show: false,//判断是否显示灯具详情
      showAbnormal: false,//判断是否显示异常信息
    })
  },

  // 点击显示异常信息类型及数量
  Numbre:function(){
  wx.navigateTo({
    url: '/pages/lineChart/lineChart',
  })
  },

  //点击展示最近一次各灯具读取信息中的异常信息
  ShowAbnormal:function(){
   
    this.setData({
      show:false,
      showAbnormal:true,
      showLightList: false,//隐藏路灯列表
      // showAbnormalNum: false,//判断是否显示异常信息类型及数量
    })

  },

  //搜索框点击搜索获取灯具最近一次的采集具体信息



  //点击获取灯具最近的一次采集具体信息
  messageLamp:function(e){
    let index = e.currentTarget.dataset.index //获取用户点击的下标
    console.log(e.currentTarget.dataset.index)
    this.setData({
      indexLamp: index,
      show:true,
      showAbnormal:false,
      showLightList: false,//隐藏路灯列表
      // showAbnormalNum: false,//判断是否显示异常信息类型及数量
    })

  },
  //根据道路编号获取最近一次各灯具的读取信息
  GetLastOneReadResult:function(){
    let getRoadIndexUser = wx.getStorageSync('getRoadIndexUser')
    this.setData({
      getRoadIndexUser: getRoadIndexUser
    })
    // console.log(this.data.getRoadIndexUser)
    // console.log(getRoadIndexUser)
    var params = {
       sRoadIdx:this.data.getRoadIndexUser
     // sRoadIdx: '00004'
    }
    HTTP.POST('GetLastOneReadResult',params).then(result=>{
     // console.log(result)


     // console.log(result.Data[0])
      //将灯杆id收集起来
      let LampPoleId = result.Data
      let LampPoleIds = []
      let LampStatus = []
      for(let i = 0 ; i < LampPoleId.length; i ++){
        LampPoleIds.push(LampPoleId[i].LampPoleId1)
        //将当前状态有异常的灯杆号收集起来
        if (LampPoleId[i].LightStatus1 !== '0000'){
          LampStatus.push(LampPoleId[i])
        }      
      }
      //console.log(LampPoleIds),
      this.setData({
        LampPoleIds: LampPoleIds,//灯杆id集合
        LampMessageS:result.Data ,
        LampStatus: LampStatus ,//当前有异常路灯状态集合       
      })
      //console.log(this.data.LampStatus)
      //console.log(this.data.LampMessageS)
     // console.log(this.data.LampPoleIds)
    }).catch(error=>{})

    

  },
  //根据道路编号获取最近一次各灯具读取信息中的异常信息种类和数目
  GetErrStatusTypeAndNums:function(){
      var params={
        sRoadIdx: this.data.getRoadIndexUser
      }
    HTTP.POST('GetErrStatusTypeAndNums',params).then(result => {
     // console.log(result)
      
      this.data.LampStatusNumber.push(result['000C'])
      this.data.LampStatusNumber.push(result['001B'])
      this.data.LampStatusNumber.push(result['001C'])
      this.data.LampStatusNumber.push(result['001D'])
      this.data.LampStatusNumber.push(result['001E'])
      this.data.LampStatusNumber.push(result['001F'])
      //将异常类型的数量放到数组存到全局里面
      app.globalData.lineChart = this.data.LampStatusNumber
     // console.log(app.globalData)
   
      this.setData({
        LampStatusNum: result
      })

      if (result.Status === '成功') {
        //console.log(this.data.LampStatusNum)
        }
    }).catch(error =>{})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetLastOneReadResult();
    this.GetErrStatusTypeAndNums();

   

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
// function initChart(canvas, width, height) {
 
//   const chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   });
//   canvas.setChart(chart);

//   var option = {
//     color: ["red"],
//     legend: {
//       data: ['灯具异常种类及其数量'],
//       top: 20,
//       left: 'center',
//       z: 100
//     },
//     grid: {
//       left: '3%',
//       right: '4%',
//       bottom: '3%',
//       containLabel: true
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: ['000C', '001B', '001C', '001D', '001E', '001F']
      
//     },
//     yAxis: {
//       x: 'center',
//       type: 'value',
//       splitLine: {
//         lineStyle: {
//           type: 'solid'
//         }
//       }
//     },
//     series: [
//       {
//         name: '灯具异常种类及其数量',
//         type: 'line',
//         smooth: true,
//         data:['1','1','2','1','1','1']
//         //data: LampStatusNumber     
//       },
//     ]

//   };

//   chart.setOption(option);
//   return chart;
// }
