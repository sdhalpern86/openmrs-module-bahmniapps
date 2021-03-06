'use strict';

angular.module('bahmni.common.displaycontrol.drugOrderDetails')
    .directive('drugOrderDetails', ['TreatmentService', 'spinner', 'treatmentConfig', '$q', function (treatmentService, spinner, treatmentConfig, $q) {
        var controller = function ($scope) {

            var init = function () {
                return $q.all([treatmentService.getAllDrugOrdersFor($scope.patient.uuid, $scope.section.dashboardParams.drugConceptSet, undefined, undefined, $scope.enrollment),
                    treatmentConfig()])
                    .then(function (results) {
                        var createDrugOrder = function (drugOrder) {
                            var treatmentConfig = results[1];
                            return Bahmni.Clinical.DrugOrderViewModel.createFromContract(drugOrder, treatmentConfig);
                        };
                        var drugOrderResponse = results[0];
                        var drugOrders = drugOrderResponse.map(createDrugOrder);
                        $scope.drugOrders = sortOrders(drugOrders);
                    });
            };

            $scope.columnHeaders = [
                "DRUG_DETAILS_DRUG_NAME",
                "DRUG_DETAILS_DOSE_INFO",
                "DRUG_DETAILS_ROUTE",
                "DRUG_DETAILS_FREQUENCY",
                "DRUG_DETAILS_START_DATE",
                "DRUG_DETAILS_ADDITIONAL_INSTRUCTIONS"
            ];

            $scope.showDetails = false;
            $scope.toggle = function (drugOrder) {
                drugOrder.showDetails = !drugOrder.showDetails;
            };

            var sortOrders = function(response){
                var drugOrderUtil = Bahmni.Clinical.DrugOrder.Util;
                var sortedDrugOrders = [];
                if($scope.section.dashboardParams.showOnlyActive) {
                    var activeAndScheduled = _.filter(response, function (order) {
                        return order.isActive() || order.isScheduled();
                    });
                    sortedDrugOrders.push(drugOrderUtil.sortDrugOrdersInChronologicalOrder(activeAndScheduled));
                }else{
                    sortedDrugOrders.push(drugOrderUtil.sortDrugOrdersInChronologicalOrder(response));
                }
                return _.flatten(sortedDrugOrders);
            };

            spinner.forPromise(init());
        };
        return {
            restrict: 'E',
            controller: controller,
            scope: {
                section: "=",
                patient: "=",
                enrollment: "="
            },
            templateUrl: "../common/displaycontrols/drugOrderDetails/views/drugOrderDetails.html"
        };
    }]);
