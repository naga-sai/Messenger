var app = angular.module("myapp", ["ngRoute"]);
//Config
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      template: "<h1>Welcome to root page</h1>"
    })
    .when("/home", {
      template: "<h1>Welcome to home page</h1>",
      resolve: [
        "authService",
        function(authService) {
          return authService.validate();
        }
      ]
    })
    .when("/messages", {
      templateUrl: "views/message.html",
      controller: "messageController",
      resolve: [
        "authService",
        function(authService) {
          return authService.validate();
        }
      ]
    })
    .when("/messages/:id", {
      templateUrl: "views/details.html",
      controller: "detailsController",
      resolve: [
        "authService",
        function(authService) {
          return authService.validate();
        }
      ]
    })
    .when("/register", {
      templateUrl: "views/register.html",
      controller: "registerController"
    })
    .when("/login", {
      templateUrl: "views/login.html",
      controller: "loginController"
    })
    .otherwise({
      template: "Invalid Url"
    });
});
//Message Controller Completed!
app.controller("messageController", function(
  $scope,
  $rootScope,
  $window,
  messageService,
  dataService
) {
  console.log("Mesages");
  $scope.showMsg = false;
  dataService
    .getUsers()
    .then(function(resp) {
      $scope.users = resp.data;
      // console.log("GET USERS CALLED!");
      // console.log($scope.users);
      $scope.newMessage = function() {
        $scope.showMsg = !$scope.showMsg;
      };
    })
    .catch(function(err) {
      $scope.users = [];
      console.log(err);
    });
  $scope.sendMessage = function() {
    var nmessage = {
      Sender: $scope.authUsername,
      Recepient: $scope.Recepient,
      Subject: $scope.subject,
      Message: $scope.body,
      important: false
    };
    // $rootScope.messages.push(nmessage);
    // $rootScope.urMsg = $rootScope.messages.filter(
    //   msg => msg.Recepient == $scope.authUsername
    // );
    dataService
      .saveMessage(nmessage)
      .then(function(resp) {
        console.log("Save");
        dataService.getMessages().then(function(res) {
          $rootScope.messages = res.data;
          $rootScope.urMsg = $rootScope.messages.filter(
            msg => msg.Recepient == $scope.authUsername
          );
          console.log("Ur msgs");
          console.log($rootScope.urMsg);
        });
        console.log($rootScope.messages);
        // $rootScope.$digest();
      })
      .catch(function(err) {
        $scope.users = [];
        console.log(err);
      });
  };

  $scope.authUsername = $window.localStorage.getItem("isLoggedIn")
    ? $window.localStorage.getItem("isLoggedIn")
    : "";

  dataService
    .getMessages()
    .then(function(resp) {
      $rootScope.messages = resp.data;
      console.log("GET messages CALLED!");
      console.log($rootScope.messages);
      $rootScope.urMsg = $rootScope.messages.filter(
        msg => msg.Recepient == $scope.authUsername
      );

      $scope.mark = function(id) {
        messageService.mark(id);
      };
      $scope.delMsg = function(id) {
        messageService.delMsg(id);
      };
    })
    .catch(function(err) {
      $rootScope.messages = [];
      console.log(err);
    });
});
//Details Cntroller Completed!
app.controller("detailsController", function(
  $scope,
  $rootScope,
  $routeParams,
  $location,
  $window,
  messageService,
  dataService
) {
  dataService
    .getMessages()
    .then(function(resp) {
      $scope.replyDiv = false;
      $scope.id = $routeParams.id;
      console.log($scope.id);
      $rootScope.messages = resp.data;
      // console.log("GET messages CALLED!");
      $scope.authUsername = $window.localStorage.getItem("isLoggedIn")
        ? $window.localStorage.getItem("isLoggedIn")
        : "";
      console.log($rootScope.messages);
      $rootScope.urMsg = $rootScope.messages.filter(
        msg => msg.Recepient == $scope.authUsername
      );
      console.log($rootScope.urMsg);
      $scope.currentMsg = $rootScope.urMsg[$scope.id];
      console.log($rootScope.urMsg[$scope.id]);

      $scope.mark = function(id) {
        console.log(id);
        messageService.mark(id);
      };
      $scope.backToMessages = function() {
        $location.path(["/messages"]);
      };
      $scope.showReply = function() {
        $scope.replyDiv = !$scope.replyDiv;
      };
      $scope.delMsg = function(id) {
        messageService.delMsg(id);
        dataService.getMessages().then(function(resp) {
          $rootScope.messages = resp.data;
          $location.path("/messages");
        });
      };
      $scope.replyMsg = function(id) {
        // $scope.authUsername = $window.localStorage.getItem("isLoggedIn");
        // console.log($scope.authUsername);
        // console.log($rootScope.urMsg[id]);
        var nmessage = {
          Sender: $scope.authUsername,
          Recepient: $rootScope.urMsg[id].Sender,
          Subject: $rootScope.urMsg[id].Subject,
          Message: $scope.reply,
          important: false
        };
        dataService.saveMessage(nmessage).then(function(res) {
          $rootScope.urMsg = $rootScope.messages.filter(
            msg => msg.Recepient == $scope.authUsername
          );
        });
      };
    })
    .catch(function(err) {
      $rootScope.messages = [];
      console.log(err);
    });

  // $scope.currentMsg = $rootScope.urMsg[$scope.id];
});
// Register Controller Completed!
app.controller("registerController", function(
  $scope,
  $rootScope,
  $window,
  $location,
  dataService
) {
  dataService
    .getUsers()
    .then(function(resp) {
      $rootScope.users = resp.data;
      // console.log("GET USERS CALLED!");
      // console.log($scope.users);
    })
    .catch(function(err) {
      $rootScope.users = [];
      console.log(err);
    });

  // $rootScope.users = $window.localStorage.getItem("users")
  //   ? JSON.parse($window.localStorage.getItem("users"))
  //   : [];
  $scope.register = function() {
    var user = {
      username: $scope.username,
      password: $scope.password,
      firstName: $scope.fname,
      lastName: $scope.lname,
      phone: $scope.phone,
      gender: $scope.gender
    };

    dataService
      .saveUser(user)
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
    // $rootScope.users.push(user);
    // $window.localStorage.setItem("users", JSON.stringify($rootScope.users));
    // console.log("registered!");
    $location.path(["/login"]);
  };
});
// Login Controller Completed!
app.controller("loginController", function(
  $scope,
  $window,
  $location,
  $rootScope,
  dataService
) {
  $scope.invalid = false;
  $scope.login = function() {
    dataService
      .getUsers()
      .then(function(resp) {
        $rootScope.users = resp.data;
        console.log("login USERS CALLED!");
        console.log($rootScope.users);
        $rootScope.auth = $rootScope.users.filter(
          user =>
            $scope.username == user.username && $scope.password == user.password
        );
        if ($rootScope.auth.length) {
          $window.localStorage.setItem(
            "isLoggedIn",
            $rootScope.auth[0].username
          );
          $rootScope.loggedIn = true;
          $location.path(["/home"]);
          $scope.$emit("nav", $rootScope.auth);
        } else {
          $scope.invalid = true;
        }
      })
      .catch(function(err) {
        $rootScope.users = [];
        console.log("error");
      });
  };
});
// Message Service
app.factory("messageService", function($rootScope, $window, dataService) {
  return {
    mark: function(id) {
      const _id = $rootScope.urMsg[id]._id;
      console.log(_id);
      $rootScope.urMsg[id].important = !$rootScope.urMsg[id].important;
      console.log(id);
      dataService
        .updateMessage(_id, { important: $rootScope.urMsg[id].important })
        .then(function(resp) {
          console.log();
          console.log($rootScope.urMsg[id].important);
        })
        .catch();
      // $window.localStorage.setItem(
      //   "messages",
      //   JSON.stringify($rootScope.messages)
      // );
    },
    delMsg: function(id) {
      console.log(id);
      var del = $rootScope.urMsg.splice(id, 1);
      console.log(del[0]);
      console.log(del[0]._id);
      dataService
        .deleteMessage(del[0]._id)
        .then(function(resp) {
          console.log(resp.data);
          // $rootScope.messages = $rootScope.messages.filter(msg => msg !== del[0]);
        })
        .catch();

      // $window.localStorage.setItem(
      //   "messages",
      //   JSON.stringify($rootScope.messages)
      // );
    }
  };
});
// Auth Service
app.factory("authService", function($window, $location, $timeout) {
  return {
    validate: function() {
      if (!$window.localStorage.getItem("isLoggedIn")) {
        $location.path(["/login"]);
      }
    }
  };
});
// Data Service
app.factory("dataService", function($http) {
  return {
    getUsers: function() {
      return $http.get("http://localhost:3000/api/user/getAllUsers");
    },
    getMessages: function() {
      return $http.get("http://localhost:3000/api/message/getAllMessages");
    },
    saveUser: function(data) {
      return $http.post("http://localhost:3000/api/user/saveUser", data);
    },
    saveMessage: function(data) {
      return $http.post("http://localhost:3000/api/message/saveMessage", data);
    },
    deleteMessage: function(id) {
      return $http.delete("http://localhost:3000/api/message/delete/" + id);
    },
    updateMessage: function(id, data) {
      return $http.put(
        "http://localhost:3000/api/message/updateMessage/" + id,
        data
      );
    }
  };
});

