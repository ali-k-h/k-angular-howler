/**
 * Created by K2 on 11/2/2016.
 */
angular.module('kAngularHowlerApp').filter('secondsToDateTime', [function () {
  return function (seconds) {
    return new Date(1970, 0, 1).setSeconds(seconds);
  };
}])
