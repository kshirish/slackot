(function($, angular) {

	angular.module('slackot')
		.controller('HomeController', ['$scope', '$http', function($scope, $http) {

			// fetch all rooms for this user
			$http.get('/api/v1/all/rooms', {params: {}})
				.success(function(data) {
					
					$scope.joinedRooms = data.joined;
					$scope.otherRooms = data.other;

				})
				.error(function() {					
					// handle error
				});

			$scope.createRoom = function() {

			};

			$scope.joinRoom = function() {

			};

			$scope.leaveRoom = function() {

			};

		}]);

})(jquery, angular)
