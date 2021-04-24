$(function (){
    
    var toDoList = {
        init: function () {//初始化
            this.cacheElement();
            this.bindEvent();
        },
        cacheElement: function () {//缓存元素
            this.$ipt = $('.ipt');
            this.$add = $('.add');
            this.$list = $('.list');
            this.$all = $('#all');
            this.$done = $('.done');
            this.$remove = $('.removes');
            this.$doneList = $('.doneList');
        },
        bindEvent: function (){//绑定事件
            
            var _this = this;//保存指针

            this.$add.click(function (){//添加任务
                var addText = _this.$ipt.val();
                if (!addText) {
                    return;
                }
                var addDom = '<li><input type="checkbox"><span class="con">'+addText+'</span><span class="remove">删除</span><span class="edit">编辑</span></li>';
                _this.$list.append(addDom);
                if (_this.$all.prop("checked")) {//勾选全部
                    $('.list li input').prop("checked", true);
                }
                _this.$ipt.val('');
            });

            this.$list.on('click','li input',function (){//选择任务
                var selectArr = [];//存储勾选状态
                $('.list li input').each(function (index,item){
                    if ($(item).prop("checked")) {//当前input勾选
                        selectArr.push('a');
                    } else {
                        selectArr.push('b');
                    }
                });
                if (selectArr.indexOf('b')==-1) {//全选 ["a", "a", "a"]
                    _this.$all.prop("checked", true);
                } else {//取消 ["a", "b", "b"]
                    _this.$all.prop("checked", false);
                }
            });

            this.$list.on('click','li .edit',function (){//编辑
                var conTxt = $(this).siblings('.con').text();
                $('<input type="text" class="repIpt">').replaceAll($(this).siblings('.con'));
                $('.repIpt').val(conTxt).focus();
            });

            this.$list.on('blur','li .repIpt',function (){//编辑完成
                var conDom = '<span class="con">'+$(this).val()+'</span>';
                $(conDom).replaceAll($(this));
            });

            this.$list.on('click','li .remove',function (){//删除记录
                $(this).parent().remove();
            });

            this.$all.click(function (){//选择全部
                if ($(this).prop("checked")) {
                    $('.list li input').prop("checked", true);
                } else {
                    $('.list li input').prop("checked", false);
                }
            });

            this.$done.click(function (){//已处理
                $('.list input:checked').each(function (index,ele){
                    var task = $(this).siblings('.con').text();
                    _this.$doneList.append('<li>'+task+'</li>');
                    $(this).parent().remove();
                    _this.$all.prop("checked", false);//取消全选
                });
            });

            this.$remove.click(function (){//批量删除
                $('.list input:checked').each(function (index,ele){
                    $(this).parent().remove();
                    _this.$all.prop("checked", false);//取消全部
                });
            });
        }
    }
    toDoList.init();
    
})