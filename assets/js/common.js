// 统一配置项目的ajax请求

$.ajaxPrefilter(function (option) {
    // option表示ajax选项

    // 1. url统一配置 (所有接口都需要配置)
    option.url = 'http://ajax.frontend.itheima.net' + option.url;

    // 完整的url   http://ajax.frontend.itheima.net/my/userinfo
    if (option.url.includes('/my/')) {
        // 2. headers，请求头加token (是以 /my 开头的接口，需要配置)
        option.headers = {
            Authorization: localStorage.getItem('token')
        }
        // 3. ajax请求完成之后，判断token的真假 (是以 /my 开头的接口，需要这个配置)
        option.complete = function (xhr) {
            // ajax请求完成，根据服务器返回的结果判断token的真假
            if (xhr.responseJSON && xhr.responseJSON.status == 1 && xhr.responseJSON.message == '身份认证失败！') {
                // 说明用户使用了假的token或者过期的token
                // 1. 清除假token或者过期的token
                localStorage.removeItem('token');
                // 2. 跳转到登录页面
                location.href = '/login.html';
            }
        }
    }

});