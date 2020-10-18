$(function () {
    //为提交按钮添加点击事件
    $('#btnSubmit').on('click', function () {
        changPwd();
    })
})

//修改用户的密码-------------------------------
function changPwd() {
    // 通过jq获取表单数据(原密码和新密码  因为确认密码是获取不到的)
    var strData = $('.layui-form').serialize();
    // 提交到重置按钮密码接口
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: strData,
        success: function (res) {
            //如果修改不成功 提示消息
            if (res.status !== 0) {
                layui.layer.msg(res.message)
            } else {
                //如果修改成功 则需要重新登录输入密码
                //提示消息
                layui.layer.msg(res.message, function () {
                    //删除本地存储的token
                    localStorage.removeItem('token');
                    //因为当前在iframe中  所以跳转到登录页面要在上级跳转
                    window.parent.location.href = '/login.html'
                })
            }
        }
    })
}