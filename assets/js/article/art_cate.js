$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    var indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })



    // 通过代理的形式， 为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式， 为删除按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        $.ajax({
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式， 为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                initArtCateList()
                layer.msg('更新分类信息成功！')
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理的形式， 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.close(index)
                    layer.msg('删除分类成功！')
                    initArtCateList()
                }
            })
        })
    })
})




// 获取文章分类列表
function initArtCateList() {
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            var htmlStr = template('tpl-table', res)
            // console.log(htmlStr);
            $('tbody').html(htmlStr)
        }
    })
}