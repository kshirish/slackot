(function($, angular) {

	angular.module('slackot')
		.controller('RoomController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

			// room
			$scope.room = $routeParams.room;

			// notifications for this room
			$http.get('/api/v1/notifications/' + $scope.room, {params: {}})
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

   			$scope.sendNotification = function(content) {

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

})(jquery, angular)
