(function(window, undef){

  var angular = window.angular;

  if (angular !== undef) {

    var module = angular.module('kii-angular', []);

    module.run(['$q', '$window', function($q, $window){


      // Process only if Kii exist on the global window, do nothing otherwise
      if (!angular.isUndefined($window.KiiUser)){ 

        // Keep a handy local reference
        var KiiUser = $window.KiiUser;


        var Kii = {
          KiiUser: $window.KiiUser
        } 
        //-------------------------------------
        // Structured object of what we need to update
        //-------------------------------------

        var methodsToUpdate = {
          "KiiACL":{
            prototype: [],
            static: []
          },
          "KiiACLEntry":{
            prototype: [''],
            static: ['']
          },
          "KiiAnonymousUser":{
            prototype: [''],
            static: ['']
          },
          "KiiAnyAuthenticatedUser":{
            prototype: [''],
            static: ['']
          },
          "KiiAppAdminContext":{
            prototype: [''],
            static: ['']
          },
          "KiiBucket":{
            prototype: [''],
            static: ['']
          },
          "KiiClause":{
            prototype: [''],
            static: ['']
          },
          "KiiGeoPoint":{
            prototype: [''],
            static: ['']
          },
          "KiiGroup":{
            prototype: [''],
            static: ['']
          },
          "KiiObject":{
            prototype: ['delete','deleteBody','downloadBody','moveBody','publishBody','publishBodyExpiresAt','refresh','save','saveAllFields','uploadBody'],
            static: ['']
          },
          "KiiQuery":{
            prototype: [''],
            static: ['']
          },
          "KiiSocialConnect":{
            prototype: [''],
            static: ['']
          },
          "KiiUser": {
            prototype: ['register'],
            static: ['userWithUsername']
          }
        }

        //// Let's loop over Kii objects
        for (var k in methodsToUpdate) {

          var currentClass = k;
          var currentObject = methodsToUpdate[k];

          var currentProtoMethods = currentObject.prototype;
          var currentStaticMethods = currentObject.static;


          /// Patching prototypes
          currentProtoMethods.forEach(function(method){

            var origMethod = Kii[currentClass].prototype[method];

            // Overwrite original function by wrapping it with $q
            Kii[currentClass].prototype[method] = function() {
               var defer = $q.defer();
              origMethod.apply(this, arguments)
                  .then(function(data){
                      defer.resolve(data);
                  }, function(err){
                      defer.reject(err);
                  });
              return defer.promise; 
            };

          });
        }
      }

    }]);
  }

})(this);