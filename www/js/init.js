require.config({
baseUrl: "/www/js/"
  });
require(["api/iscroll","api/jquery","api/pageNavigator",'api/scrolls',"app","api","syncdb","push"], function() {
  initService();
});