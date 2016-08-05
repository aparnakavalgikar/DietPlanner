'use strict';

var app = angular.module('dietApp', ['ngRoute',
									 'ngResource']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/create/profile', {
			templateUrl: 'views/create-profile.html',
			controller: 'ProfileAddCtrl'
		})
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		})
		.when('/crud/dietplans', {
			templateUrl: 'views/crud-diets.html',
			controller: 'DietCtrl'
		})
});

app.factory("UserFactory", function ($resource) {
	return $resource("http://localhost:3000/user/:id", null, {
		update: {
			method: 'PUT'
		}
	});
});

app.service('UserService', function (UserFactory, $routeParams, $q) {

	var self = {

		'users': [],
		'lgdInUser': null,
		'isProfile': false,
		
		'setLgdInUser': function (user) {
			self.lgdInUser = user;
		},
		'getUsers': function() {
			UserFactory.query({}, function (userFactory) {
				self.users = userFactory;
			});
		},
		'createUser': function(user) {
			var d = $q.defer();
			UserFactory.save(user).$promise.then(function() {
				d.resolve();
			});
			return d.promise;
		},
		'updateUser': function(user) {
			var d = $q.defer();
			
			self.lgdInUser.height = user.height;
			self.lgdInUser.weight = user.weight;
			self.lgdInUser.age = user.age;
			self.lgdInUser.gender = user.gender;
			self.lgdInUser.body = user.body;
			self.lgdInUser.foodtype = user.foodtype;
			self.lgdInUser.exhealth = user.exhealth;
			self.lgdInUser.goaltype = user.goaltype;
			self.lgdInUser.goalweight = user.goalweight;
			self.lgdInUser.isProfile = user.isProfile;
			
			user = self.lgdInUser;

			user.$update({id: self.lgdInUser._id }).then(function() {
				d.resolve();
				self.isProfile = true;
			});
			return d.promise;
		}
	};
	self.getUsers();
	return self;
});

app.factory("DietFactory", function ($resource) {
	return $resource("http://localhost:3000/diet/:id", null, {
		update: {
			method: 'PUT'
		}
	});
});

app.service('DietService', function (DietFactory, $routeParams, $q) {

	var self = {

		'diets': [],
		
		'getDiets': function(diet) {
			DietFactory.query({}, function (dietFactory) {
				self.diets = dietFactory;
			});
		},
		'createDiet': function(diet) {
			var d = $q.defer();
			DietFactory.save(diet).then(function() {
				d.resolve();
			});
			return d.promise;
		},
		'updateDiet': function(dietype) {
			var d = $q.defer();
			angular.forEach($scope.dietsList.diets, function(diet) {
				if ( diet.foodtype == dietype.foodtype && diet.goaltype == diet.goaltype ) {
					var diet_id = diet._id;
				}
			});
			
			diet.$update({id: diet_id }).then(function() {
				d.resolve();
			});
			return d.promise;
		}
	};
	self.getDiets();
	return self;
});

app.controller('LoginCtrl', function ($scope, $location, $route, UserService) {

	$scope.usersList = UserService;
	
	$scope.onSignIn = function() {
		
		var bmatch = false;
		
		if ( $scope.loginUsername == "admin" ) {
			if ( $scope.loginPassword == "admin" ) {
				$location.path('/crud/dietplans');
			}
			else {
				$scope.lerror = "Please enter correct Password";
			}
		}
		else {
			angular.forEach($scope.usersList.users, function(user) {
				
				if ( $scope.loginUsername == user.username ) {
					bmatch = true;
				}
				if (bmatch) {
					if ( $scope.loginPassword == user.password ) {
						bmatch = true;
						$scope.usersList.setLgdInUser(user);
					}
					else {
						$scope.lerror = "Please enter correct Password";
					}
				}
			});			
		}
		
		if (bmatch) {
			if ($scope.usersList.lgdInUser.isProfile == "true")
				$location.path('/home');
			else 
				$location.path('/create/profile');
		}
		else {
			$scope.lerror = "Please enter correct Username";
		}
	}
	
	$scope.onSignUp = function() {

		if ( $scope.newPassword != $scope.newCPassword ) {
			$scope.rerror = "Password is not Matching, Please re-enter"
		}
		else {
			$scope.user = { 
							username: $scope.newUsername, 
							password: $scope.newPassword,
							height: null,
							weight: null,
							age: null,
							gender: null,
							body: null,
							foodtype: null,
							exhealth: null,
							goaltype: null,
							goalweight: null,
							isProfile: false
						};
			
			$scope.usersList.createUser($scope.user).then( function () {
				$location.path('/');
				$scope.message = "User added successfully";
			});
		}
	}
});

app.controller('ProfileAddCtrl', function ($scope, $location, UserService) {

	$scope.usersList = UserService;
	$scope.gender = "male";
	$scope.showMale = true;
	
	$scope.showBody = function () {
		if ($scope.gender == "male"){
			$scope.showMale = true;
			$scope.showFemale = false;		
		}
		else if ($scope.gender == "female") {
			$scope.showMale = false;
			$scope.showFemale = true;
		}
	}
		
	$scope.exhealth = "diabetes";
	
	$scope.saveProfile = function () {
		
		var body;
		
		if ($scope.menBodyShape) {
			body = $scope.menBodyShape;
		}
		else if ($scope.womenBodyShape) {
			body = $scope.womenBodyShape;
		}

		$scope.user = { 
			height: $scope.height,
			weight: $scope.weight,
			age: $scope.age,
			gender: $scope.gender,
			body: body,
			foodtype: $scope.foodtype,
			exhealth: $scope.exhealth,
			goaltype: $scope.goaltype,
			goalweight: $scope.goalweight,
			isProfile: true
		};
		
		$scope.usersList.updateUser($scope.user).then( function () {
			$scope.message = "Profile is saved successfully";
			$location.path('/home');
		});
	}
	
});

app.controller('HomeCtrl', function ($scope, $location, $route, UserService) {
	
});

app.controller('DietCtrl', function ($scope, $location, $route, DietService) {
	
	$scope.showDiet = false;
	$scope.editDiet = true;
	$scope.button = "Edit Diet Plan";
	$scope.dietsList = DietService;
	
	$scope.onSubmit = function () {
		$scope.showDiet = true;
	}
	 
	$scope.editable = function () {
		$scope.editDiet = false;
		$scope.button = "Add Diet Plan";
	}
	
	$scope.updateDiet = function () {
		if ( $scope.button = "Add Diet Plan") {
			$scope.diet = {
				foodtype: $scope.foodtype,
				goaltype: $scope.goaltype,
				breakfast: {
					food: $scope.bfood,
					serving: $scope.bserv,
					cal: $scope.bcal
				},
				lunch: {
					food: $scope.lfood,
					serving: $scope.lserv,
					cal: $scope.lcal
				},
				snack: {
					food: $scope.sfood,
					serving: $scope.sserv,
					cal: $scope.scal
				},
				dinner: {
					food: $scope.dfood,
					serving: $scope.dserv,
					cal: $scope.dcal
				}
			};
			
			$scope.dietsList.createDiet($scope.diet).then( function () {
				$scope.message = "Diet is saved successfully";
				$location.path('/crud/diets');
			});			
		} else {
			$scope.dietype = {
				foodtype: $scope.foodtype,
				goaltype: $scope.goaltype
			}
			$scope.dietsList.updateDiet($scope.dietype).then( function () {
				$scope.message = "Diet is updated successfully";
				$location.path('/crud/diets');
			});			
			
		}
	}
});