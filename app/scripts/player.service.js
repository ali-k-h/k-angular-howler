/**
 * Created by Ali on 11/2/2016.
 */

angular.module('kAngularHowlerApp')
  .factory('player', [
    function () {
      'use strict';
      var safeCb = function(cb) {
        return (angular.isFunction(cb)) ? cb : angular.noop;
      };
      return {
        play: function (index, _playlist, volume, options) {
          var sound;
          var data;
          var currentHowlObj;
          index = typeof index === 'number' ? index : 0;
          if (index < 0 || !_playlist || _playlist.length === 0 ||
            index >= _playlist.length) {
            return;
          }
          data = _playlist[index];
          /** If we already loaded this track, use the current one.
           Otherwise, setup and load a new Howl.*/
          if (data.howl) {
            sound = data.howl;
          }
          else {
            currentHowlObj = data.howl = sound = new Howl({
              src: data.src,
             // volume: self.volume,
              html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
              onplay: function(){
                safeCb(options.onplayCallback)(data)
              },
              onload: function(){
                safeCb(options.onloadCallback)(currentHowlObj)
              },
              onloaderror: safeCb(options.onerrorCallback),
              onend: safeCb(options.onendCallback),
              onpause: safeCb(options.onpauseCallback),
              onstop: safeCb(options.onstopCallback),
              onseek: safeCb(options.onseekCallback)
            });
          }
          return {
            data:data,
            soundId:sound.play(),
            currentHowlObj:currentHowlObj
          };
        },
        pause: function (index, soundId, _playlist) {
          if (_playlist[index] && _playlist[index].howl) {
            _playlist[index].howl.pause(soundId);
          }
        },
        stop: function (index, soundId, _playlist) {
          try {
            if (_playlist && _playlist[index].howl) {
              _playlist[index].howl.stop(soundId);
            }
          }
          catch (e) {
          }
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
          Howler.unload();
        }
      };
    }]);
