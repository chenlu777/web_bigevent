let $loginBox, $regBox; //登录页面的两个超链接
$(function () {
    $loginBox = $('.login-box');
    $regBox = $('.reg-box');
    //点击去注册账号的链接
    $('#link_reg').on('click', function () {
        //隐藏登录框
        $loginBox.hide();
        //显示注册框
        $regBox.show();
    })

    //点击去登录的链接
    $('#link_login').on('click', function () {
        //显示登录框
        $loginBox.show();
        //隐藏注册框
        $regBox.hide();
    })


    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer
    //通过form.verify() 函数自定义校验规则
    form.verify({
        //自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            //通过形参拿到确认密码框中的内容
            //还需要拿到密码框中内容
            //然后进行一次等于的判断
            //如果判断失败, 则return一个提示消息即可
            var pwdStr = $('.reg-box [name="password"]').val();
            if (pwdStr !== value) {
                return '两次密码不一样哦 亲~~~'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1. 阻止默认的提交行为
        e.preventDefault();
        // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                //layui的弹出框
                return layer.msg(res.message)
            } else {
                //注册成功消息显示 关闭后再显示登录窗口
                layui.layer.msg(res.message, function () {
                    layer.msg('注册成功，请登录！')
                    // 模拟人的点击行为
                    $('#link_login').click();
                    //清空注册表单内容
                    $('#form_reg')[0].reset();
                });
                $('.login-box [name="username"]').val(data.username)
                $('.login-box [name="password"]').val(data.password)
            };
        });
    })


    //监听登录表单的提交事件
    $('#formLogin').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        //1. 获取用户名和密码
        var strData = $(this).serialize();
        //2. 提交数据到登录接口
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: strData,
            success: function (res) {
                //直接显示 登录结果 并执行回调函数
                /*  layui.layer.msg(res.message, {
                    time: 1000
                }, function () {
                     //判断是否成功之后跳转
                    if (res.status === 0) {
                        location.href = '/index.html'
                    }
                 }) */
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                } 
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html';
            }
        });
    });
})