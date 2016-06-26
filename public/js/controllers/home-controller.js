(function($, angular) {

	angular.module('HomeCtrl', [])
		.controller('HomeController', ['$scope', '$http', '$window', function($scope, $http, $window) {

			var config = {
				params: {},
				headers: {
					'x-access-token': $window.sessionStorage.getItem('token')
				}
			};

			// fetch all rooms for this user
			$http.get('/api/v1/all/rooms', config)
				.success(function(data) {
					
					if(data.success) {

						$scope.joinedRooms = data.joined;
						$scope.otherRooms = data.other;
						$scope.isError = false;
						$scope.message = null;

					} else {
						
						$scope.isError = true;
						$scope.message = data.message;
					}
				});

			$scope.createRoom = function(name) {

				$http.post('/api/v1/create/room', {name: name}, config)
					.success(function(data) {
						
						if(data.success) {
						
							$scope.otherRooms = $scope.otherRooms.concat(data);
							$scope.isError = false;
							$scope.message = null;
						
						} else {

							$scope.isError = true;
							$scope.message = data.message;
						}						
					});
			};

			$scope.setup = function(name) {

				$http.post('/api/v1/setup', {}, config)
					.success(function(data) {
						
						if(data.success) {
						
							$window.location.reload();

						} else {

							$scope.isError = true;
							$scope.message = data.message;
						}						
					});
			};

			$scope.joinRoom = function(room) {

				$http.put('/api/v1/join/' + room._id, {}, config)
					.success(function(data) {
					
						if(data.success) {

							$scope.joinedRooms = $scope.joinedRooms.concat(room);
							$scope.otherRooms = $scope.otherRooms.filter(function(other) {
								return other._id !== room._id;
							});

							$scope.isError = false;
							$scope.message = null;

						} else {

							$scope.isError = true;
							$scope.message = data.message;
						}
					});				
			};

			$scope.leaveRoom = function(room) {

				$http.put('/api/v1/leave/' + room._id, {}, config)
					.success(function(data) {
					
						if(data.success) {

							$scope.otherRooms = $scope.otherRooms.concat(room);
							$scope.joinedRooms = $scope.joinedRooms.filter(function(room) {
								return data._id !== room._id;
							});

							$scope.isError = false;
							$scope.message = null;

						} else {

							$scope.isError = true;
							$scope.message = data.message;
						}
					});
			};

		}]);

})(jQuery, angular)
