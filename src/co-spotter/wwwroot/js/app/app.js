angular.module('app',
    [
     /*Route Config*/
     'app-route',
     /*Controllers*/
     'main-controller',
     'construction-controller',
     'plan-navigation-controller',
     'note-navigation-controller',
     'zone-controller',

     'manage-controller',
     'manage-project-controller',
     'manage-plan-controller',
     'manage-department-controller',
     'manage-staff-controller',
     'manage-zone-type-controller',

     'dashboard-controller',
     'dashboard-all-controller',
     'dashboard-notes-controller',
     'dashboard-plans-controller',
     'dashboard-images-controller',
     /*Services*/
     'app-service',
     'dashboard-service'
    ]);