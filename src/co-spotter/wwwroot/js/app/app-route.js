angular.module('app-route', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('/otherwise');

        $stateProvider
            .state('otherwise', {
                url: '/otherwise',
                controller: function () {
                    var lastProject = window.localStorage.getItem('last-project');
                    console.log(lastProject);

                    window.location.href = '#!/dashboard/' + lastProject + '/all'
                }
            })
            .state('construction', {
                url: "/construction/:plan_id",
                controller: 'constructionController',
                templateUrl: "/App/Construction"
            })
                .state('construction.plan-navigation', {
                    url: '/plan-navigation',
                    controller: 'planNavigationController',
                    templateUrl: '/App/PlanNavigation'
                })
                .state('construction.note-navigation', {
                    url: '/note-navigation',
                    controller: 'noteNavigationController',
                    templateUrl: '/App/NoteNavigation'
                })
                .state('construction.zone-notes', {
                    url: '/:zone_id',
                    controller: 'zoneController',
                    templateUrl: '/App/ZoneNotes'
                })
            .state('dashboard', {
                url: '/dashboard/:project_id',
                controller: 'dashboardController',
                templateUrl: '/Dashboard'
            })
                .state('dashboard.all', {
                    url: '/all',
                    controller: 'dashboardAllController',
                    templateUrl: '/Dashboard/All'
                })
                .state('dashboard.plans', {
                    url: '/plans',
                    controller: 'dashboardPlansController',
                    templateUrl: '/Dashboard/Plans'
                })
                .state('dashboard.notes', {
                    url: '/notes',
                    controller: 'dashboardNotesController',
                    templateUrl: '/Dashboard/Notes'
                })
                .state('dashboard.images', {
                    url: '/images',
                    controller: 'dashboardImagesController',
                    templateUrl: '/Dashboard/Images'
                })
            .state('manage', {
                url: '/manage',
                controller: 'manageController',
                templateUrl: '/App/Manage'
            })
                .state('manage.project', {
                    url: '/project/:project_id',
                    controller: 'manageProjectController',
                    templateUrl: '/App/Manage/Project'
                })

                .state('manage.plan', {
                    url: '/project/:project_id/plans',
                    controller: 'managePlanController',
                    templateUrl: '/App/Manage/Project/Plan'
                })
                .state('manage.zonetype', {
                    url: '/project/:project_id/zone-types',
                    controller: 'manageZoneTypeController',
                    templateUrl: '/App/Manage/Project/ZoneType'
                })
                .state('manage.department', {
                    url: '/project/:project_id/departments',
                    controller: 'manageDepartmentController',
                    templateUrl: '/App/Manage/Project/Department'
                })
                .state('manage.staff', {
                    url: '/project/:project_id/staffs',
                    controller: 'manageStaffController',
                    templateUrl: '/App/Manage/Project/Staff'
                });

    }]);