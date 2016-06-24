(function($, angular) {

	angular.module('HomeCtrl', [])
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

			$scope.createRoom = function(name) {

				$http.post('/api/v1/create/room', {name: name})
					.success(function(data) {
						$scope.otherRooms = $scope.otherRooms.concat(data);
					})
					.error(function() {					
						// handle error
					});
			};

			$scope.joinRoom = function(room) {

				$http.put('/api/v1/join/' + room._id)
					.success(function(data) {
						$scope.joinedRooms = $scope.joinedRooms.concat(room);
						$scope.otherRooms = $scope.otherRooms.filter(function(other) {
							return other._id !== room._id;
						});
					})
					.error(function() {					
						// handle error
					});				
			};

			$scope.leaveRoom = function(room) {

				$http.put('/api/v1/leave/' + room._id)
					.success(function(data) {
						
						$scope.otherRooms = $scope.otherRooms.concat(room);
						$scope.joinedRooms = $scope.joinedRooms.filter(function(room) {
							return data._id !== room._id;
						});
					})
					.error(function() {					
						// handle error
					});
			};

		}]);

})(jQuery, angular)