// Nav Custom Directive
app.directive("navDirective", function($rootScope, $window, $location) {
  return {
    template: `
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">Messenger</a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item" ng-class="{ active: isActive('/home')}" ng-show="loggedIn">
                <a class="nav-link " href="#/home">Home</a>
              </li>
              <li class="nav-item" ng-class="{ active: isActive('/messages')}" ng-show="loggedIn">
                <a class="nav-link" href="#/messages">Messages</a>
              </li>
              <li class="nav-item"  ng-show="loggedIn">
                <a class="nav-link" href="#/login" ng-click="logout()"
                  >Logout</a
                >
              </li>
              <li class="nav-item" ng-class="{ active: isActive('/login')}" ng-hide="loggedIn">
                <a class="nav-link" href="#/login">Login</a>
              </li>
              <li class="nav-item" ng-class="{ active: isActive('/register')}" ng-hide="loggedIn">
                <a class="nav-link" href="#/register">Register</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    `,
    restrict: "E",
    scope: true,
    link: function(scope, elem, attr) {
      scope.isActive = function(viewLocation) {
        // console.log(viewLocation);
        // console.log(viewLocation === $location.path());
        return viewLocation == $location.path();
      };
      $rootScope.loggedIn = false;
      // Log out functionality
      scope.logout = function() {
        console.log("logout");
        $rootScope.loggedIn = false;
        $window.localStorage.removeItem("isLoggedIn");
      };
    }
  };
});
