'use strict';

angular.module('bahmni.common.offline')
    .factory('offlineReferenceDataInitialization', ['offlineService','$http', 'offlineDbService', 'androidDbService', '$q', 'referenceDataDbService',
        function (offlineService, $http, offlineDbService, androidDbService, $q, referenceDataDbService) {
            return function (offlineDb, isAuthenticated) {
                referenceDataDbService.init(offlineDb);
                if(offlineService.isOfflineApp()) {
                    if (offlineService.isAndroidApp()) {
                        offlineDbService = androidDbService;
                    }
                    var referenceDataMap;
                    referenceDataMap = isAuthenticated ?
                                                angular.extend(Bahmni.Common.Constants.authenticatedReferenceDataMap,
                                                    Bahmni.Common.Constants.unAuthenticatedReferenceDataMap) :
                                                Bahmni.Common.Constants.unAuthenticatedReferenceDataMap;
                    var length = Object.keys(referenceDataMap).length;
                    var x = 0;
                    var deferred = $q.defer();
                    angular.forEach(referenceDataMap, function(referenceData, url){

                        offlineDbService.getReferenceData(referenceData).then(function(result){
                            var requestUrl = Bahmni.Common.Constants.hostURL + url;
                            var req = {
                                method: 'GET',
                                url: requestUrl,
                                headers: {
                                    'If-None-Match': result ? result.etag : undefined
                                }
                            };
                            if(referenceData == 'LocaleList') {
                                req.headers.Accept = 'text/plain';
                            }
                             $http(req).then(function (response) {
                                x++;
                                if(response.status == 200) {
                                    var eTag = response.headers().etag;
                                    return offlineDbService.insertReferenceData(referenceData, response.data, eTag).then(function(){
                                        if(x == length)
                                            deferred.resolve({});
                                    });
                                }
                            }).catch(function(){
                                x++;
                                if(x == length)
                                    deferred.resolve({});
                            });
                        });
                    });
                    return deferred.promise;
                }
            };
        }
    ]);
