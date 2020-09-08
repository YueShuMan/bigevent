var form = layui.form;

// 获取地址栏的id，这个id是文章的id；
var id = new URLSearchParams(location.search).get('id');
// console.log(id);


// -------------------------- 获取分类，渲染到下拉框的位置 --------
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        var html = template('tpl-category', res);
        $('#category').html(html);
        form.render('select');
        // 下拉框的分类渲染完成，然后再去发送ajax请求，获取文章详情
        // 根据id可以获取文章详情（标题、内容、状态、图片.....）全部获取到
        $.ajax({
            // url: '/my/article/:id', // 把 :id 换成真实的id即可
            url: '/my/article/' + id,
            success: function (res) {
                // console.log(res);
                // 获取到详情后，做数据回填 (使用layui提供的 form.val())
                form.val('article', res.data);
                // 一定先做数据回填，然后在把 textarea 换成 富文本编辑器
                initEditor();
                // 更换图片(销毁剪裁区 --> 更换图片 --> 重建剪裁区)
                $image
                .cropper('destroy')
                .attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img)
                .cropper(options);
            }
        });
    }
});



// -------------------------- 处理封面图片 -----------------
// 1. 初始化剪裁框
// 1.1) 初始化图片裁剪器
var $image = $('#image')
// 1.2) 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
    autoCropArea: 1 // 让剪裁框（九宫格）占满整个图片
}
// 1.3) 初始化裁剪区域
$image.cropper(options);


// 2. 点击 “选择封面” 能够选择图片
$('button:contains("选择封面")').click(function () {
    $('#file').click();
});

// 3. 图片切换的时候，更换剪裁区的图片
$('#file').change(function () {
    // 3.1) 找到文件对象
    var fileObj = this.files[0];
    // 3.2) 创建url
    var url = URL.createObjectURL(fileObj);
    // 3.3) 更换图片
    $image.cropper('destroy').attr('src', url).cropper(options);
});


// ---------------------  完成最终的修改文章 ----------------------
$('#add-form').on('submit', function (e) {
    e.preventDefault();
    // 收集表单数据(必须是FormData)
    var fd = new FormData(this);
    // fd对象中，有content，但是值为空； 根本就没有 图片
    // 1. 获取富文本编辑器里面的内容，并不是追加到fd中，而是更改fd里面的内容
    fd.set('content', tinyMCE.activeEditor.getContent());

    // 2. 剪裁图片，转成 blob 形参（二进制形式或文件对象形式），追加到fd中
    var canvas = $image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });

    // 把canvas图片转成二进制形式
    canvas.toBlob(function (blob) {
        // 追加文件对象到fd中
        fd.append('cover_img', blob);

        // 根据修改文章的接口要求，必须加入Id
        fd.append('Id', id);

        // 检查一下，fd对象中，是否取得了接口要求的所有参赛
        // fd.forEach((val, key) => {
        //     console.log(key, val);
        // });
        // return;
        // 发送ajax请求，完成最终的添加
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',
            data: fd,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 添加成功，跳转到 文章列表 页面
                    location.href = '/article/article.html'
                }
            },
            processData: false, // 不要处理数据；意思是不要把对象形式的fd转换成查询字符串形式
            contentType: false // 不要加默认的请求头（application/x-www-form-urlencoded），让浏览器自行设置请求头
        });
    });
})