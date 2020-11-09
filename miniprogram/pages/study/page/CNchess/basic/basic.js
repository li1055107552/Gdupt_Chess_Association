// pages/study/CNchess//basic/basic.js
const app = getApp()
const current_directory = app.globalData.directory + "/study_Img/CNchess/basic/"
Page({

  //页面的初始数据
  data: {
    image:[
      ["basic_img/jiang.png",false],
      ["basic_img/shi.png",false],
      ["basic_img/xiang.png",false],
      ["basic_img/ju.png",false],
      ["basic_img/ma.png",false],
      ["basic_img/pao.png",false],
      ["basic_img/bing.png",false],
    ],
    head:[true,false,false],

    // 棋盘
    body_group_0:[
      {
        title:"一.先让我们来一起认识一下棋盘吧！",
        url: current_directory + "qipan.jpg",
        text:"象棋开局的布局如图。红黑阵营每方各有16个棋子，分别是“車、马、炮、象、士、将、兵”，总共32个棋子。"
      },
      {
        title:"二.河界",
        url: current_directory + "hejie.jpg",
        text:"在棋盘的中间，象棋分为红黑两方阵营。中间分界线是“楚河汉界”，俗称“河界”。"
      },
      {
        title:"三.获胜条件",
        url: current_directory + "jiugong.png",
        text:"棋盘的“米”字型方框称为九宫，是将和士的活动区域。象棋胜负的关键是如何吃掉对方的将。"
      }
    ],
    body_group_jiang:[
      {
        title:"帥的运用",
        text:"",
        url: current_directory + "jiang0.jpg",
        text2:"帥只能在九宫内活动，且在九宫内沿着竖线或横线走一格，不能沿斜线走。帥不能与敌方的将直接相对！"
      },
      {
        title:"帥-吃子",
        text:"如图，敌方马在我方帅的九宫内，所以可以吃掉。",
        url: current_directory + "jiang1.png",
        text2:""
      },
      { url: current_directory + "jiang2.jpg" },
      { url: current_directory + "jiang3.jpg" }
    ],
    body_group_shi:[
      {
        title:"仕的运用",
        text:"",
        url: current_directory + "shi0.jpg",
        text2:"仕只能在九宫内活动，且沿着九宫斜线走一格"
      },
      {
        title:"仕-吃子",
        text:"",
        url: current_directory + "shi1.jpg",
        text2:"如图，敌方炮、车 在九宫范围内，且在斜线上，故仕可以吃掉对面的子——炮、车"
      },
      { url: current_directory + "shi2.jpg" },
      { url: current_directory + "shi3.jpg" },
      { url: current_directory + "shi4.jpg" },
      { url: current_directory + "shi5.jpg" },
      { url: current_directory + "shi6.jpg" }
    ],
    body_group_xiang:[
      {
        title:"相的运用",
        text:"",
        url: current_directory + "xiang0.jpg",
        text2:'相只能在河界内的本方阵营活动，沿着"田"字型对角线走两格，俗称"象走田"。'
      },
      {
        title:"",
        text:"",
        url: current_directory + "xiang1.jpg",
        text2:'相的行走路线上，若有棋子阻隔，则会使相走不过去，这种情况俗称“塞象眼"。'
      },
      {
        title:"相-吃子",
        text:"",
        url: current_directory + "xiang2.jpg",
        text2:'如图，敌方马处于相的对角线处，故可以吃掉，但因被卒堵住了相脚，所以只能绕行。'
      },
      { url: current_directory + "xiang3.jpg" },
      { url: current_directory + "xiang4.jpg" },
      { url: current_directory + "xiang5.jpg" }
    ],
    body_group_ju:[
      {
        title:"車的运用",
        text:"",
        url: current_directory + "ju0.jpg",
        text2:'車沿着直线走，横竖均可，格数不限。車纵横进退威力强大，故有“一车十子寒"之称。'
      },
      {
        title:"車-吃子",
        text:"",
        url: current_directory + "ju1.jpg",
        text2:'如图，敌方马处于車所在的横线上，且中间无阻隔，故車可以把马吃掉。'
      },
      { url: current_directory + "ju2.jpg" }
    ],
    body_group_ma:[
      {
        title:"马的运用",
        text:"",
        url: current_directory + "ma0.jpg",
        text2:'马可以向上下左右四个方向，每个方向可以斜着走两个位置，即马同时又八个位置可以走，故马有"八面威风"的说法。'
      },
      {
        title:"",
        text:"",
        url: current_directory + "ma1.jpg",
        text2:'此时"士"挡住马向前走一个的路，即前方的路被堵，俗称"蹩马腿"。马后方虽有卒，但卒不在行走路线上，所以马还可以后退。'
      },
      {
        title:"马-吃子",
        text:"",
        url: current_directory + "ma2.jpg",
        text2:'如图，敌方車处于马的八个方向的其中一个方向上，且无蹩马脚，故马可以把車吃掉。'
      },
      { url: current_directory + "ma3.jpg" }
    ]
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res){
        that.setData({
          winWidth: res.windowWidth,
          winHeight:res.windowHeight
        })
      }
    })
  },

  changetop(e){
    var index = e.currentTarget.id.slice(-1) - 1 
    var head = this.data.head

    for (let i = 0; i < head.length; i++) {
      if(head[i]){    // 当前选中的是top中的
        head = [false,false,false]
        head[index] = true
        this.setData({
          head:head
        })
        break;
      }
      else if(i == head.length-1){    // 当前选中非top的
        // image 全部不选中
        var image = this.data.image
        for (let i = 0; i < image.length; i++) {
          image[i][1] = false
        }
        // 选中新的top
        head = [false,false,false]
        head[index] = true

        this.setData({
          image:image,
          head:head
        })
      }
    }
    wx.pageScrollTo({
      scrollTop:0,
      duration:300
    })
  },
  change(e){
    var image = this.data.image
    var index = e.target.id.slice(-1)
    for (let i = 0; i < image.length; i++) {
      image[i][1] = false
    }
    image[index][1] = true
    this.setData({
      image:image,
      head:[false,false,false]
    })
    wx.pageScrollTo({
      scrollTop:0,
      duration:0
    })
  },

  // 用户点击右上角分享
  onShareAppMessage() {},



})