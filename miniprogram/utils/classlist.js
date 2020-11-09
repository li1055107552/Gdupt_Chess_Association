

function getmultiArray(e){
  var multiArray = [
    ['官渡校区', '西城校区' ,'光华校区'],   //mutiArray[0]
    ['机电工程学院', '自动化学院', '电子信息工程学院', '计算机学院', '建筑工程学院', '理学院', '文法学院', '体育学院', '艺术与设计学院'],        //mutiArray[1]
    ['机械设计制造及自动化', '过程装备与控制工程', '材料成型及控制工程', '工业设计', '工业工程', '能源与动力工程', '焊接技术与工程', '安全工程'], //mutiArray[2]
    [15,16,17,18,19,20,21,22,23,24],    //mutiArray[3]
    [1,2,3,4]    //mutiArray[4]
  ]
  return multiArray
}

function instituteColumnChange(nowIndex,column,value){   //nowIndex:当前选择的校区 column:修改的列数 value:修改的值
  var session = [15,16,17,18,19,20,21,22,23,24] //届数
  var classindex = [1,2,3,4]                    //班级
  var data = {
    IArray:[],      //校区[0]   学院[1]
    CArray:[],      //专业[0]   届数[1]   班级[2]
    IIndex:[]       //选择的校区 和 学院
  }

  if(column == 0){    //更改校区时
    if(value == 0){   //改为官渡校区
      data.IArray[1] = ['机电工程学院', '自动化学院', '电子信息工程学院', '计算机学院', '建筑工程学院', '理学院', '文法学院', '马克思主义学院', '体育学院', '艺术与设计学院'];
      data.CArray[0] = ['机械设计制造及自动化', '过程装备与控制工程', '材料成型及控制工程', '工业设计', '工业工程', '能源与动力工程', '焊接技术与工程', '安全工程'];
      data.IIndex = [0,0]
    }
    else if(value == 1){  //改为西城校区
      data.IArray[1] = ['石油工程学院', '化学工程学院', '化学学院', '材料科学与工程学院'];
      data.CArray[0] = ['油气储运工程', '石油工程', '资源勘测工程'];
      data.IIndex = [1,0]
    }
    else if(value == 2){  //改为光华校区
      data.IArray[1] = ['环境科学与工程学院', '生物与食品工程学院', '经济管理学院', '外国语学院'];
      data.CArray[0] = ['环境工程', '环保设备工程', '给排水科学与工程'];
      data.IIndex = [2,0]
    }
  }
  else{               //更改学院时
    if(nowIndex == 0){  //当前为官渡校区 更改学院
      switch(value){
        case 0:   //机电工程学院
              data.CArray[0] = ['机械设计制造及自动化', '过程装备与控制工程', '材料成型及控制工程', '工业设计', '工业工程', '能源与动力工程', '焊接技术与工程', '安全工程'];
              break;
        case 1:   //自动化学院
          data.CArray[0] = ['电气工程及其自动化（卓越班）', '电气工程及其自动化', '测控技术与仪器', '智能科学与技术', '自动化'];
          break;
        case 2:   //电子信息工程学院
          data.CArray[0] = ['电子信息工程', '电子信息科学与技术','人工智能'];
          break;
        case 3:   //计算机学院
          data.CArray[0] = ['计算机科学与技术', '网络工程', '物联网工程','数据科学与大数据技术'];
          break;
        case 4:   //建筑工程学院
          data.CArray[0] = ['建筑学', '土木工程'];
          break;
        case 5:   //理学院
          data.CArray[0] = ['教育技术学', '数学与应用数学', '数学与应用数学（师范）','信息与计算科学', '物理学（师范）', '地理科学', '地理科学（师范）', '新能源科学与工程'];
          break;
        case 6:   //文法学院
          data.CArray[0] = ['法学', '汉语言文学', '汉语言文学（师范）', '历史学', '历史学（师范）', '学前教育（师范）'];
          break;
        case 7:   //马克思主义学院
          data.CArray[0] = ['思想政治教育（师范）'];
          break;
        case 8:   //体育学院
          data.CArray[0] = ['社会体育指导与管理', '体育教育（师范）'];
          break;
        case 9:   //艺术与设计学院
          data.CArray[0] = ['音乐表演', '音乐学', '环境设计'];
          break;
      }
      data.IArray[1] = ['机电工程学院', '自动化学院', '电子信息工程学院', '计算机学院', '建筑工程学院', '理学院', '文法学院', '马克思主义学院', '体育学院', '艺术与设计学院'];
      data.IIndex = [0,value]
    }
    else if(nowIndex == 1){   //当前为西城校区
      switch(value){
        case 0:   //石油工程学院
          data.CArray[0] = ['油气储运工程', '石油工程', '资源勘测工程'];
          break;
        case 1:   //化学工程学院
          data.CArray[0] = ['化学工程与工艺（卓越班）', '能源化学工程'];
          break;
        case 2:   //化学学院
          data.CArray[0] = ['应用化学'];
          break;
        case 3:   //材料科学与工程学院
          data.CArray[0] = ['高分子材料与工程', '功能材料'];
          break;
      }
      data.IArray[1] = ['石油工程学院', '化学工程学院', '化学学院', '材料科学与工程学院'];
      data.IIndex = [1,value]
    }
    else if (nowIndex == 2){   //当前为光华校区
      switch(value){
        // 可能光华
        case 0:   //环境科学与工程学院
          data.CArray[0] = ['环境工程', '环保设备工程', '给排水科学与工程'];
          break;
        case 1:   //生物与食品工程学院
          data.CArray[0] = ['食品科学与工程', '生物技术', '生物工程'];
          break;
        case 2:   //经济管理学院
          data.CArray[0] = ['市场营销', '会计学', '国际经济与贸易'];
          break;
        case 3:   //外国语学院
          data.CArray[0] = ['英语', '英语（师范）'];
          break;
      // ------
      }
      data.IArray[1] = ['环境科学与工程学院', '生物与食品工程学院', '经济管理学院', '外国语学院'];
      data.IIndex = [2,value]
    }
  }
  data.IArray[0] = ['官渡校区','西城校区','光华校区']
  data.CArray[1] = session;     //届数
  data.CArray[2] = classindex;  //班级

  return data

}

