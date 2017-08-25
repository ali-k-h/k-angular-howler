'use strict';

describe('Controller: AudioCtrl', function () {

  // load the controller's module
  beforeEach(module('kAngularHowlerApp'));

  var AudioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AudioCtrl = $controller('AudioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should set the volume up', function () {
    expect(AudioCtrl.data.startIcon).toBe('fa fa-play');
  });
});
