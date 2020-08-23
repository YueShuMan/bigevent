// ------------------------ 1. 创建剪裁框，实现基本剪裁效果 ---------------------------
// 实现这个功能，调用插件提供的方法
// 1.1 找到默认图片
var $image = $('#image');
// 1.2 配置剪裁框
var option = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区 (使用选择区)
    preview: '.img-preview'
};
// 1.3 调用插件方法，实现剪裁
$image.cropper(option);



// ------------------------ 2. 点击上传按钮，能够选择图片 -----------------------------
// 找到上传按钮，注册单击事件；单击按钮的时候，触发文件域的单击事件
$('button:contains("上传")').click(function () {
    $('#file').click();
});




// ------------------------ 3. 选择一张图片之后，能够更换剪裁区的图片 ------------------
// 文件域的内容改变的时候，更换剪裁区的图片
$('#file').change(function () {
    // 3.1 先找到文件对象
    // console.dir(this);
    var fileObj = this.files[0];
    // 3.2 为选择的图片生成一个临时的url
    var url = URL.createObjectURL(fileObj);
    // 3.3 更换图片的src属性 (销毁剪裁区  -->  更换src属性  -->  重新创建剪裁框)
    $image.cropper('destroy').attr('src', url).cropper(option);
});




// ------ 4. 点击确定按钮，剪裁图片，把图片转成base64格式，ajax提交字符串，完成更改------
$('button:contains("确定")').click(function () {
    // 4.1 调用插件方法，剪裁图片；剪裁之后得到一张canvas格式的图片
    var canvas = $image.cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    });
    // 4.2 把canvas图片转换成base64格式，得到超长字符串
    var base64 = canvas.toDataURL('image/png');
    // 4.3 ajax提交字符串，完成更新
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: { avatar: base64 },
        success: function (res) {
            layer.msg(res.message);
            if (res.status == 0) {
                // 重新渲染父页面的头像
                window.parent.getUserInfo();
            }
        }
    });
});