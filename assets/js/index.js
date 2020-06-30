function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success:function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;' + name)
    // 渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
$(function() {
    var form = layui.form
    var layer = layui.layer
    // 获取用户的基本信息
    getUserInfo()
    
    // 点击按钮， 实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', { icon: 3, title:'提示' }, function(index) {
            // 清空本地存储中的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index)
        })
    })
})