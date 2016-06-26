(function($, angular) {

	angular.module('RoomCtrl', [])
		.controller('RoomController', ['$scope', '$http', '$routeParams', '$window', function($scope, $http, $routeParams, $window) {

			var config = {
				params: {},
				headers: {
					'x-access-token': $window.sessionStorage.getItem('token')
				}
			};

			var socket = io.connect('http://localhost:9999');

			socket.emit('little_newbie', $window.sessionStorage.getItem('username'));

		    socket.on('notification_from_server', function(message) {
		        console.log('Server: ' + message);
		    });

			// room
			$scope.roomId = $routeParams.roomId;

			// roomname
			$http.get('/api/v1/room/' + $scope.roomId, config)
				.success(function(data) {				

					if(data.success) {

						$scope.roomname = data.roomname;
						$scope.isError = false;
						$scope.message = null;

					} else {
						
						$scope.isError = true;
						$scope.message = data.message;
					}	
				});

			// users for this room
			$http.get('/api/v1/all/users/' + $scope.roomId, config)
				.success(function(data) {				

					if(data.success) {

						$scope.users = data.users;
						$scope.isError = false;
						$scope.message = null;

					} else {
						
						$scope.isError = true;
						$scope.message = data.message;
					}	
				});

			// notifications for this room
			$http.get('/api/v1/all/notifications/' + $scope.roomId, config)
				.success(function(data) {					
				
					if(data.success) {
						
						$scope.notifications = data.notifications;
						$scope.isError = false;
						$scope.message = null;
					
					} else {

						$scope.isError = true;
						$scope.message = data.message;
					}					
				});

   			$scope.sendNotification = function(content) {

   				socket.emit('notification', {
   					content: content,
   					roomId: $scope.roomId,
   					username: $window.sessionStorage.getItem('username')
   				});
   				
   				$scope.notifications = $scope.notifications.concat({
   					created: (new Date()).toISOString(),
   					username: $window.sessionStorage.getItem('username'),
   					content: content	
   				});

   				// clear the textbox
   				$scope.content = '';
			};

		}]);

})(jQuery, angular)
