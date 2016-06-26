(function($, angular) {

	angular.module('LoginCtrl', [])
		.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$window', function($scope, $rootScope, $http, $location, $window) {

			var config = {
				headers: {
					'x-access-token': $window.sessionStorage.getItem('token')
				}
			};

			$scope.login = function(username, password) {

				var info = {
					username: username || username.trim(),
					password: password || password.trim()
				};

				if(!info.username || !info.password) {return;}

				// authenticate the user
				$http.post('/api/v1/login', info, config)
					.success(function(data) {
						
						if(data.success) {

							$scope.isError = false;
							$scope.message = null;
							$window.sessionStorage.setItem('token', data.token);
							$window.sessionStorage.setItem('username', info.username);
							$location.url('/home');

						} else {

							$scope.isError = true;
							$scope.message = data.message;
						}
					});
			};


			$scope.signup = function(username, password) {

				var info = {
					username: username || username.trim(),
					password: password || password.trim()
				};

				if(!info.username || !info.password) {return;}

				// authenticate the user
				$http.post('/api/v1/signup', info, config)
					.success(function(data) {
						
						if(data.success) {

							$scope.isError = false;
							$scope.message = data.message;

						} else {

							$scope.isError = true;
							$scope.message = data.message;
						}
					});
			};

		}]);

})(jQuery, angular)
