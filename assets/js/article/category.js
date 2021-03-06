// 表示添加弹层的index
var addIndex = null;
// 表示编辑的弹层
var editIndex = null;

// ------------------------  获取类别列表，渲染到页面中 -----------------------
function renderCategory() {
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            console.log(res);
            if (res.status === 0) {
                // 把数据 通过模板引擎 渲染到页面中
                var html = template('tpl-list', res);
                // 把html放到tbody中
                $('tbody').html(html);
            }
        }
    });
}
renderCategory();

// ------------------------  删除分类 -----------------------
$('tbody').on('click', 'button:contains("删除")', function () {
    // 获取id
    var id = $(this).data('id');

    // 询问是否要删除
    layer.confirm('你是否要删除吗？', { icon: 3, title: '提示' }, function (index) {
        // do something

        // 点击确定，这个函数触发了
        // console.log(id);
        // 发送ajax请求进行删除操作
        $.ajax({
            // url: '/my/article/deletecate/:id',  // 把 :id 换成真实的id值即可
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                // console.log(res);
                // 无论删除成功，还是失败，都给出提示
                layer.msg(res.message);
                // 删除成功，重新渲染页面
                if (res.status === 0) {
                    renderCategory();
                }
            }
        });
        layer.close(index);
    });
});


// ----------------------- 添加 （点击添加分类，显示弹层） -----
$('button:contains("添加类别")').click(function () {
    // addIndex 表示当前的弹层；关闭弹层的时候，需要用到它
    addIndex = layer.open({
        type: 1,
        title: '添加文章分类',
        content: $('#tpl-add').html(),
        area: ['500px', '250px']
    });
});


// ----------------------- 添加 （点击确认添加，完成添加） -----
$('body').on('submit', '.add-form', function (e) {
    e.preventDefault();
    // 收集表单数据(一定要检查表单各项的name属性)
    var data = $(this).serialize();
    // ajax提交，完成添加
    $.ajax({
        type: 'POST',
        url: '/my/article/addcates',
        data: data,
        success: function (res) {
            // 无论成功，还是失败，都给出提示
            layer.msg(res.message);
            // 关闭弹层
            layer.close(addIndex);
            if (res.status === 0) {
                renderCategory();
            }
        }
    });
});



// ----------------------- 编辑 （点击 编辑，显示弹层） -----
$('body').on('click', 'button:contains("编辑")', function () {
    // editIndex 表示当前的弹层；关闭弹层的时候，需要用到它
    editIndex = layer.open({
        type: 1,
        title: '编辑文章分类',
        content: $('#tpl-edit').html(),
        area: ['500px', '250px']
    });
    // 弹层之后，获取事件源的三个自定义属性值；设置input的value值  ---  数据回填/为表单赋值
    var zhi = $(this).data();
    console.log(zhi);
    // 数据回填(不要忘记id)
    $('.edit-form input[name="name"]').val(zhi.name);
    $('.edit-form input[name="alias"]').val(zhi.alias);
    $('.edit-form input[name="id"]').val(zhi.id);
});



// ----------------------- 编辑 （点击 确认修改，完成编辑） -----
$('body').on('submit', '.edit-form', function (e) {
    e.preventDefault();
    // 收集表单各项值
    var data = $(this).serializeArray();
    // id ===> Id
    data[2].name = 'Id';
    // console.log(data);
    // return;
    // ajax提交，完成修改
    $.ajax({
        type: 'POST',
        data: data,
        url: '/my/article/updatecate',
        success: function (res) {
            // 无论成功，还是失败，都给出提示
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                layer.close(editIndex);
            }
        }
    });
})



