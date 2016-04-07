(function() {
    
    angular.module('Module_Main', ['door3.css']);
    
  
    // Main controller
    function CTRL_Main($scope) {
        $scope.route = 'home'; // default route

        // Search function to filter
        $scope.filter_fun = function() {
            this.filterData('search', this.filter_text);
        }
        
        // Function to launch an error
        $scope.test_error = function() {
            $scope.route = 'err';
            this.filterData('error', 'true');
        }        
    }


    // Directive <profileList>
    function CTRL_SuperheroList() {
        var directive = {};
        directive.restrict     = 'EA';
        directive.templateUrl  = 'templates/superherolist.html';
        directive.css          = ['templates/superherolist.css'];
        directive.controllerAs = 'CTRL_SuperheroList';
        directive.controller   = function ($scope, $http) {
            var vm = this;
            var data_url = 'https://athena-7.herokuapp.com/ancients.json';
            var last_search = { param: null, value: null }
          
            vm.error_state = false;
            vm.error_text = '';
            vm.superheroes = [];

            
            // Function to cancel error (and reload all data)
            vm.cancel_error = function() {
                vm.error_state = false;
                vm.error_text = '';
                vm.loadData();
            };
          
          
            // Loading the whole data
            vm.loadData = function() {
                console.log('loading data');
                last_search = { param: null, value: null };
                $http.get(data_url).then(load_response, error_response);
            };
          
            // Reset the search filter
            vm.reset_search = function() {
                $scope.filter_text = '';
                vm.loadData();
            }
          
          
            // Reload data filtering (search function) --> (launched by Main controller)
            $scope.$parent.filterData = function(param, value) {
                console.log('searching : ' + param + ', ' + value);
                var url = data_url;
                
                // Prevent to launch the same filter again
                if (last_search.param == param && last_search.value == value) {
                    console.log('Using the loaded data');
                } else {
                    console.log('Filtering data');
                    last_search = { param: param, value: value };
                    if (value) url += '?' + param + '=' + value;
                    $http.get(url).then(load_response, error_response);
                    console.log(last_search);
                }
            };
            
            
            // Function to call after a correct response in the request
            var load_response = function(response) {
                vm.error_state = false;
                vm.error_text = '';              
                if (response.status == 200 && response.statusText == "OK") {
                    if (response.data.hasOwnProperty('ancients'))  vm.superheroes = response.data.ancients;
                    else                                           vm.superheroes = response.data;
                    console.log('data loaded');
                } else {
                    console.log('error data response: ' + response.statusText);
                }
            };

            
            // Function to call after an error in the request
            var error_response = function(response) {
                vm.error_state = true;
                vm.error_text = response.data.error;
                console.log('error loading data');
                console.log(response);
            };

            
        };
        
        return directive;
    }

  
  
    // Filter to capitalize an string
    function FilterCapitalize() {
        return function(input, all) {
          var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
          return (!!input) ? input.replace(reg, function(txt) {
                                                   return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                                }) : '';
        }
    };

    
  
    // Assign the components to the module
    angular.module('Module_Main')
        .controller('CTRL_Main', CTRL_Main)
        .directive('superheroList', CTRL_SuperheroList)
        .filter('capitalize', FilterCapitalize);



})();
