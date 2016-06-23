(function($, angular) {

	angular.module('slackot')
		.controller('LoginController', ['$scope', '$http', function($scope, $http) {

			$scope.login = function(username, password) {

				var info = {
					username: username,
					password: password
				};

				// authenticate the user
				$http.get('/api/v1/login', {params: info})
					.success(function(data) {
						// handle data
					})
					.error(function() {					
						// handle error
					});				
			};


			$scope.signup = function() {

				var info = {
					username: username,
					password: password
				};

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

})(jquery, angular)
