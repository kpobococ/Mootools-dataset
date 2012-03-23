/*
---
name: Dataset

description: adds support of HTML5 data attributes

license: MIT-style

authors:
- Garrick Cheung <garrick@garrickcheung.com>
- Anton Suprun <kpobococ@gmail.com>

requires: [Core/1.4:Class.Extras, Core/1.4:Element]

provides: [DatasetOptions]

...
*/

(function(window, $, undefined){

    var hasData = (function(){
        var node = document.createElement('div');
        node.setAttribute('data-id', '1');
        return node.dataset && node.dataset.id && node.dataset.id == '1';
    }());

    [Element, Document, Window].invoke('implement', {

        setData: (hasData ? function(key, val){
            this.dataset[key.camelCase()] = val;
            return this;
        } : function(key, val){
            return this.setProperty('data-' + key.hyphenate(), val);
        }).overloadSetter(),

        getData: (hasData ? function(key){
            return this.dataset[key.camelCase()]
        } : function(key){
            return this.getProperty('data-' + key.hyphenate());
        }).overloadGetter(),

        getDataset: hasData ? function(){
            return Object.clone(this.dataset);
        } : function(){
            var attributes = this.attributes,
                i = attributes.length,
                collection = {};

            while(i--){
                var attribute = attributes[i],
                    key = attribute.attributeName;

                if (!key.test(/^data-/)) continue;

                key = key.replace(/^data-/).camelCase();
                collection[key] = attribute.value;
            }

            return collection;
        },

        eraseData: function(key){
            return this.removeProperty('data-' + key.hyphenate());
        }

    });

    Element.Properties.dataset = {
        set: function(data){
            return this.setData(data);
        },

        get: function(){
            return this.getDataset();
        }
    };

    var DatasetOptions = window.DatasetOptions = new Class({
        Extends: Options,

        getOptionsFromElement: function(element, options){
            var el = $(element),
                o = options || {},
                s = this.options.datasetPrefix,
                p = this.options.datasetOptions;
            if (s) s += '-';
            p.each(function(p){
                o[p] = el.getData(s + p) || o[p] || this.options[p];
            }, this);
            return o;
        },

        setOptionsFromElement: function(element, options){
            return this.setOptions(this.getOptionsFromElement(element, options));
        }

    });

})(window, document.id);