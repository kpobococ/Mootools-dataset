Dataset
=======

This plugin adds methods to simplify working with HTML5 element data attributes.
It also adds a class extra which allows classes to read their options directly
from the element.

It is based on [Garrick Cheung's Elements.Dataset](https://github.com/GCheung55/mootools-htmlx/blob/master/Source/Elements/Elements.Dataset.js)

How to use
----------

Assuming we have the following element somewhere on our page:

    #HTML
    <div id="myElement" data-foo="bar"></div>

For read or write access to the element's data attributes, use the following
methods:

    #JS
    var element = $('myElement');

    // Get the value of data-foo attribute
    element.getData('foo'); // 'bar'

    // Set the value of data-foo attribute
    element.setData('foo', 'baz');

    // Erase the data-foo attribute
    element.eraseData('foo');

    // Retrieve the full dataset
    element.getDataset();

You can set more than one data attribute value at once:

    #JS
    element.setData({
        foo: 'bar',
        baz: 'baz'
    });

The get/set methods can also work with element's datasets:

    #JS
    // Retrieve the full dataset
    element.get('dataset');

    // Set some values on the dataset
    element.set('dataset', {
        foo: 'bar',
        baz: 'baz'
    });

If you like creating elements via `new Element`, you can pass the dataset
directly into an element's constructor, like so:

    #JS
    new Element('div',{
        dataset: {
            foo: 'bar',
            baz: 'baz'
        }
    });

DatasetOptions
--------------

It is now common practice for many plugins accepting an element to read plugin
properties directly from said element. The `DatasetOptions` mixin extends
the core mootools `Options` mixin to allow you to do just that as easy as
providing a list of options to read and an element to read them from:

    #JS
    var MyPlugin = new Class({
        Implements: [DatasetOptions],

        options: {
            foo: null,
            bar: null,
            baz: 'default',

            /* Provide a prefix for your plugin's options. If undefined, no
             * prefix is used.
             */
            datasetPrefix: 'myplugin',

            // Provide a list of options to read from the target element
            datasetOptions: ['foo', 'bar', 'baz']
        },

        initialize: function(element, options){
            this.setOptionsFromElement(element, options);
        }
    });

Let's assume we have the following element:

    #HTML
    <div id="myPluginDiv" data-myplugin-foo="foo"></div>

And initialize the plugin with the following code:

    #JS
    new MyPlugin('myPluginDiv', {
        foo: 'bar',
        bar: 'baz'
    });

We will now have the following options set in our plugin:

    #JS
    {
        foo: 'foo',
        bar: 'baz',
        baz: 'default'
    }

The `DatasetOptions` source priority when reading options is the following:

* Data attribute value
* Passed options object value
* Default plugin option value

This is useful, for example, if you initialize a certain plugin globally with
a set of defaults, to allow override on a per-element basis. A good example
of such a situation is some `Tooltip` plugin:

    #JS
    $$('.tooltip').each(function(element){
        new Tooltip(element, {
            position: 'bottom'
        });
    });

    #HTML
    <a href="..." class="tooltip">This tooltip will be at the bottom</a>
    <a href="..." class="tooltip" data-tooltip-position="top">And this one will be at the top</a>

If you only want to read the options without actually setting them, you can
use the following method:

    #JS
    options = this.getOptionsFromElement(element, options);

You can later use the default `setOptions` method to set the options to your
plugin.

** Extending plugins with DatasetOptions **

If you want to extend an existing plugin, which uses `DatasetOptions`, and want
to provide additional options, you have to do something like this:

    #JS
    initialize: function(element, options){
        this.options.datasetOptions.append(['newOption', 'anotherOption']);
        this.parent(element, options);
    }

If you just overwrite the `datasetOptions` value inside the `options` object,
it will not inherit the previous array values.