# Spine
基于 jQuery简洁的(M)VC


原文:[javascript组件化](http://purplebamboo.github.io/2015/03/16/javascript-component/)

做了部分修改,并命名空间取名`Spine`,功能因类似`backbone`所以想到用不一样单词描述`[骨架]`,源自`基于MVC的JavaScript Web富应用开发`书作者的[http://spinejs.com/](http://spinejs.com/)

## 基于 richbase 修改

* 修改`delegate`代理事件,使用`on`绑定
* 修复多个事件绑定问题,增加了闭包解决变量作用域问题

## 使用缘由

公司后台管理系统开发情况,后端经常不按理出牌,前端只用 `jquery`和单例代码太冗余,数据异步交互层不能封装到交互的对象里面,必须交由后端来写,汗~

由于已上线的页面难以修改和浏览器兼容性问题,本考虑选择两个方案

1. `backbone`+`underscore` 嫌太大而且组员生疏
2. `avalon`方案,技术不愿给数据接口,前端人员人手不够

还是简单的简单来,扩展一下基础的 mvc 对象

## 使用

### 实例扩展

**定义扩展一个视图**

```JavaScript
	var AppView = Spine.extend({
        // 视图事件绑定
        EVENTS: {
            // 过滤
            '.filter' : {
                // 点击
                click: function(self, e) {
                    $(this).addClass('cur').siblings().removeClass('cur');
                    // 执行异步
                    self.async();
                }
            },
            // 时间
            '[data-toggle="datetimepicker"]': {
                // 选择时间后
                'choose.ui.datetimepicker': function(self, e, date) {
                    self.queryData.day = date;
                    self.$start.html(Util.datediff(date, -1));
                    self.$end.html(date);
                    self.async();
                }
            }
        },
        // 初始化
        initialize: function() {
            // dom
            this.$el = this.get('parentNode');

            this.$start = this.get('startTime');

            this.$end = this.get('endTime');

            // loading
            this.$loading = null;

            // 查询条件
            this.queryData = $.extend(
                {
                    channelNO: '',
                    day: this.$el.find('[data-toggle="datetimepicker"]').val()
                },
                (this.get('queryData') || {})
            );

            // 汇总模块
            this.totalView = new PartialView({
                parentNode: $('#total-view'),
                template: $('#tmpl-total-view')
            })
            // 列表模块
            this.listView = new PartialView({
                parentNode: $('#list-view'),
                template: $('#tmpl-list-view')
            });

            // 加载数据
            this.async();
        },
        // 加载层提示
        loading: function(msg) {
            msg = msg || '正在加载中...';
            // 安装加载层
            if(this.$loading === null) {
                this.$loading = $('<div class="notify"><div class="notify-message">'+ msg +'</div></div>').css({
                    'position': 'fixed',
                    'top': '30%',
                    'left': '50%',
                    'margin-left': '-175px',
                    'text-align': 'center'
                });

                this.$loading.appendTo($(document.body));
            } else {
                this.$loading.find('.notify-message').html(msg);
            }

            // 显示 loading
            this.$loading.stop(true, true).fadeIn();
        },
        // 隐藏 loading
        hideLoading: function() {
          this.$loading.stop(true, true).fadeOut();
        },
        // 渲染模板
        render: function(data) {
            this.hideLoading();
            this.listView.render(data);
            this.totalView.render(data);
        },
        // 异步加载数据
        async: function() {
            this.loading();
            // 延迟对象
            var deferred = this.get('async')(this.queryData);
            // 延迟完成
            deferred.done($.proxy(this.render, this))
        }
    });
```

**使用视图**

```JavaScript
// 页面视图控制
// 实例化
var app = new AppView({
    parentNode: $('#app'),
    // 默认查询条件
    // queryData: {channelNO : '', day: ''},
    pager: $('.pagination'),
    startTime: $('#start_time'),
    endTime: $('#end_time'),
    async: function(query) {
        // query为查询字段数据
        return $.getJSON('/data/generalAccount.json', query);
    }
});
```

**HTML代码**

``` HTML
...
<div id="app">
	<div class="filter-wrap">
		<ul class="list-filter">
			<li><a href="#" class="filter">A</a></li>
			<li><a href="#" class="filter">B</a></li>
			<li><a href="#" class="filter">C</a></li>
		</ul>
		<input type="text" data-toggle="datetimepicker" value="2016-01-01">
	</div>

	<div id="totalView"></div>
	<div id="listView"></div>
</div>

<!-- 汇总样式 -->
<script type="text/x-template" id="tmpl-total-view">
    <table class="outline-table table fn-mb-20 fn-mt-20">
        <tbody>
        <tr class="bg">
            <th>上期余额</th>
            <th>当期收入</th>
            <th>当期支出</th>
            <th>当期余额</th>
        </tr>
        <tr>
            <td><%= PeriodBalance %></td>
            <td><%= Recharge %></td>
            <td><%= Payment %></td>
            <td><%= Balance %></td>
        </tr>
        </tbody>
    </table>
</script>
<!-- 详细表格模板 -->
<script type="text/x-template" id="tmpl-list-view">
    <table class="outline-table table">
        <thead>
        <tr class="bg">
            <th colspan="3">当期收入</th>
            <th colspan="3">当期支出</th>
        </tr>
        <tr class="bg">
            <th>类型</th>
            <th>收入金额</th>
            <th>收入笔数</th>
            <th>类型</th>
            <th>支出金额</th>
            <th>支出笔数</th>
        </tr>
        </thead>
        <tbody>
        	<% for(var i = 0; i < list.length; i ++){%>
            <tr>
                <td><%= list[i].A %></td>
                <td><%= list[i].B %></td>
                <td><%= list[i].C %></td>
                <td><%= list[i].D %></td>
                <td><%= list[i].E %></td>
                <td><%= list[i].F %></td>
            </tr>
            <% } %>
    </table>
</script>
...

```
