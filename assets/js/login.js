// ---------------------------- 切换登录和注册的盒子 ------------------------------
$('.login a').click(function () {
    $('.register').show().prev().hide();
});
$('.register a').click(function () {
    $('.login').show().next().hide();
});




// ---------------------------- 登录功能 ------------------------------
$('.login form').on('submit', function (e) {
    e.preventDefault();
    // 手机账号
    var data = $(this).serialize();
    // ajax提交
    $.ajax({
        type: 'POST',
        url: 'http://ajax.frontend.itheima.net/api/login',
        data: data,
        success: function (res) {
            if (res.status == 0) {
                // 把token保存带本地
                localStorage.setItem('token', res.token);
                // 跳转到index.html
                location.href = '/index.html';
            }
        }
    });

});





// ---------------------------- 注册功能 ------------------------------
$('.register form').on('submit', function (e) {
    e.preventDefault();
    // 收集表单数据
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: 'http://ajax.frontend.itheima.net/api/reguser',
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status == 0) {
                // 注册成功，显示登录的盒子
                $('.login').show().next().hide();
                // 清空注册的表单 (reset是DOM的方法，所以把jQuery对象转成DOM对象)
                $('.register form')[0].reset();
            }
        }
    })
});