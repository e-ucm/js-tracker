/*
 * Copyright 2017 e-UCM, Universidad Complutense de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


 import('chai').then(chai => {
    var expect = chai.expect;
    var TrackerAsset = require('../src/js-tracker');

    var tracker = new TrackerAsset();

    var parseCSV = function(trace) {
        var p = [];

        var escape = false;
        var start = 0;
        for (var i = 0; i < trace.lenth; i++) {
            switch (trace [i]) {
            case '\\': {
                escape = true;
                break;
            }
            case ',': {
                if (!escape) {
                    p.push (trace.substr(start, i - start).replace('\\,',','));
                    start = i + 1;
                } else {
                    escape = false;
                }
                break;
            }
            default: { break; }
            }
        }
        p.push(trace.substr(start).replace('\\,',','));

        return p;
    };

    var CompareCSV = function(t1, t2) {
        var sp1 = parseCSV(t1);
        var sp2 = parseCSV(t2);

        expect(sp1.length).to.equal(sp2.length);

        for (var i = 0; i < 3; i++) {
            expect(sp1[i]).to.equal(sp2[i]);
        }

        var d1 = {};

        if (sp1.length > 3) {
            for (i = 3; i < sp1.length; i += 2) {
                d1[sp1[i]] = sp1[i + 1];
            }

            for (i = 3; i < sp2.length; i += 2) {
                expect(d1.keys()).to.include(sp2[i]);
                expect(d1[sp2[i]]).to.equal(sp2[i + 1]);
            }
        }
    };

    var CheckCSVTrace = function(trace) {
        var t = tracker.queue[tracker.queue.length - 1];
        CompareCSV(trace,removeTimestamp(t.ToCsv()));
    };

    var removeTimestamp = function(trace) {
        return trace.substr(trace.search(',') + 1, trace.length);
    };

    var enqueueTrace01 = function() {
        tracker.ActionTrace('accessed', 'gameobject', 'ObjectID');
    };

    var enqueueTrace02 = function() {
        tracker.setResponse('TheResponse');
        tracker.setScore(0.123);
        tracker.ActionTrace('initialized', 'game', 'ObjectID2');
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
        tracker.ActionTrace('selected', 'zone', 'ObjectID3');
    };

    describe('TrackerAsset CSV Tests', function() {
        it('Action Trace Tests', function() {
            tracker.ActionTrace('Verb', 'Type', 'ID');
            CheckCSVTrace('Verb,Type,ID');

            tracker.ActionTrace('Verb', 'Ty,pe', 'ID');
            CheckCSVTrace('Verb,Ty\\,pe,ID');

            tracker.ActionTrace('Verb', 'Type', 'I,D');
            CheckCSVTrace('Verb,Type,I\\,D');

            tracker.ActionTrace('Ve,rb', 'Type', 'ID');
            CheckCSVTrace('Ve\\,rb,Type,ID');
        });

        it('Accessible CSV 1 Accessed', function() {
            tracker.Accessible.Accessed('AccesibleID', tracker.Accessible.AccessibleType.Cutscene);
            CheckCSVTrace('accessed,cutscene,AccesibleID');
        });

        it('Accessible CSV 2 Skipped with extensions', function() {
            tracker.setVar('extension1', 'value1');
            tracker.Accessible.Skipped('AccesibleID2', tracker.Accessible.AccessibleType.Screen);

            CheckCSVTrace('skipped,screen,AccesibleID2,extension1,value1');
        });

        it('Alternative CSV 1 Selected', function() {
            tracker.Alternative.Selected('AlternativeID', 'SelectedOption', tracker.Alternative.AlternativeType.Path);

            CheckCSVTrace('selected,path,AlternativeID,response,SelectedOption');
        });

        it('Alternative CSV 2 Unlocked with extensions', function() {
            tracker.setVar('SubCompletableScore', 0.8);
            tracker.Alternative.Unlocked('AlternativeID2', 'Answer number 3', tracker.Alternative.AlternativeType.Question);

            CheckCSVTrace('unlocked,question,AlternativeID2,response,Answer number 3,SubCompletableScore,0.8');
        });

        it('Completable CSV 1 Initialized', function() {
            tracker.Completable.Initialized('CompletableID', tracker.Completable.CompletableType.Quest);

            CheckCSVTrace('initialized,quest,CompletableID');
        });

        it('Completable CSV 2 Progressed', function() {
            tracker.Completable.Progressed('CompletableID2', tracker.Completable.CompletableType.Stage, 0.34);

            CheckCSVTrace('progressed,stage,CompletableID2,progress,0.34');
        });

        it('Completable CSV 3 Completed', function() {
            tracker.Completable.Completed('CompletableID3',tracker.Completable.CompletableType.Race, true, 0.54);

            CheckCSVTrace('completed,race,CompletableID3,success,true,score,0.54');
        });

        it('GameObject CSV 1 Interacted', function() {
            tracker.GameObject.Interacted('GameObjectID', tracker.GameObject.GameObjectType.Npc);

            CheckCSVTrace('interacted,npc,GameObjectID');
        });

        it('GameObject CSV 2 Used', function() {
            tracker.GameObject.Used('GameObjectID2', tracker.GameObject.GameObjectType.Item);

            CheckCSVTrace('used,item,GameObjectID2');
        });

        it('Generic CSV 1', function() {
            enqueueTrace01();
            CheckCSVTrace('accessed,gameobject,ObjectID');
        });

        it('Generic CSV 2', function() {
            enqueueTrace02();
            CheckCSVTrace('initialized,game,ObjectID2,response,TheResponse,score,0.123');
        });

        it('Generic CSV 3', function() {
            enqueueTrace03();
            CheckCSVTrace('selected,zone,ObjectID3,success,false,completion,true,response,AnotherResponse,' +
                            'score,123.456,extension1,value1,extension2,value2,extension3,3,extension4,4.56');
        });

        it('Generic CSV 3', function() {
            tracker.setVar('e1', 'ex,2');
            tracker.setVar('e,1', 'ex,2,');
            tracker.setVar('e3', 'e3');
            tracker.ActionTrace('verb', 'target', 'id');

            CheckCSVTrace('verb,target,id,e1,ex\\,2,e\\,1,ex\\,2\\,,e3,e3');
        });
    });
}).catch(err => {
    console.error(err);
});