// 通用视图对象
// 依赖Spine.js
// 扩展SpineJS
// by tommyshao
// ---------
var PartialView = Spine.extend({
    // 初始化
    initialize: function() {
        // 实例化获取配置
        this.$el = this.get('parentNode');
        this.template = this.get('template').html();

        
        // 外部定义事件
        this.EVENTS = this.get('EVENTS');
        this._delegateEvent();

    },
    // 惰性渲染
    // data接收数据
    render: function(data) {
        data = data || {};
        // 利用内置模板引擎编译模板获取编译后的内容
        var template = this._parseTemplate(this.template, data);
        // 重新渲染数据
        this.$el.empty().append(template);
    }
});