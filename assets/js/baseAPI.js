//为jquery的异步请求新增一个回调函数, 每次jq异步请求之前 都会先执行下这个回调函数
$.ajaxPrefilter(function (opt) {
    //1. 基地址改造
    //opt.url = 基地址 + 我们需要拼接的接口地址也就是异步请求里面写的url地址(例如:'/api/reguser')
    opt.url = 'http://ajax.frontend.itheima.net' + opt.url;
    //2. 自动将本地存储中的token读取并加入到请求报文里面, 一起发送给服务器
    //统一为有权限的接口 设置headers请求头
    //判断当前url中是否包含/my/ 这一段  如果包含 则发送token 请求报文头
    if (opt.url.indexOf('/my/') !== -1) {
        opt.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //3. 全局统一挂载 complete回调函数  
    //complete 函数是处理整个请求最后的一些事情  这里是权限认证 和success原理一样
    opt.complete = function (res) {
        //在complete 回调函数中,可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //提示用户没有权限
            alert('登录过时,请重新登录');
            //3.1 强制清空 token
            localStorage.removeItem('token');
            //3.2 强制跳转到/login.html页面
            window.top.location.href = '/login.html';
        }
    }
});