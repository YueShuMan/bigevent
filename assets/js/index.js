// --------------------------- 到达index页面，渲染头像和欢迎语 -------------------------
// 封装成函数，因为后面其他页面还要调用
function getUserInfo() {
    // 发送ajax请求，获取用户信息 (必须先登录、保证本地存储有可用token)
    $.ajax({
        url: '/my/userinfo',
        // ajax请求成功后触发
        success: function (res) {
            console.log(res);
            if (res.status == 0) {
                // 1. 设置欢迎语 (有昵称，使用昵称；没有昵称，使用用户名)
                var name = res.data.nickname || res.data.username;
                $('.username').text(name);

                // 2. 设置头像 (有图片，使用图片；没有图片，使用名字的第一个字母)
                if (res.data.user_pic) {
                    // 设置img的src属性
                    // 让img显示
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                } else {
                    // 获取名字的首字符，变为大写
                    var first = name.substr(0, 1).toUpperCase();
                    // show() 设置元素的display属性，值就是标签的默认值
                    $('.text-avatar').text(first).css('display', 'inline-block');
                }
            }
        }
    });
}
getUserInfo();






// --------------------------------- 退出功能 -------------------------------------
// 点击退出按钮，询问是否退出。确定退出 (1.清除本地存储中的token  2. 跳转到登录页面)
$('#logout').click(function () {
    // 询问是否删除
    layer.confirm('确定要退出吗？', { icon: 3, title: '提示' }, function (index) {
        // 点击确定。执行这里的代码
        // 1. 清除token
        localStorage.removeItem('token');
        // 2. 跳转到登录页面
        location.href = '/login.html';

        layer.close(index);
    })
});




// --------------------------------- 退出功能 -------------------------------------