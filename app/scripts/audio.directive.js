/**
 * Created by Kosar Hosseinkhani on 11/2/2016.
 */
'use strict';
angular.module('kAngularHowlerApp').
directive('sonicAudio', [
  function () {
    return {
      templateUrl: 'views/audio.html',
      controller:'AudioCtrl as audioCtrl',
      restrict: 'E',
      replace:true,
      scope:{
        playlist:'=?' /**Array*/,
        autoPlay:'=?', /**Boolean */
        hideAtStateChange:'=?', /**Boolean if true when
         state changes goes away e.g. from home to profile */
        index:'=?', /** Number */
        triggerElm:'@'
      },
      link: function(scope, elm, attr){
      } /** link */
    }; /** return */
  }]); /** directive */

