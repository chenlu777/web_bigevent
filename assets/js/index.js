$(function () {
    //加载完毕后 第一时间获取用户的基本信息--------------
    gitUserInfo();

    var layer = layui.layer;
    //为退出按钮添加点击事件
    $('.tuichu').on('click', function () {
        //1. 提示用户是否确认退出
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //2. 如果用户点击确认退出 则
            //2.1 删除localstorage中token
            localStorage.removeItem('token')
            //2.2 跳转到/login.html 页面
            location.href = '/login.html';
            //3. 关闭当前弹出层
            layer.close(index);
        })

    })
})


//异步请求 用户的完整信息--------------------
function gitUserInfo() {
    //发送异步请求----------------------
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        /* //headers 就是请求头配置对象---------------
        //在baseAPI里面设置了请求报文头的token  这里就可以注释掉------------
        headers: {
            //获取在登录页面存储到本地的token-------------------
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {//success是数据返回后处理页面逻辑 比如渲染页面之类的
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //如果加载成功 则渲染页面用户区域------------------
            renderUserInfo(res.data);
        }
        //baseAPI里面的complete函数会自动调用 和之前自动获取请求报文头一样
    })
}


//渲染用户信息的方法------------------------------------
function renderUserInfo(user) {
    //1. 获取用户信息名称---------------------------
    var uName = user.nickname || user.username;
    //2. 设置欢迎文本---------------------------
    $('.welcome').html('欢迎&nbsp;&nbsp;,' + uName);
    //3. 按需渲染用户的头像-----------------------------
    if (user.user_pic !== null) {
        //3.1 渲染图片头像--------------------------------
        $('.layui-nav-img').attr('src', user.user_pic).show();
        //隐藏文字头像----------------------------------
        $('.text-avatar').hide();
    } //3.2 渲染文本头像------------------------------
    else {
        //隐藏图片头像--------------------------------
        $('.layui-nav-img').hide();
        //提取名字的首字符 并转成大写---------------
        var first = uName[0].toUpperCase();
        //将首字符设置给标签----------------------------------
        $('.userinfo .text-avatar').html(first);
    }
}