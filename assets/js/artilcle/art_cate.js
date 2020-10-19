var indexAdd = null;
var indexEdit = null;
$(function () {
    initArtCateList();

    //为添加类别按钮绑定点击事件
    
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });


    //一、通过代理的形式,为form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        //调用新增类别函数
        addArtCate();
    });


    //二、通过代理的形式 为btn-edit按钮绑定点击事件
    
    $('.layui-table tbody').on('click', '.btn-edit', function () {
        //弹出一个修改数据的弹出层
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        //1. 获取当前行的id 分类名 和分类别名
        //2. 显示编辑面板 同时显示数据局
        // 使用layui.form方法给表单赋值
        var oldData = {
            Id: this.dataset.id,
            name: $(this).parent().prev('td').prev('td').text().trim(),
            alias: $(this).parent().prev('td').text().trim()
        }
        layui.form.val('form-edit', oldData);
    })

    //三、 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // 调用修改函数
        shouEdit();
    });


    /*-------------------------给删除按钮绑定事件---------*/
    $('.layui-table tbody').on('click', '.btn-delete', function () {
        var id = this.dataset.id;
        //调用删除事件
        getdelete(id);
    })

})


//-------------请求分类列表数据 并通过模板引擎渲染到页面--------------
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}

/* ---------------新增分类方法----------------*/
function addArtCate() {
    var str = $('#form-add').serialize();
    $.ajax({
        method: "POST",
        url: "/my/article/addcates",
        data: str,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            //更新列表
            initArtCateList();
            //关闭弹出框
            layui.layer.close(indexAdd);
        }
    });
}

/* ------------------编辑修改内容方法 ------------*/
function shouEdit() {
    $.ajax({
        method: "POST",
        url: '/my/article/updatecate',
        data: $('#form-edit').serialize(),
        success: function (res) {
            layui.layer.msg(res.message)
            if (res.status !== 0) {
                return;
            }
            initArtCateList();
            // 关闭弹出框
            layui.layer.close(indexEdit);
        }
    });
}

/* --------------------------------
删除方法
 */
function getdelete(id) {
    layui.layer.confirm('确定要删除吗？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            method: "GET",
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                layui.layer.msg(res.message);
                if (res.status !== 0) {
                    return;
                }
                initArtCateList();
            }
        });
        layui.layer.close(index);
    });

}
