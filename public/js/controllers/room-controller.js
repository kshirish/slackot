(function($, angular) {

	angular.module('RoomCtrl', [])
		.controller('RoomController', ['$scope', '$http', '$routeParams', '$sessionStorage', function($scope, $http, $routeParams, $sessionStorage) {

			var socket = io.connect('http://localhost:9999');

		    socket.on('message', function(message) {
		        // handle the message
		    });

			// room
			$scope.roomId = $routeParams.roomId;

			// users for this room
			$http.get('/api/v1/all/users/' + $scope.roomId, {params: {}})
				.success(function({users}) {					
					$scope.users = users;
				})
				.error(function() {					
					// handle error
				});

			// notifications for this room
			$http.get('/api/v1/all/notifications/' + $scope.roomId, {params: {}})
				.success(function({notifications}) {					
					$scope.notifications = notifications;
				})
				.error(function() {					
					// handle error
				});

   			$scope.sendNotification = function(content) {

   				socket.emit('notification', {
   					content: content,
   					roomId: $scope.roomId,
   					username: $sessionStorage.username
   				});
   				
   				$scope.notifications = $scope.notifications({
   					created: (new Date()).toISOString(),
   					username: $sessionStorage.username,
   					content: content	
   				})

				$http('/api/v1/notifications/' + $scope.room, {params: {}})
					.success(function(notifications) {
						
						// handle data
						var users;

						$scope.users = [];
						$scope.notifications = notifications;
						users = $scope.notifications.map(function(notification) {
							return notification.username;
						});

						// set unique users
						users.forEach(function (user) {
						    if ($scope.users.indexOf(user) === -1) {
						        $scope.users.push(user);
						    }
						});

					})
					.error(function() {					
						// handle error
					});
			};

		}]);

})(jQuery, angular)
