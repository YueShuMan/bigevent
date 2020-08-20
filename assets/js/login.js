// ---------------------------- 切换登录和注册的盒子 ------------------------------







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
            if (res.statua == 0) {
                // 把token保存带本地
                localStorage.setItem('token', res.token);
                // 跳转到index.html
                location.href = '/index.html';
            }
        }
    });

});





// ---------------------------- 注册功能 ------------------------------