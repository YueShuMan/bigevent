// ----------------------------------- 数据回填 ----------------------------------
// 定义渲染表单的函数
function renderForm() {
    // 发送ajax请求，获取该用户的信息
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res)
            // 设置每个input的value值 (用户名、昵称、邮箱、id)
            $('input[name=username').val(res.data.username);
            $('input[name=nickname').val(res.data.nickname);
            $('input[name=email').val(res.data.email);
            $('input[name=id').val(res.data.id);
        }
    });
}
renderForm();



// --------------------------- 点击确认修改，完成修改 -------------------------------
$('form').on('submit', function (e) {
    e.preventDefault();
    // 收集表单信息
    var data = $(this).serialize();
    // 设置input为disabled 禁用，通过serialize就不会收集到这项数据了
    // ajax提交接口，完成用户信息修改
    $.ajax({
        type: 'POST',
        url: '/my/userinfo',
        data: data,
        success: function (res) {
            // console.log(res);
            layer.msg(res.message);
            if (res.status == 0) {
                // 修改用户成功，重新渲染index.html页面
                // 调用父页面的 getUserInfo() 函数   
                // 因为 iframe，把 userinfo.html  和 index.html 确认为父子页面
                // 有父子关系的页面才可以这样用
                window.parent.getUserInfo();
            }
        }
    })
})