//定义一个查询的参数对象  将来请求数据的时候需要将参数提交到服务器
var q;
$(function () {
    
    q = {
        pagenum: 1,//页码值,默认请求第一页的数据
        pagesize: 2,//每页显示几条数据,默认每页显示2条
        cate_id: '',//文章分类的id
        state:'' //文化的发布状态
    }
    initTable();

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
})

/* ------------请求数据,渲染页面-------------- */
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
        }
    })
}
