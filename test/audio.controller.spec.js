'use strict';

describe('Controller: AudioCtrl', function () {

  // load the controller's module
  // beforeAll(module('kAngularHowlerApp'));
  //beforeAll(module('templates'));

  var audioCtrl;
  var scope;
  var compile;
  var playerMock;
  var interval;
  var _image = 'img_sp.jpg';
  var startOffset = 0;
  var duration;
  var playlist =
    [
      {
        src: ['The+Golden+Age.mp3'],
        image: _image,
        username: 'Ali Hosseinkhani',
        filename: 'The golden age',
        userProfileLink: 'http://localhost:8080/5807cf82d2b3ad2b2cb07966'
      },
      {
        src: ['Blood+I+Bled.mp3'],
        image: _image,
        username: 'Ali Hosseinkhani',
        filename: 'The Blood I bled',
        userProfileLink: 'http://localhost:8080/5807cf82d2b3ad2b2cb07966'
      },
      {
        src: ['https://s3.amazonaws.com/sonicassetsdev/static/02+-+Paper+Tiger.mp3'],
        image: _image,
        username: 'Ali Hosseinkhani',
        filename: 'Paper Tiger',
        userProfileLink: 'http://localhost:8080/5807cf82d2b3ad2b2cb07966'
      }
    ];
  playerMock = function () {
    var _options;
    var safeCb = function (cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    };
    return {
      play: function (index, _playlist, volume, options) {
        _options = options;
        var data = _playlist[index];
        data.howl = {
          duration: function () {
            return duration;
          },
          seek: function () {
            return startOffset;
          },
          volume: function () {

          }
        };
        if (typeof _options.onplayCallback === 'function') {
          _options.onplayCallback(data);
        }
        return {
          data: data,
          soundId: 101,
          currentHowlObj: 'success'
        };
      },
      pause: function () {
        if (typeof _options.onpauseCallback === 'function') {
          _options.onpauseCallback();
        }
      },
      stop: function () {
        return 'just stopped';
      },
      volumeChange: function (index, volume, _playlist, callback) {
        if (_playlist[index] && _playlist[index].howl) {
          _playlist[index].howl.volume(volume);
          safeCb(callback)()
        }
      },
      seek: function (index, soundId, _playlist, _startOffset) {
        safeCb(_options.onseekCallback)();
        if(_startOffset !== undefined){
          startOffset = _startOffset;
        }
        return startOffset;
      },
      unload: function () {
        return 'unload done';
      }
    }

  };

  // Initialize the controller and a mock scope
  beforeEach(function () {
    module('kAngularHowlerApp');
    module('templates');
    module(function ($provide) { // to inject mock objects to controller
      $provide.value('player', playerMock());
    });
    inject(function ($controller, $rootScope, $compile, $interval) {
      scope = $rootScope.$new();
      compile = $compile;
      interval = $interval;
      scope.playlist = playlist;
      scope.autoPlay = false;
      scope.index = 0;
      var elem = compile(angular.element('<sonic-audio  playlist = "playlist"  auto-play="false" index="0"></sonic-audio>'))(scope);
      $rootScope.$digest();
      audioCtrl = elem.controller("sonicAudio");

    });
  });

  it('should have 3 songs in playlist', function () {
    expect(audioCtrl.playlist.length).toBe(3);
  });
  it('should not autoplay', function () {
    expect(audioCtrl.autoPlay).toBe(false);
  });
  it('should have index equal zero at the start', function () {
    expect(audioCtrl.index).toBe(0);
  });
  it('should be playing The golden age', function () {
    audioCtrl.play();
    expect(audioCtrl.filename).toBe('The golden age');
  });
  it('should move forward and play Paper Tiger', function () {
    audioCtrl.index = 1;
    audioCtrl.move('forward');
    expect(audioCtrl.filename).toBe('Paper Tiger');
  });
  it('should move backward and play The Blood I bled', function () {
    audioCtrl.index = 2;
    audioCtrl.move('backward');
    expect(audioCtrl.filename).toBe('The Blood I bled');
  });
  it('should pause', function () {
    audioCtrl.play();
    audioCtrl.playlist[audioCtrl.index].howl = {
      pause: function () {
        return true;
      }
    };
    audioCtrl.play();
    expect(audioCtrl.isPlaying).toBe(false);
  });
  it('should fast-forward through the song', function () {
    duration = 2200;
    audioCtrl.duration = duration;
    audioCtrl.play();
    expect(audioCtrl.startOffset).toBe(0);
    audioCtrl.playbackPosition = 30;
    audioCtrl.timeChange();
    interval.flush(500);
    expect(audioCtrl.startOffset).toBe(660);
  });
  it('should fast-backward through the song', function () {
    duration = 2200;
    audioCtrl.duration = duration;
    audioCtrl.play();
    expect(audioCtrl.startOffset).toBe(0);
    audioCtrl.playbackPosition = 30;
    audioCtrl.timeChange();
    interval.flush(500);
    expect(audioCtrl.startOffset).toBe(660);
    audioCtrl.timeChange(); //did this to manually falsify changedNotByUser parameter as the event handler timeChange doesn't fire merely by changing the playbackPosition becuase it is a mock
    audioCtrl.playbackPosition = 12;
    audioCtrl.timeChange();
    interval.flush(500);
    expect(audioCtrl.startOffset).toBe(264);
  });
  it('should handle fast-forward with duration of zero', function () {
    duration = 0;
    audioCtrl.duration = duration;
    audioCtrl.play();
    expect(audioCtrl.startOffset).toBe(0);
    audioCtrl.playbackPosition = 30;
    audioCtrl.timeChange();
    interval.flush(500);
    expect(audioCtrl.startOffset).toBe(0);
  });
  it('should change the volume up', function () {
    audioCtrl.play();
    audioCtrl.volumeLevel = 70;
    audioCtrl.volumeChange();
    expect(audioCtrl.volumeIcon).toBe(audioCtrl.data.volumeUp);
  });
  it('should change the volume off', function () {
    audioCtrl.play();
    audioCtrl.volumeLevel = 0;
    audioCtrl.volumeChange();
    expect(audioCtrl.volumeIcon).toBe(audioCtrl.data.volumeOff);
  });
  it('should change the volume off', function () {
    audioCtrl.play();
    audioCtrl.volumeLevel = -10;
    audioCtrl.volumeChange();
    expect(audioCtrl.volumeIcon).toBe(audioCtrl.data.volumeOff);
  });
  it('should change the volume down', function () {
    audioCtrl.play();
    audioCtrl.volumeLevel = 10;
    audioCtrl.volumeChange();
    expect(audioCtrl.volumeIcon).toBe(audioCtrl.data.volumeDown);
  });
});
