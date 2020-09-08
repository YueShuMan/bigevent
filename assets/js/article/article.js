var form = layui.form;         // 加载表单模块
var laypage = layui.laypage;   // 加载分页模块

// 全局变量，设置ajax请求参数 (获取文章列表) 的参数
var data = {
    pagenum: 1,    // 页码值，分页获取数据；pagenum表示获取第几页的数据；1表示获取第一页的数据...
    pagesize: 2,   // 分页显示多少条数据

    // cate_id: 1,    // 这里应该填分类的id，并不是名字
    // state:'草稿'
};

// ---------------------- 1. ajax获取文章列表，渲染到页面中 --------------------
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function (res) {
            if (res.status == 0) {
                // 这里调用模板引擎，渲染数据
                // console.log(res);
                var html = template('tpl-list', res);
                $('tbody').html(html);

                // 调用创建分页的函数
                createPage(res.total);   // 传入数据
            }
        }
    });
}
renderArticle();


// ---------------------- 2. 发送ajax请求，获取所有分类 -----------------------
// 获取到所有的分类之后，渲染到页面下拉框位置
$.ajax({
    url: '/my/article/cates',
    success: function (res) {
        if (res.status == 0) {
            // console.log(res);
            // 使用模板引擎渲染到下拉框
            var html = template('tpl-category', res);
            $('#category').html(html);
            // 更新渲染
            form.render('select');
        }
    }
});



// ---------------------- 3. layui的分页模块 ---------------------------------
function createPage(total) {
    //执行一个laypage实例
    laypage.render({
        elem: 'page',    //这里的 page 是页面中div的id
        count: total,       //数据总数，从服务端得到文章总数
        limit: data.pagesize,       // 每页显示多少条，默认是10   实际开发中，应该和data.pagesize一致
        limits: [2, 3, 5, 8],  // 自定义每页显示多少条的下拉菜单
        curr: data.pagenum,         // 当前页   实际中，应该和data.pagenum一致
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],      // 自定义排版
        // 刷新页面，就是调用createPage，jump会触发一次   切换页码的时候jump也会触发
        jump: function (obj, first) {
            // obj (当前分页所有选项值)  就是当前分页的所有配置项
            // first 刷新页面后，first==true     后续页面切换时，first==undefined
            // 加入判断，解决函数相互调用形成的死循环
            if (!first) {
                // 修改ajax请求参数
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                renderArticle();
            }

        }
    });
}
// createPage(10);


// ---------------------- 4. 筛选 --------- ---------------------------------
// 思路：筛选的时候，改变请求参数；重新发送ajax请求，重新渲染页面
$('#search').on('submit', function (e) {
    e.preventDefault();
    // 获取分类的id 和状态
    var cate_id = $('#category').val();
    var state = $('#state').val();
    // 改变请求参数，重新发送ajax请求并重新渲染
    data.cate_id = cate_id;
    data.state = state;
    // 重置页码为1，筛选结束应该先浏览第一页
    data.pagenum = 1;
    renderArticle();
});




// ---------------------- 定义模板过滤函数，处理时间 --------------------------
template.defaults.imports.formatDate = function (t) {
    // 创建时间日期对象
    var date = new Date(t);
    // 获取年月日时分秒
    var y = date.getFullYear();
    var m = addZero(date.getMonth() + 1);
    var d = addZero(date.getDate());
    var hh = addZero(date.getHours());
    var mm = addZero(date.getMinutes());
    var ss = addZero(date.getSeconds());
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
}
// 定义补零函数
function addZero(n) {
    return n < 10 ? '0' + n : n;
}



