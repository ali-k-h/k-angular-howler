'use strict';

describe('Controller: AudioCtrl', function () {

  // load the controller's module
  beforeEach(module('kAngularHowlerApp'));
  beforeEach(module('templates'));

  var audioCtrl;
  var scope;
  var compile;
  var playerMock;
  var _image= 'https://s3.amazonaws.com/sonicassetsqa/files/71ca979f-8064-4d20-85b7-fc8c54cfabae1476340342881_sp.jpg';
  var playlist =
    [
      {src:['https://s3.amazonaws.com/sonicassetsdev/static/01+-+The+Golden+Age.mp3'],
        image:_image,
        username:'Kosar Hosseinkhani',
        filename:'The golden age',
        userProfileLink:'http://localhost:9000/5807cf82d2b3ad2b2cb07966'},
      {src:['https://s3.amazonaws.com/sonicassetsdev/static/The+Staves+-+Blood+I+Bled.mp3'],
        image:_image,
        username:'Kosar Hosseinkhani',
        filename:'The Bload I bled',
        userProfileLink:'http://localhost:9000/5807cf82d2b3ad2b2cb07966'},
      {src:['https://s3.amazonaws.com/sonicassetsdev/static/02+-+Paper+Tiger.mp3'],
        image:_image,
        username:'Kosar Hosseinkhani',
        filename:'Paper Tiger',
        userProfileLink:'http://localhost:9000/5807cf82d2b3ad2b2cb07966'}
    ];
  var playerMock = {
    play: function (index, _playlist) {
      return {
        data:_playlist[0],
        soundId:101,
        currentHowlObj:'success'
      };
    },
    pause: function () {
     return 'just paused';
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
    seek: function (index, soundId, _playlist, startOffset) {
      /**get or set seek */
      if (_playlist[index] && _playlist[index].howl) {
        return startOffset ?
          _playlist[index].howl.seek(startOffset, soundId) :
          _playlist[index].howl.seek(soundId);
      }
    },
    unload: function(){
      return 'unload done';
    }
  };

  // Initialize the controller and a mock scope
  beforeEach(function () {
    module(function($provide){ // to inject mock objects to controller
      $provide.value('player', playerMock);
    });
    inject(function($controller, $rootScope, $compile){
      scope = $rootScope.$new();
      compile = $compile;
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
  it('should have index equal zero', function () {
    expect(audioCtrl.index).toBe(0);
  });
  it('should be playing The golden age', function () {
    audioCtrl.play();
    expect(audioCtrl.filename).toBe('The golden age');
  });
  it('should be playing The Bload I bled', function () {
    audioCtrl.index = 0;
    audioCtrl.move();
    expect(audioCtrl.filename).toBe('The golden age');
  });
});
