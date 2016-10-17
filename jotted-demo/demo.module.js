var demo = angular
  .module('demo', []);

demo.directive('myDirective', function() {
  return {
    restrict: 'EA',
    link: link
  }

  function link(scope, el, attrs) {
    el.css('font-weight', 'bold');
  }
});
