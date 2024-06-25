/*
 * Copyright 2017 e-UCM, Universidad Complutense de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


 import('chai').then(chai => {
    var expect = chai.expect;
    var TrackerAsset = require('../src/js-tracker');
    
    var tracker = new TrackerAsset();
    
    var enqueueTrace01 = function() {
        return tracker.ActionTrace('accessed', 'gameobject', 'ObjectID');
    };
    
    var enqueueTrace02 = function() {
        tracker.setResponse('TheResponse');
        tracker.setScore(0.123);
        return tracker.ActionTrace('initialized', 'game', 'ObjectID2');
    };
    
    var enqueueTrace03 = function() {
        tracker.setResponse('AnotherResponse');
        tracker.setScore(123.456);
        tracker.setSuccess(false);
        tracker.setCompletion(true);
        tracker.setVar('extension1', 'value1');
        tracker.setVar('extension2', 'value2');
        tracker.setVar('extension3', 3);
        tracker.setVar('extension4', 4.56);
        return tracker.ActionTrace('selected', 'zone', 'ObjectID3');
    };
    
    var obsize = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };
    
    describe('TrackerAsset xAPI Tests', function() {
        it('Accessible xAPI 1 Accessed', function() {
            var t = tracker.Accessible.Accessed('AccesibleID', tracker.Accessible.AccessibleType.Cutscene);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(6);
            expect(tracejson.object.id).to.contain('AccesibleID');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/cutscene');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/seriousgames/verbs/accessed');
        });
    
        it('Accessible xAPI 2 Skipped with extensions', function() {
            tracker.setVar('extension1', 'value1');
            var t = tracker.Accessible.Skipped('AccesibleID2', tracker.Accessible.AccessibleType.Screen);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('AccesibleID2');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/screen');
            expect(tracejson.verb.id).to.equal('http://id.tincanapi.com/verb/skipped');
            expect(tracejson.result.extensions.extension1).to.equal('value1');
        });
    
        it('Alternative xAPI 1 Selected', function() {
            var t = tracker.Alternative.Selected('AlternativeID', 'SelectedOption', tracker.Alternative.AlternativeType.Path);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('AlternativeID');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/path');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/adb/verbs/selected');
            expect(tracejson.result.response).to.equal('SelectedOption');
        });
    
    
        it('Alternative xAPI 2 Unlocked with extensions', function() {
            tracker.setVar('SubCompletableScore', 0.8);
            var t = tracker.Alternative.Unlocked('AlternativeID2', 'Answer number 3', tracker.Alternative.AlternativeType.Question);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('AlternativeID2');
            expect(tracejson.object.definition.type).to.equal('http://adlnet.gov/expapi/activities/question');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/seriousgames/verbs/unlocked');
            expect(tracejson.result.response).to.equal('Answer number 3');
            expect(tracejson.result.extensions.SubCompletableScore).to.equal(0.8);
        });
    
        it('Completable xAPI 1 Initialized', function() {
            var t = tracker.Completable.Initialized('CompletableID', tracker.Completable.CompletableType.Quest);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(6);
            expect(tracejson.object.id).to.contain('CompletableID');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/quest');
            expect(tracejson.verb.id).to.equal('http://adlnet.gov/expapi/verbs/initialized');
        });
    
        it('Completable xAPI 2 Progressed', function() {
            var t = tracker.Completable.Progressed('CompletableID2', tracker.Completable.CompletableType.Stage, 0.34);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('CompletableID2');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/stage');
            expect(tracejson.verb.id).to.equal('http://adlnet.gov/expapi/verbs/progressed');
            expect(tracejson.result.extensions['https://w3id.org/xapi/seriousgames/extensions/progress']).to.equal(0.34);
        });
    
        it('Completable xAPI 3 Completed', function() {
            var t = tracker.Completable.Completed('CompletableID3',tracker.Completable.CompletableType.Race, true, 0.54);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('CompletableID3');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/race');
            expect(tracejson.verb.id).to.equal('http://adlnet.gov/expapi/verbs/completed');
            expect(tracejson.result.success).to.equal(true);
            expect(tracejson.result.score.raw).to.equal(0.54);
        });
    
        it('GameObject xAPI 1 Interacted', function() {
            var t = tracker.GameObject.Interacted('GameObjectID', tracker.GameObject.GameObjectType.Npc);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(6);
            expect(tracejson.object.id).to.contain('GameObjectID');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/non-player-character');
            expect(tracejson.verb.id).to.equal('http://adlnet.gov/expapi/verbs/interacted');
        });
    
        it('GameObject xAPI 2 Used', function() {
            var t = tracker.GameObject.Used('GameObjectID2', tracker.GameObject.GameObjectType.Item);
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(6);
            expect(tracejson.object.id).to.contain('GameObjectID2');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/item');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/seriousgames/verbs/used');
        });
    
        it('Generic xAPI 1', function() {
            var t = enqueueTrace01();
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(6);
            expect(tracejson.object.id).to.contain('ObjectID');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/game-object');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/seriousgames/verbs/accessed');
        });
    
        it('Generic xAPI 2', function() {
            var t = enqueueTrace02();
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('ObjectID2');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/serious-game');
            expect(tracejson.verb.id).to.equal('http://adlnet.gov/expapi/verbs/initialized');
        
            expect(obsize(tracejson.result)).to.equal(2);
            expect(tracejson.result.response).to.equal('TheResponse');
            expect(tracejson.result.score.raw).to.equal(0.123);
        });
    
        it('Generic xAPI 3', function() {
            var t = enqueueTrace03();
        
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('ObjectID3');
            expect(tracejson.object.definition.type).to.equal('https://w3id.org/xapi/seriousgames/activity-types/zone');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/adb/verbs/selected');
        
            expect(obsize(tracejson.result)).to.equal(5);
            expect(tracejson.result.response).to.equal('AnotherResponse');
            expect(tracejson.result.score.raw).to.equal(123.456);
            expect(tracejson.result.completion).to.equal(true);
            expect(tracejson.result.success).to.equal(false);
        
            expect(obsize(tracejson.result.extensions)).to.equal(4);
            expect(tracejson.result.extensions.extension1).to.equal('value1');
            expect(tracejson.result.extensions.extension2).to.equal('value2');
            expect(tracejson.result.extensions.extension3).to.equal(3);
            expect(tracejson.result.extensions.extension4).to.equal(4.56);
        });
    
        it('Test Scores', function() {
            tracker.setScore(1.1,2.2,3.3,4.4);
            var t = tracker.Alternative.Selected('a1','o1');
            var tracejson = JSON.parse(t.ToXapi());
        
            expect(obsize(tracejson)).to.equal(7);
            expect(tracejson.object.id).to.contain('a1');
            expect(tracejson.verb.id).to.equal('https://w3id.org/xapi/adb/verbs/selected');
        
            expect(obsize(tracejson.result)).to.equal(2);
            expect(tracejson.result.response).to.equal('o1');
            expect(tracejson.result.score.raw).to.equal(1.1);
            expect(tracejson.result.score.min).to.equal(2.2);
            expect(tracejson.result.score.max).to.equal(3.3);
            expect(tracejson.result.score.scaled).to.equal(4.4);
        });
    
        it('Test Score Raw', function() {
            tracker.setScore(1.1);
            var t = tracker.Alternative.Selected('a1','o1');
            var tracejson = JSON.parse(t.ToXapi());
            expect(tracejson.result.score.raw).to.equal(1.1);
        });
    
        it('Test Score Raw and Max', function() {
            tracker.setScoreRaw(1.1);
            tracker.setScoreMax(3.3);
            var t = tracker.Alternative.Selected('a1','o1');
            var tracejson = JSON.parse(t.ToXapi());
            expect(tracejson.result.score.max).to.equal(3.3);
        });
    
        it('Test Score Min and Scaled', function() {
            tracker.setScoreMin(2.2);
            tracker.setScoreScaled(4.4);
            var t = tracker.Alternative.Selected('a1','o1');
            var tracejson = JSON.parse(t.ToXapi());
            expect(tracejson.result.score.min).to.equal(2.2);
            expect(tracejson.result.score.scaled).to.equal(4.4);
        });
    });
}).catch(err => {
    console.error(err);
});