$(function () {
  $('.trigger').bind('click', function(e){
    var target = $(this).attr('data-target');
    var attr = $(this).attr('data-attr');
    $(target).toggleClass(attr);
  });
});
