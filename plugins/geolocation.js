/*
 * Copyright 2017 e-UCM, Universidad Complutense de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *		 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


if (typeof TrackerPlugins === 'undefined') {
    var TrackerPlugins = {};
}

TrackerPlugins.Geolocation = function() {
    this.interfaces = {

        Places:
         function(tracker) {
             this.tracker = tracker;

             this.PlaceType = {
                 Building: 0,
                 GreenZone: 1,
                 UrbanArea: 2,
                 Water: 3,
                 POI: 4,
                 Place: 5,
                 properties: ['building', 'green-zone', 'urban-area', 'water', 'point-of-interest', 'place']

             };

             this.Moved = function(placeId, latitude, longitude, type) {
                 if (typeof type === 'undefined') {type = 5;}

                 this.tracker.setLocation(latitude, longitude);

                 return this.tracker.Trace('moved',this.PlaceType.properties[type],placeId);
             };

             this.Looked = function(placeId, type, orientation, latitude, longitude) {
                 if (typeof type === 'undefined') {type = 5;}
                 if (typeof orientation !== 'undefined') {
                     this.tracker.setVar('orientation', orientation);
                 }
                 if (typeof latitude !== 'undefined') {
                     this.tracker.setLocation(latitude, longitude);
                 }

                 return this.tracker.Trace('looked',this.PlaceType.properties[type],placeId);
             };

             this.Entered = function(placeId, type) {
                 if (typeof type === 'undefined') {type = 5;}

                 return this.tracker.Trace('entered',this.PlaceType.properties[type],placeId);
             };

             this.Exited = function(placeId, type) {
                 if (typeof type === 'undefined') {type = 5;}

                 return this.tracker.Trace('exited',this.PlaceType.properties[type],placeId);
             };
         },

        Directions:
         function(tracker) {
             this.tracker = tracker;

             this.DirectionType = {
                 Direction: 0,
                 properties: ['direction']
             };

             this.Followed = function(placeId, directions, type) {
                 if (typeof type === 'undefined') {type = 0;}

                 this.tracker.setLocation(location);

                 return this.tracker.Trace('followed',this.DirectionType.properties[type],placeId);
             };
         }
    };
    this.functions = {
        setLocation: function(tracker) {
            return function(latitude, longitude) {
                tracker.setVar('location',{lat: latitude, lon: longitude});
            };
        }
    };
    this.verbs = {
        entered: 'https://beaconing.e-ucm.es/xapi/geolocated/verbs/entered',
        exited: 'https://beaconing.e-ucm.es/xapi/geolocated/verbs/exited',
        moved: 'https://beaconing.e-ucm.es/xapi/geolocated/verbs/moved',
        looked: 'https://beaconing.e-ucm.es/xapi/geolocated/verbs/looked',
        followed: 'https://beaconing.e-ucm.es/xapi/geolocated/verbs/followed'
    };
    this.objects = {
        building: 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/building',
        'green-zone': 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/green-zone',
        'urban-area': 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/urban-area',
        water: 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/water',
        place: 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/place',
        direction: 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/direction',
        'point-of-interest': 'https://beaconing.e-ucm.es/xapi/geolocated/activity-types/point-of-interest'
    };
    this.extensions = {
        location: 'https://beaconing.e-ucm.es/xapi/geolocated/extensions/location',
        orientation: 'https://beaconing.e-ucm.es/xapi/geolocated/extensions/orientation',
        guide: 'https://beaconing.e-ucm.es/xapi/geolocated/extensions/guide'
    };
};