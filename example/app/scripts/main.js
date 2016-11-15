'use strict';

/**
 * @ngdoc function
 * @name kAngularHowlerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kAngularHowlerApp
 */
angular.module('kAngularHowlerAppExample')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var self = this;
    var _image= 'https://s3.amazonaws.com/sonicassetsqa/files/71ca979f-8064-4d20-85b7-fc8c54cfabae1476340342881_sp.jpg';
    self.playlist =
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
  });
