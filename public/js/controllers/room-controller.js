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

			socket.emit('joined a room', {
				username: $window.sessionStorage.getItem('username'),
				roomId: $routeParams.roomId
			});

		    socket.on('personal message from server', function(message) {
		        console.log('Server: ' + message);
		    });

		    socket.on('broadcast message from server', function(data) {
		        
		        switch(data.type) {

		        	case 'online': 	$scope.users.forEach(function(user) {		        	
							        	user.isOnline = data.clients.indexOf(user.username) !== -1;
							        });

		        					break;

		        	case 'room'  :	$scope.notifications = $scope.notifications.concat({
					   					created: (new Date()).toISOString(),
					   					username: data.username,
					   					content: data.content	
					   				});			

		        					break;
		        }

		        $scope.$apply();
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

			$window.onbeforeunload = function (e) {

				// socket.emit('left a room', {
				// 	roomId: $routeParams.roomId
				// });
			};

   			$scope.sendNotification = function(content) {

   				socket.emit('message from client', {
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