function test(){
  var array = [1,2,3];
  return array
}

module.exports = {
  getmultiArray: getmultiArray,
  getarray:test,
  instituteColumnChange:instituteColumnChange
}

/*
    // 校区 + 学院 改变值
    instituteChange:function(e){
      this.setData({
        IIndex: e.detail.value
      })
      console.log(
        this.data.institute[0][this.data.IIndex[0]] + '\t' +
        this.data.institute[1][this.data.IIndex[1]] + '\t' +
        this.data.classname[0][this.data.CIndex[0]] + '\t' +
        this.data.classname[1][this.data.CIndex[1]] + '\t' +
        this.data.classname[2][this.data.CIndex[2]]
      )
    },
    // 校区 + 学院 改变下标
    instituteColumnChange:function(e){
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var changeValue = classlist.instituteColumnChange(this.data.IIndex[0],e.detail.column,e.detail.value)  //当前的下标+列数+值
      this.setData({
        institute:changeValue.IArray,
        classname:changeValue.CArray,
        IIndex:changeValue.IIndex,
        CIndex:[0,0,0]
      })
      console.log(
        this.data.institute[0][this.data.IIndex[0]] + '\t' +
        this.data.institute[1][this.data.IIndex[1]] + '\t' +
        this.data.classname[0][this.data.CIndex[0]] + '\t' +
        this.data.classname[1][this.data.CIndex[1]] + '\t' +
        this.data.classname[2][this.data.CIndex[2]]
      )
    },

    // 专业 + 届数 + 班级 改变值
    classnameChange:function(e){
      this.setData({
        CIndex: e.detail.value
      })
      console.log(
        this.data.institute[0][this.data.IIndex[0]] + '\t' +
        this.data.institute[1][this.data.IIndex[1]] + '\t' +
        this.data.classname[0][this.data.CIndex[0]] + '\t' +
        this.data.classname[1][this.data.CIndex[1]] + '\t' +
        this.data.classname[2][this.data.CIndex[2]]
      )
    },
    // 专业 + 届数 + 班级 改变下标
    classnameColumnChange:function(e){
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = this.data.CIndex
      data[e.detail.column] = e.detail.value
      this.setData({
        CIndex:data
      })
      console.log(
        this.data.institute[0][this.data.IIndex[0]] + '\t' +
        this.data.institute[1][this.data.IIndex[1]] + '\t' +
        this.data.classname[0][this.data.CIndex[0]] + '\t' +
        this.data.classname[1][this.data.CIndex[1]] + '\t' +
        this.data.classname[2][this.data.CIndex[2]]
      )
    },

*/