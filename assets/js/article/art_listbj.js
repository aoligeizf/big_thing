$(function () {
    var layer = layui.layer
    var form = layui.form

    // 获取地址栏参数
    var $Id = new URLSearchParams(location.search).get('Id')

    // 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    }
    // 调用Ajax查询文章旧数据
    $.ajax({
        url: '/my/article/' + $Id,
        success: function (res) {
            // 把旧数据进行表单填充
            form.val('art_edit', res.data)
            console.log(res);
            
            // 把当前所属的分类传进去， 进行默认选中的判断
            initCate(res.data.cate_id)
            // 初始化富文本编辑器
            initEditor()
            // 初始化裁剪区域， 把当前封面地址进行替换
            $image
                .cropper('destroy')     // 销毁旧的裁剪区域
                .attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img)       // 重新设置图片路径
                .cropper(options)       // 重新初始化裁剪区域
        }
    })
    // 定义加载文章分类的方法
    function initCate(currentCateId = "") {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                console.log(res);
                
                res.currentCateId = currentCateId
                // 调用模板引擎， 渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                console.log($('[name=cate_id]').length);
                
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为选择封面的按钮， 绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件， 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件， 创建对应的 URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径   
            .cropper(options)   // 重新初始化裁剪区域
    })
    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮， 绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })
    // 为表单 绑定submit提交事件
    $('#form-edit').on('submit', function(e) {
        // 阻止表单的默认提交行为i
        e.preventDefault()
        // 基于form表单 快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 把当前文章的Id加入到fd中
        fd.append('Id', $Id)
        // 将封面裁剪过后的图片， 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个Canvas画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将Canvas画布上的内容， 转化为文件对象
                // 得到文件对象后， 进行后续的操作
                // 将文件对象， 存储到fd中
                fd.append('cover_img', blob)
                // 发起Ajax数据请求
                editArticle(fd)
            })
    })
    // 定义一个修改文章的方法
    function editArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                location.href= '/article/art_list.html'
            }
        })
    }

})