# Spine
基于 jQuery简洁的(M)VC


** 并非原创 **

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