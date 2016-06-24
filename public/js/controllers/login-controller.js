(function($, angular) {

	angular.module('LoginCtrl', [])
		.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$sessionStorage', function($scope, $rootScope, $http, $location, $sessionStorage) {

			$rootScope.loginPage = true;

			$scope.login = function(username, password) {

				var info = {
					username: username || username.trim(),
					password: password || password.trim()
				};

				if(!info.username || !info.password) {return;}

				// authenticate the user
				$http.post('/api/v1/login', info)
					.success(function(data) {
						
						if(data.success) {

							$sessionStorage.username = info.username;
							$location.url('/home');
						}
					})
					.error(function() {					
						// handle error
					});				
			};


			$scope.signup = function(username, password) {

				var info = {
					username: username || username.trim(),
					password: password || password.trim()
				};

				if(!info.username || !info.password) {return;}

				// authenticate the user
				$http.post('/api/v1/signup', info)
					.success(function(data) {
						// handle data
					})
					.error(function() {					
						// handle error
					});
			};

		}]);

})(jQuery, angular)
