$(function (){
    // 加载商品列表的数据
    $.ajax({
        url: 'data/goods.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: function (json){
            var results = '';
            $.each(json,function (index,item){
                results += '<div class="goods" code=“'+item.code+'"><img src="'+item.imgurl+'" alt=""><p>'+item.price+'</p><h3>'+item.title+'</h3><div>加入购物车</div></div>';
            });
            $('.content').html(results);
        }
    });

    // 点击加入购物车
    // localStorage -> goods : '{"code":['abc1','abc4','abc6']}'
    $('.content').on('click','.goods div',function (){
        // 获取点击商品的编号
        var code = $(this).parent().attr('code');

        // 获取本地存储数据（数组）
        if (localStorage.getItem('goods')) {
            var codeArr = JSON.parse( localStorage.getItem('goods') ).code;
        } else {
            var codeArr = [];
        }

        codeArr.push(code);//添加数据

        var jsonStr = JSON.stringify( {"code": codeArr} );//对象转成 json 字符串

        // 更新本地存储数据
        localStorage.setItem('goods',jsonStr);

        alert('成功加入购物车！');
    })


})
