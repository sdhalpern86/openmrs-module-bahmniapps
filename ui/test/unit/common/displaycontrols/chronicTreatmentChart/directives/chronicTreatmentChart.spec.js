'use strict';

describe('Chronic Treatment Chart DisplayControl', function () {
    var q,
        compile,
        mockBackend,
        rootScope,
        deferred,
        drugService,
        translate,
        simpleHtml = '<chronic-treatment-chart patient="patient" section="section" is-on-dashboard="true" enrollment="enrollment"></chronic-treatment-chart>';

    beforeEach(module('ui.router.router', function(){}));
    beforeEach(module('pascalprecht.translate', function(){}));
    beforeEach(module('bahmni.common.uiHelper'), function(){});
    beforeEach(module('bahmni.clinical'), function(){});

    beforeEach(module('bahmni.common.displaycontrol.chronicTreatmentChart'), function($provide){
        var _spinner = jasmine.createSpyObj('spinner',['forPromise','then']);
        _spinner.forPromise.and.callFake(function(){
            deferred = q.defer();
            deferred.resolve({data: dispositions});
            return deferred.promise;
        });

        _spinner.then.and.callThrough({data: dispositions});

        drugService = jasmine.createSpyObj('DrugService',['getRegimen']);

        translate = jasmine.createSpyObj('$translate',['instant']);

        $provide.value('spinner', _spinner);
        $provide.value('DrugService',drugService);
        $provide.value('$translate',translate);
    });

    beforeEach(inject(function ($compile, $httpBackend, $rootScope,$q) {
        compile = $compile;
        mockBackend = $httpBackend;
        rootScope = $rootScope;
        q = $q;
    }));

    it('should return the concept name when there is no abbreviation', function () {
        var scope = rootScope.$new();

        scope.isOnDashboard = true;
        scope.section = {
            "headingConceptSource":"Abbreviation",
            "dashboardParams": {
                "drugs": [
                    "RIFAMPICIN",
                    "PYRAZINAMIDE"
                ]
            }
        };

        scope.patient = {
            "uuid":"patientUuid"
        };

        mockBackend.expectGET('../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html').respond("<div>dummy</div>");
        mockBackend.expectGET('/openmrs/ws/rest/v1/bahmnicore/drugOGram/regimen?drugs=RIFAMPICIN&drugs=PYRAZINAMIDE&patientUuid=patientUuid').respond({});

        var element = compile(simpleHtml)(scope);

        scope.$digest();
        mockBackend.flush();

        var compiledElementScope = element.isolateScope();
        scope.$digest();

        var conceptWithoutMappingAndShortName = {
            "uuid":"uuid",
            "shortName":"shortName"
        };

        expect(compiledElementScope.getAbbreviation(conceptWithoutMappingAndShortName)).toEqual("shortName");

        var conceptWithoutMappingAndName = {
            "uuid":"uuid",
            "name":"name"
        };

        expect(compiledElementScope.getAbbreviation(conceptWithoutMappingAndName)).toEqual("name");

        var conceptWithoutMappingAndBothFullNameAndShortName = {
            "uuid":"uuid",
            "name":"name",
            "shortName":"shortName"
        };

        expect(compiledElementScope.getAbbreviation(conceptWithoutMappingAndBothFullNameAndShortName)).toEqual("shortName");
    });

    it('should return the abbreviation given the concept name', function () {
        var scope = rootScope.$new();

        scope.isOnDashboard = true;
        scope.section = {
            "headingConceptSource":"Abbreviation",
            "dashboardParams": {
                "drugs": [
                    "RIFAMPICIN",
                    "PYRAZINAMIDE"
                ]
            }
        };

        scope.patient = {
            "uuid":"patientUuid"
        };

        mockBackend.expectGET('../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html').respond("<div>dummy</div>");
        mockBackend.expectGET('/openmrs/ws/rest/v1/bahmnicore/drugOGram/regimen?drugs=RIFAMPICIN&drugs=PYRAZINAMIDE&patientUuid=patientUuid').respond({});

        var element = compile(simpleHtml)(scope);

        scope.$digest();
        mockBackend.flush();

        var compiledElementScope = element.isolateScope();
        scope.$digest();

        var conceptWithAbbreviation = {
            "uuid":"uuid",
            "shortName":"shortName",
            "mappings":[
                {
                    "source": "org.openmrs.module.bacteriology",
                    "name": "SPECIMEN COLLECTION DATE",
                    "code": "SPECIMEN_COLLECTION_DATE"
                },
                {
                    "source": "Abbreviation",
                    "name": "abbreviation",
                    "code": "SCD"
                }
            ]
        };

        expect(compiledElementScope.getAbbreviation(conceptWithAbbreviation)).toEqual("SCD");

        var conceptWithoutAbbreviationMapping = {
            "uuid":"uuid",
            "shortName":"shortName",
            "mappings":[
                {
                    "source": "org.openmrs.module.bacteriology",
                    "name": "SPECIMEN COLLECTION DATE",
                    "code": "SPECIMEN_COLLECTION_DATE"
                }
            ]
        };

        expect(compiledElementScope.getAbbreviation(conceptWithoutAbbreviationMapping)).toEqual("shortName");

    });

    it('should return the abbreviation from the provided heading source dictionary', function () {
        var scope = rootScope.$new();

        scope.isOnDashboard = true;
        scope.section = {
            "headingConceptSource":"CustomAbbreviationSource",
            "dashboardParams": {
                "drugs": [
                    "RIFAMPICIN",
                    "PYRAZINAMIDE"
                ]
            }
        };

        scope.patient = {
            "uuid":"patientUuid"
        };

        scope.enrollment = "patientProgramUuid";

        mockBackend.expectGET('../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html').respond("<div>dummy</div>");
        mockBackend.expectGET('/openmrs/ws/rest/v1/bahmnicore/drugOGram/regimen?drugs=RIFAMPICIN&drugs=PYRAZINAMIDE&patientProgramUuid=patientProgramUuid&patientUuid=patientUuid').respond({});

        var element = compile(simpleHtml)(scope);

        scope.$digest();
        mockBackend.flush();

        var compiledElementScope = element.isolateScope();
        scope.$digest();

        var conceptWithAbbreviation = {
            "uuid":"uuid",
            "shortName":"shortName",
            "mappings":[
                {
                    "source": "org.openmrs.module.bacteriology",
                    "name": "SPECIMEN COLLECTION DATE",
                    "code": "SPECIMEN_COLLECTION_DATE"
                },
                {
                    "source": "CustomAbbreviationSource",
                    "name": "abbreviation",
                    "code": "SCD"
                }
            ]
        };

        expect(compiledElementScope.getAbbreviation(conceptWithAbbreviation)).toEqual("SCD");

    });

    it('should return the short name when headingConceptSource is not configured', function () {
        var scope = rootScope.$new();

        scope.isOnDashboard = true;
        scope.section = {
            "dashboardParams": {
                "drugs": [
                    "RIFAMPICIN",
                    "PYRAZINAMIDE"
                ]
            }
        };

        scope.patient = {
            "uuid":"patientUuid"
        };

        mockBackend.expectGET('../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html').respond("<div>dummy</div>");
        mockBackend.expectGET('/openmrs/ws/rest/v1/bahmnicore/drugOGram/regimen?drugs=RIFAMPICIN&drugs=PYRAZINAMIDE&patientUuid=patientUuid').respond({});

        var element = compile(simpleHtml)(scope);

        scope.$digest();
        mockBackend.flush();

        var compiledElementScope = element.isolateScope();
        scope.$digest();

        var conceptWithAbbreviation = {
            "uuid":"uuid",
            "shortName":"shortName",
            "mappings":[
                {
                    "source": "org.openmrs.module.bacteriology",
                    "name": "SPECIMEN COLLECTION DATE",
                    "code": "SPECIMEN_COLLECTION_DATE"
                },
                {
                    "source": "Abbrevation",
                    "name": "abbreviation",
                    "code": "SCD"
                }
            ]
        };

        expect(compiledElementScope.getAbbreviation(conceptWithAbbreviation)).toEqual("shortName");

    });

    it('should expected to call with the only patientUuid', function () {
        var scope = rootScope.$new();

        scope.isOnDashboard = true;
        scope.section = {
            "dashboardParams": {
                "drugs": [
                    "RIFAMPICIN",
                    "PYRAZINAMIDE"
                ]
            }
        };

        scope.patient = {
            "uuid":"patientUuid"
        };


        mockBackend.expectGET('../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html').respond("<div>dummy</div>");
        mockBackend.expectGET('/openmrs/ws/rest/v1/bahmnicore/drugOGram/regimen?drugs=RIFAMPICIN&drugs=PYRAZINAMIDE&patientUuid=patientUuid').respond({});

        var element = compile(simpleHtml)(scope);

        scope.$digest();
        mockBackend.flush();

        var compiledElementScope = element.isolateScope();
        scope.$digest();

    });

    it('should expected to call with the both patientProgramUuid and patientUuid', function () {
        var scope = rootScope.$new();

        scope.isOnDashboard = true;
        scope.section = {
            "dashboardParams": {
                "drugs": [
                    "RIFAMPICIN",
                    "PYRAZINAMIDE"
                ]
            }
        };

        scope.patient = {
            "uuid":"patientUuid"
        };

        scope.enrollment = "patientProgramUuid";

        mockBackend.expectGET('../common/displaycontrols/chronicTreatmentChart/views/chronicTreatmentChart.html').respond("<div>dummy</div>");
        mockBackend.expectGET('/openmrs/ws/rest/v1/bahmnicore/drugOGram/regimen?drugs=RIFAMPICIN&drugs=PYRAZINAMIDE&patientProgramUuid=patientProgramUuid&patientUuid=patientUuid').respond({});

        var element = compile(simpleHtml)(scope);

        scope.$digest();
        mockBackend.flush();

        var compiledElementScope = element.isolateScope();
        scope.$digest();

    });
});
