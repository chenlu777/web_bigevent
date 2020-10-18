$(function () {
    //添加自定义校验规则----------------------
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须在1-6个字符之间~';
            }
        }
    });

    //发送请求 获取用户基本信息------------------------
    initUserInfo();

    //重置功能-----------------------
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        //调用方法 重新请求用户信息 并填充到表单中
        initUserInfo();
    });

    // 监听提交按钮的点击事件------------------------
    $('#btnSubmit').on('click', function () {
        //调用提交修改用户信息函数
        modifyUserInfo();
    })
})
//初始化用户的基本信息---------------------------
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户基本信息失败');
            }
            layui.form.val('formUserInfo', res.data)
        }
    })
}

//提交修改用户信息-----------------
function modifyUserInfo() {
    var dataStr = $('.layui-form').serialize();
    // 发起 ajax 数据请求
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: dataStr,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('更新用户信息失败！')
            }
            layui.layer.msg('更新用户信息成功！')
            // 调用父页面中的方法，重新渲染用户的头像和用户的信息
            window.parent.gitUserInfo();
        }
    })
}