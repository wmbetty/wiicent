var app = getApp();
Page({
  data:{
    categoryListData:[{name:'交通',isSelect:true},{name:'住宿',isSelect:false},{name:'美食',isSelect:false},{name:'玩法',isSelect:false},{name:'景点',isSelect:false},{name:'锦囊',isSelect:false},{name:'购物',isSelect:false},{name:'休闲',isSelect:false}]
  },
  onUnload:function(e){
    var categoryListData = this.data.categoryListData;
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var formData = prePage.data.formData;
    for (var i = 0; i < categoryListData.length; i++) {
      if (categoryListData[i].isSelect) {
        formData.mtype = categoryListData[i].name;
      }
    }
    console.log('onUnload');
    prePage.setData({
      formData:formData
    })
  },
  changeSelect:function(e){
    var index = e.currentTarget.dataset.index;
    var categoryListData = this.data.categoryListData;
    for (var i = 0; i < categoryListData.length; i++) {
      if (index == i) {
        categoryListData[i].isSelect = true;
      }else{
        categoryListData[i].isSelect = false;
      }
    }
    this.setData({
      categoryListData:categoryListData
    })
  }
})