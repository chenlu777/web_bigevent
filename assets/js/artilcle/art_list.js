//定义一个查询的参数对象  将来请求数据的时候需要将参数提交到服务器
var q = {
    pagenum: 1, //页码值,默认请求第一页的数据
    pagesize: 2, //每页显示几条数据,默认每页显示2条
    cate_id: '', //文章分类的id
    state: '' //文化的发布状态
};
$(function () {
    //1.1 请求文章列表
    initTable();
    //1.2 请求下拉框列表
    initCate();
    //1.3 请求筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        gitSel();
    });
    //1.4 为每一个删除按钮添加点击事件
    $('.layui-table tbody').on('click', '.btn-delete', doDel);
})

/* ------------请求文章列表数据,渲染页面-------------- */
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res);
            $('tbody').html(htmlStr);
            //生成页码条
            renderPageBar(res.total);
        }
    });
};

/*-------------- 生成页码条   参数: 文章总行数 ------------*/
function renderPageBar(total) {
    //调用layui.render()方法来渲染分页的结构
    layui.laypage.render({
        elem: 'pageBox', //分页容器id
        count: total, //总数据条数
        limit: q.pagesize, //每页显示几条数据
        curr: q.pagenum, //设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        //分页发生切换的时候  触发jump回调
        //触发jump的两种方式
        //1. 点击页码的时候 会触发jump回调  flag的值会是undefined
        //2. 只要调用了layui.laypage.render()方法 就会触发jump回调flag的值会是true
        jump: function (obj, flag) {
            //把最新的页码值 赋值到q这个查询参数中
            q.pagenum = obj.curr;
            //把最新的页容量赋值给q.pagesize
            q.pagesize = obj.limit;
            // 重新渲染页面
            // 这里不能直接调用initTable()函数 不然会形成死循环 两个函数互相调用
            //点击页码是调用渲染函数即可
            if (!flag) {
                initTable();
            }
        }
    })
}

/* ---------------- 定义美化时间的过滤器 ----------------*/
template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
};

/*--------------- 定义补零的函数 -------------------*/
function padZero(n) {
    return n > 9 ? n : '0' + n
};

/* ------------------初始化文章分类的方法----------- */
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return ayui.layer.msg('获取分类数据失败！');
            };
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr);
            // 通过 layui 重新渲染表单区域的UI结构
            layui.form.render();
        }
    });
};


/*-------------- 为筛选表单获取数据 -------------*/
function gitSel() {
    var cate_id = $('#form-search [name=cate_id]').val();
    var state = $('#form-search [name=state]').val();
    //为查询参数对象q对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    //调用请求数据函数 再次请求数据 重新渲染页面
    initTable();
};


/* 为删除按钮绑定点击事件 */
function doDel() {
    //获取到文章的id
    var id = $(this).attr('data-id');
    //获取删除按钮的长度
    var len = $('.btn-delete').length;
    layui.layer.confirm('确认删除?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                // 如果没有剩余的数据了,则让页码值 -1 之后,
                // 再重新调用 initTable 方法
                // 4
                if (len === 1) {
                    // 如果 len 删除按钮的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 页码值最小必须是 1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                }
                initTable();
            }
        })
    })
}