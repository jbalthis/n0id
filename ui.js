
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      02.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype for any button view. A button is a view element that is
 * typically used for triggering an action, e.g. switching to another page, firing a
 * request or opening a dialog.
 *
 * @extends M.View
 */
M.ButtonView = M.View.extend(
/** @scope M.ButtonView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ButtonView',

    /**
     * Determines whether this button is active or not.
     *
     * Note: This property is only used if the button is part of a button group (M.ButtonGroupView).
     *
     * @type Boolean
     */
    isActive: NO,

    /**
     * Determines whether to display the button ony with an icon but no text or not.
     *
     * @type Boolean
     */
    isIconOnly: NO,

    /**
     * This property can be used to specify a certain hyperlink type for this button. It only
     * works in combination with the hyperlinkTarget property.
     *
     * @type String
     */
    hyperlinkType: null,

    /**
     * This property can be used to specify a hyperlink target for this button. It only
     * works in combination with the hyperlinkType property.
     *
     * @type String
     */
    hyperlinkTarget: null,

    /**
     * This property can be used to specify a tag, that is independent from the button's
     * value. This allows you to identify a button, without having to worry about changes
     * to its value.
     *
     * @type String
     */
    tag: null,

    /**
     * This property can be used to specifically set the data-theme property of a button view
     * as it is used by jquery mobile.
     *
     * @type String
     */
    dataTheme: '',

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap', 'vclick'],

    /**
     * Renders a button as an input tag. Input is automatically converted by jQuery mobile.
     *
     * @private
     * @returns {String} The button view's html representation.
     */
    render: function() {
        this.computeValue();
        this.html = '<a data-role="button" id="' + this.id + '"' + this.style() + ' ';

        if(this.hyperlinkTarget && this.hyperlinkType) {
            switch (this.hyperlinkType) {
                case M.HYPERLINK_EMAIL:
                    this.html += 'rel="external" href="mailto:' + this.hyperlinkTarget + '"';
                    break;
                case M.HYPERLINK_WEBSITE:
                    this.html += 'rel="external" target="_blank" href="' + this.hyperlinkTarget + '"';
                    break;
                case M.HYPERLINK_PHONE:
                    this.html += 'rel="external" href="tel:' + this.hyperlinkTarget + '"';
                    break;
            }
        } else {
            this.html += 'href="#"';
        }

        this.html += '>' + this.value + '</a>';

        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list views and their
     * internal events.
     */
    registerEvents: function() {
        if(!this.internalEvents) {
            this.internalEvents = {
                tap: {
                    target: this,
                    action: 'dispatchEvent'
                }
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * Updates the value of the button with DOM access by jQuery.
     *
     * @private
     */
    renderUpdate: function() {
        this.computeValue();
        $('#' + this.id + ' .ui-btn-text').text(this.value);
    },

    /**
     * Sets the button's value and calls renderUpdate() to make the value update visible.
     *
     * @param {String} value The button's new value.
     */
    setValue: function(value) {
        this.value = value;
        this.renderUpdate();
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the button.
     *
     * @private
     */
    theme: function() {
        /* theme only if not already done */
        if(!$('#' + this.id).hasClass('ui-btn')) {
            $('#' + this.id).buttonMarkup();
        }
    },

    /**
     * Applies some style-attributes to the button.
     *
     * @private
     * @returns {String} The button's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.isInline) {
            html += ' data-inline="true"';
        }
        if(this.icon) {
            html += ' data-icon="' + this.icon + '"';
        }
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        if(this.dataTheme) {
            html += ' data-theme="' + this.dataTheme + '"';
        }
        if(this.isIconOnly) {
            html += ' data-iconpos="notext"';
        }
        if(this.cssStyle) {
            html += 'style="' + this.cssStyle + '"';
        }
        return html;
    },

    /**
     * This method is called right before the page is loaded. If a beforeLoad-action is defined
     * for the page, it is now called.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    dispatchEvent: function(id, event, nextEvent) {
        if(this.isEnabled && nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * This method can be used to disable the button. This leads to a visual 'disabled' look and
     * disabled the buttons tap/click events.
     */
    disable: function() {
        if(this.isEnabled) {
            var html = $('#' + this.id).html();
            html = '<div data-theme="c" class="ui-shadow ui-disabled" aria-disabled="true">' + html + '</div>';
            $('#' + this.id).html(html);
            this.isEnabled = NO;
        }
    },

    /**
     * This method can be used to enable a disabled button and make it usable again.
     */
    enable: function() {
        if(!this.isEnabled) {
            var html = $('#' + this.id + ' div').html();
            $('#' + this.id).html(html);
            this.isEnabled = YES;
        }
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      03.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('ui/button.js');

/**
 * @class
 *
 * This is the prototype for any list item view. It can only be used as child view of a list
 * view (M.ListView).
 *
 * @extends M.View
 */
M.ListItemView = M.View.extend(
/** @scope M.ListItemView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ListItemView',

    /**
     * States whether the list view item is currently in edit mode or not. This is mainly used by
     * the built-in toggleRemove() functionality of list views.
     *
     * @type Boolean
     */
    inEditMode: NO,

    /**
     * This property determines whether a list item has one single action that is triggered
     * once there is a click anywhere inside the list item or if there are specific actions
     * defined for single ui elements within one list item.
     *
     * @type Boolean
     */
    hasSingleAction: YES,

    /**
     * This property contains the list item's delete button that is automatically shown if the
     * list view's built-in toggleRemove() functionality is used.
     *
     * @type M.ButtonView
     */
    deleteButton: M.ButtonView.design({
        icon: 'delete',
        value: ''
    }),

    /**
     * This property determines whether the list item is a divider or not.
     *
     * @type Boolean
     */
    isDivider: NO,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['tap'],

    /**
     * This property can be used to specify whether a list item can be selected or not. Note, that this
     * only affects styling stuff. If set to NO, you still can apply e.g. tap events.
     *
     * @type Boolean
     */
    isSelectable: YES,

    /**
     * This property can be used to specify a button that appears on a swipe left or swipe right
     * gesture (as known from the iphone). Simply specify a tap event for that button and provide a
     * custom method to handle the event. This can e.g. be used as a delete button.
     *
     * By default the button will look like a delete button (in red) and display 'delete'. To change this,
     * simply pass a value to set the label and make use of the cssClass property. To get a standard button
     * as you now it from the other parts of the framework, set the cssClass property's value to:
     *
     *   - 'a'  ->  black
     *   - 'b'  ->  blue
     *   - 'c'  ->  light grey
     *   - 'd'  ->  white
     *   - 'e'  ->  yellow
     *
     * Check the jQM docs for further information and visual samples of these themes:
     * http://jquerymobile.com/test/docs/buttons/buttons-themes.html
     *
     * A valid and usefull configuration of such a swipe button could e.g. look like the following:
     *
     *   swipeButton: M.ButtonView.design({
     *     events: {
     *       tap: {
     *         target: MyApp.MyController,
     *         action: 'removeItem'
     *       }
     *     },
     *     cssClass: 'e'
     *   })
     *
     * The event handler (removeItem() in the sample above) will be called with two parameters:
     *
     *   - domID  ->  The DOM id of the list item view, e.g. 'm_123'
     *   - id  ->  The id/recordId of the list item based on the bound data
     *
     * @type M.ButtonView
     */
    swipeButton: null,

    /**
     * Renders a list item as an li-tag. The rendering is initiated by the parent list view.
     *
     * @private
     * @returns {String} The list item view's html representation.
     */
    render: function() {
        this.html = '<li id="' + this.id + '"' + this.style();

        if(this.isDivider) {
            this.html += ' data-role="list-divider"';
        }

        this.html += '>';

        if(this.childViews) {
            if(this.inEditMode) {
                this.html += '<a href="#">';
                this.renderChildViews();
                this.html += '</a>';

                this.html += this.deleteButton.render();
            } else {
                if(this.isSelectable) {
                    this.html += '<a href="#">';
                    this.renderChildViews();
                    this.html += '</a>';
                } else {
                    this.renderChildViews();
                }
            }
        } else if(this.value) {
            this.html += this.value;
        }

        this.html += '</li>';

        return this.html;
    },

    /**
     * Triggers render() on all children. This method defines a special rendering behaviour for a list item
     * view's child views.
     *
     * @override
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            for(var i in childViews) {
                var childView = this[childViews[i]];
                if(childView) {
                    childView._name = childViews[i];
                    childView.parentView = this;

                    if(childView.type === 'M.ButtonView') {
                        this.html += '<div>' + childView.render() + '</div>';
                    } else {
                        this.html += childView.render();
                    }
                } else {
                    this.childViews = this.childViews.replace(childViews[i], ' ');
                    M.Logger.log('There is no child view \'' + childViews[i] + '\' available for ' + this.type + ' (' + (this._name ? this._name + ', ' : '') + '#' + this.id + ')! It will be excluded from the child views and won\'t be rendered.', M.WARN);
                }
            }
            return this.html;
        }
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list item views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            tap: {
                target: this.parentView,
                action: 'setActiveListItem'
            }
        };
        if(this.swipeButton) {
            $.extend(this.internalEvents, {
                swipeleft: {
                    target: this.parentView,
                    action: 'showSwipeButton'
                },
                swiperight: {
                    target: this.parentView,
                    action: 'showSwipeButton'
                }
            })
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * Applies some style-attributes to the list item.
     *
     * @private
     * @returns {String} The list item's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    /**
     * This method is used as the event handler of the tap event of a swipe button. All it does
     * is to collect the required information for the external handler (domID, modelID) and call
     * this external handler (if there is one specified).
     *
     * @private
     */
    swipeButtonClicked: function(id, event, nextEvent) {
        id = this.id;
        var modelId = M.ViewManager.getViewById(id).modelId;

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [id, modelId]);
        }
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      02.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for horizontal alignment.
 *
 * @type String
 */
M.HORIZONTAL = 'horizontal';

/**
 * A constant value for vertical alignment.
 *
 * @type String
 */
M.VERTICAL = 'vertical';


/**
 * @class
 *
 * A button group is a vertically or / and horizontally aligned group of buttons. There
 * are basically three different types of a button group:
 *
 * - horizontally aligned buttons
 *     1 - 2 - 3
 *
 * - vertically aligned buttons
 *     1
 *     |
 *     2
 *     |
 *     3
 *
 * - horizontally and vertically aligned buttons
 *     1 - 2
 *     |   |
 *     3 - 4
 * 
 * @extends M.View
 */
M.ButtonGroupView = M.View.extend(
/** @scope M.ButtonGroupView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ButtonGroupView',

    /**
     * This property determines whether to render the button group horizontally
     * or vertically. Default: horizontal.
     *
     * Possible values are:
     * - M.HORIZONTAL: horizontal
     * - M.VERTICAL: vertical
     *
     * @type String
     */
    direction: M.HORIZONTAL,

    /**
     * Determines whether to display the button group view 'inset' or at full width.
     *
     * @type Boolean
     */
    isInset: YES,

    /**
     * Determines whether to display the button group compact, i.e. without top/bottom
     * margin. This property only is relevant in combination with multiple lines of
     * buttons (c.p.: buttonsPerLine property).
     *
     * @type Boolean
     */
    isCompact: YES,

    /**
     * This property, if set, defines how many buttons are rendered per line. If there
     * are more buttons defined that fitting into one line, the following buttons are
     * rendered into a new line. Make sure, the number of your buttons is divisible by
     * the number of buttons per line, since only full lines are displayed. So if you
     * for example specify 5 buttons and 2 buttons per line, the fifth button won't be
     * visible.
     *
     * If e.g. 4 buttons are specified and this property is set to 2, the rendering will
     * be as follows:
     *
     *     1 -- 2
     *     3 -- 4
     *
     * @type Number
     */
    buttonsPerLine: null,

    /**
     * This property is used to internally store the number of lines that are necessary
     * to render all buttons according to the buttonsPerLine property.
     *
     * @private
     * @type Number
     */
    numberOfLines: null,

    /**
     * This property refers to the currently rendered line, if there is more than one.
     *
     * @private
     * @type Number
     */
    currentLine: null,

    /**
     * This property contains an array of html ids referring to the several lines of grouped
     * buttons, if there is more than one at all.
     *
     * @private
     * @type Array
     */
    lines: null,

    /**
     * This property contains a reference to the currently selected button.
     *
     * @private
     * @type Object
     */
    activeButton: null,

    /**
     * This property determines whether the buttons of this button group are selectable or not. If
     * set to YES, a click on one of the buttons will set this button as the currently active button
     * and automatically change its styling to visualize its selection.
     *
     * @type Boolean
     */
    isSelectable: YES,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['change'],

    /**
     * Renders a button group as a div container and calls the renderChildViews
     * method to render the included buttons.
     *
     * @private
     * @returns {String} The button group view's html representation.
     */
    render: function() {
        /* check if multiple lines are necessary before rendering */
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            if(this.buttonsPerLine && this.buttonsPerLine < childViews.length) {
                var numberOfButtons = 0;
                for(var i in childViews) {
                    if(this[childViews[i]] && this[childViews[i]].type === 'M.ButtonView') {
                        numberOfButtons = numberOfButtons + 1;
                    }
                }
                if(this.buttonsPerLine < numberOfButtons) {
                    this.numberOfLines = M.Math.round(numberOfButtons / this.buttonsPerLine, M.FLOOR);
                }
            }
        }
        this.html = '';
        /* if there are multiple lines, render multiple horizontally aligned button groups */
        if(this.numberOfLines) {
            /* set the direction to horizontally, no matter what it was set to before */
            this.direction = M.HORIZONTAL;

            /* this is a wrapper for the multiple button groups.
               if it is not inset, assign css class 'ui-listview' for clearing the padding of the surrounding element */
            this.html += '<div id="' + this.id + '"';
            this.html += this.style();
            this.html += '>';

            /* create a button group for every line */
            this.lines = [];
            for(var i = 0; i < this.numberOfLines; i++) {
                this.currentLine = i + 1;
                /* store current line in lines property for use in renderChildViews() */
                this.lines.push(this.id + '_' + i);

                this.html += '<div data-role="controlgroup" href="#" id="' + this.id + '_' + i + '" data-type="' + this.direction + '"';

                /* if isCompact, assign specific margin, depending on line number (first, last, other) */
                if(!this.isInset || this.isCompact) {
                    if(i == 0) {
                        this.html += this.isInset ? ' style="margin-bottom:0px"' : ' style="margin:0px"';
                    } else if(i > 0 && i < this.numberOfLines - 1) {
                        this.html += this.isInset ? ' style="margin:0px 0px 0px 0px"' : ' style="margin:0px"';
                    } else if(i < this.numberOfLines) {
                        this.html += this.isInset ? ' style="margin-top:0px"' : ' style="margin:0px"';
                    }
                }

                this.html += '>';

                /* render the buttons for the current line */
                this.renderChildViews();

                this.html += '</div>';
            }
            this.html += '</div>';
        } else {
            this.html += '<div data-role="controlgroup" href="#" id="' + this.id + '" data-type="' + this.direction + '"' + this.style() + '>';

            this.renderChildViews();

            this.html += '</div>';
        }

        return this.html;
    },

    /**
     * Triggers render() on all children of type M.ButtonGroupView.
     *
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            var currentButtonIndex = 0;

            for(var i in childViews) {
                if(this[childViews[i]] && this[childViews[i]].type === 'M.ButtonView') {
                    currentButtonIndex = currentButtonIndex + 1;

                    if(!this.numberOfLines || M.Math.round(currentButtonIndex / this.buttonsPerLine, M.CEIL) === this.currentLine) {

                        var button = this[childViews[i]];
                        /* reset buttons html, to make sure it doesn't get rendered twice if this is multi button group */
                        button.html = '';

                        button.parentView = this;
                        button.internalEvents = {
                            tap: {
                                target: this,
                                action: 'buttonSelected'
                            }
                        }

                        /* if the buttons are horizontally aligned, compute their width depending on the number of buttons
                           and set the right margin to '-2px' since the jQuery mobile default would cause an ugly gap to
                           the right of the button group */
                        if(this.direction === M.HORIZONTAL) {
                            button.cssStyle = 'margin-right:-2px;width:' + 100 / (this.numberOfLines ? this.buttonsPerLine : childViews.length) + '%';
                        }

                        /* set the button's _name property */
                        this[childViews[i]]._name = childViews[i];

                        /* finally render the button and add it to the button groups html */
                        this.html += this[childViews[i]].render();
                    }
                } else {
                    M.Logger.log('childview of button group is no button.', M.WARN);
                }
            }
        }
    },

    /**
     * This method themes the button group and activates one of the included buttons
     * if its isActive property is set.
     *
     * @private
     */
    theme: function() {
        /* if there are multiple lines of buttons, it's getting heavy */
        if(this.numberOfLines) {
            
            /* iterate through all lines */
            for(var line in this.lines) {
                line = parseInt(line);

                /* style the current line */
                $('#' + this.lines[line]).controlgroup();
                var childViews = this.getChildViewsAsArray();
                var currentButtonIndex = 0;
                
                /* if isCompact, iterate through all buttons */
                if(this.isCompact) {
                    for(var i in childViews) {
                        i = parseInt(i);
                        if(this[childViews[i]] && this[childViews[i]].type === 'M.ButtonView') {
                            currentButtonIndex = currentButtonIndex + 1;
                            var currentLine = M.Math.round(currentButtonIndex / this.buttonsPerLine, M.CEIL) - 1;
                            var button = this[childViews[i]];

                            /* if the button belongs to the current line adjust its styling according to its position,
                               e.g. the first button in the first row gets the css class 'ui-corner-tl' (top left). */
                            if(line === currentLine) {

                                /* first line */
                                if(line === 0 && this.numberOfLines > 1) {
                                    /* first button */
                                    if(currentButtonIndex === 1) {
                                        $('#' + button.id).removeClass('ui-corner-left');
                                        if(this.isInset) {
                                            $('#' + button.id).addClass('ui-corner-tl');
                                        }
                                    /* last button */
                                    } else if(currentButtonIndex === this.buttonsPerLine) {
                                        $('#' + button.id).removeClass('ui-corner-right');
                                        if(this.isInset) {
                                            $('#' + button.id).addClass('ui-corner-tr');
                                        }
                                    }
                                /* last line */
                                } else if(line === this.numberOfLines - 1) {
                                    /* first button */
                                    if(currentButtonIndex === (currentLine * this.buttonsPerLine) + 1) {
                                        $('#' + button.id).removeClass('ui-corner-left');
                                        $('#' + button.id).addClass('ui-corner-bl');
                                    /* last button */
                                    } else if(currentButtonIndex === ((currentLine + 1) * this.buttonsPerLine)) {
                                        $('#' + button.id).removeClass('ui-corner-right');
                                        $('#' + button.id).addClass('ui-corner-br');
                                    }
                                /* all other lines */
                                } else {
                                    /* first button */
                                    if(currentButtonIndex === (currentLine * this.buttonsPerLine) + 1) {
                                        $('#' + button.id).removeClass('ui-corner-left');
                                    /* last button */
                                    } else if(currentButtonIndex === ((currentLine + 1) * this.buttonsPerLine)) {
                                        $('#' + button.id).removeClass('ui-corner-right');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        /* if there is only on row, simply style that button group */
        } else {
            $('#' + this.id).controlgroup();
        }

        /* iterate through all buttons and activate on of them, according to the button's isActive property */
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            for(var i in childViews) {
                if(this[childViews[i]] && this[childViews[i]].type === 'M.ButtonView') {
                    var button = this[childViews[i]];
                    if(button.isActive) {
                        this.setActiveButton(button.id);
                    }
                }
            }
        }
    },

    /**
     * This method returns the currently selected button of this button group. If no
     * button is selected, null is returned.
     *
     * @returns {M.ButtonView} The currently active button of this button group.
     */
    getActiveButton: function() {
        return this.activeButton;  
    },

    /**
     * This method activates one button within the button group.
     *
     * @param {M.ButtonView, String} button The button to be set active or its id.
     */
    setActiveButton: function(button) {
        if(this.isSelectable) {
            if(this.activeButton) {
                this.activeButton.removeCssClass('ui-btn-active');
                this.activeButton.isActive = NO;
            }

            var obj = this[button];
            if(!obj){
                obj = M.ViewManager.getViewById(button);
            }
            if(!obj) {
                if(button && typeof(button) === 'object' && button.type === 'M.ButtonView') {
                    obj = button;
                }
            }
            if(obj) {
                obj.addCssClass('ui-btn-active');
                obj.isActive = YES;
                this.activeButton = obj;
            }
        }
    },

    /**
     * This method activates one button within the button group at the given index.
     *
     * @param {Number} index The index of the button to be set active.
     */
    setActiveButtonAtIndex: function(index) {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            var button = this[childViews[index]];
            if(button && button.type === 'M.ButtonView') {
                this.setActiveButton(button);
            }
        }
    },

    /**
     * This method is called everytime a button is activated / clicked.
     *
     * @private
     * @param {String} id The id of the selected item.
     * @param {Object} event The event.
     * @param {Object} nextEvent The application-side event handler.
     */
    buttonSelected: function(id, event, nextEvent) {
        /* if selected button is disabled, do nothing */
        if(M.ViewManager.getViewById(id) && M.ViewManager.getViewById(id).type === 'M.ButtonView' && !M.ViewManager.getViewById(id).isEnabled) {
            return;
        }

        if(!(this.activeButton && this.activeButton === M.ViewManager.getViewById(id))) {
            if(this.isSelectable) {
                if(this.activeButton) {
                    this.activeButton.removeCssClass('ui-btn-active');
                    this.activeButton.isActive = NO;
                }

                var button = M.ViewManager.getViewById(id);
                if(!button) {
                    if(id && typeof(id) === 'object' && id.type === 'M.ButtonView') {
                        button = id;
                    }
                }
                if(button) {
                    button.addCssClass('ui-btn-active');
                    button.isActive = YES;
                    this.activeButton = button;
                }
            }

            /* trigger change event for the button group */
            $('#' + this.id).trigger('change');
        }

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * Applies some style-attributes to the button group.
     *
     * @private
     * @returns {String} The button group's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.numberOfLines && !this.isInset) {
            html += ' class="ui-listview';
        }
        if(this.cssClass) {
            html += html !== '' ? ' ' + this.cssClass : ' class="' + this.cssClass;
        }
        html += '"';
        return html;
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   dominik
// Date:      28.10.11
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This is the prototype of any canvas view. It basically renders a simple canvas
 * tag into the DOM. Additionally it offers some wrappers for canvas-based methods,
 * but mostly you will just use this view for the first rendering of the canvas
 * element and then work on the dom element itself.
 *
 * @extends M.View
 */
M.CanvasView = M.View.extend(
/** @scope M.CanvasView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.CanvasView',

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['tap'],

    /**
     * This method simply renders a canvas view as a html canvas element.
     *
     * @private
     * @returns {String} The image view's styling as html representation.
     */
    render: function() {
        this.html = '<canvas id="' + this.id + '" ></canvas>';

        return this.html;
    },

    /**
     * Updates the canvas (e.g. with content binding).
     *
     * @private
     */
    renderUpdate: function() {
        // nothing so far...
    },

    /**
     * This method returns the canvas' DOM representation.
     *
     * @returns {Object} The canvas' DOM representation.
     */
    getCanvas: function() {
        return $('#' + this.id).get(0);
    },

    /**
     * This method returns the canvas' context.
     *
     * @param {String} type The context tyoe to return.
     * @returns {Object} The canvas' context.
     */
    getContext: function(type) {
        return $('#' + this.id).get(0).getContext(type);
    },

    /**
     * This method sets the canvas' size.
     *
     * @param {Number} width The width to be applied to the canvas view.
     * @param {Number} height The height to be applied to the canvas view.
     */
    setSize: function(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    },

    /**
     * This method sets the canvas' width.
     *
     * @param {Number} width The width to be applied to the canvas view.
     */
    setWidth: function(width) {
        $('#' + this.id).get(0).width = width;
    },

    /**
     * This method returns the canvas' width.
     *
     * @returns {Number} The canvas' width.
     */
    getWidth: function() {
        return $('#' + this.id).get(0).width;
    },

    /**
     * This method sets the canvas' height.
     *
     * @param {Number} height The height to be applied to the canvas view.
     */
    setHeight: function(height) {
        $('#' + this.id).get(0).height = height;
    },

    /**
     * This method returns the canvas' height.
     *
     * @returns {Number} The canvas' height.
     */
    getHeight: function() {
        return $('#' + this.id).get(0).height;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   dominik
// Date:      10.04.12
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for calculating the carousel's size based on its content.
 *
 * @type Number
 */
M.CAROUSEL_SIZE_CONTENT = 1;

/**
 * A constant value for calculating the carousel's size based on its surrounding element.
 *
 * @type Number
 */
M.CAROUSEL_SIZE_SURROUNDING_ELEMENT = 2;

/**
 * A constant value for not calculating the size at all.
 *
 * Note: you will have to take care of this instead!
 *
 * @type Number
 */
M.CAROUSEL_SIZE_NONE = 3;


/**
 * @class
 *
 * A carousel is a view that allows you to slide/scroll vertically or horizontally
 * through a set of items. If required, a paginator indicates the user which item
 * is currently visible and how many of them are there at all.
 *
 * @extends M.View
 */
M.CarouselView = M.View.extend(
/** @scope M.CarouselView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.CarouselView',

    /**
     * This property is used inernally to count the number of theme calls once the
     * carousel was added to dom.
     *
     * @private
     * @type Number
     */
    numOfThemeCalls: 0,

    /**
     * This property is used internally to store the reference width of the parent element
     * of the carousel which is needed for theming.
     *
     * @private
     * @type Number
     */
    lastWidth: 0,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['change'],

    /**
     * This property is used internally to store the iScroll object for this carousel.
     *
     * @private
     * @type Object
     */
    iScroll: null,

    /* This property contains the numerical index of the currently visible item of the
     * carousel.
     *
     * @private
     * @type Number
     */
    activeItem: 1,

    /* This property contains the number of items within the carousel.
     *
     * @private
     * @type Number
     */
    numItems: 0,

    /* This property contains a flag telling us whether the carousel was correctly
     * initialized or not. Whenever there is an orientation change event, this flag
     * needs to be reset.
     *
     * @private
     * @type Boolean
     */
    isInitialized: NO,

    /* TT
     *
     * @type Boolean
     */
    showPaginator: YES,

    /**
     * This property determines whether the carousel is vertically or horizontally
     * scrollable.
     *
     * Possible values are:
     * - M.HORIZONTAL: horizontal
     * - M.VERTICAL: vertical
     *
     * @type String
     */
    direction: M.HORIZONTAL,

    /* This property can be used to specify on what bases the size of the carousel
     * shall be calculated. By default the content of the items determine that size.
     * So the item with the longest / biggest content sets the size for all the other
     * items and the carousel itself.
     *
     * If set to M.CAROUSEL_SIZE_SURROUNDING_ELEMENT, the surrounding element will
     * determine the size of the carousel.
     *
     * If set to M.CAROUSEL_SIZE_NONE, there will be no special size calculation for
     * the carousel. You will have to take care about this instead.
     *
     * @type Number
     */
    sizeCalculator: M.CAROUSEL_SIZE_CONTENT,

    /**
     * This method renders the basic skeleton of the carousel based on several nested
     * div elements.
     *
     * @private
     * @returns {String} The carousel view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id +'" class="tmp-carousel-wrapper">';
        this.html += '<div class="tmp-carousel-scroller">';
        this.html += '<ul class="tmp-carousel-list">';

        if(this.childViews) {
            this.renderChildViews();
        }

        this.html += '</ul>';
        this.html += '</div>';
        this.html += '</div>';

        if(this.showPaginator) {
            this.html += '<div id="' + this.id + '_paginator" class="tmp-carousel-paginator tmp-carousel-paginator-' + this.direction + '"></div>';
        }

        this.html += '<div class="tmp-carousel-clear"></div>';

        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for text field views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            change: {
                target: this,
                action: 'prepareExternalCallback'
            }
        };
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * This method is called everytime a carousel item is set to active. It will prepare
     * the external callback for the change event and then call it.
     *
     * @private
     * @param {String} id The id of the selected item.
     * @param {Object} event The event.
     * @param {Object} nextEvent The application-side event handler.
     */
    prepareExternalCallback: function(id, event, nextEvent) {
        if(nextEvent) {
            var activeItem = M.ViewManager.getViewById($('#' + this.id + ' .tmp-carousel-list li:nth-child(' + this.activeItem + ')').attr('id'));
            M.EventDispatcher.callHandler(nextEvent, event, NO, [activeItem, this.activeItem - 1]);
        }
    },

    /**
     * This method is called automatically once the bound content changes. It then re-renders the
     * carousel's content.
     *
     * @private
     */
    renderUpdate: function() {
        if(this.contentBinding && this.value) {
            this.removeAllItems();

            /* lets gather the html together */
            var html = '';
            for(var i in this.value) {
                html += this.value[i].render();
            }

            /* set the num of items */
            this.numItems = this.value.length;

            /* add the items to the DOM */
            this.addItems(html);

            /* now the items are in DOM, finally register events */
            for(var i in this.value) {
                this.value[i].theme();
                this.value[i].registerEvents();
            }

            /* no re-theme the carousel (async) */
            var that = this;
            window.setTimeout(function() {
                that.isInitialized = NO;
                that.initThemeUpdate(YES);
            }, 1);
        }
    },

    /**
     * This method adds a given html string, containing the carousel's items, to the DOM.
     *
     * @param {String} item The html representation of the carousel items to be added.
     */
    addItems: function(items) {
        $('#' + this.id + ' .tmp-carousel-list').append(items);
    },

    /**
     * This method removes all of the carousel view's items by removing all of its content in the
     * DOM. This method is based on jQuery's empty().
     */
    removeAllItems: function() {
        /* remove all list items, kill the style and unbind events from list */
        $('#' + this.id + ' .tmp-carousel-list').empty();
        $('#' + this.id + ' .tmp-carousel-list').attr('style', '');
        $('#' + this.id + ' .tmp-carousel-list').unbind();

        /* kill the style and unbind events from scroller */
        $('#' + this.id + ' .tmp-carousel-scroller').attr('style', '');
        $('#' + this.id + ' .tmp-carousel-scroller').unbind();

        /* kill the style and unbind events from wrapper */
        $('#' + this.id).attr('style', '');
        $('#' + this.id).unbind();
    },

    /**
     * This method triggers the render() function on all children of type M.CarouselItemView.
     *
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();

            var numItems = 0;
            for(var i in childViews) {
                var view = this[childViews[i]];
                if(view.type === 'M.CarouselItemView') {
                    view.parentView = this;
                    view._name = childViews[i];
                    this.html += view.render();
                    numItems++;
                } else {
                    M.Logger.log('Invalid child views specified for M.CarouselView. Only M.CarouselItemView accepted.', M.WARN);
                }
            }
            this.numItems = numItems;
        } else if(!this.contentBinding) {
            M.Logger.log('No child views specified for the carousel view.', M.WARN);
        }
    },

    /**
     * This method is responsible for theming and layouting the carousel. We mainly do
     * some calculation based on the device's screen size to position the carousel
     * correctly.
     *
     * @private
     */
    theme: function() {
        var that = this;

        /* if there is no container, something went wrong, so return */
        if(!($('#' + this.id).parent() && $('#' + this.id).parent().length > 0)) {
            return;
        }

        /* if we already called this method 200 times, return */
        if(this.numOfThemeCalls >= 200) {
            return;
        }

        /* if the container is not ready yet, try again in 25ms */
        if(parseInt($('#' + this.id).css('opacity')) > 0 || $('#' + this.id).parent().width() === 0 || $('#' + this.id).parent().width() === this.lastWidth) {
            window.setTimeout(function() {
                that.theme();
            }, 25);
            this.numOfThemeCalls++;
        /* otherwise setup iscroll */
        } else {
            window.setTimeout(function() {
                /* store the last width */
                that.lastWidth = $('#' + that.id).parent().width();

                /* calculate the size of the carousel */
                var width = $('#' + that.id).parent().outerWidth();
                var height = 0;

                if(that.sizeCalculator === M.CAROUSEL_SIZE_CONTENT) {
                    $('#' + that.id + ' ul.tmp-carousel-list li').each(function() {
                        if(height < $(this).outerHeight()) {
                            height = $(this).outerHeight();
                        }
                    });
                } else if(that.sizeCalculator === M.CAROUSEL_SIZE_SURROUNDING_ELEMENT) {
                    height = parseInt($('#' + that.id).parent().css('height'));
                }

                $('#' + that.id).css('width', width);
                $('#' + that.id).css('height', height);
                $('#' + that.id + ' .tmp-carousel-scroller').css('width', (that.direction === M.HORIZONTAL ? width * that.numItems : width));
                $('#' + that.id + ' .tmp-carousel-scroller').css('height', (that.direction === M.VERTICAL ? height * that.numItems : height));
                $('#' + that.id + ' ul.tmp-carousel-list li').css('width', width);
                $('#' + that.id + ' ul.tmp-carousel-list li').css('height', height);

                /* add negative margin for any padding of outer element */
                var margin = {
                    top: -parseInt($('#' + that.id).parent().css('padding-top')),
                    right: -parseInt($('#' + that.id).parent().css('padding-right')),
                    bottom: -parseInt($('#' + that.id).parent().css('padding-bottom')),
                    left: -parseInt($('#' + that.id).parent().css('padding-left'))
                };
                _.each(margin, function(m, key) {
                    switch(key) {
                        case 'top':
                            /* if this is the first child, add negative margin */
                            if($('#' + that.id).parent().children()[0] === $('#' + that.id)[0]) {
                                $('#' + that.id).css('margin-' + key, m);
                            }
                            break;
                        case 'bottom':
                            /* if this is the last child, add negative margin */
                            if($('#' + that.id).parent().children()[$('#' + that.id).parent().children().length - 1] === $('#' + that.id)[0]) {
                                $('#' + that.id).css('margin-' + key, m);
                            }
                            break;
                        default:
                            $('#' + that.id).css('margin-' + key, m);
                            break;
                    }
                });

                if(that.iScroll) {
                    that.iScroll.refresh();
                    that.iScroll.scrollToElement('li:nth-child(' + (that.activeItem > 1 ? that.activeItem : 1) + ')', 100);
                } else {
                    that.iScroll = new iScroll(that.id, {
                        snap: true,
                        momentum: false,
                        hScrollbar: false,
                        vScrollbar: false,
                        onScrollEnd: function () {
                            var nextItem = null;
                            if(that.direction === M.HORIZONTAL) {
                                var width = parseInt($('#' + that.id + ' ul.tmp-carousel-list li').css('width'));
                                nextItem = Math.abs(Math.floor(that.iScroll.x / width)) + 1;
                            } else {
                                var height = parseInt($('#' + that.id + ' ul.tmp-carousel-list li').css('height'));
                                nextItem = Math.abs(Math.ceil(that.iScroll.y / height)) + 1;
                            }

                            if(nextItem !== that.activeItem) {
                                $('#' + that.id + '_paginator_' + that.activeItem).removeClass('tmp-carousel-paginator-item-active');
                                that.activeItem = nextItem;
                                $('#' + that.id + '_paginator_' + that.activeItem).addClass('tmp-carousel-paginator-item-active');
                            }

                            /* trigger change event for the button group */
                            $('#' + that.id).trigger('change');
                        }
                    });
                }

                /* position and calculate the paginator (async) */
                var paginatorDOM = $('#' + that.id + '_paginator');
                paginatorDOM.css('opacity', 0);
                window.setTimeout(function() {
                    /* render paginator items? */
                    if(!paginatorDOM.html()) {
                        var html = '';
                        for(var i = 1; i <= that.numItems; i++) {
                            html += '<div id="' + that.id + '_paginator_' + i + '" class="tmp-carousel-paginator-item' + (i === that.activeItem ? ' tmp-carousel-paginator-item-active' : '') + '"></div>';
                        }
                        paginatorDOM.html(html);
                    }

                    /* css stuff */
                    if(that.direction === M.HORIZONTAL) {
                        paginatorDOM.css('width', width);
                        paginatorDOM.css('top', $('#' + that.id).position().top + parseInt($('#' + that.id + ' .tmp-carousel-scroller').css('height')) - parseInt($('#' + that.id + '_paginator').css('height')));
                    } else {
                        paginatorDOM.css('top', $('#' + that.id).position().top + (parseInt($('#' + that.id).css('height')) - parseInt(paginatorDOM.height()))/2);
                    }
                    paginatorDOM.css('margin-top', margin['top']);
                    paginatorDOM.animate({
                        opacity: 1
                    }, 100);
                }, 500);

                /* display carousel */
                $('#' + that.id).animate({
                    opacity: 1
                }, 100);

                /* set isInitialized flag to YES */
                that.isInitialized = YES;
            }, 100);
        }
    },

    /**
     * This method is automatically called by the surrounding page once an orientation
     * change event took place.
     *
     * @private
     */
    orientationDidChange: function() {
        this.isInitialized = NO;
        this.initThemeUpdate();
    },

    /**
     * This method is automatically called once there was an event that might require
     * an re-theming of the carousel such as orientation change or page show.
     *
     * @private
     */
    initThemeUpdate: function(initFromScratch) {
        /* if this carousel already is initialized, return */
        if(this.isInitialized) {
            return;
        }

        /* if this is a total refresh, clean some things up */
        if(initFromScratch) {
            this.lastWidth = 0;
            $('#' + this.id + '_paginator').html('');
        }

        /* reset theme counter */
        this.numOfThemeCalls = 0;

        /* hide carousel */
        $('#' + this.id).css('opacity', 0);

        /* hide the paginator (if available) */
        $('#' + this.id + '_paginator').css('opacity', 0);

        /* init the re-theming (but give the carousel some time to get invisible) */
        var that = this;
        window.setTimeout(function() {
            that.theme();
        }, 100)
    },

    /**
     * This method activates one specific item within the carousel.
     *
     * @param {M.CarouselItemView, String} item The item to be set active or its id.
     */
    setActiveItem: function(item) {
        /* get the item based on the given obj or the given id */
        item = typeof(item) === 'string' ? M.ViewManager.getViewById(item) : item;
        if(!(item && item.type === 'M.CarouselItemView')) {
            M.Logger.log('No valid carousel item passed to be set active. Must be either valid id or item object of type M.CarouselItemView.', M.WARN);
            return;
        }

        /* if item is already active, return */
        var activeItem = M.ViewManager.getViewById($('#' + this.id + ' .tmp-carousel-list li.tmp-carousel-item:nth-child(' + this.activeItem + ')').attr('id'));
        if(activeItem && activeItem.id === item.id) {
            M.Logger.log('The given carousel item already is active, so we do nothing.', M.INFO);
            return;
        }

        /* set given item active */
        $('#' + this.id + '_paginator_' + this.activeItem).removeClass('tmp-carousel-paginator-item-active');
        this.activeItem = 1;
        var that = this;
        $('#' + this.id + ' .tmp-carousel-list li.tmp-carousel-item').each(function() {
            if($(this).attr('id') !== item.id) {
                that.activeItem++;
            } else {
                return false;
            }
        });
        /* highlight active item in paginator again */
        $('#' + this.id + '_paginator_' + this.activeItem).addClass('tmp-carousel-paginator-item-active');
        this.iScroll.scrollToElement('li.tmp-carousel-item:nth-child(' + (this.activeItem > 1 ? this.activeItem : 1) + ')', 100);
    },

    /**
     * This method activates the next item in the row.
     */
    next: function() {
        var nextItem = $('#' + this.id + ' .tmp-carousel-list li:nth-child(' + this.activeItem + ')').next();
        if(nextItem.length === 0) {
            M.Logger.log('There is no next item available. You already reached the end of the carousel.', M.INFO);
            return;
        }
        this.setActiveItem(M.ViewManager.getViewById(nextItem.attr('id')));
    },

    /**
     * This method activates the previous item in the row.
     */
    prev: function() {
        var prevItem = $('#' + this.id + ' .tmp-carousel-list li:nth-child(' + this.activeItem + ')').prev();
        if(prevItem.length === 0) {
            M.Logger.log('There is no previous item available. You already reached the start of the carousel.', M.INFO);
            return;
        }
        this.setActiveItem(M.ViewManager.getViewById(prevItem.attr('id')));
    }

});

/* iScroll */
(function(){var g=Math,f=/webkit/i.test(navigator.appVersion)?"webkit":/firefox/i.test(navigator.userAgent)?"Moz":/trident/i.test(navigator.userAgent)?"ms":"opera"in window?"O":"",t=/android/gi.test(navigator.appVersion),u=/iphone|ipad/gi.test(navigator.appVersion),p=/playbook/gi.test(navigator.appVersion),B=/hp-tablet/gi.test(navigator.appVersion),v="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,l="ontouchstart"in window&&!B,z=f+"Transform"in document.documentElement.style,C=u||p,D=function(){return window.requestAnimationFrame||
window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(b){return setTimeout(b,1)}}(),A=window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout,w="onorientationchange"in window?"orientationchange":"resize",x=l?"touchstart":"mousedown",
q=l?"touchmove":"mousemove",r=l?"touchend":"mouseup",s=l?"touchcancel":"mouseup",y="Moz"==f?"DOMMouseScroll":"mousewheel",n="translate"+(v?"3d(":"("),o=v?",0)":")",p=function(b,a){var c=this,d;c.wrapper="object"==typeof b?b:document.getElementById(b);c.wrapper.style.overflow="hidden";c.scroller=c.wrapper.children[0];c.options={hScroll:!0,vScroll:!0,x:0,y:0,bounce:!0,bounceLock:!1,momentum:!0,lockDirection:!0,useTransform:!0,useTransition:!1,topOffset:0,checkDOMChanges:!1,hScrollbar:!0,vScrollbar:!0,
fixedScrollbar:t,hideScrollbar:u,fadeScrollbar:u&&v,scrollbarClass:"",zoom:!1,zoomMin:1,zoomMax:4,doubleTapZoom:2,wheelAction:"scroll",snap:!1,snapThreshold:1,onRefresh:null,onBeforeScrollStart:function(a){a.preventDefault()},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:null,onBeforeScrollEnd:null,onScrollEnd:null,onTouchEnd:null,onDestroy:null,onZoomStart:null,onZoom:null,onZoomEnd:null};for(d in a)c.options[d]=a[d];c.x=c.options.x;c.y=c.options.y;c.options.useTransform=z?c.options.useTransform:
!1;c.options.hScrollbar=c.options.hScroll&&c.options.hScrollbar;c.options.vScrollbar=c.options.vScroll&&c.options.vScrollbar;c.options.zoom=c.options.useTransform&&c.options.zoom;c.options.useTransition=C&&c.options.useTransition;c.options.zoom&&t&&(n="translate(",o=")");c.scroller.style[f+"TransitionProperty"]=c.options.useTransform?"-"+f.toLowerCase()+"-transform":"top left";c.scroller.style[f+"TransitionDuration"]="0";c.scroller.style[f+"TransformOrigin"]="0 0";c.options.useTransition&&(c.scroller.style[f+
"TransitionTimingFunction"]="cubic-bezier(0.33,0.66,0.66,1)");c.options.useTransform?c.scroller.style[f+"Transform"]=n+c.x+"px,"+c.y+"px"+o:c.scroller.style.cssText+=";position:absolute;top:"+c.y+"px;left:"+c.x+"px";c.options.useTransition&&(c.options.fixedScrollbar=!0);c.refresh();c._bind(w,window);c._bind(x);l||(c._bind("mouseout",c.wrapper),"none"!=c.options.wheelAction&&c._bind(y));c.options.checkDOMChanges&&(c.checkDOMTime=setInterval(function(){c._checkDOMChanges()},500))};p.prototype={enabled:!0,
x:0,y:0,steps:[],scale:1,currPageX:0,currPageY:0,pagesX:[],pagesY:[],aniTime:null,wheelZoomCount:0,handleEvent:function(b){switch(b.type){case x:if(!l&&0!==b.button)break;this._start(b);break;case q:this._move(b);break;case r:case s:this._end(b);break;case w:this._resize();break;case y:this._wheel(b);break;case "mouseout":this._mouseout(b);break;case "webkitTransitionEnd":this._transitionEnd(b)}},_checkDOMChanges:function(){!this.moved&&!this.zoomed&&!(this.animating||this.scrollerW==this.scroller.offsetWidth*
this.scale&&this.scrollerH==this.scroller.offsetHeight*this.scale)&&this.refresh()},_scrollbar:function(b){var a=document,c;this[b+"Scrollbar"]?(this[b+"ScrollbarWrapper"]||(c=a.createElement("div"),this.options.scrollbarClass?c.className=this.options.scrollbarClass+b.toUpperCase():c.style.cssText="position:absolute;z-index:100;"+("h"==b?"height:7px;bottom:1px;left:2px;right:"+(this.vScrollbar?"7":"2")+"px":"width:7px;bottom:"+(this.hScrollbar?"7":"2")+"px;top:2px;right:1px"),c.style.cssText+=";pointer-events:none;-"+
f+"-transition-property:opacity;-"+f+"-transition-duration:"+(this.options.fadeScrollbar?"350ms":"0")+";overflow:hidden;opacity:"+(this.options.hideScrollbar?"0":"1"),this.wrapper.appendChild(c),this[b+"ScrollbarWrapper"]=c,c=a.createElement("div"),this.options.scrollbarClass||(c.style.cssText="position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-"+f+"-background-clip:padding-box;-"+f+"-box-sizing:border-box;"+("h"==b?"height:100%":"width:100%")+";-"+f+
"-border-radius:3px;border-radius:3px"),c.style.cssText+=";pointer-events:none;-"+f+"-transition-property:-"+f+"-transform;-"+f+"-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-"+f+"-transition-duration:0;-"+f+"-transform:"+n+"0,0"+o,this.options.useTransition&&(c.style.cssText+=";-"+f+"-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"),this[b+"ScrollbarWrapper"].appendChild(c),this[b+"ScrollbarIndicator"]=c),"h"==b?(this.hScrollbarSize=this.hScrollbarWrapper.clientWidth,this.hScrollbarIndicatorSize=
g.max(this.hScrollbarSize*this.hScrollbarSize/this.scrollerW>>0,8),this.hScrollbarIndicator.style.width=this.hScrollbarIndicatorSize+"px",this.hScrollbarMaxScroll=this.hScrollbarSize-this.hScrollbarIndicatorSize,this.hScrollbarProp=this.hScrollbarMaxScroll/this.maxScrollX):(this.vScrollbarSize=this.vScrollbarWrapper.clientHeight,this.vScrollbarIndicatorSize=g.max(this.vScrollbarSize*this.vScrollbarSize/this.scrollerH>>0,8),this.vScrollbarIndicator.style.height=this.vScrollbarIndicatorSize+"px",this.vScrollbarMaxScroll=
this.vScrollbarSize-this.vScrollbarIndicatorSize,this.vScrollbarProp=this.vScrollbarMaxScroll/this.maxScrollY),this._scrollbarPos(b,!0)):this[b+"ScrollbarWrapper"]&&(z&&(this[b+"ScrollbarIndicator"].style[f+"Transform"]=""),this[b+"ScrollbarWrapper"].parentNode.removeChild(this[b+"ScrollbarWrapper"]),this[b+"ScrollbarWrapper"]=null,this[b+"ScrollbarIndicator"]=null)},_resize:function(){var b=this;setTimeout(function(){b.refresh()},t?200:0)},_pos:function(b,a){b=this.hScroll?b:0;a=this.vScroll?a:0;
this.options.useTransform?this.scroller.style[f+"Transform"]=n+b+"px,"+a+"px"+o+" scale("+this.scale+")":(b>>=0,a>>=0,this.scroller.style.left=b+"px",this.scroller.style.top=a+"px");this.x=b;this.y=a;this._scrollbarPos("h");this._scrollbarPos("v")},_scrollbarPos:function(b,a){var c="h"==b?this.x:this.y;this[b+"Scrollbar"]&&(c*=this[b+"ScrollbarProp"],0>c?(this.options.fixedScrollbar||(c=this[b+"ScrollbarIndicatorSize"]+(3*c>>0),8>c&&(c=8),this[b+"ScrollbarIndicator"].style["h"==b?"width":"height"]=
c+"px"),c=0):c>this[b+"ScrollbarMaxScroll"]&&(this.options.fixedScrollbar?c=this[b+"ScrollbarMaxScroll"]:(c=this[b+"ScrollbarIndicatorSize"]-(3*(c-this[b+"ScrollbarMaxScroll"])>>0),8>c&&(c=8),this[b+"ScrollbarIndicator"].style["h"==b?"width":"height"]=c+"px",c=this[b+"ScrollbarMaxScroll"]+(this[b+"ScrollbarIndicatorSize"]-c))),this[b+"ScrollbarWrapper"].style[f+"TransitionDelay"]="0",this[b+"ScrollbarWrapper"].style.opacity=a&&this.options.hideScrollbar?"0":"1",this[b+"ScrollbarIndicator"].style[f+
"Transform"]=n+("h"==b?c+"px,0":"0,"+c+"px")+o)},_start:function(b){var a=l?b.touches[0]:b,c,d;if(this.enabled){this.options.onBeforeScrollStart&&this.options.onBeforeScrollStart.call(this,b);(this.options.useTransition||this.options.zoom)&&this._transitionTime(0);this.zoomed=this.animating=this.moved=!1;this.dirY=this.dirX=this.absDistY=this.absDistX=this.distY=this.distX=0;this.options.zoom&&l&&1<b.touches.length&&(d=g.abs(b.touches[0].pageX-b.touches[1].pageX),c=g.abs(b.touches[0].pageY-b.touches[1].pageY),
this.touchesDistStart=g.sqrt(d*d+c*c),this.originX=g.abs(b.touches[0].pageX+b.touches[1].pageX-2*this.wrapperOffsetLeft)/2-this.x,this.originY=g.abs(b.touches[0].pageY+b.touches[1].pageY-2*this.wrapperOffsetTop)/2-this.y,this.options.onZoomStart&&this.options.onZoomStart.call(this,b));if(this.options.momentum&&(this.options.useTransform?(c=getComputedStyle(this.scroller,null)[f+"Transform"].replace(/[^0-9-.,]/g,"").split(","),d=1*c[4],c=1*c[5]):(d=1*getComputedStyle(this.scroller,null).left.replace(/[^0-9-]/g,
""),c=1*getComputedStyle(this.scroller,null).top.replace(/[^0-9-]/g,"")),d!=this.x||c!=this.y))this.options.useTransition?this._unbind("webkitTransitionEnd"):A(this.aniTime),this.steps=[],this._pos(d,c);this.absStartX=this.x;this.absStartY=this.y;this.startX=this.x;this.startY=this.y;this.pointX=a.pageX;this.pointY=a.pageY;this.startTime=b.timeStamp||Date.now();this.options.onScrollStart&&this.options.onScrollStart.call(this,b);this._bind(q);this._bind(r);this._bind(s)}},_move:function(b){var a=l?
b.touches[0]:b,c=a.pageX-this.pointX,d=a.pageY-this.pointY,e=this.x+c,i=this.y+d,h=b.timeStamp||Date.now();this.options.onBeforeScrollMove&&this.options.onBeforeScrollMove.call(this,b);if(this.options.zoom&&l&&1<b.touches.length)e=g.abs(b.touches[0].pageX-b.touches[1].pageX),i=g.abs(b.touches[0].pageY-b.touches[1].pageY),this.touchesDist=g.sqrt(e*e+i*i),this.zoomed=!0,a=1/this.touchesDistStart*this.touchesDist*this.scale,a<this.options.zoomMin?a=0.5*this.options.zoomMin*Math.pow(2,a/this.options.zoomMin):
a>this.options.zoomMax&&(a=2*this.options.zoomMax*Math.pow(0.5,this.options.zoomMax/a)),this.lastScale=a/this.scale,e=this.originX-this.originX*this.lastScale+this.x,i=this.originY-this.originY*this.lastScale+this.y,this.scroller.style[f+"Transform"]=n+e+"px,"+i+"px"+o+" scale("+a+")",this.options.onZoom&&this.options.onZoom.call(this,b);else{this.pointX=a.pageX;this.pointY=a.pageY;if(0<e||e<this.maxScrollX)e=this.options.bounce?this.x+c/2:0<=e||0<=this.maxScrollX?0:this.maxScrollX;if(i>this.minScrollY||
i<this.maxScrollY)i=this.options.bounce?this.y+d/2:i>=this.minScrollY||0<=this.maxScrollY?this.minScrollY:this.maxScrollY;this.distX+=c;this.distY+=d;this.absDistX=g.abs(this.distX);this.absDistY=g.abs(this.distY);6>this.absDistX&&6>this.absDistY||(this.options.lockDirection&&(this.absDistX>this.absDistY+5?(i=this.y,d=0):this.absDistY>this.absDistX+5&&(e=this.x,c=0)),this.moved=!0,this._pos(e,i),this.dirX=0<c?-1:0>c?1:0,this.dirY=0<d?-1:0>d?1:0,300<h-this.startTime&&(this.startTime=h,this.startX=
this.x,this.startY=this.y),this.options.onScrollMove&&this.options.onScrollMove.call(this,b))}},_end:function(b){if(!(l&&0!=b.touches.length)){var a=this,c=l?b.changedTouches[0]:b,d,e,i={dist:0,time:0},h={dist:0,time:0},k=(b.timeStamp||Date.now())-a.startTime,j=a.x,m=a.y;a._unbind(q);a._unbind(r);a._unbind(s);a.options.onBeforeScrollEnd&&a.options.onBeforeScrollEnd.call(a,b);if(a.zoomed)j=a.scale*a.lastScale,j=Math.max(a.options.zoomMin,j),j=Math.min(a.options.zoomMax,j),a.lastScale=j/a.scale,a.scale=
j,a.x=a.originX-a.originX*a.lastScale+a.x,a.y=a.originY-a.originY*a.lastScale+a.y,a.scroller.style[f+"TransitionDuration"]="200ms",a.scroller.style[f+"Transform"]=n+a.x+"px,"+a.y+"px"+o+" scale("+a.scale+")",a.zoomed=!1,a.refresh(),a.options.onZoomEnd&&a.options.onZoomEnd.call(a,b);else{if(a.moved){if(300>k&&a.options.momentum){i=j?a._momentum(j-a.startX,k,-a.x,a.scrollerW-a.wrapperW+a.x,a.options.bounce?a.wrapperW:0):i;h=m?a._momentum(m-a.startY,k,-a.y,0>a.maxScrollY?a.scrollerH-a.wrapperH+a.y-a.minScrollY:
0,a.options.bounce?a.wrapperH:0):h;j=a.x+i.dist;m=a.y+h.dist;if(0<a.x&&0<j||a.x<a.maxScrollX&&j<a.maxScrollX)i={dist:0,time:0};if(a.y>a.minScrollY&&m>a.minScrollY||a.y<a.maxScrollY&&m<a.maxScrollY)h={dist:0,time:0}}i.dist||h.dist?(i=g.max(g.max(i.time,h.time),10),a.options.snap&&(h=j-a.absStartX,k=m-a.absStartY,g.abs(h)<a.options.snapThreshold&&g.abs(k)<a.options.snapThreshold?a.scrollTo(a.absStartX,a.absStartY,200):(h=a._snap(j,m),j=h.x,m=h.y,i=g.max(h.time,i))),a.scrollTo(j>>0,m>>0,i)):a.options.snap?
(h=j-a.absStartX,k=m-a.absStartY,g.abs(h)<a.options.snapThreshold&&g.abs(k)<a.options.snapThreshold?a.scrollTo(a.absStartX,a.absStartY,200):(h=a._snap(a.x,a.y),(h.x!=a.x||h.y!=a.y)&&a.scrollTo(h.x,h.y,h.time))):a._resetPos(200)}else l&&(a.doubleTapTimer&&a.options.zoom?(clearTimeout(a.doubleTapTimer),a.doubleTapTimer=null,a.options.onZoomStart&&a.options.onZoomStart.call(a,b),a.zoom(a.pointX,a.pointY,1==a.scale?a.options.doubleTapZoom:1),a.options.onZoomEnd&&setTimeout(function(){a.options.onZoomEnd.call(a,
b)},200)):a.doubleTapTimer=setTimeout(function(){a.doubleTapTimer=null;for(d=c.target;1!=d.nodeType;)d=d.parentNode;"SELECT"!=d.tagName&&"INPUT"!=d.tagName&&"TEXTAREA"!=d.tagName&&(e=document.createEvent("MouseEvents"),e.initMouseEvent("click",!0,!0,b.view,1,c.screenX,c.screenY,c.clientX,c.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,0,null),e._fake=!0,d.dispatchEvent(e))},a.options.zoom?250:0)),a._resetPos(200);a.options.onTouchEnd&&a.options.onTouchEnd.call(a,b)}}},_resetPos:function(b){var a=
0<=this.x?0:this.x<this.maxScrollX?this.maxScrollX:this.x,c=this.y>=this.minScrollY||0<this.maxScrollY?this.minScrollY:this.y<this.maxScrollY?this.maxScrollY:this.y;if(a==this.x&&c==this.y){if(this.moved&&(this.moved=!1,this.options.onScrollEnd&&this.options.onScrollEnd.call(this)),this.hScrollbar&&this.options.hideScrollbar&&("webkit"==f&&(this.hScrollbarWrapper.style[f+"TransitionDelay"]="300ms"),this.hScrollbarWrapper.style.opacity="0"),this.vScrollbar&&this.options.hideScrollbar)"webkit"==f&&
(this.vScrollbarWrapper.style[f+"TransitionDelay"]="300ms"),this.vScrollbarWrapper.style.opacity="0"}else this.scrollTo(a,c,b||0)},_wheel:function(b){var a=this,c,d;if("wheelDeltaX"in b)c=b.wheelDeltaX/12,d=b.wheelDeltaY/12;else if("wheelDelta"in b)c=d=b.wheelDelta/12;else if("detail"in b)c=d=3*-b.detail;else return;if("zoom"==a.options.wheelAction){if(d=a.scale*Math.pow(2,1/3*(d?d/Math.abs(d):0)),d<a.options.zoomMin&&(d=a.options.zoomMin),d>a.options.zoomMax&&(d=a.options.zoomMax),d!=a.scale)!a.wheelZoomCount&&
a.options.onZoomStart&&a.options.onZoomStart.call(a,b),a.wheelZoomCount++,a.zoom(b.pageX,b.pageY,d,400),setTimeout(function(){a.wheelZoomCount--;!a.wheelZoomCount&&a.options.onZoomEnd&&a.options.onZoomEnd.call(a,b)},400)}else c=a.x+c,d=a.y+d,0<c?c=0:c<a.maxScrollX&&(c=a.maxScrollX),d>a.minScrollY?d=a.minScrollY:d<a.maxScrollY&&(d=a.maxScrollY),a.scrollTo(c,d,0)},_mouseout:function(b){var a=b.relatedTarget;if(a)for(;a=a.parentNode;)if(a==this.wrapper)return;this._end(b)},_transitionEnd:function(b){b.target==
this.scroller&&(this._unbind("webkitTransitionEnd"),this._startAni())},_startAni:function(){var b=this,a=b.x,c=b.y,d=Date.now(),e,f,h;b.animating||(b.steps.length?(e=b.steps.shift(),e.x==a&&e.y==c&&(e.time=0),b.animating=!0,b.moved=!0,b.options.useTransition)?(b._transitionTime(e.time),b._pos(e.x,e.y),b.animating=!1,e.time?b._bind("webkitTransitionEnd"):b._resetPos(0)):(h=function(){var k=Date.now(),j;if(k>=d+e.time){b._pos(e.x,e.y);b.animating=false;b.options.onAnimationEnd&&b.options.onAnimationEnd.call(b);
b._startAni()}else{k=(k-d)/e.time-1;f=g.sqrt(1-k*k);k=(e.x-a)*f+a;j=(e.y-c)*f+c;b._pos(k,j);if(b.animating)b.aniTime=D(h)}},h()):b._resetPos(400))},_transitionTime:function(b){b+="ms";this.scroller.style[f+"TransitionDuration"]=b;this.hScrollbar&&(this.hScrollbarIndicator.style[f+"TransitionDuration"]=b);this.vScrollbar&&(this.vScrollbarIndicator.style[f+"TransitionDuration"]=b)},_momentum:function(b,a,c,d,e){var a=g.abs(b)/a,f=a*a/0.0012;0<b&&f>c?(c+=e/(6/(6.0E-4*(f/a))),a=a*c/f,f=c):0>b&&f>d&&(d+=
e/(6/(6.0E-4*(f/a))),a=a*d/f,f=d);return{dist:f*(0>b?-1:1),time:a/6.0E-4>>0}},_offset:function(b){for(var a=-b.offsetLeft,c=-b.offsetTop;b=b.offsetParent;)a-=b.offsetLeft,c-=b.offsetTop;b!=this.wrapper&&(a*=this.scale,c*=this.scale);return{left:a,top:c}},_snap:function(b,a){var c,d,e;e=this.pagesX.length-1;c=0;for(d=this.pagesX.length;c<d;c++)if(b>=this.pagesX[c]){e=c;break}e==this.currPageX&&0<e&&0>this.dirX&&e--;b=this.pagesX[e];d=(d=g.abs(b-this.pagesX[this.currPageX]))?500*(g.abs(this.x-b)/d):
0;this.currPageX=e;e=this.pagesY.length-1;for(c=0;c<e;c++)if(a>=this.pagesY[c]){e=c;break}e==this.currPageY&&0<e&&0>this.dirY&&e--;a=this.pagesY[e];c=(c=g.abs(a-this.pagesY[this.currPageY]))?500*(g.abs(this.y-a)/c):0;this.currPageY=e;e=g.max(d,c)>>0;return{x:b,y:a,time:e||200}},_bind:function(b,a,c){(a||this.scroller).addEventListener(b,this,!!c)},_unbind:function(b,a,c){(a||this.scroller).removeEventListener(b,this,!!c)},destroy:function(){this.scroller.style[f+"Transform"]="";this.vScrollbar=this.hScrollbar=
!1;this._scrollbar("h");this._scrollbar("v");this._unbind(w,window);this._unbind(x);this._unbind(q);this._unbind(r);this._unbind(s);this.options.hasTouch||(this._unbind("mouseout",this.wrapper),this._unbind(y));this.options.useTransition&&this._unbind("webkitTransitionEnd");this.options.checkDOMChanges&&clearInterval(this.checkDOMTime);this.options.onDestroy&&this.options.onDestroy.call(this)},refresh:function(){var b,a,c,d=0;a=0;this.scale<this.options.zoomMin&&(this.scale=this.options.zoomMin);
this.wrapperW=this.wrapper.clientWidth||1;this.wrapperH=this.wrapper.clientHeight||1;this.minScrollY=-this.options.topOffset||0;this.scrollerW=this.scroller.offsetWidth*this.scale>>0;this.scrollerH=(this.scroller.offsetHeight+this.minScrollY)*this.scale>>0;this.maxScrollX=this.wrapperW-this.scrollerW;this.maxScrollY=this.wrapperH-this.scrollerH+this.minScrollY;this.dirY=this.dirX=0;this.options.onRefresh&&this.options.onRefresh.call(this);this.hScroll=this.options.hScroll&&0>this.maxScrollX;this.vScroll=
this.options.vScroll&&(!this.options.bounceLock&&!this.hScroll||this.scrollerH>this.wrapperH);this.hScrollbar=this.hScroll&&this.options.hScrollbar;this.vScrollbar=this.vScroll&&this.options.vScrollbar&&this.scrollerH>this.wrapperH;b=this._offset(this.wrapper);this.wrapperOffsetLeft=-b.left;this.wrapperOffsetTop=-b.top;if("string"==typeof this.options.snap){this.pagesX=[];this.pagesY=[];c=this.scroller.querySelectorAll(this.options.snap);b=0;for(a=c.length;b<a;b++)d=this._offset(c[b]),d.left+=this.wrapperOffsetLeft,
d.top+=this.wrapperOffsetTop,this.pagesX[b]=d.left<this.maxScrollX?this.maxScrollX:d.left*this.scale,this.pagesY[b]=d.top<this.maxScrollY?this.maxScrollY:d.top*this.scale}else if(this.options.snap){for(this.pagesX=[];d>=this.maxScrollX;)this.pagesX[a]=d,d-=this.wrapperW,a++;this.maxScrollX%this.wrapperW&&(this.pagesX[this.pagesX.length]=this.maxScrollX-this.pagesX[this.pagesX.length-1]+this.pagesX[this.pagesX.length-1]);a=d=0;for(this.pagesY=[];d>=this.maxScrollY;)this.pagesY[a]=d,d-=this.wrapperH,
a++;this.maxScrollY%this.wrapperH&&(this.pagesY[this.pagesY.length]=this.maxScrollY-this.pagesY[this.pagesY.length-1]+this.pagesY[this.pagesY.length-1])}this._scrollbar("h");this._scrollbar("v");this.zoomed||(this.scroller.style[f+"TransitionDuration"]="0",this._resetPos(200))},scrollTo:function(b,a,c,d){var e=b;this.stop();e.length||(e=[{x:b,y:a,time:c,relative:d}]);b=0;for(a=e.length;b<a;b++)e[b].relative&&(e[b].x=this.x-e[b].x,e[b].y=this.y-e[b].y),this.steps.push({x:e[b].x,y:e[b].y,time:e[b].time||
0});this._startAni()},scrollToElement:function(b,a){var c;if(b=b.nodeType?b:this.scroller.querySelector(b))c=this._offset(b),c.left+=this.wrapperOffsetLeft,c.top+=this.wrapperOffsetTop,c.left=0<c.left?0:c.left<this.maxScrollX?this.maxScrollX:c.left,c.top=c.top>this.minScrollY?this.minScrollY:c.top<this.maxScrollY?this.maxScrollY:c.top,a=void 0===a?g.max(2*g.abs(c.left),2*g.abs(c.top)):a,this.scrollTo(c.left,c.top,a)},scrollToPage:function(b,a,c){c=void 0===c?400:c;this.options.onScrollStart&&this.options.onScrollStart.call(this);
if(this.options.snap)b="next"==b?this.currPageX+1:"prev"==b?this.currPageX-1:b,a="next"==a?this.currPageY+1:"prev"==a?this.currPageY-1:a,b=0>b?0:b>this.pagesX.length-1?this.pagesX.length-1:b,a=0>a?0:a>this.pagesY.length-1?this.pagesY.length-1:a,this.currPageX=b,this.currPageY=a,b=this.pagesX[b],a=this.pagesY[a];else if(b*=-this.wrapperW,a*=-this.wrapperH,b<this.maxScrollX&&(b=this.maxScrollX),a<this.maxScrollY)a=this.maxScrollY;this.scrollTo(b,a,c)},disable:function(){this.stop();this._resetPos(0);
this.enabled=!1;this._unbind(q);this._unbind(r);this._unbind(s)},enable:function(){this.enabled=!0},stop:function(){this.options.useTransition?this._unbind("webkitTransitionEnd"):A(this.aniTime);this.steps=[];this.animating=this.moved=!1},zoom:function(b,a,c,d){var e=c/this.scale;this.options.useTransform&&(this.zoomed=!0,d=void 0===d?200:d,b=b-this.wrapperOffsetLeft-this.x,a=a-this.wrapperOffsetTop-this.y,this.x=b-b*e+this.x,this.y=a-a*e+this.y,this.scale=c,this.refresh(),this.x=0<this.x?0:this.x<
this.maxScrollX?this.maxScrollX:this.x,this.y=this.y>this.minScrollY?this.minScrollY:this.y<this.maxScrollY?this.maxScrollY:this.y,this.scroller.style[f+"TransitionDuration"]=d+"ms",this.scroller.style[f+"Transform"]=n+this.x+"px,"+this.y+"px"+o+" scale("+c+")",this.zoomed=!1)},isReady:function(){return!this.moved&&!this.zoomed&&!this.animating}};"undefined"!==typeof exports?exports.iScroll=p:window.iScroll=p})();

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   dominik
// Date:      10.04.12
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * A carousel item view is the one and only valid sub view of a carousel view. It basically
 * serves as a container that allows you to put anything into such an element. Simply
 * apply as much child views as you like and let this view (in combination with the carousel)
 * take care of the rest.
 *
 * @extends M.View
 */
M.CarouselItemView = M.View.extend(
/** @scope M.CarouselItemView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.CarouselItemView',

    /**
     * This property can be used to specify a tag, that is independent from the carousel
     * item's content. This allows you to identify a carousel item e.g. within the callback
     * of the carousel's change event.
     *
     * @type String
     */
    tag: null,

    /**
     * This method renders a carousel item and its content with an li element as the
     * surrounding element.
     *
     * @private
     * @returns {String} The carousel item view's html representation.
     */
    render: function() {
        this.html = '<li id="' + this.id + '" class="tmp-carousel-item">';

        this.renderChildViews();

        this.html += '</li>';

        return this.html;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      01.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * A container view renders a simple div container that can be used to display
 * any html valid content, e.g. by third party frameworks.
 *
 * @extends M.View
 */
M.ContainerView = M.View.extend(
/** @scope M.ContainerView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ContainerView',

    /**
     * Renders a simple div container and applies css classes if specified.
     *
     * @private
     * @returns {String} The container view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '"' + this.style() + '>';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Applies some style-attributes to the container view.
     *
     * @private
     * @returns {String} The container's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      09.08.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * A dashboard view displays images and a corresponding text in a grid-like view
 * and serves as the homescreen of an application. By tapping on of the icons, a
 * user can access certain features of an app. By default, there are three icons
 * in a row and three rows per page possible. But you can easily adjust this to
 * your custom needs.
 *
 * @extends M.View
 */
M.DashboardView = M.View.extend(
/** @scope M.DashboardView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.DashboardView',

    /**
     * This property can be used to customize the number of items a dashboard
     * shows per line. By default this is set to three.
     *
     * @type Number
     */
    itemsPerLine: 3,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap'],

    /**
     * This property is used internally for storing the items of a dashboard, when using
     * the content binding feature.
     *
     * @private
     */
    items: [],

    /**
     * This property can be used to specify whether or not the dashboard can be re-arranged
     * by a user.
     *
     * @type Boolean
     */
    isEditable: NO,

    /**
     * This property is used internally to indicate whether the dashboard is currently in
     * edit mode or not.
     *
     * @private
     * @type Boolean
     */
    isInEditMode: NO,

    /**
     * This property defines the dashboard's name. This is used internally to identify
     * the dashboard inside the DOM.
     *
     * Note: If you are using more than one dashboard inside your application, make sure
     * you provide different names.
     *
     * @type String
     */
    name: 'dashboard',

    /**
     * This property is used internally to track the position of touch events.
     *
     * @private
     */
    touchPositions: null,

    /**
     * This property is used internally to know of what type the latest touch events was.
     *
     * @private
     */
    latestTouchEventType: null,

    /**
     * Renders a dashboard.
     *
     * @private
     * @returns {String} The dashboard view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '"' + this.style() + '>';
        this.renderChildViews();
        this.html += '</div>';

        /* clear floating */
        this.html += '<div class="tmp-dashboard-line-clear"></div>';

        /* init the touchPositions property */
        this.touchPositions = {};

        return this.html;
    },

    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();

            /* lets gather the html together */
            for(var i in childViews) {
                /* set the dashboard item's _name and parentView property */
                this[childViews[i]].parentView = this;
                this[childViews[i]]._name = childViews[i];

                this.html += this.renderDashboardItemView(this[childViews[i]], i);
            }
        }
    },

    renderUpdate: function() {
        if(this.contentBinding) {
            this.removeAllItems();

            /* do we have something in locale storage? */
            var values = localStorage.getItem(M.LOCAL_STORAGE_PREFIX + M.Application.name + M.LOCAL_STORAGE_SUFFIX + 'dashboard');
            values = values ? JSON.parse(values) : null;

            /* get the items (if there is something in the LS and it fits the content bound values, use them) */
            this.items = [];
            var items = (values && this.value && values.length == this.value.length) ? this.sortItemsByValues(this.value, values) : this.value;
            var html = '';

            /* lets gather the html together */
            for(var i in items) {
                html += this.renderDashboardItemView(items[i], i);
            }

            /* add the items to the DOM */
            this.addItems(html);

            /* now the items are in DOM, finally register events */
            for(var i in this.items) {
                this.items[i].registerEvents();
            }
        }
    },

    /**
     * This method adds a given html string, contain the dasboard's items, to the DOM.
     *
     * @param {String} item The html representation of the dashboard items to be added.
     */
    addItems: function(items) {
        $('#' + this.id).append(items);
    },

    /**
     * This method removes all of the dashboard view's items by removing all of its content in the DOM. This
     * method is based on jQuery's empty().
     */
    removeAllItems: function() {
        $('#' + this.id).empty();
    },

    renderDashboardItemView: function(item, itemIndex) {
        if(item && item.value && item.icon) {
            var obj = item.type === 'M.DashboardItemView' ? item : M.DashboardItemView.design({
                value: item.value ? item.value : '',
                icon: item.icon ? item.icon : '',
                label: item.label ? item.label : (item.value ? item.value : ''),
                parentView: this,
                events: item.events
            });
            var html = '';

            /* add item to array for later use */
            this.items.push(obj);

            /* is new line starting? */
            if(itemIndex % this.itemsPerLine === 0) {
                html += '<div class="tmp-dashboard-line">';
            }

            /* assign the desired width */
            obj.cssStyle = 'width: ' + 100/this.itemsPerLine + '%';

            /* finally render the dashboard item and add it to the dashboard's html */
            html += obj.render();

            /* is a line finished? */
            if(itemIndex % this.itemsPerLine === this.itemsPerLine - 1) {
                html += '</div><div class="tmp-dashboard-line-clear"></div>';
            }

            /* return the html */
            return html;
        } else {
            M.Logger.log('Childview of dashboard is no valid dashboard item.', M.WARN);
        }
    },

    /**
     * This method is used internally for dispatching the tap event for a dashboard view. If the
     * dashboard view is in edit mode, we do not dispatch the event to the application.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     *
     * @private
     */
    dispatchTapEvent: function(id, event, nextEvent) {
        /* now first call special handler for this item */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }

        /* now call global tap-event handler (if set) */
        if(this.events && this.events.tap) {
            M.EventDispatcher.callHandler(this.events.tap, event, YES);
        }

        /* now store timestamp for last tap event to kill a possible false taphold event */
        this.latestTapEventTimestamp = +new Date();
    },

    /**
     * This method is automatically called when a taphold event is triggered for one
     * of the dashboard's
     */
    editDashboard: function(id, event, nextEvent) {
        this.touchPositions.touchstart = {};
        if(!this.isEditable || this.latestTapEventTimestamp > +new Date() - 500) {
            return;
        }

        if(this.isInEditMode && event) {
            this.stopEditMode();
        } else if((!this.isInEditMode && event) || (this.isInEditMode && !event)) {
            M.EventDispatcher.unregisterEvents(this.id);
            this.isInEditMode = YES;
            _.each(this.items, function(item) {
                item.addCssClass('rotate' + M.Math.random(1, 2));
                M.EventDispatcher.unregisterEvents(item.id);
                if($.support.touch) {
                    M.EventDispatcher.registerEvent(
                        'touchstart',
                        item.id,
                        {
                            target: item.parentView,
                            action: 'editTouchStart'
                        },
                        item.recommendedEvents
                    );
                    M.EventDispatcher.registerEvent(
                        'touchend',
                        item.id,
                        {
                            target: item.parentView,
                            action: 'editTouchEnd'
                        },
                        item.recommendedEvents
                    );
                    M.EventDispatcher.registerEvent(
                        'touchmove',
                        item.id,
                        {
                            target: item.parentView,
                            action: 'editTouchMove'
                        },
                        item.recommendedEvents
                    );
                } else {
                    M.EventDispatcher.registerEvent(
                        'mousedown',
                        item.id,
                        {
                            target: item.parentView,
                            action: 'editMouseDown'
                        },
                        item.recommendedEvents
                    );
                    M.EventDispatcher.registerEvent(
                        'mouseup',
                        item.id,
                        {
                            target: item.parentView,
                            action: 'editMouseUp'
                        },
                        item.recommendedEvents
                    );
                }
            });
        }
    },

    stopEditMode: function() {
        this.isInEditMode = NO;
        _.each(this.items, function(item) {
            item.removeCssClass('rotate1');
            item.removeCssClass('rotate2');
            M.EventDispatcher.unregisterEvents(item.id);
            item.registerEvents();
        });
    },

    setValue: function(items) {
        this.value = items;
        var values = [];
        _.each(items, function(item) {
            values.push(item.value);
        });
        if(localStorage) {
            localStorage.setItem(M.LOCAL_STORAGE_PREFIX + M.Application.name + M.LOCAL_STORAGE_SUFFIX + 'dashboard', JSON.stringify(values));
        }
    },

    sortItemsByValues: function(items, values) {
        var itemsSorted = [];
        _.each(values, function(value) {
            _.each(items, function(item) {
                if(item.value === value) {
                    itemsSorted.push(item);
                }
            });
        });
        return itemsSorted;
    },

    editTouchStart: function(id, event) {
        this.latestTouchEventType = 'touchstart';
        var latest = event.originalEvent ? (event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : null) : null;
        
        this.touchPositions.touchstart = {
            x: latest.clientX,
            y: latest.clientY,
            date: +new Date()
        };

        var that = this;
        window.setTimeout(function() {
            if(that.latestTouchEventType === 'touchstart') {
                that.stopEditMode();
            }
        }, 750);
    },

    editTouchMove: function(id, event) {
        this.latestTouchEventType = 'touchmove';
        var latest = event.originalEvent ? (event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : null) : null;

        if(latest) {
            var left = latest.pageX - parseInt($('#' + id).css('width')) / 2;
            var top = latest.pageY - parseInt($('#' + id).css('height')) / 2;
            $('#' + id).css('position', 'absolute');
            $('#' + id).css('left', left + 'px');
            $('#' + id).css('top', top + 'px');

            /* if end event is within certain radius of start event and it took a certain time, and editing */
            /*if(this.touchPositions.touchstart) {
                if(this.touchPositions.touchstart.date < +new Date() - 1500) {
                    if(Math.abs(this.touchPositions.touchstart.x - latest.clientX) < 30 && Math.abs(this.touchPositions.touchstart.y - latest.clientY) < 30) {
                        this.stopEditMode();
                        this.editTouchEnd(id, event);
                    }
                }
            }*/
        }
    },

    editTouchEnd: function(id, event) {
        this.latestTouchEventType = 'touchend';
        var latest = event.originalEvent ? (event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : null) : null;
        
        if(event.currentTarget.id) {
            var items = [];
            _.each(this.items, function(item) {
                items.push({
                    id: item.id,
                    x: $('#' + item.id).position().left,
                    y: $('#' + item.id).position().top,
                    item: item
                });
                items.sort(function(a, b) {
                    /* assume they are in one row */
                    if(Math.abs(a.y - b.y) < 30) {
                        if(a.x < b.x) {
                            return -1;
                        } else {
                            return 1;
                        }
                    /* otherwise */
                    } else {
                        if(a.y < b.y) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                });
            });
            var objs = [];
            _.each(items, function(item) {
                objs.push(item.item);
            });
            this.setValue(objs);
            this.renderUpdate();

            if(this.isInEditMode) {
                this.editDashboard();
            }
        }
    },

    editMouseDown: function(id, event) {
        this.latestTouchEventType = 'mousedown';

        this.touchPositions.touchstart = {
            x: event.clientX,
            y: event.clientY,
            date: +new Date()
        };

        /* enable mouse move for selected item */
        M.EventDispatcher.registerEvent(
            'mousemove',
            id,
            {
                target: this,
                action: 'editMouseMove'
            },
            M.ViewManager.getViewById(id).recommendedEvents
        );

        var that = this;
        window.setTimeout(function() {
            if(that.latestTouchEventType === 'mousedown') {
                that.stopEditMode();
            }
        }, 750);
    },

    editMouseMove: function(id, event) {
        this.latestTouchEventType = 'mousemove';

        var left = event.pageX - parseInt($('#' + id).css('width')) / 2;
        var top = event.pageY - parseInt($('#' + id).css('height')) / 2;
        $('#' + id).css('position', 'absolute');
        $('#' + id).css('left', left + 'px');
        $('#' + id).css('top', top + 'px');

        /* if end event is within certain radius of start event and it took a certain time, and editing */
        /*if(this.touchPositions.touchstart) {
            if(this.touchPositions.touchstart.date < +new Date() - 1500) {
                if(Math.abs(this.touchPositions.touchstart.x - latest.clientX) < 30 && Math.abs(this.touchPositions.touchstart.y - latest.clientY) < 30) {
                    this.stopEditMode();
                    this.editTouchEnd(id, event);
                }
            }
        }*/
    },

    editMouseUp: function(id, event) {
        this.latestTouchEventType = 'mouseup';

        if(event.currentTarget.id) {
            var items = [];
            _.each(this.items, function(item) {

                /* disable mouse move for all item */
                M.EventDispatcher.unregisterEvent('mousemove', item.id);

                items.push({
                    id: item.id,
                    x: $('#' + item.id).position().left,
                    y: $('#' + item.id).position().top,
                    item: item
                });
                items.sort(function(a, b) {
                    /* assume they are in one row */
                    if(Math.abs(a.y - b.y) < 30) {
                        if(a.x < b.x) {
                            return -1;
                        } else {
                            return 1;
                        }
                    /* otherwise */
                    } else {
                        if(a.y < b.y) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                });
            });
            var objs = [];
            _.each(items, function(item) {
                objs.push(item.item);
            });
            this.setValue(objs);
            this.renderUpdate();

            if(this.isInEditMode) {
                this.editDashboard();
            }
        }
    },

    /**
     * Applies some style-attributes to the dashboard view.
     *
     * @private
     * @returns {String} The dashboard's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="tmp-dashboard ' + this.cssClass + '"';
        }
        return html;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      09.08.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * A dashboard itm view contains an icon and a label and can be used as the only
 * kind of childviews for a dashboard view.
 *
 * @extends M.View
 */
M.DashboardItemView = M.View.extend(
/** @scope M.DashboardItemView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.DashboardItemView',

    /**
     * The path/url to the dashboard item's icon.
     *
     * @type String
     */
    icon: null,

    /**
     * The label for the dashboard item. If no label is specified, the value will be
     * displayed instead.
     *
     * @type String
     */
    label: null,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap', 'taphold', 'touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseup'],

    /**
     * Renders a dashboard item.
     *
     * @private
     * @returns {String} The dashboard item view's html representation.
     */
    render: function() {
        //this.computeValue();

        /* reset html property */
        this.html = '';

        if(!this.icon) {
            M.Logger.log('Please provide an icon for a dashboard item view!', M.WARN);
            return this.html;
        }

        this.html += '<div id="' + this.id + '" class="tmp-dashboard-item" ' + this.style() + '>';

        /* add image */
        var image = M.ImageView.design({
            value: this.icon
        });
        this.html += image.render();

        /* add label */
        this.html += '<div class="tmp-dashboard-item-label">' + (this.label ? this.label : this.value) + '</div>';

        this.html += '</div>';

        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list item views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            taphold: {
                target: this.parentView,
                action: 'editDashboard'
            },
            tap: {
                target: this.parentView,
                action: 'dispatchTapEvent'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * Applies some style-attributes to the dashboard item.
     *
     * @private
     * @returns {String} The button's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssStyle) {
            html += 'style="' + this.cssStyle + '"';
        }
        return html;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      04.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype for a date picker view. A date picker is a special view, that can
 * be called out of a controller. It is shown as a date picker popup, based on the mobiscroll
 * library. You can either connect a date picker with an existing view and automatically pass
 * the selected date to the source's value property, or you can simply use the date picker to
 * select a date, return it to the controller (respectively the callback) and handle the date
 * by yourself.
 *
 * @extends M.View
 */
M.DatePickerView = M.View.extend(
/** @scope M.DatePickerView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.DatePickerView',

    /**
     * This property is used to link the date picker to a source. You can either pass the DOM id of
     * the corresponding source or the javascript object itself. Linking the date picker directly
     * to a source results in automatic value updates of this source.
     *
     * Note: Valid sources need to provide a setValue() method.
     *
     * If you do not pass a source, the date picker isn't linked to any view. It simply returns the
     * selected value/date to given callbacks. So you can call the date picker out of a controller
     * and handle the selected date all by yourself.
     *
     * @type String|Object
     */
    source: null,

    /**
     * This property can be used to specify several callbacks for the date picker view. There are
     * three types of callbacks available:
     *
     *     - before
     *         This callback gets called, right before the date picker is shown. It passes along two
     *         parameters:
     *             - value      -> The initial date of the date picker, formatted as a string
     *             - date       -> The initial date of the date picker as d8 object
     *     - confirm
     *         This callback gets called, when a selected date was confirmed. It passes along two
     *         parameters:
     *             - value      -> The selected date of the date picker, formatted as a string
     *             - date       -> The selected date of the date picker as d8 object
     *     - cancel
     *         This callback gets called, when the cancel button is hit. It doesn't pass any
     *         parameters.
     *
     * Setting up one of those callbacks works the same as with other controls of The-M-Project. You
     * simply have to specify an object containing a target function, e.g.:
     *
     * callbacks: {
     *     confirm: {
     *         target: this,
     *         action: 'dateSelected'
     *     },
     *     cancel: {
     *         action: function() {
     *             // do something
     *         }
     *     }
     * }
     *
     * @type Object
     */
    callbacks: null,

    /**
     * This property can be used to specify the initial date for the date picker. If you use the
     * date picker without a source, this date is always picked as the initial date. If nothing is
     * specified, the current date will be displayed.
     *
     * If you use the date picker with a valid source, the initial date is picked as long as there
     * is no valid date available by the source. Once a date was selected and assigned to the source,
     * this is taken as initial date the next time the date picker is opened.
     *
     * @type Object|String
     */
    initialDate: null,

    /**
     * This property can be used to determine whether to use the data source's value as initial date
     * or not. If there is no source specified, this property is irrelevant.
     *
     * Note: If there is a source specified and this property is set to NO, the 'initialDate' property
     * will be used anyway if there is no date value available for the source!
     *
     * @type Boolean
     */
    useSourceDateAsInitialDate: YES,

    /**
     * This property can be used to specify whether to show scrollers for picking a date or not.
     *
     * Note: If both this and the 'showTimePicker' property are set to NO, no date picker will
     * be shown!
     *
     * @type Boolean
     */
    showDatePicker: YES,

    /**
     * This property can be used to specify whether to show scrollers for picking a time or not.
     *
     * Note: If both this and the 'showDatePicker' property are set to NO, no date picker will
     * be shown!
     *
     * @type Boolean
     */
    showTimePicker: YES,

    /**
     * This property can be used to specify whether or not to show labels above of the scrollers.
     * If set to YES, the labels specified with the '...Label' properties are displayed above of
     * the corresponding scroller.
     *
     * @type Boolean
     */
    showLabels: YES,

    /**
     * This property specified the label shown above of the 'year' scroller.
     *
     * Note: This label is only shown if the 'showLabels' property is set to YES.
     *
     * @type String
     */
    yearLabel: 'Year',

    /**
     * This property specified the label shown above of the 'month' scroller.
     *
     * Note: This label is only shown if the 'showLabels' property is set to YES.
     *
     * @type String
     */
    monthLabel: 'Month',

    /**
     * This property specified the label shown above of the 'day' scroller.
     *
     * Note: This label is only shown if the 'showLabels' property is set to YES.
     *
     * @type String
     */
    dayLabel: 'Day',

    /**
     * This property specified the label shown above of the 'hours' scroller.
     *
     * Note: This label is only shown if the 'showLabels' property is set to YES.
     *
     * @type String
     */
    hoursLabel: 'Hours',

    /**
     * This property specified the label shown above of the 'minutes' scroller.
     *
     * Note: This label is only shown if the 'showLabels' property is set to YES.
     *
     * @type String
     */
    minutesLabel: 'Minutes',

    /**
     * You can use this property to enable or disable the AM/PM scroller. If set to NO, the
     * date picker will use the 24h format.
     *
     * @type Boolean
     */
    showAmPm: YES,

    /**
     * This property can be used to specify the first year of the 'year' scroller. By default,
     * this will be set to 20 years before the current year.
     *
     * @type Number
     */
    startYear: null,

    /**
     * This property can be used to specify the last year of the 'year' scroller. By default,
     * this will be set to 20 years after the current year.
     *
     * @type Number
     */
    endYear: null,

    /**
     * This property can be used to customize the date format of the date picker. This is important
     * if you use the date picker on a valid source since the date picker will then automatically
     * push the selected date/datetime to the 'value' property of the source - based on this format.
     *
     * The possible keys:
     *
     *     - m      -> month (without leading zero)
     *     - mm     -> month (two-digit)
     *     - M      -> month name (short)
     *     - MM     -> month name (long)
     *     - d      -> day (without leading zero)
     *     - d      -> day (two digit)
     *     - D      -> day name (short)
     *     - DD     -> day name (long)
     *     - y      -> year (two digit)
     *     - yy     -> year (four digit)
     *
     * @type String
     */
    dateFormat: 'M dd, yy',

    /**
     * This property can be used to customize the date format of the date picker if it is associated
     * with a text input with the type 'month'. It works the same as the dateFormat property.
     *
     * @type String
     */
    dateFormatMonthOnly: 'MM yy',

    /**
     * This property can be used to customize the time format of the date picker. This is important
     * if you use the date picker on a valid source since the date picker will then automatically
     * push the selected time/datetime to the 'value' property of the source - based on this format.
     *
     * The possible keys:
     *
     *     - h      -> hours (without leading zero, 12h format)
     *     - hh     -> hours (two-digit, 12h format)
     *     - H      -> hours (without leading zero, 24h format)
     *     - HH     -> hours (two-digit, 24h format)
     *     - i      -> minutes (without leading zero)
     *     - ii     -> minutes (two-digit)
     *     - A      -> AM/PM
     *
     * @type String
     */
    timeFormat: 'h:ii A',

    /**
     * This property determines the order and formating of the date scrollers. The following keys
     * are possible:
     *
     *     - m      -> month (without leading zero)
     *     - mm     -> month (two-digit)
     *     - M      -> month name (short)
     *     - MM     -> month name (long)
     *     - d      -> day (without leading zero)
     *     - d      -> day (two digit)
     *     - y      -> year (two digit)
     *     - yy     -> year (four digit)
     *
     * By default, we use this format: Mddyy
     *
     * @type String
     */
    dateOrder: 'Mddyy',

    /**
     * This property determines the order and formating of the date scrollers if it is associated
     * with an input field of type 'month'. It works the same as the dateOrder property.
     *
     * By default, we use this format: MMyy
     *
     * @type String
     */
    dateOrderMonthOnly: 'MMyy',



    /**
     * This property specifies a list of full month names.
     *
     * @type Array
     */
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    /**
     * This property specifies a list of short month names.
     *
     * @type Array
     */
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    /**
     * This property specifies a list of full day names.
     *
     * @type Array
     */
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    /**
     * This property specifies a list of short day names.
     *
     * @type Array
     */
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    /**
     * This property can be used to specify the label of the date picker's cancel button. By default
     * it shows 'Cancel'.
     *
     * @type String
     */
    cancelButtonValue: 'Cancel',

    /**
     * This property can be used to specify the label of the date picker's cancel button. By default
     * it shows 'Ok'.
     *
     * @type String
     */
    confirmButtonValue: 'Ok',

    /**
     * This property can be used to specify the steps between hours in the time / date-time picker.
     *
     * @type Number
     */
    stepHour: 1,

    /**
     * This property can be used to specify the steps between minutes in the time / date-time picker.
     *
     * @type Number
     */
    stepMinute: 1,

    /**
     * This property can be used to specify the steps between seconds in the time / date-time picker.
     *
     * @type Number
     */
    stepSecond: 1,

    /**
     * This property can be used to activate the seconds wheel on a time/date-time picker.
     *
     * @type Boolean
     */
    seconds: NO,

    /**
     * This property is used internally to indicate whether the current date picker works on a valid
     * source or was called without one. This is important for stuff like auto-updating the source's
     * DOM representation.
     *
     * @private
     */
    hasSource: YES,

    /**
     * This property is used internally to state whether a value, respectively a date, was selected
     * or not.
     *
     * @private
     * @type Boolean
     */
    isValueSelected: NO,

    /**
     * This property is used internally to state whether a the date picker is currently activated
     * or not.
     *
     * @private
     * @type Boolean
     */
    isActive: NO,

    /**
     * This method is the only important method of a date picker view for 'the outside world'. From within
     * an application, simply call this method and pass along an object, containing all the properties
     * you want to set, different from default.
     *
     * A sample call:
     *
     * M.DatePickerView.show({
     *     source: M.ViewManager.getView('mainPage', 'myTextField')
     *     initialDate: D8.create('30.04.1985 10:30'),
     *     callbacks: {
     *          confirm: {
     *              target: this,
     *              action: function(value, date) {
     *                  // do something...
     *              }
     *          }
     *     }
     * });
     *
     * @param obj
     */
    show: function(obj) {
        var datepicker = M.DatePickerView.design(obj);

        /* if a datepicker is active already, return */
        if(Object.getPrototypeOf(datepicker).isActive) {
            return;
        /* otherwise go on and set the flag to active */
        } else {
            Object.getPrototypeOf(datepicker).isActive = YES;
        }

        /* check if it's worth the work at all */
        if(!(datepicker.showDatePicker || datepicker.showTimePicker)) {
            M.Logger.log('In order to use the M.DatepickerView, you have to set the \'showDatePicker\' or \'showTimePicker\' property to YES.', M.ERR);
            return;
        }

        /* calculate the default start and end years */
        this.startYear = this.startYear ? this.startYear : D8.now().format('yyyy') - 20;
        this.endYear = this.endYear ? this.endYear : D8.now().format('yyyy') + 20;

        /* check if we got a valid source */
        if(datepicker.source) {
            /* if we got a view, get its id */
            datepicker.source = typeof(datepicker.source) === 'object' && datepicker.source.type ? datepicker.source.id : datepicker.source;

            var view = M.ViewManager.getViewById(datepicker.source);
            if(view && typeof(view.setValue) === 'function' && $('#' + datepicker.source) && $('#' + datepicker.source).length > 0) {
                datepicker.init();
            } else {
                M.Logger.log('The specified source for the M.DatepickerView is invalid!', M.ERR);
            }
        } else {
            /* use default source (the current page) */
            datepicker.hasSource = NO;
            var page = M.ViewManager.getCurrentPage();
            if(page) {
                datepicker.source = page.id;
                datepicker.init();
            }
        }
    },

    /**
     * This method is used internally to communicate with the mobiscroll library. It actually initializes
     * the creation of the date picker and is responsible for reacting on events. If the cancel or confirm
     * button is hit, this method dispatches the events to the corresponding callbacks.
     *
     * @private
     */
    init: function() {
        var that = this;
        $('#' + this.source).scroller({
            preset: (this.showDatePicker && this.showTimePicker ? 'datetime' : (this.showDatePicker ? 'date' : (this.showTimePicker ? 'time' : null))),
            ampm: this.showAmPm,
            startYear: this.startYear,
            endYear: this.endYear,
            dateFormat: this.dateFormat,
            timeFormat: this.timeFormat,
            dateOrder: this.dateOrder,
            dayText: this.dayLabel,
            hourText: this.hoursLabel,
            minuteText: this.minutesLabel,
            monthText: this.monthLabel,
            yearText: this.yearLabel,
            monthNames: this.monthNames,
            monthNamesShort: this.monthNamesShort,
            dayNames: this.dayNames,
            dayNamesShort: this.dayNamesShort,
            cancelText: this.cancelButtonValue,
            setText: this.confirmButtonValue,
            stepHour: this.stepHour,
            stepMinute: this.stepMinute,
            stepSecond: this.stepSecond,
            seconds: this.seconds,

            /* now set the width of the scrollers */
            width: (M.Environment.getWidth() - 20) / 3 - 20 > 90 ? 90 : (M.Environment.getWidth() - 20) / 3 - 20,

            beforeShow: function(input, scroller) {
                that.bindToCaller(that, that.beforeShow, [input, scroller])();
            },
            onClose: function(value, scroller) {
                that.bindToCaller(that, that.onClose, [value, scroller])();
            },
            onSelect: function(value, scroller) {
                that.bindToCaller(that, that.onSelect, [value, scroller])();
            }
        });
        $('#' + this.source).scroller('show');
    },

    /**
     * This method is used internally to handle the 'beforeShow' event. It does some adjustments to the
     * rendered scroller by mobiscroll and finally calls the application's 'before' callback, if it is
     * defined.
     *
     * @param source
     * @param scroller
     */
    beforeShow: function(source, scroller) {
        var source = null;
        var date = null;

        /* try to set the date picker's initial date based on its source */
        if(this.hasSource && this.useSourceDateAsInitialDate) {
            source = M.ViewManager.getViewById(this.source);
            if(source.value) {
                try {
                    date = D8.create(source.value);
                } catch(e) {

                }
                if(date) {
                    if(date.format('yyyy') < this.startYear) {
                        if(this.hasOwnProperty('startYear')) {
                            M.Logger.log('The given date of the source (' + date.format('yyyy') + ') conflicts with the \'startYear\' property (' + this.startYear + ') and therefore will be ignored!', M.WARN);
                        } else {
                            M.Logger.log('The date picker\'s default \'startYear\' property (' + this.startYear + ') conflicts with the given date of the source (' + date.format('yyyy') + ') and therefore will be ignored!', M.WARN);
                            $('#' + this.source).scroller('option', 'startYear', date.format('yyyy'));
                            $('#' + this.source).scroller('setDate', date.date);
                        }
                    } else {
                        $('#' + this.source).scroller('setDate', date.date);
                    }
                }
            }
        }

        /* if there is no source or the retrieval of the date went wrong, try to set it based on the initial date property */
        if(this.initialDate && !date) {
            if(this.initialDate.date) {
                date = this.initialDate;
            } else {
                try {
                    date = D8.create(this.initialDate);
                } catch(e) {

                }
            }
            if(date) {
                if(date.format('yyyy') < this.startYear) {
                    if(this.hasOwnProperty('startYear')) {
                        M.Logger.log('The specified initial date (' + date.format('yyyy') + ') conflicts with the \'startYear\' property (' + this.startYear + ') and therefore will be ignored!', M.WARN);
                    } else {
                        M.Logger.log('The date picker\'s default \'startYear\' property (' + this.startYear + ') conflicts with the specified initial date (' + date.format('yyyy') + ') and therefore will be ignored!', M.WARN);
                        $('#' + this.source).scroller('option', 'startYear', date.format('yyyy'));
                        $('#' + this.source).scroller('setDate', date.date);
                    }
                } else {
                    $('#' + this.source).scroller('setDate', date.date);
                }
            }
        }

        /* now we got the date (or use the current date as default), lets compute this as a formatted text for the callback */
        value = scroller.formatDate(
            this.showDatePicker ? this.dateFormat + (this.showTimePicker ? ' ' + this.timeFormat : '') : this.timeFormat,
            scroller.getDate()
        );

        /* kill parts of the scoller */
        $('.dwv').remove();

        /* give it some shiny jqm style */
        window.setTimeout(function() {
            $('.dw').addClass('ui-btn-up-a');
        }, 1);

        /* disable scrolling for the background */
        $('.dwo').bind('touchmove', function(e) {
            e.preventDefault();
        });

        /* inject TMP buttons*/
        var confirmButton = M.ButtonView.design({
            value: this.confirmButtonValue,
            cssClass: 'b tmp-dialog-smallerbtn-confirm',
            events: {
                tap: {
                    action: function() {
                        $('#dw_set').trigger('click');
                    }
                }
            }
        });
        var cancelButton = M.ButtonView.design({
            value: this.cancelButtonValue,
            cssClass: 'd tmp-dialog-smallerbtn-confirm',
            events: {
                tap: {
                    action: function() {
                        $('#dw_cancel').trigger('click');
                    }
                }
            }
        });

        if(this.showDatePicker) {
            var grid = M.GridView.design({
                childViews: 'confirm cancel',
                layout: M.TWO_COLUMNS,
                cssClass: 'tmp-datepicker-buttongrid',
                confirm: confirmButton,
                cancel: cancelButton
            });

            var html = grid.render();
            $('.dw').append(html);
            grid.theme();
            grid.registerEvents();
        } else {
            var html = confirmButton.render();
            html += cancelButton.render();
            $('.dw').append(html);
            confirmButton.theme();
            confirmButton.registerEvents();
            cancelButton.theme();
            cancelButton.registerEvents();
        }

        /* hide default buttons */
        $('#dw_cancel').hide();
        $('#dw_set').hide();

        /* add class to body as selector for showing/hiding labels */
        if(!this.showLabels) {
            $('body').addClass('tmp-datepicker-no-label');
        }

        /* call callback */
        if(this.callbacks && this.callbacks['before'] && M.EventDispatcher.checkHandler(this.callbacks['before'])) {
            M.EventDispatcher.callHandler(this.callbacks['before'], null, NO, [value, date]);
        }
    },

    onClose: function(value, scroller) {
        /* set value if one was selected */
        var source = null;
        var date = null;
        if(this.isValueSelected) {
            /* first compute the date */
            try {
                date = D8.create(scroller.getDate());
            } catch(e) {

            }

            /* now, if there is a source, auto-update its value */
            if(this.hasSource) {
                source = M.ViewManager.getViewById(this.source);
                if(source) {
                    source.setValue(value, NO, YES);
                }
            }
        }

        /* remove class from body as selector for showing/hiding labels */
        if(!this.showLabels) {
            $('body').removeClass('tmp-datepicker-no-label');
        }

        /* call cancel callback */
        if(!this.isValueSelected && this.callbacks && this.callbacks['cancel'] && M.EventDispatcher.checkHandler(this.callbacks['cancel'])) {
            M.EventDispatcher.callHandler(this.callbacks['cancel'], null, NO, []);
        } else if(this.isValueSelected && this.callbacks && this.callbacks['confirm'] && M.EventDispatcher.checkHandler(this.callbacks['confirm'])) {
            M.EventDispatcher.callHandler(this.callbacks['confirm'], null, NO, [value, date]);
        }

        /* kill the datepicker */
        Object.getPrototypeOf(this).isActive = NO;
        $('#' + this.source).scroller('destroy');
        $('.dwo').remove();
        $('.dw').remove();
        this.destroy();
    },

    onSelect: function(value) {
        /* mark the datepicker as 'valueSelected' */
        this.isValueSelected = YES;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      23.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This is the prototype of any dialog view. It is responsible for showing and later
 * hiding a dialog.
 *
 * @extends M.View
 */
M.DialogView = M.View.extend(
/** @scope M.DialogView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.DialogView',

    /**
     * Determines whether there currently is an active alert dialog, confirm
     * dialog or action sheet.
     *
     * @private
     * @type Boolean
     */
    isActive: NO,

    /**
     * This property is used to store a queue of coming up dialogs. Whenever a dialog
     * is called out of an application and there already is one present, it will be
     * added to the queue and called afterwards.
     *
     * @private
     * @type Array
     */
    queue: [],

    /**
     * This property is used to specify whether to store the dialog in the queue if it
     * can't be shown right away. So if set to YES, this property will prevent a dialog
     * from being added to the queue. If the dialog can not be displayed right away, it
     * will not be displayed at all.
     *
     * @private
     * @type Boolean
     */
    showNowOrNever: NO,

    /**
     * This method creates an alert dialog based on the given customizing parameters and
     * initiates its displaying on the screen.
     *
     * @param {Object} obj The customizing parameters of the alert dialog view.
     */
    alert: function(obj) {
        if(this.isActive) {
            this.enqueue('alert', obj);
        } else {
            this.isActive = YES;
            M.AlertDialogView.design(obj).show();
        }
    },

    /**
     * This method creates an confirm dialog based on the given customizing parameters and
     * initiates its displaying on the screen.
     *
     * @param {Object} obj The customizing parameters of the confirm dialog view.
     */
    confirm: function(obj) {
        if(this.isActive) {
            this.enqueue('confirm', obj);
        } else {
            this.isActive = YES;
            M.ConfirmDialogView.design(obj).show();
        }
    },

    /**
     * This method creates an actionSheet dialog based on the given customizing parameters and
     * initiates its displaying on the screen.
     *
     * @param {Object} obj The customizing parameters of the actionSheet dialog view.
     */
    actionSheet: function(obj) {
        if(this.isActive) {
            this.enqueue('actionSheet', obj);
        } else {
            this.isActive = YES;
            M.ActionSheetDialogView.design(obj).show();
        }
    },

    enqueue: function(action, obj) {
        if(!obj.showNowOrNever) {
            this.queue.unshift({
                action: action,
                obj: obj
            });
        }
    },

    dequeue: function() {
        if(!this.isActive && this.queue.length > 0) {
            var obj = this.queue.pop();
            this[obj.action](obj.obj);
        }
    },

    show: function() {
        /* call the dialog's render() */
        this.render();
        var dialog = $('#' + this.id);
        var background = $('.tmp-dialog-background');
        background.hide();

        /* disable scrolling to enable a "real" dialog behaviour */
//        $(document).bind('touchmove', function(e) {
//            e.preventDefault();
//        });

        /* position the dialog and fade it in */
        this.positionDialog(dialog);
        dialog.addClass('pop in');

        /* reposition, but wait a second */
        var that = this;
        window.setTimeout(function() {
            background.show();
            that.positionBackground(background);
        }, 1);
    },

    hide: function() {
        var dialog = $('#' + this.id);
        var background = $('.tmp-dialog-background');
        dialog.addClass('pop out');
        background.remove();
        this.destroy();

        /* enable scrolling again */
//        $(document).unbind('touchmove');

        /* now wait 100ms and then call the next in the queue */
        var that = this;
        window.setTimeout(function() {
            M.DialogView.isActive = NO;
            that.dequeue();
        }, 100);
    },

    positionDialog: function(dialog) {
        /* position alert in the center of the possibly scrolled viewport */
        var screenSize = M.Environment.getSize();
        var scrollYOffset = window.pageYOffset;
        var scrollXOffset = window.pageXOffset;
        var dialogHeight = dialog.outerHeight();
        var dialogWidth = dialog.outerWidth();

        var xPos = scrollXOffset + (screenSize[0]/2);
        var yPos = scrollYOffset + (screenSize[1]/2);

        dialog.css('position', 'absolute');
        dialog.css('top', yPos + 'px');
        dialog.css('left', xPos + 'px');
        dialog.css('z-index', 10000);
        dialog.css('margin-top', '-' + (dialogHeight/2) + 'px');
        dialog.css('margin-left', '-' + (dialogWidth/2) + 'px');
    },

    positionBackground: function(background) {
        background.css('height', $(document).height() + 'px');
        background.css('width', $(document).width() + 'px');
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      23.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('ui/dialog.js');

/**
 * @class
 *
 * This is the prototype for any action sheet dialog view. It is derived from M.DialogView
 * and mainly used for implementing a action sheet dialog view specific render method.
 *
 * @extends M.DialogView 
 */
M.ActionSheetDialogView = M.DialogView.extend(
/** @scope M.ActionSheetDialogView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ActionSheetDialogView',

    /**
     * The default title of an action sheet dialog.
     *
     * @type String
     */
    title: 'ActionSheet',

    /**
     * Defines the value of the destructive button (the one button that is showed in red)
     *
     * @type String
     */
    destructiveButtonValue: null,

    /**
     * Defines the value of the cancel button
     *
     * @type String
     */
    cancelButtonValue: null,

    /**
     * Contains the values of all other buttons as strings
     *
     * @type Array
     */
    otherButtonValues: null,

    /**
     * Contains the tags of all other buttons as strings
     *
     * @type Array
     */
    otherButtonTags: null,

    /**
     * Delay between action sheet slide out animation finished and deleting it from DOM and deleting the object
     */
    deletionDelay: 1000,

    /**
     * If set, contains the dialog's callbacks in sub objects named 'destruction', 'cancel' and 'other' or as  functions named confirm, cancel and other.
     *
     * @type Object
     */
    callbacks: null,

    /**
     * Renders an action sheet dialog as a slide-up.
     *
     * @private
     * @returns {String} The action sheet dialog view's html representation.
     */

    render: function() {
        /* render half transparent grey background */
        this.html = '<div class="tmp-dialog-background"></div>';

        /* render title */
        this.html += '<div id="' + this.id + '" class="tmp-actionsheet">';
        this.html += '<div class="tmp-dialog-header">';
        this.html += this.title ? this.title : '';
        this.html +='</div>';

        /* render footer that contains all buttons */
        this.html += '<div class="tmp-dialog-footer">';

        var that = this;

        var buttons = [];
        if(this.destructiveButtonValue) {
            buttons.push(M.ButtonView.design({
                value: this.destructiveButtonValue,
                tag: 'destruction',
                dataTheme: 'a tmp-actionsheet-destructive-button',
                events: {
                    tap: {
                        target: that,
                        action: 'handleCallback'
                    }
                }
            }));
        }
        if(this.otherButtonValues) {
            if(this.otherButtonTags && !(_.isArray(this.otherButtonTags)) && !(_.isArray(this.otherButtonValues))) {
                M.Logger.log('Error in Action Sheet: Values and (optional) tags must be passed as string in an array! Rendering will not proceed.', M.WARN);
                return '';
            }
            /* First check if passed number of values matches number of labels passed */
            /* If not, do not use values, but use incremented buttonNr as value */
            if(this.otherButtonTags && this.otherButtonTags.length !== this.otherButtonValues.length) {
                M.Logger.log('Mismatch in Action Sheet: Number of other button\'s tags doesn\'t match number of values. Will not use given values, but use generated numbers as values.', M.WARN);
                this.otherButtonTags = null;
            }

            var buttonNr = 0;

            _.each(this.otherButtonValues, function(btn) {
                buttons.push(M.ButtonView.design({
                    value: btn,
                    tag: that.otherButtonTags ? that.otherButtonTags[buttonNr++] : buttonNr++,
                    events: {
                        tap: {
                            target: that,
                            action: 'handleCallback'
                        }
                    }
                }));
            });
        }
        
        if(this.cancelButtonValue) {
            buttons.push(M.ButtonView.design({
                value: this.cancelButtonValue,
                tag: 'cancel',
                dataTheme: 'a',
                events: {
                    tap: {
                        target: that,
                        action: 'handleCallback'
                    }
                }
            }));
        }


        /* render each button saved in the buttons array */
        for(var i in buttons) {
            this.html += buttons[i].render();
        };

        this.html += '</div>';
        this.html += '</div>';

        $('body').append(this.html);

        /* register events for each designed and rendered button and theme it afterwards
         * must be performed AFTER button has been inserted to DOM
         */
        for(var i in buttons) {
            buttons[i].registerEvents();
            buttons[i].theme();
        };
    },

    show: function() {
        /* call the dialog's render() */
        this.render();
        var dialog = $('#' + this.id);
        var background = $('.tmp-dialog-background');
        background.hide();

        /* disable scrolling to enable a "real" dialog behaviour */
//        $(document).bind('touchmove', function(e) {
//            e.preventDefault();
//        });

        /* slide the dialog in */
        dialog.removeClass('slideup out reverse');
        dialog.addClass('slideup in');

        /* reposition, but wait a second */
        var that = this;
        window.setTimeout(function() {
            background.show();
            that.positionBackground(background);

            /* click on background cancels the action sheet */
            $('.tmp-dialog-background').bind('click tap', function() {
                that.hide();
            });
        }, 1);
    },

    handleCallback: function(viewId, event) {
        this.hide();
        var button = M.ViewManager.getViewById(viewId);
        var buttonType = (button.tag === 'destruction' || button.tag === 'cancel') ? button.tag : 'other';

        if(this.callbacks && buttonType && M.EventDispatcher.checkHandler(this.callbacks[buttonType])){
            this.bindToCaller(this.callbacks[buttonType].target, this.callbacks[buttonType].action, button.tag)();
        }
    }
});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      23.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('ui/dialog.js');

/**
 * @class
 *
 * This is the prototype for any alert dialog view. It is derived from M.DialogView
 * and mainly used for implementing a alert dialog view specific render method.
 *
 * @extends M.DialogView
 */
M.AlertDialogView = M.DialogView.extend(
/** @scope M.AlertDialogView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.AlertDialogView',

    /**
     * The default title of an alert dialog.
     *
     * @type String
     */
    title: 'Alert',

    /**
     * The default message of an alert dialog.
     *
     * @type String
     */
    message: '',

    /**
     * Determines whether the alert dialog gets a default ok button.
     *
     * @type Boolean
     */
    hasConfirmButton: YES,

    /**
     * Determines the value of the button, means the text label on it.
     *
     * @type String
     */
    confirmButtonValue: 'Ok',

    /**
     * If set, contains the dialog's callback in a sub object named 'confirm' or as a function named confirm.
     *
     * @type Object
     */
    callbacks: null,

    /**
     * Renders an alert dialog as a pop up
     *
     * @private
     * @returns {String} The alert dialog view's html representation.
     */
    render: function() {
        this.html = '<div class="tmp-dialog-background"></div>';
        this.html += '<div id="' + this.id + '" class="tmp-dialog">';
        this.html += '<div class="tmp-dialog-header">';
        this.html += this.title ? this.title : '';
        this.html +='</div>';
        this.html += '<div class="tmp-dialog-content">';
        this.html += this.message;
        this.html +='</div>';
        var button;
        if(this.hasConfirmButton) {
            this.html += '<div class="tmp-dialog-footer">';
            var that = this;
            button = M.ButtonView.design({
                value: this.confirmButtonValue,
                dataTheme: 'b tmp-dialog-smallerbtn',
                events: {
                    tap: {
                        target: that,
                        action: 'handleCallback'
                    }
                }
            });
            this.html += button.render();
            this.html += '</div>';
        }
        this.html += '</div>';

        $('body').append(this.html);
        if(button.type) {
            button.registerEvents();
            button.theme();
        }
    },

    handleCallback: function() {
        this.hide();
        if(this.callbacks && M.EventDispatcher.checkHandler(this.callbacks.confirm)){
            this.bindToCaller(this.callbacks.confirm.target, this.callbacks.confirm.action)();
        }
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      23.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('ui/dialog.js');

/**
 * @class
 *
 * This is the prototype for any confirm dialog view. It is derived from M.DialogView
 * and mainly used for implementing a confirm dialog view specific render method.
 *
 * @extends M.DialogView
 */
M.ConfirmDialogView = M.DialogView.extend(
/** @scope M.ConfirmDialogView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ConfirmDialogView',

    /**
     * The default title of an confirm dialog.
     *
     * @type String
     */
    title: 'Confirm',

    /**
     * The default message of an confirm dialog.
     *
     * @type String
     */
    message: '',
    
    /**
     * Determines the value of the button, means the text label on it.
     *
     * @type String
     */
    confirmButtonValue: 'Ok',

    /**
     * Determines the value of the button, means the text label on it.
     *
     * @type String
     */
    cancelButtonValue: 'Cancel',

    /**
     * If set, contains the dialog's callbacks in  sub objects named 'confirm' and 'cancel' or as  functions named confirm and cancel.
     *
     * @type Object
     */
    callbacks: null,

    /**
     * Renders a confirm dialog as a pop-up.
     *
     * @private
     * @returns {String} The confirm dialog view's html representation.
     */
    render: function() {
        this.html = '<div class="tmp-dialog-background"></div>';
        this.html += '<div id="' + this.id + '" class="tmp-dialog">';
        this.html += '<div class="tmp-dialog-header">';
        this.html += this.title ? this.title : '';
        this.html +='</div>';
        this.html += '<div class="tmp-dialog-content">';
        this.html += this.message;
        this.html +='</div>';
        this.html += '<div class="tmp-dialog-footer">';
        var that = this;
        /* build confirm button */
        var button = M.ButtonView.design({
            value: this.confirmButtonValue,
            dataTheme: 'b tmp-dialog-smallerbtn-confirm',
            events: {
                tap: {
                    target: that,
                    action: 'confirmed'
                }
            }
        });
        /* build cancel button */
        var button2 = M.ButtonView.design({
            value: this.cancelButtonValue,
            dataTheme: 'd tmp-dialog-smallerbtn-confirm',
            events: {
                tap: {
                    target: that,
                    action: 'canceled'
                }
            }
        });
        /*Grid View for positioning buttons*/
        var grid = M.GridView.design({
            childViews: 'confirm cancel',
            layout: M.TWO_COLUMNS,
            confirm: button,
            cancel: button2
        });
        this.html += grid.render(); // renders also buttons (childViews)
        this.html += '</div>';
        this.html += '</div>';

        $('body').append(this.html);
        if(button.type) {
            button.registerEvents();
            button.theme();
        }
        if(button2.type) {
            button2.registerEvents();
            button2.theme();
        }
    },

    confirmed: function() {
        this.hide();
        if(this.callbacks && M.EventDispatcher.checkHandler(this.callbacks.confirm)){
            this.bindToCaller(this.callbacks.confirm.target, this.callbacks.confirm.action)();
        }
    },

    canceled: function() {
        this.hide();
        if(this.callbacks && M.EventDispatcher.checkHandler(this.callbacks.cancel)){
            this.bindToCaller(this.callbacks.cancel.target, this.callbacks.cancel.action)();
        }
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      25.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.FormViews is the prototype of a form view, a container like view for grouping
 * input views, e.g. M.TextFieldView. It covers a lot of the jobs concerning the
 * validation of input views. There is no visible representation of an M.FormView,
 * it is only used to ease the validation process and its accessing out of a
 * controller.
 * 
 * @extends M.View
 */
M.FormView = M.View.extend(
/** @scope M.FormView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.FormView',

    /**
     * Determines whether to automatically show an alert dialog view out of the showError method
     * if the validation failed or not. So if set to YES, all error messages are shown in an alert
     * dialog view once the showError method is called.
     *
     * @type Boolean
     */
    showAlertDialogOnError: YES,

    /**
     * The title of the alert view that comes up automatically if the validation fails, depending
     * one the 'showAlertOnError' property.
     *
     * @type String
     */
     alertTitle: 'Validation Error(s)',

    /**
     * This method triggers the validate() on all child views, respectively on their validators. If
     * a validation error occurs, the showErrors() will be called.
     *
     * @returns {Boolean} The result of the validation process: valid or not.
     */
    validate: function() {
        var ids = this.getIds();
        for(var name in ids) {
            if(!!!(M.ViewManager.getViewById(ids[name]).validators)) {
                delete ids[name];
            }
        }

        var isValid = YES;
        M.Validator.clearErrorBuffer();

        for(var name in ids) {
            var view = M.ViewManager.getViewById(ids[name]);
            if(view && view.validators) {
                if(view.cssClassOnError) {
                    view.removeCssClass(view.cssClassOnError);
                }

                _.each(view.validators, function(validator) {
                    if(!validator.validate(view, name)) {
                        isValid = NO;
                    }
                });
            }
        }

        if(!isValid) {
            this.showErrors();
        }

        return isValid;
    },

    /**
     * This method adds a css class specified by the cssClassOnError property to any
     * view that caused a validation error and has this property specified.
     *
     * If the showAlertDialogOnError property is set to YES, a alert dialog view
     * is display additionally, presenting the error messages of all invalid views.
     */
    showErrors: function() {
        var errors = '';
        _.each(M.Validator.validationErrors, function(error) {
            if(error && error.errObj) {
                var view = M.ViewManager.getViewById(error.errObj.viewId);
                if(view && view.cssClassOnError) {
                    view.addCssClass(view.cssClassOnError);
                }
                errors += '<li>' + error.msg + '</li>';
            }
        });

        if(this.showAlertDialogOnError) {
            M.DialogView.alert({
                title: this.alertTitle,
                message: errors
            });
        }
    },

    /**
     * This method is a wrapper of M.View's clearValues() method.
     */
    clearForm: function() {
        this.clearValues();
    },

    /**
     * This method is a wrapper of M.View's getValues() method.
     */
    getFormValues: function() {
        return this.getValues();
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for a two column layout of a grid view.
 *
 * @type String
 */
M.TWO_COLUMNS = {
    cssClass: 'ui-grid-a',
    columns: {
        0: 'ui-block-a',
        1: 'ui-block-b'
    }
};

/**
 * A constant value for a three column layout of a grid view.
 *
 * @type String
 */
M.THREE_COLUMNS = {
    cssClass: 'ui-grid-b',
    columns: {
        0: 'ui-block-a',
        1: 'ui-block-b',
        2: 'ui-block-c'
    }
};

/**
 * A constant value for a four column layout of a grid view.
 *
 * @type String
 */
M.FOUR_COLUMNS = {
    cssClass: 'ui-grid-c',
    columns: {
        0: 'ui-block-a',
        1: 'ui-block-b',
        2: 'ui-block-c',
        3: 'ui-block-d'
    }
};

/**
 * @class
 *
 * M.GridView defines a prototype of a grid view, that allows you to display several
 * views horizontally aligned. Therefore you can either use a predefined layout or you
 * can provide a custom layout.
 * 
 * @extends M.View
 */
M.GridView = M.View.extend(
/** @scope M.GridView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.GridView',

    /**
     * The layout for the grid view. There are two predefined layouts available:
     * 
     * - M.TWO_COLUMNS: a two column layout, width: 50% / 50%
     * - M.THREE_COLUMNS: a three column layout, width: 33% / 33% / 33%
     * - M.FOUR_COLUMNS: a four column layout, width: 25% / 25% / 25%
     *
     * To specify your own layout, you will have to implement some css classes and
     * then define your layout like:
     *
     *     cssClass: 'cssClassForWholeGrid',
     *     columns: {
     *         0: 'cssClassForColumn1',
     *         1: 'cssClassForColumn2',
     *         2: 'cssClassForColumn3',
     *         3: 'cssClassForColumn4',
     *         //........
     *     }
     *
     * @type Object
     */
    layout: null,
    
    /**
     * This property can be used to assign a css class to the view to get a custom styling.
     *
     * @type String
     */
    cssClass: '',

    /**
     * Renders a grid view based on the specified layout.
     *
     * @private
     * @returns {String} The grid view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '" ' + this.style() + '>';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Triggers render() on all children and includes some special grid view logic
     * concerning the rendering of these child views.
     *
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            if(this.layout) {
                var arr = this.childViews.split(' ');
                for(var i in this.layout.columns) {
                    if(this[arr[i]]) {
                        this.html += '<div class="' + this.layout.columns[i] + '">';

                        this[arr[i]]._name = arr[i];
                        this.html += this[arr[i]].render();

                        this.html += '</div>';
                    }
                }
            } else {
                M.Logger.log('No layout specified for GridView (' + this.id + ')!', M.WARN);
            }
        }
    },

    /**
     * This method themes the grid view, respectively its child views.
     *
     * @private
     */
    theme: function() {
        this.themeChildViews();
    },

    /**
     * Applies some style-attributes to the grid view.
     *
     * @private
     * @returns {String} The grid view's styling as html representation.
     */
    style: function() {
        if(this.layout) {
            var html = 'class="' + this.layout.cssClass + ' ' + this.cssClass + '"';
            return html;
        }
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * The is the prototype of any image view. It basically renders a simple image and
 * can be styled using a css class.
 *
 * @extends M.View
 */
M.ImageView = M.View.extend(
/** @scope M.ImageView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ImageView',

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap', 'error', 'load'],

    /**
     * Renders an image view based on the specified layout.
     *
     * @private
     * @returns {String} The image view's html representation.
     */
    render: function() {
        this.computeValue();
        this.html = '<img id="' + this.id + '" src="' + (this.value && typeof(this.value) === 'string' ? this.value : '') + '"' + this.style() + ' />';
        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for image views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            error: {
                target: this,
                action: 'sourceIsInvalid'
            },
            load: {
                target: this,
                action: 'sourceIsValid'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },


    /**
     * Updates the value of the label with DOM access by jQuery.
     *
     * @private
     */
    renderUpdate: function() {
        this.computeValue();
        $('#' + this.id).attr('src', this.value);
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the image.
     *
     * @private
     */
    theme: function() {
    },
    
    /**
     * Applies some style-attributes to the image view.
     *
     * @private
     * @returns {String} The image view's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    sourceIsInvalid: function(id, event, nextEvent) {
        M.Logger.log('The source \'' + this.value + '\' is invalid, so we hide the image!', M.WARN);
        $('#' + this.id).addClass('tmp-image-hidden');

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    sourceIsValid: function(id, event, nextEvent) {
        $('#' + this.id).removeClass('tmp-image-hidden');
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      02.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for hyperlink of type email.
 *
 * @type String
 */
M.HYPERLINK_EMAIL = 'mail';

/**
 * A constant value for hyperlink of type website.
 *
 * @type String
 */
M.HYPERLINK_WEBSITE = 'website';

/**
 * A constant value for hyperlink of type phone number.
 *
 * @type String
 */
M.HYPERLINK_PHONE = 'phone';

/**
 * @class
 *
 * The is the prototype of any label view. It basically renders a simple plain
 * text can be styled using several properties of M.LabelView or providing one
 * ore more css classes.
 *
 * @extends M.View
 */
M.LabelView = M.View.extend(
/** @scope M.LabelView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.LabelView',

    /**
     * Determines whether a new line '\n' within the label's value should be transformed
     * into a line break '<br/>' before it is rendered. Default: YES.
     *
     * @type Boolean
     */
    newLineToBreak: YES,

    /**
     * Determines whether a tabulator '\t' within the label's value should be transformed
     * into four spaces '&#160;' before it is rendered. Default: YES.
     *
     * @type Boolean
     */
    tabToSpaces: YES,

    /**
     * This property can be used to specify a certain hyperlink type for this label. It only
     * works in combination with the hyperlinkTarget property.
     *
     * @type String
     */
    hyperlinkType: null,

    /**
     * This property can be used to specify a hyperlink target for this label. It only
     * works in combination with the hyperlinkType property.
     *
     * @type String
     */
    hyperlinkTarget: null,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['tap'],

    /**
     * Renders a label view as a div tag with corresponding data-role attribute and inner
     * text defined by value.
     *
     * @private
     * @returns {String} The image view's styling as html representation.
     */
    render: function() {
        this.computeValue();
        this.html += '<div id="' + this.id + '"' + this.style() + '>';

        if(this.hyperlinkTarget && this.hyperlinkType) {
            switch (this.hyperlinkType) {
                case M.HYPERLINK_EMAIL:
                    this.html += '<a rel="external" href="mailto:' + this.hyperlinkTarget + '">';
                    break;
                case M.HYPERLINK_WEBSITE:
                    this.html += '<a rel="external" target="_blank" href="' + this.hyperlinkTarget + '">';
                    break;
                case M.HYPERLINK_PHONE:
                    this.html += '<a rel="external" href="tel:' + this.hyperlinkTarget + '">';
                    break;
            }
        }

        this.html += this.newLineToBreak ? this.nl2br(this.tabToSpaces ? this.tab2space(this.value) : this.value) : (this.tabToSpaces ? this.tab2space(this.value) : this.value);

        if(this.hyperlinkTarget && this.hyperlinkType) {
            this.html += '</a>';
        }

        this.html += '</div>';

        return this.html;
    },

    /**
     * Updates the value of the label with DOM access by jQuery.
     *
     * @private
     */
    renderUpdate: function() {
        this.computeValue();
        $('#' + this.id).html(this.newLineToBreak ? this.nl2br(this.value) : this.value);
    },

    /**
     * Applies some style-attributes to the label.
     *
     * @private
     * @returns {String} The label's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.isInline) {
            html += ' style="display:inline;"';
        }
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    /**
     * This method sets the label's value and initiates its re-rendering.
     *
     * @param {String} value The value to be applied to the label view.
     */
    setValue: function(value) {
        this.value = value;
        this.renderUpdate();
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      02.12.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.LoaderView is the prototype for a loader a.k.a. activity indicator. This very simple
 * view can be used to show the user that something is happening, e.g. while the application
 * is waiting for a request to return some data.
 *
 * @extends M.View
 */
M.LoaderView = M.View.extend(
/** @scope M.LoaderView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.LoaderView',

    /**
     * This property states whether the loader has already been initialized or not.
     *
     * @type Boolean
     */
    isInitialized: NO,

    /**
     * This property counts the loader calls to show
     *
     * @type Number
     */
    refCount: 0,

    /**
     * This property can be used to specify the default title of a loader.
     *
     * @type String
     */
    defaultTitle: 'loading',
            
    /**
     * This method initializes the loader by loading it once.
     *
     * @private 
     */
    initialize: function() {
        if(!this.isInitialized) {
            this.refCount = 0;
            $.mobile.showPageLoadingMsg();
            $.mobile.hidePageLoadingMsg();
            this.isInitialized = YES;
        }
    },

    /**
     * This method shows the default loader. You can specify the displayed label with the
     * title parameter.
     *
     * @param {String} title The title for this loader.
     * @param {Boolean} hideSpinner A boolean to specify whether to display a spinning wheel or not.
     */
    show: function(title, hideSpinner) {
        this.refCount++;
        var title = title && typeof(title) === 'string' ? title : this.defaultTitle;
        if(this.refCount == 1){
            $.mobile.showPageLoadingMsg('a', title, hideSpinner);
            var loader = $('.ui-loader');
            loader.removeClass('ui-loader-default');
            loader.addClass('ui-loader-verbose');

            /* position alert in the center of the possibly scrolled viewport */
            var screenSize = M.Environment.getSize();
            var scrollYOffset = window.pageYOffset;
            var loaderHeight = loader.outerHeight();

            var yPos = scrollYOffset + (screenSize[1]/2);
            loader.css('top', yPos + 'px');
            loader.css('margin-top', '-' + (loaderHeight/2) + 'px');
        }
    },

    /**
     * This method changes the current title.
     *
     * @param {String} title The title for this loader.
     */

    changeTitle: function(title){
        $('.ui-loader h1').html(title);
    },

    /**
     * This method hides the loader.
     *
     * @param {Boolean} force Determines whether to force the hide of the loader.
     */
    hide: function(force) {
        if(force || this.refCount <= 0) {
            this.refCount = 0;
        } else {
            this.refCount--;
        }
        if(this.refCount == 0){
            $.mobile.hidePageLoadingMsg();
        }
    }
    
});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      26.01.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for map type: roadmap
 *
 * @type String
 */
M.MAP_ROADMAP = 'ROADMAP';

/**
 * A constant value for map type: hybrid
 *
 * @type String
 */
M.MAP_HYBRID = 'HYBRID';

/**
 * A constant value for map type: satellite
 *
 * @type String
 */
M.MAP_SATELLITE = 'SATELLITE';

/**
 * A constant value for map type: terrain
 *
 * @type String
 */
M.MAP_TERRAIN = 'TERRAIN';

/**
 * A global reference to the first instances of M.MapView. We use this to have a accessible hook
 * to the map we can pass to google as a callback object.
 *
 * @type Object
 */
M.INITIAL_MAP = null;

/**
 * @class
 *
 * M.MapView is the prototype of a map view. It defines a set of methods for
 * displaying a map, setting markers and showing the current location. This
 * map view is based on google maps, but other implementations are possible.
 *
 * @extends M.View
 */
M.MapView = M.View.extend(
/** @scope M.MapView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.MapView',

    /**
     * This property is used to save a reference to the actual google map. It
     * is set automatically when the map is firstly initialized.
     *
     * @type Object
     */
    map: null,

    /**
     * This property is used to store the map's M.MapMarkerViews. If a marker
     * is set within the init() method or by calling the addMarker() method,
     * it is automatically pushed into this array.
     *
     * @type Object
     */
    markers: null,

    /**
     * Determines whether to display the map view 'inset' or at full width.
     *
     * @type Boolean
     */
    isInset: YES,

    /**
     * This property specifies the zoom level for this map view. It is directly
     * mapped to the zoom property of a google map view. For further information
     * see the google maps API specification:
     *
     *   http://code.google.com/intl/de-DE/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type Number
     */
    zoomLevel: 15,

    /**
     * This property specifies the map type for this map view. It is directly
     * mapped to the 'mapTypeId' property of a google map view. Possible values
     * for this property are:
     *
     *   - M.MAP_ROADMAP --> This map type displays a normal street map.
     *   - M.MAP_HYBRID --> This map type displays a transparent layer of major streets on satellite images.
     *   - M.MAP_SATELLITE --> This map type displays satellite images.
     *   - M.MAP_TERRAIN --> This map type displays maps with physical features such as terrain and vegetation.
     *
     * For further information see the google maps API specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type String
     */
    mapType: M.MAP_ROADMAP,

    /**
     * This property specifies whether or not to display the map type controls
     * inside of this map view. For further information see the google maps API
     * specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type Boolean
     */
    showMapTypeControl: NO,

    /**
     * This property specifies whether or not to display the navigation controls
     * inside of this map view. For further information see the google maps API
     * specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type Boolean
     */
    showNavigationControl: NO,

    /**
     * This property specifies whether or not to display the street view controls
     * inside of this map view. For further information see the google maps API
     * specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type Boolean
     */
    showStreetViewControl: NO,

    /**
     * This property specifies whether the map is draggable or not. If set to NO,
     * a user won't be able to move the map, respectively the visible sector. For
     * further information see the google maps API specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type Boolean
     */
    isDraggable: YES,

    /**
     * This property specifies the initial location for this map view, as an M.Location
     * object. Its latitude and longitude properties are directly mapped to the center
     * property of a google map view. For further information see the google maps API
     * specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MapOptions
     *
     * @type M.Location
     */

    initialLocation: M.Location.extend({
        latitude: 48.813338,
        longitude: 9.178463
    }),

    /**
     * This property determines whether or not to show a marker at the map view's
     * initial location. This location can be specified by the initialLocation
     * property of this map view.
     *
     * @type Boolean
     */
    setMarkerAtInitialLocation: NO,

    /**
     * This property can be used to specify the animation type for this map view's
     * markers. The following three values are possible:
     *
     *   M.MAP_MARKER_ANIMATION_NONE --> no animation
     *   M.MAP_MARKER_ANIMATION_DROP --> the marker drops onto the map
     *   M.MAP_MARKER_ANIMATION_BOUNCE --> the marker constantly bounces
     *
     * @type String
     */
    markerAnimationType: M.MAP_MARKER_ANIMATION_NONE,

    /**
     * This property spacifies whether or not this map has already been initialized.
     *
     * @type Boolean
     */
    isInitialized: NO,

    /**
     * This property specifies whether or not to remove all existing markers on a
     * map update. A map update can either be an automatic update due to content
     * binding or a implicit call of the map view's updateMap() method.
     *
     * @type Boolean
     */
    removeMarkersOnUpdate: YES,

    /**
     * If set, contains the map view's callback in sub a object named 'error',
     * which will be called if no connection is available and the map service
     * (google maps api) can not be loaded.
     *
     * @type Object
     */
    callbacks: null,

    /**
     * This flag can be used to specify whether or not to load the google places
     * library. By default this property is set to YES. If you do not need the
     * library, you should set this to NO in order to save some bandwidth.
     *
     * @type Boolean
     */
    loadPlacesLibrary: YES,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap'],

    /**
     * Renders a map view, respectively a map view container.
     *
     * @private
     * @returns {String} The map view's html representation.
     */
    render: function() {
        this.html = '<div data-fullscreen="true" id="' + this.id + '"';
        this.html += !this.isInset ? ' class="ui-listview"' : '';
        this.html += '><div id="' + this.id + '_map"' + this.style() + '></div></div>';

        return this.html;
    },

    /**
     * This method is called if the bound content changed. This content must be
     * an array of M.Location objects or M.MapMarkerView objects. This method
     * will take care of a re-rendering of the map view and all of its bound
     * markers.
     *
     * If M.Location objects are passed, the default settings for map markers
     * of this map view are assigned.
     *
     * Note that you can not use individual click events for your markers if
     * you pass M.Location objects.
     */
    renderUpdate: function() {
        /* check if content binding is valid */
        var content = null;
        if(!(this.contentBinding && this.contentBinding.target && typeof(this.contentBinding.target) === 'object' && this.contentBinding.property && typeof(this.contentBinding.property) === 'string' && this.contentBinding.target[this.contentBinding.property])) {
            M.Logger.log('No valid content binding specified for M.MapView (' + this.id + ')!', M.WARN);
            return;
        }

        /* get the marker / location objects from content binding */
        var content = this.contentBinding.target[this.contentBinding.property];
        var markers = [];

        /* save a reference to the map */
        var that = this;

        /* if we got locations, transform to markers */
        if(content && content[0] && content[0].type === 'M.Location') {
            _.each(content, function(location) {
                if(location && typeof(location) === 'object' && location.type === 'M.Location') {
                    markers.push(M.MapMarkerView.init({
                        location: location,
                        map: that
                    }));
                }
            });
        /* otherwise check and filter for map markers */
        } else if(content && content[0] && content[0].type === 'M.MapMarkerView') {
            markers = _.select(content, function(marker) {
                return (marker && marker.type === 'M.MapMarkerView')
            })
        }

        /* remove current markers */
        if(this.removeMarkersOnUpdate) {
            this.removeAllMarkers();
        }

        /* add all new markers */
        _.each(markers, function(marker) {
            that.addMarker(marker);
        })
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * We use this to disable event registration for M.MapView, since we only use the 'events' property
     * for determining the handler for possible map markers of this map.
     */
    registerEvents: function() {

    },

    /**
     * Applies some style-attributes to the map view.
     *
     * @private
     * @returns {String} The maps view's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    /**
     * This method is used to initialize a map view, typically out of a controller.
     * With its options parameter you can set or update almost every parameter of
     * a map view. This allows you to define a map view within your view, but then
     * update its parameters later when you want this view to display a map.
     *
     * The options parameter must be passed as a simple object, containing all of
     * the M.MapView's properties you want to be updated. Such an options object
     * could look like the following:
     *
     *   {
     *     zoomLevel: 12,
     *     mapType: M.MAP_HYBRID,
     *     initialLocation: location
     *   }
     *
     * While all properties of the options parameter can be given as Number, String
     * or a constant value, the location must be a valid M.Location object.
     *
     * Once the google api is initialized, the success callback specified with the
     * options parameter is called. If an error occurs (e.g. no network connection),
     * the error callback is called instead. They can be specified like the
     * following:
     *
     *   {
     *     callbacks: {
     *       success: {
     *         target: this,
     *         action: function() {
     *           // success callback
     *         }
     *       },
     *       error: {
     *         target: this,
     *         action: function() {
     *           // error callback
     *         }
     *       }
     *     }
     *   }
     *   
     * @param {Object} options The options for the map view.
     * @param {Boolean} isUpdate Indicates whether this is an update call or not.
     */
    initMap: function(options, isUpdate) {
        if(!this.isInitialized || isUpdate) {
            if(!isUpdate) {
                this.markers = [];
            }

            if(typeof(google) === 'undefined') {
                /* store the passed params and this map globally for further use */
                M.INITIAL_MAP = {
                    map: this,
                    options: options,
                    isUpdate: isUpdate
                };

                /* check the connection status */
                M.Environment.getConnectionStatus({
                    target: this,
                    action: 'didRetrieveConnectionStatus'
                });
            } else {
                this.googleDidLoad(options, isUpdate, true);
            }
        } else {
            M.Logger.log('The M.MapView has already been initialized', M.WARN);
        }
    },

    /**
     * This method is used internally to retrieve the connection status. If there is a connection
     * available, we will include the google maps api.
     *
     * @private
     */
    didRetrieveConnectionStatus: function(connectionStatus) {
        if(connectionStatus === M.ONLINE) {
            $.getScript(
                'http://maps.google.com/maps/api/js?' + (this.loadPlacesLibrary ? 'libraries=places&' : '') + 'sensor=true&callback=M.INITIAL_MAP.map.googleDidLoad'
            );
        } else {
            var callback = M.INITIAL_MAP.options ? M.INITIAL_MAP.options.callbacks : null;
            if(callback && M.EventDispatcher.checkHandler(callback.error)){
                this.bindToCaller(callback.error.target, callback.error.action)();
            }
        }
    },

    /**
     * This method is used internally to initialite the map if the google api hasn't been loaded
     * before. If so, we use this method as callback for google.
     *
     * @private
     */
    googleDidLoad: function(options, isUpdate, isInternalCall) {
        if(!isInternalCall) {
            options = M.INITIAL_MAP.options;
            isUpdate = M.INITIAL_MAP.isUpdate;
        }

        for(var i in options) {
             switch (i) {
                 case 'zoomLevel':
                    this[i] = (typeof(options[i]) === 'number' && options[i] > 0) ? (options[i] > 22 ? 22 : options[i]) : this[i];
                    break;
                 case 'mapType':
                    this[i] = (options[i] === M.MAP_ROADMAP || options[i] === M.MAP_HYBRID || options[i] === M.MAP_SATELLITE || options[i] === M.MAP_TERRAIN) ? options[i] : this[i];
                    break;
                 case 'markerAnimationType':
                    this[i] = (options[i] === M.MAP_MARKER_ANIMATION_BOUNCE || options[i] === M.MAP_MARKER_ANIMATION_DROP) ? options[i] : this[i];
                    break;
                 case 'showMapTypeControl':
                 case 'showNavigationControl':
                 case 'showStreetViewControl':
                 case 'isDraggable':
                 case 'setMarkerAtInitialLocation':
                 case 'removeMarkersOnUpdate':
                    this[i] = typeof(options[i]) === 'boolean' ? options[i] : this[i];
                    break;
                 case 'initialLocation':
                    this[i] = (typeof(options[i]) === 'object' && options[i].type === 'M.Location') ? options[i] : this[i];
                    break;
                 case 'callbacks':
                    this[i] = (typeof(options[i]) === 'object') ? options[i] : this[i];
                    break;
                 default:
                    break;
             }
        };
        if(isUpdate) {
            if(this.removeMarkersOnUpdate) {
                this.removeAllMarkers();
            }
            this.map.setOptions({
                zoom: this.zoomLevel,
                center: new google.maps.LatLng(this.initialLocation.latitude, this.initialLocation.longitude),
                mapTypeId: google.maps.MapTypeId[this.mapType],
                mapTypeControl: this.showMapTypeControl,
                navigationControl: this.showNavigationControl,
                streetViewControl: this.showStreetViewControl,
                draggable: this.isDraggable
            });
        } else {
            this.map = new google.maps.Map($('#' + this.id + '_map')[0], {
                zoom: this.zoomLevel,
                center: new google.maps.LatLng(this.initialLocation.latitude, this.initialLocation.longitude),
                mapTypeId: google.maps.MapTypeId[this.mapType],
                mapTypeControl: this.showMapTypeControl,
                navigationControl: this.showNavigationControl,
                streetViewControl: this.showStreetViewControl,
                draggable: this.isDraggable
            });
        }

        if(this.setMarkerAtInitialLocation) {
            var that = this;
            this.addMarker(M.MapMarkerView.init({
                location: this.initialLocation,
                map: that.map
            }));
        }

        this.isInitialized = YES;

        /* now call callback of "the outside world" */
        if(!isUpdate && this.callbacks.success && M.EventDispatcher.checkHandler(this.callbacks.success)) {
            this.bindToCaller(this.callbacks.success.target, this.callbacks.success.action)();
        }
    },

    /**
     * This method is used to update a map view, typically out of a controller.
     * With its options parameter you can update or update almost every parameter
     * of a map view. This allows you to define a map view within your view, but
     * then update its parameters later when you want this view to display a map
     * and to update those options over and over again for this map. 
     *
     * The options parameter must be passed as a simple object, containing all of
     * the M.MapView's properties you want to be updated. Such an options object
     * could look like the following:
     *
     *   {
     *     zoomLevel: 12,
     *     mapType: M.MAP_HYBRID,
     *     initialLocation: location
     *   }
     *
     * While all properties of the options parameter can be given as Number, String
     * or a constant value, the location must be a valid M.Location object.
     *
     * @param {Object} options The options for the map view.
     */
    updateMap: function(options) {
        this.initMap(options, YES);
    },

    /**
     * This method can be used to add a marker to the map view. Simply pass a
     * valid M.MapMarkerView object and a map marker is created automatically,
     * displayed on the map and added to this map view's markers property.
     *
     * @param {M.MapMarkerView} marker The marker to be added.
     */
    addMarker: function(marker) {
        if(marker && typeof(marker) === 'object' && marker.type === 'M.MapMarkerView' && typeof(google) !== 'undefined') {
            var that = this;
            marker.marker = new google.maps.Marker({
                map: that.map,
                draggable: NO,
                animation: google.maps.Animation[marker.markerAnimationType ? marker.markerAnimationType : that.markerAnimationType],
                position: new google.maps.LatLng(marker.location.latitude, marker.location.longitude),
                icon: marker.icon ? new google.maps.MarkerImage(
                    marker.icon,
                    null,
                    null,
                    marker.iconSize && marker.isIconCentered ? new google.maps.Point(marker.iconSize.width / 2, marker.iconSize.height / 2) : null,
                    marker.iconSize ? new google.maps.Size(marker.iconSize.width, marker.iconSize.height) : null
                ) : marker.icon
            });
            marker.registerEvents();
            this.markers.push(
                marker
            );
        } else {
            M.Logger.log('No valid M.MapMarkerView passed for addMarker().', M.WARN);
        }
    },

    /**
     * This method can be used to remove a certain marker from the map view. In
     * order to do this, you need to pass the M.MapMarkerView object that you
     * want to be removed from the map view.
     *
     * @param {M.MapMarkerView} marker The marker to be removed.
     */
    removeMarker: function(marker) {
        if(marker && typeof(marker) === 'object' && marker.type === 'M.MapMarkerView') {
            var didRemoveMarker = NO;
            this.markers = _.select(this.markers, function(m) {
                if(marker === m){
                    m.marker.setMap(null);
                    didRemoveMarker = YES;
                }
                return !(marker === m);
            });
            if(!didRemoveMarker) {
                M.Logger.log('No marker found matching the passed marker in removeMarker().', M.WARN);    
            }
        } else {
            M.Logger.log('No valid M.MapMarkerView passed for removeMarker().', M.WARN);
        }
    },

    /**
     * This method removes all markers from this map view. It both cleans up the
     * markers array and deletes the marker's visual representation from the map
     * view.
     */
    removeAllMarkers: function() {
        _.each(this.markers, function(marker) {
            marker.marker.setMap(null);
        });
        this.markers = [];
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      27.01.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for the map's marker animation type: none
 *
 * @type String
 */
M.MAP_MARKER_ANIMATION_NONE = 'NONE';

/**
 * A constant value for the map's marker animation type: drop
 *
 * @type String
 */
M.MAP_MARKER_ANIMATION_DROP = 'DROP';

/**
 * A constant value for the map's marker animation type: bounce
 *
 * @type String
 */
M.MAP_MARKER_ANIMATION_BOUNCE = 'BOUNCE';

/**
 * @class
 *
 * M.MapMarkerView is the prototype of a map marker view. It defines a set
 * of methods for adding, removing and managing the markers of a M.MapView.
 *
 * The M.MapMarkerView is based on google maps markers.
 *
 * @extends M.View
 */
M.MapMarkerView = M.View.extend(
/** @scope M.MapMarkerView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.MapMarkerView',

    /**
     * This property is used to save a reference to the actual google map marker.
     * It is set automatically when the map marker is firstly initialized.
     *
     * @type Object
     */
    marker: null,

    /**
     * This property can be used to store additional information about a marker.
     * Since this property is an object, you can store pretty much anything in
     * this property.
     *
     * This can be useful especially if you are using the click event for map
     * markers. So you can store any information with a marker and retrieve
     * this information on the click event.
     *
     * @type Object
     */
    data: null,

    /**
     * This property contains a reference to the marker's map view.
     *
     * @type M.MapView
     */
    map: null,

    /**
     * This property specifies the title of a map marker view. It can be used in
     * an annotation.
     *
     * @type String
     */
    title: null,

    /**
     * This property specifies the message of a map marker view respectively for
     * its annotation.
     *
     * @type String
     */
    message: null,

    /**
     * This property can be used to specify whether or not to show the annotation,
     * if title and / or message are defined, automatically on click event.
     *
     * @type Boolean
     */
    showAnnotationOnClick: NO,

    /**
     * This property contains a reference to a google maps info window that is
     * connected to this map marker. By calling either the showAnnotation() or
     * the hideAnnotation() method, this info window can be toggled.
     *
     * Additionally the info window will be automatically set to visible if the
     * showAnnotationOnClick property is set to YES.
     *
     * @type Object
     */
    annotation: null,

    /**
     * This property specifies whether the marker is draggable or not. If set
     * to NO, a user won't be able to move the marker. For further information
     * see the google maps API specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MarkerOptions
     *
     * @type Boolean
     */
    isDraggable: NO,

    /**
     * This property specifies the location for this map marker view, as an M.Location
     * object. Its latitude and longitude properties are directly mapped to the position
     * property of a google maps marker. For further information see the google maps API
     * specification:
     *
     *   http://code.google.com/intl/en-US/apis/maps/documentation/javascript/reference.html#MarkerOptions
     *
     * @type M.Location
     */
    location: M.Location.extend({
        latitude: 48.813338,
        longitude: 9.178463
    }),

    /**
     * This property can be used to specify the animation type for this map marker
     * view. If this property is set, the markerAnimationType property of the parent
     * map view is ignored. The following three values are possible:
     *
     *   M.MAP_MARKER_ANIMATION_NONE --> no animation
     *   M.MAP_MARKER_ANIMATION_DROP --> the marker drops onto the map
     *   M.MAP_MARKER_ANIMATION_BOUNCE --> the marker constantly bounces
     *
     * @type String
     */
    markerAnimationType: null,

    /**
     * This property can be used to specify a custom marker icon. Simply pass a valid
     * path to an image and it will be shown instead of google's default marker.
     *
     * @type String
     */
    icon: null,

    /**
     * This property can be used to specify the display size of the icon used for the
     * marker. This is important if you want to support e.g. the iphone's retina display.
     *
     * Pass along an object containing the desired width and height, e.g.:
     *
     *     {
     *         width: 20,
     *         height: 20
     *     }
     *
     * @type Object
     */
    iconSize: null,

    /**
     * This property can be used to display a map marker icon centered about its location.
     * By default a map marker is positioned with its bottom center at the location.
     *
     * @type Boolean
     */
    isIconCentered: NO,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap'],

    /**
     * This method initializes an M.MapMarkerView. It connects a map marker directly with
     * the parent map view and returns the created M.MapMarkerView object.
     *
     * Note: By calling this method, the map marker won't be displayed on the map. It only gets
     * initialized and can no be displayed by using the map view's addMarker() method or via
     * content binding.
     *
     * @param {Object} options The options for the map marker view.
     */
    init: function(options) {
        var marker = this.extend(options);

        if(marker.annotation || marker.message) {
            var content = marker.title ? '<h1 class="ui-annotation-header">' + marker.title + '</h1>' : '';
            content += marker.message ? '<p class="ui-annotation-message">' + marker.message + '</p>' : '';
            
            marker.annotation = new google.maps.InfoWindow({
                content: content,
                maxWidth: 100
            });
        }

        return marker;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list item views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            tap: {
                target: this,
                action: 'showAnnotation'
            }
        }

        var that = this;
        google.maps.event.addListener(this.marker, 'click', function() {
            M.EventDispatcher.callHandler(that.internalEvents.tap, event, YES);
        });
    },

    /**
     * This method can be used to remove a map marker from a map view.
     */
    remove: function() {
        this.map.removeMarker(this);
    },

    /**
     * This method can be used to show a map markers annotation.
     */
    showAnnotation: function(id, event, nextEvent) {
        if(this.annotation) {
            this.annotation.open(this.map.map, this.marker);
        }

        /* delegate event to external handler, if specified */
        if(this.events || this.map.events) {
            var events = this.events ? this.events : this.map.events;
            for(var e in events) {
                if(e === ((event.type === 'click' || event.type === 'touchend') ? 'tap' : event.type)) {
                    M.EventDispatcher.callHandler(events[e], event, NO, [this]);
                }
            }
        }
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      02.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * The is the prototype of a movable label view.
 * It extends M.LabelView and has special methods and overrides for making it movable
 *
 * @extends M.LabelView
 */
M.MovableLabelView = M.LabelView.extend(
/** @scope M.MovableLabelView.prototype */ {

    /**
     * The type of this object.
     *
     * @type {String}
     */
    type: 'M.MovableLabelView',

    /**
     * movable object property responsible for making this view movable
     *
     */
    movable: null,

    /**
     * The CSSOM representation of the newly created style in the document-head
     *
     * @private
     * @type {Object}
     */
    extraStyle: null,

    /**
     * Signalizes if there are any moveRules attached to this view
     *
     * @private
     * @type {Boolean}
     */
    moveRulesAvailable: NO,

    /**
     * jQuery object of the DOM representation of this view
     *
     * @private
     * @type {Object}
     */
    $this: null,

    /**
     * jQuery object of the DOM representation of this view's parent
     *
     * @private
     * @type {Object}
     */
    $parent: null,

    /**
     * Renders a label view as a div tag with corresponding data-role attribute and inner
     * text defined by value. Also checks if the label has to move hence that the movable property has been passed.
     * If so renders an outer div, creates an extra style inside the document-head, checks if moving is necessary
     * and if so sets the label movable.
     *
     * @private
     * @returns {String} The image view's styling as html representation.
     */

    render: function() {
        var that = this,
            diff;
        this.computeValue();
        if(_.isObject(this.movable)) {
            if ((this.movable.time || this.movable.time === 0) || (this.movable.pxPerSec || this.movable.pxPerSec === 0)){
                this.html = '<div class="tmp-movable-outer outer-'+ this.id +'">';
                this.extraStyle = this._createExtraStyle();
                window.setTimeout(function(){
                    (diff = that._checkIfMovingNecessary()) ? that._makeMovable(diff) : M.Logger.log('Width not big enough to move', M.INFO);
                }, 0);
            }else {
                M.Logger.log('"time" OR "pxPerSec" are needed', M.WARN);
            }
        }
        this.html += '<div id="' + this.id + '"' + this.style() + '>';

        if(this.hyperlinkTarget && this.hyperlinkType) {
            switch (this.hyperlinkType) {
                case M.HYPERLINK_EMAIL:
                    this.html += '<a rel="external" href="mailto:' + this.hyperlinkTarget + '">';
                    break;
                case M.HYPERLINK_WEBSITE:
                    this.html += '<a rel="external" target="_blank" href="' + this.hyperlinkTarget + '">';
                    break;
                case M.HYPERLINK_PHONE:
                    this.html += '<a rel="external" href="tel:' + this.hyperlinkTarget + '">';
                    break;
            }
        }

        this.html += this.newLineToBreak ? this.nl2br(this.tabToSpaces ? this.tab2space(this.value) : this.value) : (this.tabToSpaces ? this.tab2space(this.value) : this.value);

        if(this.hyperlinkTarget && this.hyperlinkType) {
            this.html += '</a>';
        }

        this.html += '</div>';

        /* If movable is set, an outer div box was defined before and we need to close it here */
        if(_.isObject(this.movable)) {
            this.html += '</div>';
        }

        return this.html;
    },

    /**
     * Updates the value of the label with DOM access by jQuery. Checks again if this view has to move
     * as the width might has changed hence of changes in the views value.
     *
     * @private
     */
    renderUpdate: function() {
        var that = this;
        this.computeValue();
        $('#' + this.id).html(this.newLineToBreak ? this.nl2br(this.value) : this.value);
        if(_.isObject(this.movable)){
            if ((this.movable.time || this.movable.time === 0) || (this.movable.pxPerSec || this.movable.pxPerSec === 0)){
                window.setTimeout(function(){
                    (diff = that._checkIfMovingNecessary()) ? that._makeMovable(diff) : M.Logger.log('Width not big enough to move', M.INFO);
                }, 0);
            }else {
                M.Logger.log('"time" OR "pxPerSec" are needed', M.WARN);
            }
        }
    },

    /**
     * Actual method which makes this view movable by inserting CSS3 animation rule
     * to the extra style-tag in the document-head.
     *
     * @private
     */
    _makeMovable: function(diff) {
        var that = this;
        window.setTimeout(function(){
            that._insertMoveRules(that._getBrowserKeyframeRule(), diff, (that.movable.offset || that.movable.offset === 0) ? that.movable.offset : 0, (that.movable.pxPerSec) ? (diff / that.movable.pxPerSec) : that.movable.time);
        }, 0);
    },

    /**
     * Responsible for deciding whether this view should move or not.
     *
     * @private
     * @returns either the calculated number or false
     */
    _checkIfMovingNecessary: function() {
        var diff;
        this.$this = $('#' + this.id);
        this.$parent = this.$this.parent();
        this._addMoveClasses(this.$this, this.$parent);
        diff = this._getDiff(this.$this, this.$parent);
        if(diff > 0){
            if(this.moveRulesAvailable){
                this._deleteMoveRules();
            }
            return diff;
        }else {
            this._removeMoveClasses(this.$this, this.$parent);
            if(this.moveRulesAvailable) {
                this._deleteMoveRules();
            }
            return NO;
        }
    },

    /**
     *
     * Appends an extra style tag to the head
     *
     * @private
     * @returns {HTMLElement} The style element as CSSOM
     */
    _createExtraStyle: function(){
        var animationStyle = document.createElement('style'), styles;
        animationStyle.type = "text/css";
        document.getElementsByTagName('head').item(0).appendChild(animationStyle);
        styles = document.styleSheets.length;
        animationStyle = document.styleSheets[styles-1];
        return animationStyle;
    },

    /**
     * Calculates the width-difference of the inner div (the one containing the value) and
     * its outer box.
     *
     * Difference + offset results in the "moving value", the offset that the label is animated.
     *
     * @private
     * @param {Object} $self
     * @param {Object} $parent
     * @returns {number} difference self-width minus parent-width
     */
    _getDiff: function($self, $parent) {
        var diff = $self.outerWidth() - $parent.width();
        return diff;
    },

    /**
     * Returns the CSSRule for the specific browser.
     *
     * @private
     * @returns {string} the name of the browser for css3-animation
     */
    _getBrowserKeyframeRule: function(){
        if(CSSRule.WEBKIT_KEYFRAME_RULE) {
            return "-webkit-";
        }else if(CSSRule.MOZ_KEYRAME_RULE) {
            return "-moz-";
        }else if(CSSRule.O_KEYFRAME_RULE) {
            return "-o-";
        }else {
            return "";
        }
    },

    /**
     * Adds special classes responsible for making the label move.
     *
     * @private
     * @param {Object} $self The jQuery-Object of this label
     * @param {Object} $parent The jQuery-Object of the surrounding div-container of the label
     */
    _addMoveClasses: function($self, $parent) {
        $self.addClass('tmp-movable-inner inner-' + this.id);
        $parent.addClass('tmp-movable-outer');
    },

    /**
     * Removes special classes responsible for making the label move.
     *
     * @private
     * @param {Object} $self The jQuery-Object of this label
     * @param {Object} $parent The jQuery-Object of the surrounding div-container of the label
     */
    _removeMoveClasses: function($self, $parent) {
        $self.removeClass('tmp-movable-inner inner-' + this.id);
        $parent.removeClass('tmp-movable-outer');
    },

    /**
     * Inserts Animation-Rules to the CSSOM in the document-head.
     *
     * @private
     * @param {String} The String for the specific browser
     * @param diff The difference self-parent
     * @param offset The offset value of the passed movable-object
     * @param sec The time value of the passed movable-object
     */
    _insertMoveRules: function(browsertype, diff, offset, sec){
        this.extraStyle.insertRule('.inner-' + this.id + ' {'+
            browsertype+'animation-name: move-' + this.id + ';'+
            browsertype+'animation-duration: ' + sec + 's;'+
            browsertype+'animation-iteration-count: infinite;'+
            browsertype+'animation-timing-function: linear;'+
            '}', 0);
        this.extraStyle.insertRule('@' + browsertype + 'keyframes move-' + this.id + '{ 0%,100% { left: ' + offset + 'px;} 50% { left:' + (-diff - offset) + 'px;}}', 1);
        this.moveRulesAvailable = YES;
    },

    /**
     * Deletes the extra CSS3 animation-rules from the CSSOM in the document-head.
     *
     * @private
     *
     */
    _deleteMoveRules: function(){
        var l = this.extraStyle.cssRules.length;
        while(l > 0){
            this.extraStyle.removeRule(l-1);
            l = this.extraStyle.cssRules.length;
        }
        this.moveRulesAvailable = NO;
    },

    /**
     * Applies some style-attributes to the label.
     *
     * @private
     * @returns {String} The label's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.isInline) {
            html += ' style="display:inline;"';
        }
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    /**
     * This method sets the label's value and initiates its re-rendering.
     *
     * @param {String} value The value to be applied to the label view.
     */
    setValue: function(value) {
        this.value = value;
        this.renderUpdate();
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Sebastian
// Date:      02.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.PageView is the prototype of any page. It is the seconds 'highest' view, right after
 * M.Application. A page is the container view for all other views.
 *
 * @extends M.View
 */
M.PageView = M.View.extend(
/** @scope M.PageView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.PageView',

    /**
     * States whether a page is loaded the first time or not. It is automatically set to NO
     * once the page was first loaded.
     *
     * @type Boolean
     */
    isFirstLoad: YES,

    /**
     * Indicates whether the page has a tab bar or not.
     *
     * @type Boolean
     */
    hasTabBarView: NO,

    /**
     * The page's tab bar.
     *
     * @type M.TabBarView
     */
    tabBarView: null,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['pagebeforeshow', 'pageshow', 'pagebeforehide', 'pagehide', 'orientationdidchange'],

    /**
     * This property is used to specify a view's internal events and their corresponding actions. If
     * there are external handlers specified for the same event, the internal handler is called first.
     *
     * @type Object
     */
    internalEvents: null,

    /**
     * An associative array containing all list views used in this page. The key for a list view is
     * its id. We do this to have direct access to a list view, so we can reset its selected item
     * once the page was hidden.
     *
     * @type Object
     */
    listList: null,

    /**
     * This property contains the page's current orientation. This property is only used internally!
     *
     * @private
     * @type Number
     */
    orientation: null,

    /**
     * Renders in three steps:
     * 1. Rendering Opening div tag with corresponding data-role
     * 2. Triggering render process of child views
     * 3. Rendering closing tag
     *
     * @private
     * @returns {String} The page view's html representation.
     */
    render: function() {
        /* store the currently rendered page as a reference for use in child views */
        M.ViewManager.currentlyRenderedPage = this;
        
        this.html = '<div id="' + this.id + '" data-role="page"' + this.style() + '>';

        this.renderChildViews();

        this.html += '</div>';

        this.writeToDOM();
        this.theme();
        this.registerEvents();
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for page views and its
     * internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            pagebeforeshow: {
                target: this,
                action: 'pageWillLoad'
            },
            pageshow: {
                target: this,
                action: 'pageDidLoad'
            },
            pagebeforehide: {
                target: this,
                action: 'pageWillHide'
            },
            pagehide: {
                target: this,
                action: 'pageDidHide'
            },
            orientationdidchange: {
                target: this,
                action: 'orientationDidChange'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * This method writes the view's html string into the DOM. M.Page is the only view that does
     * that. All other views just deliver their html representation to a page view.
     */
    writeToDOM: function() {
        $('body').append(this.html);
    },

    /**
     * This method is called right before the page is loaded. If a beforeLoad-action is defined
     * for the page, it is now called.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    pageWillLoad: function(id, event, nextEvent) {
        /* initialize the tabbar */
        if(M.Application.isFirstLoad) {
            M.Application.isFirstLoad = NO;
            var currentPage = M.ViewManager.getCurrentPage();
            if(currentPage && currentPage.hasTabBarView) {
                var tabBarView = currentPage.tabBarView;

                if(tabBarView.childViews) {
                    var childViews = tabBarView.getChildViewsAsArray();
                    for(var i in childViews) {
                        if(M.ViewManager.getPage(tabBarView[childViews[i]].page).id === currentPage.id) {
                            tabBarView.setActiveTab(tabBarView[childViews[i]]);
                        }
                    }
                }
            }
        }

        /* initialize the loader for later use (if not already done) */
        if(M.LoaderView) {
            M.LoaderView.initialize();
        }

        /* call controlgroup plugin on any such element on the page */
        $('#' + id).find('[data-role="controlgroup"]').each(function() {
            var that = this;
            window.setTimeout(function() {
                $(that).controlgroup();
            }, 1);
        });

        /* reset the page's title */
        document.title = M.Application.name;

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [this.isFirstLoad]);
        }
    },

    /**
     * This method is called right after the page was loaded. If a onLoad-action is defined
     * for the page, it is now called.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    pageDidLoad: function(id, event, nextEvent) {
        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [this.isFirstLoad]);
        }

        /* call controlgroup plugin on any such element on the page */
//        $('#' + id).find('[data-role="controlgroup"]').each(function() {
//            $(this).controlgroup();
//        });

        this.isFirstLoad = NO;
    },

    /**
     * This method is called right before the page is hidden. If a beforeHide-action is defined
     * for the page, it is now called.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    pageWillHide: function(id, event, nextEvent) {
        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [this.isFirstLoad]);
        }
    },

    /**
     * This method is called right after the page was hidden. If a onHide-action is defined
     * for the page, it is now called.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    pageDidHide: function(id, event, nextEvent) {
        /* if there is a list on the page, reset it: deactivate possible active list items */
        if(this.listList) {
            _.each(this.listList, function(list) {
                list.resetActiveListItem();
            });
        }

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [this.isFirstLoad]);
        }
    },

    /**
     * This method is called right after the device's orientation did change. If a action for
     * orientationdidchange is defined for the page, it is now called.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    orientationDidChange: function(id, event, nextEvent) {
        /* get the orientation */
        var orientation = M.Environment.getOrientation();
        
        /* filter event duplicates (can happen due to event delegation in bootstraping.js) */
        if(orientation === this.orientation) {
            return;
        }

        /* auto-reposition opened dialogs */
        $('.tmp-dialog').each(function() {
            var id = $(this).attr('id');
            var dialog = M.ViewManager.getViewById(id);
            var dialogDOM = $(this);
            window.setTimeout(function() {
                dialog.positionDialog(dialogDOM);
                dialog.positionBackground($('.tmp-dialog-background'));
            }, 500);
        });

        /* auto-reposition carousels */
        $('#' + this.id + ' .tmp-carousel-wrapper').each(function() {
            var carousel = M.ViewManager.getViewById($(this).attr('id'));
            carousel.orientationDidChange();
        });

        /* set the current orientation */
        this.orientation = orientation;

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [M.Environment.getOrientation()]);
        }
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the page and call the theme() of
     * its child views.
     *
     * @private
     */
    theme: function() {
        $('#' + this.id).page();
        this.themeChildViews();
    },

    /**
     * Applies some style-attributes to the page.
     *
     * @private
     * @returns {String} The page's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            if(!html) {
                html += ' class="';
            }
            html += this.cssClass;
        }
        if(html) {
            html += '"';
        }
        return html;
    }
    
});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2012 M-Way Solutions GmbH. All rights reserved.
//            (c) 2012 panacoda GmbH. All rights reserved.
// Creator:   Frank
// Date:      07.02.2013
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for the display type: overlay.
 *
 * @type String
 */
M.OVERLAY = 'OVERLAY';

/**
 * A constant value for the display type: reveal.
 *
 * @type String
 */
M.REVEAL  = 'REVEAL';

/**
 * A constant value for the display type: push.
 *
 * @type String
 */
M.PUSH    = 'PUSH';

/**
 * @class
 *
 * The defines the prototype of a panel view.
 *
 * @extends M.View
 */
M.PanelView = M.View.extend(
/** @scope M.PanelView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.PanelView',

    /**
    * Defines the position of the Panel. Possible values are:
    *
    * - M.LEFT  => appears on the left
    * - M.RIGHT => appears on the right
    *
    * @type String
    */
    position: M.LEFT,

    /**
    * Defines the display mode of the Panel. Possible values are:
    *
    * - M.OVERLAY  => the panel will appear on top of the page contents
    * - M.REVEAL   => the panel will sit under the page and reveal as the page slides away
    * - M.PUSH     => animates both the panel and page at the same time
    *
    * @type String
    */
    display:  M.REVEAL,

    /**
    * Defines the jqm theme to use.
    *
    * @type String
    */
    dataTheme: 'a',

    /**
     * Renders in three steps:
     * 1. Rendering Opening div tag with corresponding data-role
     * 2. Triggering render process of child views
     * 3. Rendering closing tag
     *
     * @private
     * @returns {String} The scroll view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '" data-role="panel" ' + this.style() + '>';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Applies some style-attributes to the scroll view.
     *
     * @private
     * @returns {String} The button's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        html += this.dataTheme ? ' data-theme="' + this.dataTheme + '"' : '';
        html += ' data-position="' + (this.position || M.LEFT).  toLowerCase() + '"';
        html += ' data-display="'  + (this.display  || M.REVEAL).toLowerCase() + '"';
        return html;
    },

    /**
     * shows the panel
     *
     * @public
     */
    open: function() {
        $("#"+this.id).panel("open");
    },

    /**
     * hides the panel
     *
     * @public
     */
    close: function() {
        $("#"+this.id).panel("close");
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   dominik
// Date:      15.08.11
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This ...
 *
 * @extends M.View
 */
M.PopoverView = M.View.extend(
/** @scope M.PopoverView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.PopoverView',

    menu: null,

    scrollview: null,

    hasPopScrollview: NO,

    selectedItemInPopover: null,

    render: function() {
        this.html = '<div data-role="page" id="' + this.id + '" class="tmp-popover">';

        /* render a toolbar as the popover's header */
        var toolbar = M.ToolbarView.design({
            value: 'Menu',
            cssClass: 'tmp-popover-header'
        });
        this.html += toolbar.render();

        this.menu = M.ListView.design({});

        /* render a scrollview as the content container */
        this.scrollview = M.ScrollView.design({
            cssClass: 'tmp-popover-content',
            childViews: 'list',
            list: this.menu
        });
        this.html += this.scrollview.render();

        /* add the border (with the arrow at the top) */
        this.html += '<div class="tmp-popover-arrow"></div>';

        this.html += '</div>';

        /* push to DOM */
        $('body').append(this.html);

        /* now render items */
        this.selectedItemInPopover = null;
        for (var i in this.items) {
            var item = M.ListItemView.design({
                childViews: 'label',
                parentView: this.splitview.menu.menu,
                splitViewItem: this.items[i],
                label: M.LabelView.design({
                    value: this.items[i].value
                }),
                events: {
                    tap: {
                        target: this,
                        action: 'itemSelected'
                    }
                }
            });
            this.scrollview.list.addItem(item.render());

            /* check if this item has to be selected afterwards */
            if (item.splitViewItem.id === this.splitview.selectedItem.id) {
                this.selectedItemInPopover = item.id;
            }

            /* register events for item */
            item.registerEvents();
        }

        /* now set the active list item */
        this.splitview.menu.menu.setActiveListItem(this.selectedItemInPopover);

        /* finally show the active list item's content */
        this.splitview.listItemSelected(this.selectedItemInPopover);
    },

    renderUpdate: function() {
        /* get id of selected item */
        var id;
        var that = this;
        $('#' + this.menu.id).find('li').each(function() {
            if (M.ViewManager.getViewById($(this).attr('id')).splitViewItem.id === that.splitview.selectedItem.id) {
                id = $(this).attr('id');
            }
        });
        /* activate item */
        if (id) {
            this.menu.setActiveListItem(id);
            this.selectedItemInPopover = id;
        }
    },

    show: function() {
        this.render();
        this.theme();
        this.toggle();
    },

    hide: function() {
        $('#' + this.id).hide();
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the page and call the theme() of
     * its child views.
     *
     * @private
     */
    theme: function() {
        $('#' + this.id).page();
        this.themeChildViews();
        var size = M.Environment.getSize();
        var width = size[0];
        var height = size[1];
        $('#' + this.id).css('width', Math.floor(width * 0.4) + 'px');
    },


    /**
     * This method calculates the popup's height, checks if a scrollview is required and,
     * if neccessary, scrollt the list to make the selected item visible.
     */
    resizePopup: function() {
        var itemHeight = ($('#' + this.menu.id).find('li:first')).outerHeight();
        var itemCount = $('#' + this.menu.id).find('li').length;
        var popoverSize = M.Environment.getHeight() * 0.7;
        var itemListHeight = itemCount * itemHeight;
        if (popoverSize < itemListHeight) {
            $('#' + this.menu.id).css('height', popoverSize);
            // Add a scrollview to List
            $('#' + this.menu.id).scrollview({
                direction: 'y'
            });
            this.hasPopScrollview = YES;
        }
        else {
            $('#' + this.menu.id).css('height', itemListHeight);
        }
        //Scrolling to right position is only needed when the popover has a scrollview
        if (this.hasPopScrollview) {
            this.scrollListToRightPosition();
        }
    },

    toggle: function() {
        $('#' + this.id).toggle();
        this.resizePopup();
    },

    itemSelected: function(id, event, nextEvent) {
        this.toggle();
        this.splitview.listItemSelected(id);
    },

    scrollListToRightPosition: function() {
        var itemHeight = $('#' + this.menu.id + ' li:first-child').outerHeight();
        var y = ($('#' + this.selectedItemInPopover).index() + 1) * itemHeight;
        var menuHeight = M.Environment.getHeight() * 0.7;
        var completeItemListHeight = $('#' + this.menu.id).find('li').length * itemHeight;
        var center = menuHeight / 2;
        var distanceToListEnd = completeItemListHeight - y;
        var yScroll = 0;

        /* if y coordinate of item is greater than menu height, we need to scroll down */
        if (y > menuHeight) {
            if (distanceToListEnd < center) {
                yScroll = -(y - menuHeight + distanceToListEnd);
            } else {
                yScroll = -(y - center);
            }
            /* if y coordinate of item is less than menu height, we need to scroll up */
        } else if (y < menuHeight) {
            if (y < center) {
                yScroll = 0;
            } else {
                yScroll = -(y - center);
            }
        }
        $('#' + this.menu.id).scrollview('scrollTo', 0, yScroll);
    }
});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Sebastian
// Date:      02.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * The defines the prototype of a scrollable content view. It should be used as a wrapper
 * for any content that isn't part of a header or footer toolbar / tabbar.
 *
 * @extends M.View
 */
M.ScrollView = M.View.extend(
/** @scope M.ScrollView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ScrollView',

    /**
     * Renders in three steps:
     * 1. Rendering Opening div tag with corresponding data-role
     * 2. Triggering render process of child views
     * 3. Rendering closing tag
     *
     * @private
     * @returns {String} The scroll view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '" data-role="content"' + this.style() + '>';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Applies some style-attributes to the scroll view.
     *
     * @private
     * @returns {String} The button's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      26.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.SearchBarView defines a prototype of a search bar that can be used inside of a list
 * view or independently as a plain input field with a search styling.
 *
 * @extends M.View
 */
M.SearchBarView = M.View.extend(
/** @scope M.SearchBarView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SearchBarView',

    /**
     * Determines whether the search bar is part of a list view.
     *
     * @type Boolean
     */
    isListViewSearchBar: NO,

    /**
     * If the search bar belongs to a list view, this property contains this
     * list view.
     *
     * @type M.ListView
     */
    listView: null,

    /**
     * The initial text shown inside the search bar field describing the input or making a suggestion for
     * input e.g. "Please enter your Name."
     *
     * @type String
     */
    initialText: '',

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['focus', 'blur', 'enter', 'keyup'],

    /**
     * Renders a search bar.
     *
     * @private
     * @returns {String} The search bar view's html representation.
     */
    render: function() {
        this.html = '<input id="' + this.id + '" type="search" value="' + (this.value ? this.value : this.initialText) + '" class="' + this.cssClass + '" />';

        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for text field views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            focus: {
                target: this,
                action: 'gotFocus'
            },
            blur: {
                target: this,
                action: 'lostFocus'
            },
            keyup: {
                target: this,
                action: 'setValueFromDOM'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * Updates a SearchBarView with DOM access by jQuery.
     *
     * @private
     */
    renderUpdate: function() {
        $('#' + this.id).val(this.value);
        this.styleUpdate();
    },

    /**
     * This method sets its value to the value it has in its DOM representation
     * and then delegates these changes to a controller property if the
     * contentBindingReverse property is set.
     *
     * Additionally call target / action if set.
     *
     * @param {Object} evt The event triggered this method.
     */
    setValueFromDOM: function(id, event, nextEvent) {
        this.value = this.secure($('#' + this.id).val());
        this.delegateValueUpdate();

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * Applies some style-attributes to the button.
     *
     * @private
     * @returns {String} The search bar's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.isListViewSearchBar) {
            html += ' class="ui-listview-filter"';
        }
        return html;
    },

    /**
     * Method to append css styles inline to the rendered view on the fly.
     *
     * @private
     */
    styleUpdate: function() {
        if(this.isInline) {
            $('#' + this.id).attr('display', 'inline');
        } else {
            $('#' + this.id).removeAttr('display');
        }

        if(!this.isEnabled) {
            $('#' + this.id).attr('disabled', 'disabled');
        } else {
            $('#' + this.id).removeAttr('disabled');
        }
    },

    /**
     * This method is called whenever the view gets the focus.
     * If there is a initial text specified and the value of this search bar field
     * still equals this initial text, the value is emptied.
     */
    gotFocus: function() {
        if(this.initialText && (!this.value || this.initialText === this.value)) {
            this.setValue('');
            if(this.cssClassOnInit) {
                this.removeCssClass(this.cssClassOnInit);
            }
        }
        this.hasFocus = YES;
    },

    /**
     * This method is called whenever the view lost the focus.
     * If there is a initial text specified and the value of this search bar field
     * is empty, the value is set to the initial text.
     */
    lostFocus: function() {
        if(this.initialText && !this.value) {
            this.setValue(this.initialText, NO);
            this.value = '';
            if(this.cssClassOnInit) {
                this.addCssClass(this.cssClassOnInit);
            }
        }
        this.hasFocus = NO;
    },

    /**
     * This method sets the text field's value, initiates its re-rendering
     * and call the delegateValueUpdate().
     *
     * @param {String} value The value to be applied to the text field view.
     * @param {Boolean} delegateUpdate Determines whether to delegate this value update to any observer or not.
     */
    setValue: function(value, delegateUpdate) {
        this.value = value;
        this.renderUpdate();

        if(delegateUpdate) {
            this.delegateValueUpdate();
        }
    },

    /**
     * This method disables the search bar by setting the disabled property of its
     * html representation to true.
     */
    disable: function() {
        this.isEnabled = NO;
        this.renderUpdate();
    },

    /**
     * This method enables the search bar by setting the disabled property of its
     * html representation to false.
     */
    enable: function() {
        this.isEnabled = YES;
        this.renderUpdate();
    },

    /**
     * This method clears the search bar's value, both in the DOM and within the JS object.
     */
    clearValue: function() {
        this.setValue('');

        /* call lostFocus() to get the initial text displayed */
        this.lostFocus();
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the search bar field.
     *
     * @private
     */
    theme: function() {
        if(this.initialText && !this.value && this.cssClassOnInit) {
            this.addCssClass(this.cssClassOnInit);
        }

        /* register tap event for delete button */
        var that = this;
        $('#' + this.id).siblings('a.ui-input-clear').bind('tap', function() {
            that.setValue('', YES);
        });
    },

    /**
     * This method returns the search bar view's value.
     *
     * @returns {String} The search bar view's value.
     */
    getValue: function() {
        return this.value;
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      03.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('ui/search_bar.js');

/**
 * @class
 *
 * M.ListView is the prototype of any list view. It is used to display static or dynamic
 * content as vertically aligned list items (M.ListItemView). A list view provides some
 * easy to use helper method, e.g. an out-of-the-box delete view for items.
 *
 * @extends M.View
 */
M.ListView = M.View.extend(
/** @scope M.ListView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ListView',

    /**
     * Determines whether to remove all item if the list is updated or not.
     *
     * @type Boolean
     */
    removeItemsOnUpdate: YES,

    /**
     * Determines whether to display the list as a divided list or not.
     *
     * @type Boolean
     */
    isDividedList: NO,

    /**
     * If the list view is a divided list, this property can be used to customize the style
     * of the list's dividers.
     *
     * @type String
     */
    cssClassForDivider: null,

    /**
     * Determines whether to display the the number of child items for each list item view.
     *
     * @type Boolean
     */
    isCountedList: NO,

    /**
     * If the list view is a counted list, this property can be used to customize the style
     * of the list item's counter.
     *
     * @type String
     */
    cssClassForCounter: null,

    /**
     * This property can be used to customize the style of the list view's split view. For example
     * the toggleRemove() of a list view uses the built-in split view functionality.
     *
     * @type String
     */
    cssClassForSplitView: null,

    /**
     * The list view's items, respectively its child views.
     *
     * @type Array
     */
    items: null,

    /**
     * States whether the list view is currently in edit mode or not. This is mainly used by the
     * built-in toggleRemove() functionality. 
     *
     * @type Boolean
     */
    inEditMode: NO,

    /**
     * This property contains all available options for the edit mode. For example the target and action
     * of the automatically rendered delete button can be specified using this property.
     *
     * @type Object
     */
    editOptions: null,

    /**
     * Defines if the ListView is rendered with prefixed numbering for each item.
     *
     * @type Boolean
     */
    isNumberedList: NO,

    /**
     * This property contains the list view's template view, the blueprint for every child view.
     *
     * @type M.ListItemView
     */
    listItemTemplateView: null,

    /**
     * Determines whether to display the list view 'inset' or at full width.
     *
     * @type Boolean
     */
    isInset: NO,

    /**
     * Determines whether to add margin at the top of the list or not. This is useful whenever
     * the list is not the first element within a page's content area to make sure the list does
     * not overlap preceding elements.
     *
     * @type Boolean
     */
    doNotOverlapAtTop: NO,


    /**
     * Determines whether to add margin at the bottom of the list or not. This is useful whenever
     * the list is not the last element within a page's content area to make sure the list does
     * not overlap following elements.
     *
     * @type Boolean
     */
    doNotOverlapAtBottom: NO,

    /**
     * The list view's search bar.
     *
     * @type Object
      */
    searchBar: M.SearchBarView,

    /**
     * Determines whether or not to display a search bar at the top of the list view. 
     *
     * @type Boolean
     */
    hasSearchBar: NO,

    /**
     * If the hasSearchBar property is set to YES, this property determines whether to use the built-in
     * simple search filters or not. If set to YES, the list is simply filtered on the fly according
     * to the entered search string. Only list items matching the entered search string will be visible.
     *
     * If a custom search behaviour is needed, this property must be set to NO.
     *
     * @type Boolean
     */
    usesDefaultSearchBehaviour: YES,

    /**
     * If the hasSearchBar property is set to YES and the usesDefaultSearchBehaviour is set to YES, this
     * property can be used to specify the inital text for the search bar. This text will be shown as long
     * as nothing else is entered into the search bar text field.
     *
     * @type String
     */
    searchBarInitialText: 'Search...',

    /**
     * An object containing target and action to be triggered if the search string changes.
     *
     * @type Object
     */
    onSearchStringDidChange: null,

    /**
     * An optional String defining the id property that is passed in view as record id
     *
     * @type String
     */
    idName: null,

    /**
     * Contains a reference to the currently selected list item.
     *
     * @type Object
     */
    selectedItem: null,

    /**
     * Contains a reference to the currently visible swipe delete button (if one exists).
     *
     * @type M.ButtonView
     * @private
     */
    swipeButton: null,

    /**
     * This property can be used to determine whether or not to use a list items index as its refer id.
     *
     * @type Boolean
     * @private
     */
    useIndexAsId: NO,

    /**
     * This method renders the empty list view either as an ordered or as an unordered list. It also applies
     * some styling, if the corresponding properties where set.
     *
     * @private
     * @returns {String} The list view's styling as html representation.
     */
    render: function() {
        /* add the list view to its surrounding page */
        if(!M.ViewManager.currentlyRenderedPage.listList) {
            M.ViewManager.currentlyRenderedPage.listList = [];
        }
        M.ViewManager.currentlyRenderedPage.listList.push(this);

        if(this.hasSearchBar && !this.usesDefaultSearchBehaviour) {
            this.searchBar.isListViewSearchBar = YES;
            this.searchBar.listView = this;
            this.searchBar = M.SearchBarView.design(this.searchBar);
            this.html = this.searchBar.render();
        } else {
            this.html = '';
        }

        var listTagName = this.isNumberedList ? 'ol' : 'ul';
        this.html += '<' + listTagName + ' id="' + this.id + '" data-role="listview"' + this.style() + '></' + listTagName + '>';

        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list views and their
     * internal events.
     */
    registerEvents: function() {
        /*this.internalEvents = {
            focus: {
                target: this,
                action: 'gotFocus'
            },
            blur: {
                target: this,
                action: 'lostFocus'
            },
            keyup: {
                target: this,
                action: 'setValueFromDOM'
            }
        }*/
        this.bindToCaller(this, M.View.registerEvents)();
        if(this.hasSearchBar && !this.usesDefaultSearchBehaviour) {
            this.searchBar.registerEvents();
        }
    },

    /**
     * This method adds a new list item to the list view by simply appending its html representation
     * to the list view inside the DOM. This method is based on jQuery's append().
     *
     * @param {String} item The html representation of a list item to be added.
     */
    addItem: function(item) {
        $('#' + this.id).append(item);
    },

    /**
     * This method removes all of the list view's items by removing all of its content in the DOM. This
     * method is based on jQuery's empty().
     */
    removeAllItems: function() {
        $('#' + this.id).find('> li').each(function() {
            M.ViewManager.getViewById($(this).attr('id')).destroy();
        });
        $('#' + this.id).empty();
    },

    /**
     * Updates the the list view by re-rendering all of its child views, respectively its item views. There
     * is no rendering done inside this method itself. It is more like the manager of the rendering process
     * and delegates the responsibility to renderListItemDivider() and renderListItemView() based on the
     * given list view configuration.
     *
     * @private
     */
    renderUpdate: function() {

        /* Remove all list items if the removeItemsOnUpdate property is set to YES */
        if(this.removeItemsOnUpdate) {
            this.removeAllItems();
        }

        /* Save this in variable that for later use within an other scope (e.g. _each()) */
        var that = this;

        /* Get the list view's content as an object from the assigned content binding */
        if(this.contentBinding && typeof(this.contentBinding.target) === 'object' && typeof(this.contentBinding.property) === 'string' && this.value) {
            var content = this.value;
        } else {
            M.Logger.log('The specified content binding for the list view (' + this.id + ') is invalid!', M.WARN);
            return;
        }

        /* Get the list view's template view for each list item */
        var templateView = this.listItemTemplateView;

        /* if there is no template, log error and stop */
        if(!templateView) {
            M.Logger.log('The template view could not be loaded! Maybe you forgot to use m_require to set up the correct load order?', M.ERR);
            return;
        }

        /* check if there is an events propety specified for the template or if we should use the list's events */
        templateView.events = templateView.events ? templateView.events : this.events;

        /* If there is an items property, re-assign this to content, otherwise iterate through content itself */
        if(this.items) {
            content = content[this.items];
        }

        if(this.isDividedList) {
            /* @deprecated implementation for old-fashioned data structure */
            if(!_.isArray(content)) {
                _.each(content, function(items, divider) {
                    that.renderListItemDivider(divider);
                    that.renderListItemView(items, templateView);
                });
            /* new implementation with more intelligent data structures */
            } else {
                _.each(content, function(item) {
                    that.renderListItemDivider(item.label);
                    that.renderListItemView(item.items, templateView);
                });
            }
        } else {
            this.renderListItemView(content, templateView);
        }

        /* Finally let the whole list look nice */
        this.themeUpdate();
    },

    /**
     * Renders a list item divider based on a string given by its only parameter.
     *
     * @param {String} name The name of the list divider to be rendered.
     * @private
     */
    renderListItemDivider: function(name) {
        var obj = M.ListItemView.design({});
        obj.value = name;
        obj.isDivider = YES;
        this.addItem(obj.render());
        obj.theme();
    },

    /**
     * This method renders list items based on the passed parameters.
     *
     * @param {Array} content The list items to be rendered.
     * @param {M.ListItemView} templateView The template for for each list item.
     * @private
     */
    renderListItemView: function(content, templateView) {
        /* Save this in variable that for later use within an other scope (e.g. _each()) */
        var that = this;

        _.each(content, function(item, index) {

            /* Create a new object for the current template view */
            var obj = templateView.design({});

            /* Determine the "modelId" value of the list item */
            if(that.useIndexAsId && typeof(index) === 'number') {
                obj.modelId = index;
            } else if(item.type === 'M.Model') {
                if(that.idName) {
                    obj.modelId = item.get(that.idName);
                } else {
                    obj.modelId = item.m_id;
                }
            } else if(that.idName) {
                obj.modelId = item[that.idName] || undefined;
            } else if(item.id) {
                obj.modelId = item.id;
            } else if(typeof(index) === 'number') {
                obj.modelId = index;
            }

            obj = that.cloneObject(obj, item);
            //set the current list item value to the view value. This enables for example to get the value/contentBinding of a list item in a template view.
            obj.value = item;
            /* If edit mode is on, render a delete button */
            if(that.inEditMode) {
                obj.inEditMode = that.inEditMode;
                obj.deleteButton = obj.deleteButton.design({
                    modelId: obj.modelId,
                    events: {
                        tap: {
                            target: that.editOptions.target,
                            action: that.editOptions.action
                        }
                    },
                    internalEvents: {
                        tap: {
                            target: that,
                            action: 'removeListItem'
                        }
                    }
                });
            }

            /* set the list view as 'parent' for the current list item view */
            obj.parentView = that;

            /* Add the current list view item to the list view ... */
            that.addItem(obj.render());

            /* register events */
            obj.registerEvents();
            if(obj.deleteButton) {
                obj.deleteButton.registerEvents();
            }

            /* ... once it is in the DOM, make it look nice */
            var childViewsArray = obj.getChildViewsAsArray();
            for(var i in obj.getChildViewsAsArray()) {
                obj[childViewsArray[i]].theme();
            }
        });
    },

    /**
     * This method clones an object of the template including its sub views (recursively).
     *
     * @param {Object} obj The object to be cloned.
     * @param {Object} item The current item (record/data).
     * @private
     */
    cloneObject: function(obj, item) {
        /* Get the child views as an array of strings */
        var childViewsArray = obj.childViews ? obj.getChildViewsAsArray() : [];

        /* If the item is a model, read the values from the 'record' property instead */
        var record = item.type === 'M.Model' ? item.record : item;

        /* Iterate through all views defined in the template view */
        for(var i in childViewsArray) {
            /* Create a new object for the current view */
            obj[childViewsArray[i]] = obj[childViewsArray[i]].design({});

            /* create childViews of the current object */
            obj[childViewsArray[i]] = this.cloneObject(obj[childViewsArray[i]], item);

            /* This regex looks for a variable inside the template view (<%= ... %>) ... */
            var pattern = obj[childViewsArray[i]].computedValue ? obj[childViewsArray[i]].computedValue.valuePattern : obj[childViewsArray[i]].valuePattern;
            var regexResult = /<%=\s+([.|_|-|$|§|@|a-zA-Z0-9\s]+)\s+%>/.exec(pattern);

            /* ... if a match was found, the variable is replaced by the corresponding value inside the record */
            if(regexResult) {
                switch (obj[childViewsArray[i]].type) {
                    case 'M.LabelView':
                    case 'M.ButtonView':
                    case 'M.ImageView':
                    case 'M.TextFieldView':
                        while(regexResult !== null) {
                            if(typeof(record[regexResult[1]]) === 'object') {
                                pattern = record[regexResult[1]];
                                regexResult = null;
                            } else {
                                pattern = pattern.replace(regexResult[0], record[regexResult[1]]);
                                regexResult = /<%=\s+([.|_|-|$|§|@|a-zA-Z0-9\s]+)\s+%>/.exec(pattern);
                            }
                        }
                        obj[childViewsArray[i]].value = pattern;
                        break;
                }
            }
        }
        obj.item = item;

        _.each(Object.keys(item), function(key){
            if(!obj.hasOwnProperty(key)){
                obj[key] = item[key];
            }
        });
        
        return obj;
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the list view.
     *
     * @private
     */
    theme: function() {
        $('#' + this.id).listview();
        if(this.searchBar) {
            /* JQM-hack: remove multiple search bars */
            if($('#' + this.id) && $('#' + this.id).parent()) {
                var searchBarsFound = 0;
                $('#' + this.id).parent().find('form.ui-listview-filter').each(function() {
                    searchBarsFound += 1;
                    if(searchBarsFound == 1) {
                        return;
                    }
                    $(this).remove();
                });
            }
            this.searchBar.theme();
        }
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to re-style the list view.
     *
     * @private
     */
    themeUpdate: function() {
        $('#' + this.id).listview('refresh');
    },

    /**
     * This method activates the edit mode and forces the list view to re-render itself
     * and to display a remove button for every list view item.
     *
     * @param {Object} options The options for the remove button.
     */
    toggleRemove: function(options) {
        if(this.contentBinding && typeof(this.contentBinding.target) === 'object' && typeof(this.contentBinding.property) === 'string' && this.contentBinding.target[this.contentBinding.property]) {
            this.inEditMode = !this.inEditMode;
            this.editOptions = options;
            this.renderUpdate();
        }
    },

    /**
     * This method activates a list item by applying the default 'isActive' css style to its
     * DOM representation.
     *
     * @param {String} listItemId The id of the list item to be set active.
     */
    setActiveListItem: function(listItemId, event, nextEvent) {
        /* if there is a swipe button visible, do nothing but hide that button */
        if(this.swipeButton) {
            this.hideSwipeButton();
            return;
        }

        if(this.selectedItem) {
            this.selectedItem.removeCssClass('ui-btn-active');
        }
        this.selectedItem = M.ViewManager.getViewById(listItemId);

        /* is the selection list items are selectable, activate the right one */
        if(!this.listItemTemplateView || (this.listItemTemplateView && this.listItemTemplateView.isSelectable)) {
            this.selectedItem.addCssClass('ui-btn-active');
        }

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [listItemId, this.selectedItem.modelId]);
        }
    },

    /**
     * This method resets the list by applying the default css style to its currently activated
     * list item.
     */
    resetActiveListItem: function() {
        if(this.selectedItem) {
            this.selectedItem.removeCssClass('ui-btn-active');
        }
    },

    /**
     * Applies some style-attributes to the list view.
     *
     * @private
     * @returns {String} The list's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass || this.doNotOverlapAtTop || this.doNotOverlapAtBottom) {
            html += ' class="'
                + (this.cssClass ? this.cssClass : '')
                + (!this.isInset && this.doNotOverlapAtTop ? ' listview-do-not-overlap-at-top' : '')
                + (!this.isInset && this.doNotOverlapAtBottom ? ' listview-do-not-overlap-at-bottom' : '')
                + '"';
        }
        if(this.isDividedList && this.cssClassForDivider) {
            html += ' data-dividertheme="' + this.cssClassForDivider + '"';
        }
        if(this.isInset) {
            html += ' data-inset="true"';
        }
        if(this.isCountedList && this.cssClassForCounter) {
            html += ' data-counttheme="' + this.cssClassForCounter + '"';
        }
        if(this.cssClassForSplitView) {
            html += ' data-splittheme="' + this.cssClassForSplitView + '"';
        }
        if(this.hasSearchBar && this.usesDefaultSearchBehaviour) {
            html += ' data-filter="true" data-filter-placeholder="' + this.searchBarInitialText + '"';
        }
        return html;
    },

    removeListItem: function(id, event, nextEvent) {
        var modelId = M.ViewManager.getViewById(id).modelId;

        /* delegate event to external handler, if specified */
        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [id, modelId]);
        }
    },

    showSwipeButton: function(id, event, nextEvent) {
        var listItem = M.ViewManager.getViewById(id);

        /* reset the selection for better visual effect */
        this.resetActiveListItem();

        if(!listItem.swipeButton) {
            M.Logger.log('You need to specify a valid button with the \'swipeButton\' property of your list template!', M.WARN);
        } else {
            var previouslistItem = this.swipeButton ? this.swipeButton.parentView : null;

            if(previouslistItem) {
                this.hideSwipeButton();
            }

            if(!previouslistItem) {
                this.swipeButton = M.ButtonView.design(
                    listItem.swipeButton
                );
                this.swipeButton.value = this.swipeButton.value ? this.swipeButton.value : 'delete';
                this.swipeButton.parentView = M.ViewManager.getViewById(id);
                this.swipeButton.cssClass = this.swipeButton.cssClass ? this.swipeButton.cssClass + ' tmp-swipe-button' : 'a tmp-actionsheet-destructive-button tmp-swipe-button';
                this.swipeButton.value = this.swipeButton.value ? this.swipeButton.value : 'delete';
                this.swipeButton.internalEvents = {
                    tap: {
                        target: listItem,
                        action: 'swipeButtonClicked'
                    }
                };

                $('#' + id).append(this.swipeButton.render());
                this.swipeButton.theme();
                this.swipeButton.registerEvents();
                $('#' + this.swipeButton.id).css('height', 0.7 * $('#' + id).outerHeight());
                $('#' + this.swipeButton.id).css('top', Math.floor(0.15 * $('#' + id).outerHeight()));
                $('#' + id + '>div.ui-btn-inner').css('margin-right', parseInt($('#' + this.swipeButton.id).css('width')) + parseInt($('#' + this.swipeButton.id).css('right')));

                /* register tap/click for the page so we can hide the button again */
                var that = this;
                $('#' + M.ViewManager.getCurrentPage().id).bind('click tap', function() {
                    that.hideSwipeButton();
                });
            }
        }
    },

    hideSwipeButton: function() {
        $('#' + this.swipeButton.id).hide();
        $('#' + this.swipeButton.id).parent('li').find('div.ui-btn-inner').css('margin-right', 0);
        this.swipeButton = null;

        /* un-register tap/click for the page */
        $('#' + M.ViewManager.getCurrentPage().id).unbind('click tap');
    },

    /**
     * This method can be used to determine a list item view based on its id.
     *
     * Note: This is not the DOM id! If no special id was set with the list item's data, the index
     * of the item within the list is taken as reference id.
     *
     * @param {String, Number} modelId The id to determine the list item.
     */
    getListItemViewById: function(modelId) {
        var item = _.detect(this.childViewObjects, function(item) {
            return item.modelId === modelId;
        });

        return item;
    },

    /**
     * This method can be used to silently update values within a single list item. Instead
     * of removing the whole item, only the desired sub views are updated.
     *
     * To determine which list item to update, pass the internal id of the item as the first
     * parameter.
     *
     * Note: This is not the DOM id! If no special id was set with the list item's data, the index
     * of the item within the list is taken as reference id.
     *
     * As second parameter pass an array containing objects that specify which sub view to
     * update (key) and which value to set (value), e.g.:
     *
     *     [
     *         {
     *             key: 'label1',
     *             value: 'new value',
     *         }
     *     ]
     *
     * @param {String, Number} modelId The id to determine the list item.
     * @param {Array} updates An array containing all updates.
     */
    updateListItemView: function(modelId, updates) {
        var item = this.getListItemViewById(modelId);

        if(!item) {
            M.Logger.log('No list item found with given id \'' + modelId + '\'.', M.WARN);
            return;
        }

        if(!(updates && typeof(updates) === 'object')) {
            M.Logger.log('No updates specified when calling \'updateListItemView\'.', M.WARN);
            return;
        }

        _.each(updates, function(update) {
            var view = M.ViewManager.getView(item, update['key']);

            if(view) {
                view.setValue(update['value']);
            } else {
                M.Logger.log('There is no view \'' + update['key'] + '\' available within the list item.', M.WARN);
            }
        });
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      30.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.SelectionListItemView defines the prototype of any selection list item. It can only be used
 * as a child view for a selection list view.
 *
 * @extends M.View
 */
M.SelectionListItemView = M.View.extend(
/** @scope M.SelectionListItemView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SelectionListItemView',

    /**
     * This property can be used to specify a label for a selection list item. If
     * set, the label will be displayed instead of the value, so you can use the
     * item's value as an internal value.
     *
     * E.g. if you use a selection list to select a color, you could set an item's
     * value to '#FF0000' but its label to 'Red'. If there is no label specified,
     * the value is displayed instead.
     *
     * @type String
     */
    label: null,

    /**
     * This property states whether a selection list item is selected or not.
     *
     * @type Boolean
     */
    isSelected: NO,

    /**
     * Renders a selection list item.
     * 
     * @private
     * @returns {String} The selection list item view's html representation.
     */
    render: function() {
        this.html = '';
        if(this.parentView && (this.parentView.selectionMode === M.SINGLE_SELECTION_DIALOG || this.parentView.selectionMode === M.MULTIPLE_SELECTION_DIALOG)) {
            this.html += '<option id="' + this.id + '" value="' + this.value + '"';

            if((this.isSelected && typeof(this.isSelected) === 'boolean') || (this.isSelected === String(YES))) {
                if(!this.parentView.selection) {
                    this.html += ' selected="selected"';
                    this.parentView.selection = this;
                }
            }

            this.html += '>';
            
            this.html += this.label ? this.label : this.value;

            this.html += '</option>';
        } else {
            this.html += '<input type="' + this.parentView.selectionMode + '" data-native-menu="false" id="' + this.id + '"';

            if(this.parentView.selectionMode === M.SINGLE_SELECTION) {
                this.html += ' name="' + (this.parentView.name ? this.parentView.name : this.parentView.id) + '"';
            } else if(this.parentView.selectionMode === M.MULTIPLE_SELECTION) {
                this.html += ' name="' + (this.name ? this.name : this.id) + '"';
            }

            if((this.isSelected && typeof(this.isSelected) === 'boolean') || (this.isSelected === String(YES))) {
                if(this.parentView.selectionMode === M.SINGLE_SELECTION) {
                    if(!this.parentView.selection) {
                        this.html += ' checked="checked"';
                        this.parentView.selection = this;
                    }
                } else {
                    this.html += ' checked="checked"';

                    if(!this.parentView.selection) {
                        this.parentView.selection = [];
                    }
                    this.parentView.selection.push(this);
                }
            }

            this.html += '/>';
            this.html += '<label for="' + this.id + '">' + (this.label ? this.label : this.value) + '</label>';
        }

        return this.html;
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the selection list item.
     *
     * @private
     */
    theme: function() {
        if(this.parentView) {
            if(this.parentView.selectionMode !== M.SINGLE_SELECTION_DIALOG && this.parentView.selectionMode !== M.MULTIPLE_SELECTION_DIALOG) {
                $('#' + this.id).checkboxradio();
            }
        }
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      30.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for single selection mode.
 *
 * @type String
 */
M.SINGLE_SELECTION = 'radio';

/**
 * A constant value for multiple selection mode.
 *
 * @type String
 */
M.MULTIPLE_SELECTION = 'checkbox';

/**
 * A constant value for single selection mode in a dialog / popup.
 *
 * @type String
 */
M.SINGLE_SELECTION_DIALOG = 'select';

/**
 * A constant value for multiple selection mode in a dialog / popup.
 *
 * @type String
 */
M.MULTIPLE_SELECTION_DIALOG = 'select_multiple';

m_require('ui/selection_list_item.js');

/**
 * @class
 *
 * This defines the prototype of any selection list view. A selection list view displays
 * a list with several items of which either only one single item (M.SINGLE_SELECTION /
 * M.SINGLE_SELECTION_DIALOG) or many items (M.MULTIPLE_SELECTION /
 * M.MULTIPLE_SELECTION_DIALOG) can be selected.
 *
 * @extends M.View
 */
M.SelectionListView = M.View.extend(
/** @scope M.SelectionListView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SelectionListView',

    /**
     * Determines whether to remove all item if the list is updated or not.
     *
     * @type Boolean
     */
    removeItemsOnUpdate: YES,

    /**
     * The selection mode for this selection list. This can either be single or
     * multiple selection. To set this value use one of the three constants:
     *
     * - M.SINGLE_SELECTION
     *
     *   This selection mode will render a selection list with several list items
     *   of which only one can be selected. Whenever a new item is selected, the
     *   previously selected item automatically gets de-selected. This selection
     *   mode's behaviour is equivalent to the plain HTML's radio button.
     *
     *
     * - M.SINGLE_SELECTION_DIALOG
     *
     *   This selection mode will render a selection list equivalent to the plain
     *   HTML's select menu. Only the currently selected item will be visible, and
     *   by clicking on this item, the selection list will be displayed in a dialog
     *   respectively a popup view. By selecting on of the items, this popup will
     *   automatically close and the selected value will be displayed.
     *
     *
     * - M.MULTIPLE_SELECTION
     *
     *   This selection mode will render a selection list with several list items
     *   of which all be selected. So the selection of a new item doesn't lead to
     *   automatic de-selected of previously selected items. This selection mode's
     *   behaviour is equivalent to the plain HTML's checkboxes.
     *
     *
     * - M.MULTIPLE_SELECTION_DIALOG
     *
     *   This selection mode will render a selection list equivalent to the plain
     *   HTML's select menu, but with the possibility to select multiple options.
     *   In contrast to the single selection dialog mode, it also is possible to
     *   select no option at all. As with the multiple selecton mode, the selection
     *   of a new item doesn't lead to automatic de-selected of previously selected
     *   items.
     *
     *   Note: This mode currently only works on mobile devices!!
     *
     * @type String
     */
    selectionMode: M.SINGLE_SELECTION,

    /**
     * The selected item(s) of this list.
     *
     * @type String, Array
     */
    selection: null,

    /**
     * This property defines the tab bar's name. This is used internally to identify
     * the selection list inside the DOM.
     *
     * @type String
     */
    name: null,

    
    /**
     * This property is used to specify an initial value for the selection list if
     * it is running in 'multiple selection dialog' (M.MULTIPLE_SELECTION_DIALOG) mode.
     * This value is then displayed at startup. You would typically use this e.g. to
     * specify something like: 'Please select...'.
     *
     * As long as this initial value is 'selected', the getSelection() of this selection
     * list will return nothing. Once a 'real' option is selected, this value will visually
     * disappear. If at some point no option will be selected again, this initial text
     * will be shown again.
     *
     * @type String
     */
    initialText: null,

    /**
     * The label proeprty defines a text that is shown above or next to the selection list as a 'title'
     * for the selection list. e.g. "Name:". If no label is specified, no label will be displayed.
     *
     * @type String
     */
    label: null,

    /**
     * Determines whether to display the selection list grouped with the label specified with the label property.
     * If set to YES, the selection list and its label are wrapped in a container and styled as a unit 'out of
     * the box'. If set to NO, custom styling could be necessary.
     *
     * @type Boolean
     */
    isGrouped: NO,

    /**
     * This property is used internally to store the selection list's initial state. This is used to be able
     * to reset the selection list later on using the resetSelection method.
     *
     * Note: This property is only used if the selection list's child views are specified directly (without
     * content binding). Otherwise the state is stored within the content binding and does not need to be
     * stored with this selection list.
     *
     * @private
     * @type Object
     */
    initialState: null,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['change'],

    /**
     * Define whether putting an asterisk to the right of the label for this selection list.
     *
     * @type Boolean
     */
    hasAsteriskOnLabel: NO,

    /**
     * This property can be used to assign a css class to the asterisk on the right of the label.
     *
     * @type String
     */
    cssClassForAsterisk: null,

    /**
     * Renders a selection list.
     *
     * @private
     * @returns {String} The selection list view's html representation.
     */
    render: function() {

        /* initialize the initialState property as new array */
        this.initialState = [];

        this.html = '<div id="' + this.id + '_container"';

        if(this.isGrouped) {
            this.html += ' data-role="fieldcontain"';
        }

        if(this.cssClass) {
            this.html += ' class="';
            var cssClasses = $.trim(this.cssClass).split(' ');            
            for(var i in cssClasses) {
                this.html += (i > 0 ? ' ' : '') + cssClasses[i] + '_container';
            }
            this.html += '"';
        }

        this.html += '>';

        if(this.selectionMode === M.SINGLE_SELECTION_DIALOG || this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
            
            if(this.label) {
                this.html += '<label for="' + this.id + '">' + this.label;
                if (this.hasAsteriskOnLabel) {
                    if (this.cssClassForAsterisk) {
                        this.html += '<span class="' + this.cssClassForAsterisk + '">*</span></label>';
                    } else {
                        this.html += '<span>*</span></label>';
                    }
                } else {
                    this.html += '</label>';
                }
            }

            this.html += '<select name="' + (this.name ? this.name : this.id) + '" id="' + this.id + '"' + this.style() + (this.selectionMode === M.MULTIPLE_SELECTION_DIALOG ? ' multiple="multiple"' : '') + '>';

            this.renderChildViews();

            this.html += '</select>';

        } else {

            this.html += '<fieldset data-role="controlgroup" data-native-menu="false" id="' + this.id + '">';

            if(this.label) {
                this.html += '<legend>' + this.label;
                if (this.hasAsteriskOnLabel) {
                    if (this.cssClassForAsterisk) {
                        this.html += '<span class="' + this.cssClassForAsterisk + '">*</span></legend>';
                    } else {
                        this.html += '<span>*</span></legend>';
                    }
                } else {
                    this.html += '</legend>';
                }
            }

            this.renderChildViews();

            this.html += '</fieldset>';

        }

        this.html += '</div>';

        return this.html;
    },

    /**
     * Triggers render() on all children of type M.ButtonView based on the specified
     * selection mode (single or multiple selection).
     *
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();

            for(var i in childViews) {
                var view = this[childViews[i]];
                if(view.type === 'M.SelectionListItemView') {
                    view.parentView = this;
                    view._name = childViews[i];
                    this.html += view.render();

                    /* store list item in initialState property */
                    this.initialState.push({
                        value: view.value,
                        label: view.label,
                        isSelected: view.isSelected
                    });
                } else {
                    M.Logger.log('Invalid child views specified for SelectionListView. Only SelectionListItemViews accepted.', M.WARN);
                }
            }
        } else if(!this.contentBinding) {
            M.Logger.log('No SelectionListItemViews specified.', M.WARN);
        }
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for text field views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            change: {
                target: this,
                action: 'itemSelected'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * This method adds a new selection list item to the selection list view by simply appending
     * its html representation to the selection list view inside the DOM. This method is based
     * on jQuery's append().
     *
     * @param {String} item The html representation of a selection list item to be added.
     */
    addItem: function(item) {
        $('#' + this.id).append(item);
    },

    /**
     * This method removes all of the selection list view's items by removing all of its content in
     * the DOM. This method is based on jQuery's empty().
     */
    removeAllItems: function() {
        $('#' + this.id).empty();
    },

    /**
     * Updates the the selection list view by re-rendering all of its child views, respectively its
     * item views.
     *
     * @private
     */
    renderUpdate: function() {
        if(this.removeItemsOnUpdate || this.selectionMode === M.SINGLE_SELECTION_DIALOG || this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
            this.removeAllItems();

            if(this.label && !(this.selectionMode === M.SINGLE_SELECTION_DIALOG || this.selectionMode === M.MULTIPLE_SELECTION_DIALOG)) {
                this.addItem('<legend>' + this.label + '</legend>');
            } else if(this.selectionMode === M.SINGLE_SELECTION_DIALOG || this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
            }
        }

        /* remove selection before applying new content */
        this.removeSelection();

        if(this.contentBinding) {
            /* assign the value property to 'items' since this was automatically set by contentDidChange of M.View */
            var items = this.value;
            for(var i in items) {
                var item  = items[i];
                var obj = null;
                obj = M.SelectionListItemView.design({
                    value: (item.value !== undefined && item.value !== null) ? item.value : '',
                    label: item.label ? item.label : ((item.value !== undefined && item.value !== null) ? item.value : ''),
                    parentView: this,
                    isSelected: item.isSelected
                });
                if(this.selectionMode !== M.SINGLE_SELECTION_DIALOG && this.selectionMode !== M.MULTIPLE_SELECTION_DIALOG) {
                    obj.name = item.name ? item.name : (item.label ? item.label : (item.value ? item.value : ''));
                }

                this.addItem(obj.render());
                obj.theme();
            }
            this.themeUpdate();
        }
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the selection list.
     *
     * @private
     */
    theme: function() {
        if(this.selectionMode === M.SINGLE_SELECTION_DIALOG || this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
            $('#' + this.id).selectmenu();
            if((this.selectionMode === M.MULTIPLE_SELECTION_DIALOG && this.initialText && this.selection && this.selection.length === 0) || (this.selectionMode === M.SINGLE_SELECTION_DIALOG && !this.selection && this.initialText)) {
                $('#' + this.id + '_container').find('.ui-btn-text').html(this.initialText);
                document.getElementById(this.id).selectedIndex = -1;
            }
        } else if(this.selectionMode !== M.SINGLE_SELECTION_DIALOG && this.selectionMode !== M.MULTIPLE_SELECTION_DIALOG) {
            $('#' + this.id).controlgroup();
        }
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the selection list.
     *
     * @private
     */
    themeUpdate: function() {
        if(this.selectionMode === M.SINGLE_SELECTION_DIALOG || this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
            $('#' + this.id).selectmenu('refresh');
            if((this.selectionMode === M.MULTIPLE_SELECTION_DIALOG && this.initialText && this.selection && this.selection.length === 0) || (this.selectionMode === M.SINGLE_SELECTION_DIALOG && !this.selection && this.initialText)) {
                $('#' + this.id + '_container').find('.ui-btn-text').html(this.initialText);
                document.getElementById(this.id).selectedIndex = -1;
            } else if(this.selectionMode === M.SINGLE_SELECTION_DIALOG && !this.selection) {
                var that = this;
                var item = M.ViewManager.getViewById($('#' + this.id).find('option:first-child').attr('id'));
                item !== undefined && item !== null ? that.setSelection(item.value) : null;
            }
        } else if(this.selectionMode !== M.SINGLE_SELECTION_DIALOG && this.selectionMode !== M.MULTIPLE_SELECTION_DIALOG) {
            $('#' + this.id).controlgroup();
        }
    },

    /**
     * Method to append css styles inline to the rendered selection list.
     *
     * @private
     * @returns {String} The selection list's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    /**
     * This method is called everytime a item is selected / clicked. If the selected item
     * changed, the defined onSelect action is triggered.
     *
     * @param {String} id The id of the selected item.
     * @param {Object} event The event.
     * @param {Object} nextEvent The application-side event handler.
     */
    itemSelected: function(id, event, nextEvent) {
        var item = null;

        if(this.selectionMode === M.SINGLE_SELECTION) {
            item = M.ViewManager.getViewById($('input[name=' + (this.name ? this.name : this.id) + ']:checked').attr('id'));
            
            if(item !== this.selection) {
                this.selection = item;

                if(nextEvent) {
                    M.EventDispatcher.callHandler(nextEvent, event, NO, [this.selection.value, this.selection]);
                }
            }
        } else if(this.selectionMode === M.SINGLE_SELECTION_DIALOG) {
            item = M.ViewManager.getViewById($('#' + this.id + ' :selected').attr('id'));

            if(item !== this.selection) {
                this.selection = item;

                $('#' + this.id + '_container').find('.ui-btn-text').html(item.label ? item.label : item.value);

                if(nextEvent) {
                    M.EventDispatcher.callHandler(nextEvent, event, NO, [this.selection.value, this.selection]);
                }
            }
        } else if(this.selectionMode === M.MULTIPLE_SELECTION) {
            var that = this;
            this.selection = [];
            $('#' + this.id).find('input:checked').each(function() {
                that.selection.push(M.ViewManager.getViewById($(this).attr('id')));
            });

            var selectionValues = [];
            for(var i in this.selection) {
                selectionValues.push(this.selection[i].value);
            }

            if(nextEvent) {
                M.EventDispatcher.callHandler(nextEvent, event, NO, [selectionValues, this.selection]);
            }
        } else if(this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
            var that = this;
            this.selection = [];
            $('#' + this.id).find(':selected').each(function() {
                that.selection.push(M.ViewManager.getViewById($(this).attr('id')));
            });

            var selectionValues = [];
            for(var i in this.selection) {
                selectionValues.push(this.selection[i].value);
                $('#' + this.id + '_container').find('.ui-btn-text').html(this.formatSelectionLabel(this.selection.length));
            }
            $('#' + this.id + '_container').find('.ui-li-count').html(this.selection ? this.selection.length : 0);

            /* if there is no more item selected, reset the initial text */
            if(this.selection.length === 0) {
                this.themeUpdate();
            }

            if(nextEvent) {
                M.EventDispatcher.callHandler(nextEvent, event, NO, [selectionValues, this.selection]);
            }
        }

        /* fix the toolbar(s) again */
        if(this.selectionMode !== M.MULTIPLE_SELECTION_DIALOG) {
            $('#' + this.id).blur();
        }
        
        this.delegateValueUpdate();
    },
    
    /**
     * This method delegates any value changes to a controller, if the 'contentBindingReverse'
     * property is specified.
     */
    delegateValueUpdate: function() {
        /**
         * delegate value updates to a bound controller, but only if the view currently is
         * the master
         */
        if(this.contentBindingReverse) {
            this.contentBindingReverse.target.set(this.contentBindingReverse.property, this.selection.value);
        }
    },

    /**
     * This method returns the selected item's value(s) either as a String (single selection)
     * or as an Array (multiple selection).
     *
     * @param {Boolean} returnObject Determines whether to return the selected item(s) as object or not.
     * @returns {String|Object|Array} The selected item's value(s).
     */
    getSelection: function(returnObject) {
        if(this.selectionMode === M.SINGLE_SELECTION || this.selectionMode === M.SINGLE_SELECTION_DIALOG) {
            if(this.selection) {
                if(returnObject) {
                    return this.selection;
                } else {
                    return this.selection.value;
                }
            }
        } else {
            if(this.selection) {
                var selection = [];
                _.each(this.selection, function(item) {
                    if(returnObject) {
                        selection.push(item);
                    } else {
                        selection.push(item.value);
                    }
                });
                return selection;
            }
            return [];
        }
    },

    /**
     * This method can be used to select items programmatically. The given parameter can either
     * be a String (single selection) or an Array (multiple selection).
     *
     * @param {String|Array} selection The selection that should be applied to the selection list.
     */
    setSelection: function(selection) {
        var that = this;
        if(this.selectionMode === M.SINGLE_SELECTION && (typeof(selection) === 'string' || typeof(selection) === 'number' || typeof(selection) === 'boolean')) {
            $('#' + this.id).find('input').each(function() {
                var item = M.ViewManager.getViewById($(this).attr('id'));
                if(item.value == selection) {
                    that.removeSelection();
                    item.isSelected = YES;
                    that.selection = item;
                    $(this).attr('checked', 'checked');
                    $(this).siblings('label:first').addClass('ui-radio-on');
                    $(this).siblings('label:first').removeClass('ui-radio-off');
                    $(this).siblings('label:first').find('span .ui-icon-radio-off').addClass('ui-icon-radio-on');
                    $(this).siblings('label:first').find('span .ui-icon-radio-off').removeClass('ui-icon-radio-off');
                }
            });
        } else if(this.selectionMode === M.SINGLE_SELECTION_DIALOG && (typeof(selection) === 'string' || typeof(selection) === 'number' || typeof(selection) === 'boolean')) {
            var didSetSelection = NO;
            $('#' + this.id).find('option').each(function() {
                var item = M.ViewManager.getViewById($(this).attr('id'));
                if(item.value == selection) {
                    that.removeSelection();
                    item.isSelected = YES;
                    that.selection = item;
                    $('#' + that.id).val(item.value);
                    didSetSelection = YES;
                }
            });
            if(didSetSelection) {
                $('#' + this.id).selectmenu('refresh');
            }
        } else if(typeof(selection) === 'object') {
            if(this.selectionMode === M.MULTIPLE_SELECTION) {
                var removedItems = NO;
                $('#' + this.id).find('input').each(function() {
                    var item = M.ViewManager.getViewById($(this).attr('id'));
                    for(var i in selection) {
                        var selectionItem = selection[i];
                        if(item.value == selectionItem) {
                            if(!removedItems) {
                                that.removeSelection();
                                removedItems = YES;
                            }
                            item.isSelected = YES;
                            that.selection.push(item);
                            $(this).attr('checked', 'checked');
                            $(this).siblings('label:first').removeClass('ui-checkbox-off');
                            $(this).siblings('label:first').addClass('ui-checkbox-on');
                            $(this).siblings('label:first').find('span .ui-icon-checkbox-off').addClass('ui-icon-checkbox-on');
                            $(this).siblings('label:first').find('span .ui-icon-checkbox-off').removeClass('ui-icon-checkbox-off');
                        }
                    }
                });
            } else if(this.selectionMode === M.MULTIPLE_SELECTION_DIALOG) {
                var removedItems = NO;
                $('#' + this.id).find('option').each(function() {
                    var item = M.ViewManager.getViewById($(this).attr('id'));
                    for(var i in selection) {
                        var selectionItem = selection[i];
                        if(item.value == selectionItem) {
                            if(!removedItems) {
                                that.removeSelection();
                                removedItems = YES;
                            }
                            item.isSelected = YES;
                            that.selection.push(item);
                            $(this).attr('selected', 'selected');
                        }
                    }

                    /* set the label */
                    $('#' + that.id + '_container').find('.ui-btn-text').html(that.formatSelectionLabel(that.selection.length));
                    $('#' + that.id + '_container').find('.ui-li-count').html(that.selection ? that.selection.length : 0);
                });
            }
        }
    },

    /**
     * This method de-selects all of the selection list's items.
     */
    removeSelection: function() {
        var that = this;

        if(this.selectionMode === M.SINGLE_SELECTION || this.selectionMode === M.SINGLE_SELECTION_DIALOG) {
            this.selection = null;
        } else {
            this.selection = [];
        }
        
        if(this.selectionMode !== M.SINGLE_SELECTION_DIALOG && this.selectionMode !== M.MULTIPLE_SELECTION_DIALOG) {
            $('#' + this.id).find('input').each(function() {
                var item = M.ViewManager.getViewById($(this).attr('id'));
                item.isSelected = NO;
                $(this).removeAttr('checked');
                $(this).siblings('label:first').addClass('ui-' + that.selectionMode + '-off');
                $(this).siblings('label:first').removeClass('ui-' + that.selectionMode + '-on');
                $(this).siblings('label:first').find('span .ui-icon-' + that.selectionMode + '-on').addClass('ui-icon-' + that.selectionMode + '-off');
                $(this).siblings('label:first').find('span .ui-icon-' + that.selectionMode + '-on').removeClass('ui-icon-' + that.selectionMode + '-on');
            });
        } else {
            $('#' + this.id).find('option').each(function() {
                var item = M.ViewManager.getViewById($(this).attr('id'));
                item.isSelected = NO;
            });
            $('#' + this.id).val('').removeAttr('checked').removeAttr('selected');
        }
    },

    /**
     * This method can be used to reset the selection list. This basically discards
     * all changes made to the selection by the user or any application-sided calls
     * and applies the original state.
     *
     * The 'original state' can either be the bound content or the state, specified
     * by the originally assigned child views.
     */
    resetSelection: function() {
        if(this.contentBinding) {
            this.removeSelection();
            this.renderUpdate();
        } else {
            this.contentBinding = {};
            this.contentBinding.target = this;
            this.contentBinding.property = 'initialState';
            this.removeSelection();
            this.renderUpdate();
            this.contentBinding = null;
        }
    },

    /**
     *  We use this as alias for the form reset function view.clearValues() to reset the selection to its initial state
     */
    clearValue: function(){
        this.resetSelection();
    },

    /**
     * This method returns the selection list view's value.
     *
     * @returns {String|Array} The selected item's value(s).
     */
    getValue: function() {
        return this.getSelection();
    },

    /**
     * This method is responsible for rendering the visual text for a selection list
     * in the M.MULTIPLE_SELECTION_DIALOG mode. It's only parameter is a number, that
     * specifies the number of selected options of this selection list. To customize
     * the visual output of such a list, you will need to overwrite this method within
     * the definition of the selection list in your application.
     *
     * @param {Number} v The number of selected options.
     */
    formatSelectionLabel: function(v) {
        return v + ' Object(s)';
    },

    /**
     * This method disables the selection list by setting the disabled property of its
     * html representation to true.
     */
    disable: function() {
        this.isEnabled = NO;
        if(this.selectionMode === M.SINGLE_SELECTION || this.selectionMode === M.MULTIPLE_SELECTION) {
            $('#' + this.id).find('input').each(function() {
                $(this).checkboxradio('disable');
            });
        } else {
            $('#' + this.id).selectmenu('disable');
            $('#' + this.id).each(function() {
                $(this).attr('disabled', 'disabled');
            });
        }
    },

    /**
     * This method enables the selection list by setting the disabled property of its
     * html representation to false.
     */
    enable: function() {
        this.isEnabled = YES;
        if(this.selectionMode === M.SINGLE_SELECTION || this.selectionMode === M.MULTIPLE_SELECTION) {
            $('#' + this.id).find('input').each(function() {
                $(this).checkboxradio('enable');
            });
        } else {
            $('#' + this.id).selectmenu('enable');
            $('#' + this.id).each(function() {
                $(this).removeAttr('disabled');
            });
        }
    },

    valueDidChange: function(){
        var valueBinding = this.valueBinding ? this.valueBinding : (this.computedValue) ? this.computedValue.valueBinding : null;

        if(!valueBinding) {
            return;
        }

        var value = valueBinding.target;
        var propertyChain = valueBinding.property.split('.');
        _.each(propertyChain, function(level) {
            if(value) {
                value = value[level];
            }
        });

        if(!value || value === undefined || value === null) {
            M.Logger.log('The value assigned by valueBinding (property: \'' + valueBinding.property + '\') for ' + this.type + ' (' + (this._name ? this._name + ', ' : '') + '#' + this.id + ') is invalid!', M.WARN);
            return;
        }

        this.setSelection(value);
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      17.11.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype for a slider view. It renders a touch-optimized slider
 * that can be used to set a number within a specified range.
 *
 * @extends M.View
 */
M.SliderView = M.View.extend(
/** @scope M.ButtonView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SliderView',

    /**
     * This property contains the slider's value.
     */
    value: 0,

    /**
     * This property contains the slider's initial value.
     *
     * @private
     */
    initialValue: 0,

    /**
     * This property specifies the min value of the slider.
     *
     * @type Number
     */
    min: 0,

    /**
     * This property specifies the max value of the slider.
     *
     * @type Number
     */
    max: 100,

    /**
     * This property specifies the step value of the slider.
     *
     * @type Number
     */
    step: 1,

    /**
     * This property determines whether or not to display the corresponding input of the slider.
     *
     * @type Boolean
     */
    isSliderOnly: NO,

    /**
     * This property determines whether or not to visually highlight the left part of the slider. If
     * this is set to YES, the track from the left edge to the slider handle will be highlighted.
     *
     * @type Boolean
     */
    highlightLeftPart: NO,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['change'],

    /**
     * The label proeprty defines a text that is shown above or next to the slider as a 'title'
     * for the slider. e.g. "Name:". If no label is specified, no label will be displayed.
     *
     * @type String
     */
    label: null,

    /**
     * Define whether putting an asterisk to the right of the label for this slider.
     *
     * @type Boolean
     */
    hasAsteriskOnLabel: NO,

    /**
     * This property can be used to assign a css class to the asterisk on the right of the label.
     *
     * @type String
     */
    cssClassForAsterisk: null,

    /**
     * Renders a slider.
     *
     * @private
     * @returns {String} The slider view's html representation.
     */
    render: function() {
        this.html = '';
        if(this.label) {
            this.html += '<label for="' + this.id + '">' + this.label;
            if (this.hasAsteriskOnLabel) {
                if (this.cssClassForAsterisk) {
                    this.html += '<span class="' + this.cssClassForAsterisk + '">*</span></label>';
                } else {
                    this.html += '<span>*</span></label>';
                }
            } else {
                this.html += '</label>';
            }
        }

        this.html += '<div id="' + this.id + '_container" class="tmp-slider-container' + (this.isSliderOnly ? ' tmp-slider-is-slider-only' : '') + '">';
        this.html += '<input id="' + this.id + '" type="range" data-highlight="' + this.highlightLeftPart + '" min="' + this.min + '" max="' + this.max + '" step="' + this.step + '" value="' + this.value + '"' + this.style() + '>';

        this.html += '</div>';

        /* store value as initial value for later resetting */
        this.initialValue = this.value;

        return this.html;
    },

    /**
     * This method registers the change event to internally re-set the value of the
     * slider.
     */
    registerEvents: function() {
        if(!this.internalEvents) {
            this.internalEvents = {
                change: {
                    target: this,
                    action: 'setValueFromDOM'
                }
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * Updates a SliderView with DOM access by jQuery.
     *
     * @private
     */
    renderUpdate: function() {
        /* check if the slider's value is numeric, otherwise use initial value */
        if(isNaN(this.value)) {
            this.value = this.initialValue;
        /* if it is a number, but out of bounds, use min/max */
        } else if(this.value < this.min) {
            this.value = this.min
        } else if(this.value > this.max) {
            this.value = this.max
        }

        $('#' + this.id).val(this.value);
        $('#' + this.id).slider('refresh');
    },

    /**
     * This method sets its value to the value it has in its DOM representation
     * and then delegates these changes to a controller property if the
     * contentBindingReverse property is set.
     *
     * Additionally call target / action if set.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    setValueFromDOM: function(id, event, nextEvent) {
        this.value = $('#' + this.id).val();

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, NO, [this.value, this.id]);
        }
    },

    /**
     * Applies some style-attributes to the slider.
     *
     * @private
     * @returns {String} The slider's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    },

    /**
     * Do some theming/styling once the slider was added to the DOM.
     *
     * @private
     */
    theme: function() {
        if(this.isSliderOnly) {
            $('#' + this.id).hide();
        }

        if(!this.isEnabled) {
            this.disable();
        }
    },

    /**
     * This method resets the slider to its initial value.
     */
    resetSlider: function() {
        this.value = this.initialValue;
        this.renderUpdate();
    },

    /**
     * This method disables the text field by setting the disabled property of its
     * html representation to true.
     */
    disable: function() {
        this.isEnabled = NO;
        $('#' + this.id).slider('disable');
    },

    /**
     * This method enables the text field by setting the disabled property of its
     * html representation to false.
     */
    enable: function() {
        this.isEnabled = YES;
        $('#' + this.id).slider('enable');
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      16.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype for any button view. A button is a view element that is
 * typically.........
 *
 * @extends M.View
 */
M.SplitView = M.View.extend(
/** @scope M.SplitView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SplitView',

    menu: null,

    content: null,

    isInitialized: NO,

    selectedItem: null,

    orientation: null,

    headerheight: null,

    footerheight: null,

    itemheight: null,

    contentLoaded: NO,

    scrollviewsInitialized: NO,

    hasMenuScrollview: NO,

    shouldHaveScrollview: YES,

    /**
     * Renders a split view.
     *
     * @private
     * @returns {String} The split view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '">';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Render child views.
     *
     * @private
     */
    renderChildViews: function() {
        if (this.childViews || this.contentBinding) {
            var childViews = this.getChildViewsAsArray();
            if (childViews.length > 0 || this.contentBinding) {
                this.menu = M.ScrollView.design({
                    childViews: 'menu',
                    menu: M.ListView.design({})
                });
                this.menu.parentView = this;
                this.menu.menu.parentView = this.menu;
                this.menu.cssClass = this.menu.cssClass ? this.menu.cssClass + ' tmp-splitview-menu' : 'tmp-splitview-menu';
                this.html += this.menu.render();

                this.content = M.ScrollView.design({});
                this.content.parentView = this;
                this.content.cssClass = this.content.cssClass ? this.content.cssClass + ' tmp-splitview-content' : 'tmp-splitview-content';
                this.html += this.content.render();

                return this.html;
            } else {
                M.Logger.log('You need to provide at least one child view for M.SplitView of the type M.SplitItemView.', M.ERROR);
            }
        }
    },

    /**
     * Render update.
     *
     * @private
     */
    renderUpdate: function() {
        var content = null;

        if (this.contentBinding) {
            content = this.value;
        } else if (this.childViews) {
            var childViews = this.getChildViewsAsArray();
            content = [];
            for (var i = 0; i < childViews.length; i++) {
                content.push(this[childViews[i]]);
            }
        }

        if (content) {
            if (content.length > 0) {

                /* reset menu list before filling it up again */
                this.menu.menu.removeAllItems();

                var entryItem = null;
                var currentItem = 0;
                for (var i in content) {
                    if (content[i] && content[i].type === 'M.SplitItemView') {
                        /* add item to list */
                        var item = M.ListItemView.design({
                            childViews: 'label',
                            parentView: this.menu.menu,
                            splitViewItem: content[i],
                            label: M.LabelView.design({
                                value: content[i].value
                            }),
                            events: {
                                tap: {
                                    target: this,
                                    action: 'listItemSelected'
                                }
                            }
                        });
                        this.menu.menu.addItem(item.render());

                        /* register events for item */
                        item.registerEvents();

                        /* save id of the current item if it is either the first item or isActive is set */
                        if (currentItem === 0 || content[i].isActive) {
                            entryItem = item.id;
                        }

                        /* increase item counter */
                        currentItem++;
                    } else {
                        M.Logger.log('Invalid child view passed! The child views of M.SplitView need to be of type M.ListView.', M.ERROR);
                    }
                }

                /* theme the list */
                this.menu.menu.themeUpdate();

                /* now set the active list item */
                this.menu.menu.setActiveListItem(entryItem);

                /* finally show the active list item's content */
                this.listItemSelected(entryItem);
            } else {
                M.Logger.log('You need to provide at least one child view for M.SplitView of the type M.SplitItemView.', M.ERROR);
            }
        }
    },

    /**
     * Theme.
     *
     * @private
     */
    theme: function() {
        this.renderUpdate();

        /* register for DOMContentLoaded event to initialize the split view once its in DOM */
        if (!this.contentLoaded) {
            var that = this;
            $(document).bind('DOMContentLoaded', function() {
                that.initializeVar();
            });
        }
    },

    themeUpdate: function() {
        var size = M.Environment.getSize();
        var width = size[0];
        var height = size[1];

        /* landscape mode */
        if (M.Environment.getWidth() > M.Environment.getHeight()) {
            this.orientation = 'landscape';
            $('html').addClass(this.orientation);

            $('#' + this.menu.id).css('width', Math.ceil(width * 0.3) - 2 * (parseInt($('#' + this.menu.id).css('border-right-width'))) + 'px');
            $('#' + this.content.id).css('width', Math.floor(width * 0.7) - 2 * (parseInt($('#' + this.content.id).css('padding-right')) + parseInt($('#' + this.content.id).css('padding-left'))) + 'px');
            $('#' + this.content.id).css('left', Math.ceil(width * 0.3) + (parseInt($('#' + this.content.id).css('padding-right')) + parseInt($('#' + this.content.id).css('padding-left'))) - parseInt($('#' + this.menu.id).css('border-right-width')) + 'px');

            $('.tmp-splitview-menu-toolbar').css('width', Math.ceil(width * 0.3) + (parseInt($('#' + this.content.id).css('padding-right')) + parseInt($('#' + this.content.id).css('padding-left'))) - parseInt($('.tmp-splitview-menu-toolbar').css('border-right-width')) + 'px');
            $('.tmp-splitview-content-toolbar').css('width', Math.floor(width * 0.7) - (parseInt($('#' + this.content.id).css('padding-right')) + parseInt($('#' + this.content.id).css('padding-left'))) + 'px');
        /* portrait mode */
        } else {
            this.orientation = 'portrait';
            $('html').addClass(this.orientation);

            $('#' + this.content.id).css('width', width - (parseInt($('#' + this.content.id).css('padding-right')) + parseInt($('#' + this.content.id).css('padding-left'))) + 'px');
            $('#' + this.content.id).css('left', '0px');

            $('.tmp-splitview-content-toolbar').css('width', width + 'px');
        }

        var page = M.ViewManager.getCurrentPage() || M.ViewManager.getPage(M.Application.entryPage);

        /* set the min height of the page based on if there's a footer or not */
        if ($('#' + page.id).hasClass('tmp-splitview-no-footer')) {
            $('#' + page.id).css('min-height', height + 'px');
        } else {
            $('#' + page.id).css('min-height', height - this.footerheight + 'px !important');
        }

        /* set the height of the menu based on header/footer */
        if ($('#' + page.id + ' .ui-footer').length === 0) {
            $('#' + this.menu.menu.id).css('height', M.Environment.getHeight() - this.headerheight);
        } else {
            $('#' + this.menu.menu.id).css('height', M.Environment.getHeight() - this.headerheight - this.footerheight);
        }

        /* initialize the scrolling stuff (if not done yet) */
        if (!this.scrollviewsInitialized) {
            $('#' + this.content.id).scrollview({
                direction: 'y'
            });

            /* check whether scrolling is required or not for the menu */
            if (this.orientation === 'landscape') {
                this.itemheight = $('#' + this.menu.menu.id).find('li:first').outerHeight();
                var itemCount = $('#' + this.menu.menu.id).find('li').length;

                if (this.itemheight !== 0) {
                    var menuHeight = M.Environment.getHeight();
                    var itemListHeight = itemCount * this.itemheight;
                    if (menuHeight < itemListHeight) {
                        $('#' + this.menu.menu.id).scrollview({
                            direction: 'y'
                        });
                        this.hasMenuScrollview = YES;
                    } else {
                        this.shouldHaveScrollview = NO;
                    }
                }
                this.scrollviewsInitialized = YES;
            }

        }
    },

    /**
     * Called when Dom Content Loaded event arrived, to calculate height of header and footer
     * and set the contentLoaded, call theme update, in order to check out if a scrollview for menu is needed
     */
    initializeVar: function() {
        this.headerheight = $('#' + M.ViewManager.getCurrentPage().id + ' .ui-header').height();
        this.footerheight = $('#' + M.ViewManager.getCurrentPage().id + ' .ui-footer').height();
        this.contentLoaded = YES;
        this.themeUpdate();
    },

    registerEvents: function() {
        /* register for orientation change events of the current page */
        var page = M.ViewManager.getCurrentPage() || M.ViewManager.getPage(M.Application.entryPage);
        M.EventDispatcher.registerEvent(
            'orientationdidchange',
            page.id,
            {
                target: this,
                action:  function() {
                    /* trigger re-theming with a little delay to make sure, the orientation change did finish */
                    var that = this;
                    window.setTimeout(function() {
                        that.orientationDidChange();
                    }, 100);
                }
            },
            ['orientationdidchange'],
            null,
            NO,
            YES
        );
    },

    listItemSelected: function(id) {
        var contentView = M.ViewManager.getViewById(id) && M.ViewManager.getViewById(id).splitViewItem ? M.ViewManager.getViewById(id).splitViewItem.view : null;

        if (!contentView) {
            return;
        }

        this.selectedItem = M.ViewManager.getViewById(id).splitViewItem;

        if (!this.isInitialized) {
            if (contentView.html) {
                $('#' + this.content.id).html(contentView.html);
            } else {
                $('#' + this.content.id).html(contentView.render());
                contentView.theme();
                contentView.registerEvents();
            }
            this.isInitialized = YES;
        } else {
            if (contentView.html) {
                $('#' + this.content.id + ' div:first').html(contentView.html);
            } else {
                $('#' + this.content.id + ' div:first').html(contentView.render());
                contentView.theme();
                contentView.registerEvents();
            }
            $('#' + this.content.id).scrollview('scrollTo', 0, 0);
        }

        /* check if there is a split toolbar view on the page and update its label to show the value of the selected item */
        var page = M.ViewManager.getCurrentPage() || M.ViewManager.getPage(M.Application.entryPage);
        var that = this;
        if (page) {
            $('#' + page.id + ' .tmp-splitview-content-toolbar').each(function() {
                var toolbar = M.ViewManager.getViewById($(this).attr('id'));
                if (toolbar.parentView && toolbar.parentView.showSelectedItemInMainHeader) {
                    toolbar.value = M.ViewManager.getViewById(id).splitViewItem.value;
                    $('#' + toolbar.id + ' h1').html(toolbar.value);

                    /* now link the menu with the toolbar if not yet done */
                    if (!toolbar.parentView.splitview) {
                        toolbar.parentView.splitview = that;
                    }
                }
            });

            /* add special css class if there is no footer */
            if ($('#' + page.id + ' .ui-footer').length === 0) {
                page.addCssClass('tmp-splitview-no-footer');
            }

            /* add special css class if there is no header */
            if ($('#' + page.id + ' .tmp-splitview-content-toolbar').length === 0) {
                page.addCssClass('tmp-splitview-no-header');
            }
        }
    },

    orientationDidChange: function() {
        var orientation = M.Environment.getOrientation();
        var that = this;
        var page = M.ViewManager.getCurrentPage() || M.ViewManager.getPage(M.Application.entryPage);

        /* portrait */
        if (M.Environment.getHeight() > M.Environment.getWidth()) {
            $('html').removeClass('landscape');
            $('html').addClass('portrait');
        /* landscape */
        } else {
            $('html').removeClass('portrait');
            $('html').addClass('landscape');

            /* hide the popover */
            var toolbar;
            if (page) {
                $('#' + page.id + ' .tmp-splitview-menu-toolbar').each(function() {
                    toolbar = M.ViewManager.getViewById($(this).attr('id'));
                    if (toolbar && toolbar.parentView && toolbar.parentView.popover) {
                        toolbar.parentView.popover.hide();
                    }
                });
            }

            /* update the menu */
            var id;
            $('#' + this.menu.id).find('li').each(function() {
                if (M.ViewManager.getViewById($(this).attr('id')).splitViewItem.id === that.selectedItem.id) {
                    id = $(this).attr('id');
                }
            });

            /* activate the current item */
            if (id) {
                this.menu.menu.setActiveListItem(id);
            }

            /* set the selected item */
            this.selectedItem = M.ViewManager.getViewById(id).splitViewItem;

            /* scroll the menu so we def. see the selected item */
            this.scrollListToRightPosition(id);
        }

        /* scroll content to top */
        $('#' + this.content.id).scrollview('scrollTo', 0, 0);

        /* call theme update */
        this.themeUpdate();
    },

    scrollListToRightPosition: function(id) {
        var itemHeight = $('#' + this.menu.menu.id + ' li:first-child').outerHeight();
        var y = ($('#' + id).index() + 1) * itemHeight;
        var menuHeight = M.Environment.getHeight() - this.headerheight - this.footerheight;
        var middle = menuHeight / 2;
        var distanceToListEnd = $('#' + this.menu.menu.id).find('li').length * itemHeight - y;
        var yScroll = 0;

        /* if y coordinate of item is greater than menu height, we need to scroll down */
        if (y > menuHeight) {
            if (distanceToListEnd < middle) {
                yScroll = -(y - menuHeight + distanceToListEnd);
            } else {
                yScroll = -(y - middle);
            }
            /* if y coordinate of item is less than menu height, we need to scroll up */
        } else if (y < menuHeight) {
            if (y < middle) {
                yScroll = 0;
            } else {
                yScroll = -(y - middle);
            }
        }

        /* if there already is a scroll view, just scroll */
        if (!this.hasMenuScrollview && this.shouldHaveScrollview) {
            $('#' + this.menu.menu.id).scrollview({
                direction: 'y'
            });
        }
        $('#' + this.menu.menu.id).scrollview('scrollTo', 0, yScroll);
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      17.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype for any button view. A button is a view element that is
 * typically.........
 *
 * @extends M.View
 */
M.SplitItemView = M.View.extend(
/** @scope M.SplitItemView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SplitItemView',

    /**
     * Renders a split view.
     *
     * @private
     * @returns {String} The split view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '">';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Render update.
     *
     * @private
     */
    renderUpdate: function() {
        // ...
    },

    /**
     * Theme.
     *
     * @private
     */
    theme: function() {
        // ...
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      17.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype for any button view. A button is a view element that is
 * typically.........
 *
 * @extends M.View
 */
M.SplitToolbarView = M.View.extend(
/** @scope M.SplitToolbarView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.SplitToolbarView',

    showSelectedItemInMainHeader: YES,

    showMenuButtonInPortraitMode: YES,

    popover: null,

    splitview: null,

    /**
     * Triggers render() on all children.
     *
     * @private
     */
    renderChildViews: function() {

        if(this.childViews) {
            var childViews = $.trim(this.childViews).split(' ');

            var currentToolbar = 0;
            for(var i in childViews) { // toolbar1, toolbar 2
                
                var toolbar = this[childViews[i]]; //zugriff wie 
                
                if(toolbar && toolbar.type === 'M.ToolbarView') {

                    toolbar.parentView = this;
                    if(currentToolbar === 0) {


                        toolbar.cssClass = toolbar.cssClass ? toolbar.cssClass + ' tmp-splitview-menu-toolbar' : 'tmp-splitview-menu-toolbar';



                    } else if(currentToolbar === 1) {
                        //toolbar2
                        toolbar.cssClass = toolbar.cssClass ? toolbar.cssClass + ' tmp-splitview-content-toolbar' : 'tmp-splitview-content-toolbar'

                        /* check if this is a simple toolbar so we can add the menu button */
                        if(!toolbar.childViews && this.showMenuButtonInPortraitMode) {
                            toolbar.cssClass = toolbar.cssClass ? toolbar.cssClass + ' tmp-splitview-content-toolbar-show-menu-button' : 'tmp-splitview-content-toolbar-show-menu-button';
                            toolbar.childViews = 'menuButton label';



                            var buttonLabel = this[childViews[0]].value;
                            toolbar.menuButton = M.ButtonView.design({
                                value: buttonLabel,
                                icon: 'arrow-d',
                                anchorLocation: M.LEFT,
                                internalEvents: {
                                    tap: {
                                        target: this,
                                        action: function() {
                                           if(!this.popover) {
                                                var content;
                                                if(this.splitview.contentBinding) {
                                                    content = this.splitview.value;
                                                } else if(this.splitview.childViews) {
                                                    var childViews = this.splitview.getChildViewsAsArray();
                                                    content = [];
                                                    for(var i = 0; i < childViews.length; i++) {
                                                        content.push(this.splitview[childViews[i]]);
                                                    }
                                                }
                                                var items = [];
                                                for(var i in content) {
                                                    items.push(content[i]);
                                                }
                                                this.popover = M.PopoverView.design({
                                                    items: items,
                                                    splitview: this.splitview
                                                });
                                                this.popover.show();
                                            } else {
                                                this.popover.renderUpdate();
                                                this.popover.toggle();
                                            }
                                        }
                                    }
                                }
                            });


                            toolbar.label = M.LabelView.design({
                                value: toolbar.value,
                                anchorLocation: M.CENTER
                            });

                            toolbar.value = '';
                        }
                    } else {
                        M.Logger.log('Too many child views given! M.SplitToolbarView only accepts two child views of type M.ToolbarView.', M.ERROR);
                        return;
                    }
                    this.html += toolbar.render();
                    currentToolbar++;
                } else {
                    M.Logger.log(childViews[i] + ' must be of type M.ToolbarView.', M.ERROR);
                }
            }
            return this.html;
        }
    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      16.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * The is the prototype of any tab bar view. A tab bar view is a special variant of a toolbar
 * at the top or bottom of a page, that consists of up to five horizontally aligned tabs. An
 * M.TabBarView can be used the top navigation level for an application since it is always
 * visible an indicates the currently selected tab.
 *
 */
M.TabBarView = M.View.extend(
/** @scope M.TabBarView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.TabBarView',
    
     /**
     * Defines the position of the TabBar. Possible values are:
     *
     * - M.BOTTOM => is a footer tab bar
     * - M.TOP => is a header tab bar
     * - null / not set ==> a tab bar outside header / footer
     *
     * @type String
     */
    anchorLocation: null,

    /**
     * This property defines the tab bar's name. This is used internally to identify
     * the tab bar inside the DOM.
     *
     * @type String
     */
    name: 'tab_bar',

    /**
     * This property holds a reference to the currently active tab.
     *
     * @type M.TabBarItemView
     */
    activeTab: null,

    /**
     * This property is used internally to count the number of usages of a tab bar.
     */
    usageCounter: 0,

    /**
     * This property determines whether to toggle the tab bar on tap on the content area
     * or not. By default this is set to NO.
     *
     * @type Boolean
     */
    toggleOnTap: NO,

    /**
     * Renders a tab bar as an unordered list.
     *
     * @private
     * @returns {String} The tab bar view's html representation.
     */
    render: function() {
        this.html = '';
        this.usageCounter += 1;

        if(this.anchorLocation) {
            this.html += '<div id="' + this.id + '" data-id="' + this.name + '" data-role="' + this.anchorLocation + '" data-position="fixed" data-tap-toggle="' + this.toggleOnTap + '" data-transition="' + (M.Application.getConfig('useTransitions') ? M.TRANSITION.SLIDE : M.TRANSITION.NONE) + '"><div data-role="navbar"><ul>';
        } else {
            this.html += '<div data-role="navbar" id="' + this.id + '" data-id="' + this.name + '"><ul>';
        }

        this.renderChildViews();

        this.html += '</ul></div>';

        if(this.anchorLocation) {
            this.html += '</div>';
        }

        return this.html;
    },

    /**
     * Triggers render() on all children of type M.TabBarItemView.
     *
     * @private
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();

            /* pre-process the child views to define which tab is selected */
            var hasActiveTab = NO;
            for(var i in childViews) {
                var view = this[childViews[i]];
                if(view.type === 'M.TabBarItemView' && view.isActive) {
                    if(!hasActiveTab) {
                        hasActiveTab = YES;
                        this.activeTab = view;
                    } else {
                        view.isActive = NO;
                    }
                }
            }

            var numTabBarViews = 0;
            for(var i in childViews) {
                var view = this[childViews[i]];
                if(view.type === 'M.TabBarItemView') {
                    numTabBarViews = numTabBarViews + 1;

                    /* set first tab to active tab if nothing else specified */
                    if(numTabBarViews === 1 && !hasActiveTab) {
                        view.isActive = YES;
                        this.activeTab = view;
                    }

                    view.parentView = this;
                    view._name = childViews[i];
                    this.html += view.render();
                } else {
                    M.Logger.log('Invalid child views specified for TabBarView. Only TabBarItemViews accepted.', M.WARN);
                }
            }
        } else {
            M.Logger.log('No TabBarItemViews specified.', M.WARN);
            return;
        }
    },

    /**
     * This method visually activates a tab bar item based on a given page.
     *
     * @param {M.TabBarItemView} tab The tab to set active.
     */
    setActiveTab: function(tab) {
        /* deactivate current active tav */
        this.activeTab.isActive = NO;
        var activeTabMainID = this.activeTab.id.substring(0, this.activeTab.id.lastIndexOf('_'));
        $('[id^=' + activeTabMainID + '_]').each(function() {
            $(this).removeClass('ui-btn-active');
        });

        /* activate new tab */
        tab.isActive = YES;
        this.activeTab = tab;
        var tabMainID = tab.id.substring(0, tab.id.lastIndexOf('_'));
        $('[id^=' + tabMainID + '_]').each(function() {
            $(this).addClass('ui-btn-active');
        });

    }

});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      16.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * This defines the prototype of any tab bar item view. An M.TabBarItemView can only be
 * used as a child view of a tab bar view.
 *
 * @extends M.View
 */
M.TabBarItemView = M.View.extend(
/** @scope M.TabBarItemView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.TabBarItemView',

    /**
     * Determines whether this TabBarItem is active or not.
     *
     * @type Boolean
     */
    isActive: NO,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['click', 'tap'],

    /**
     * Renders a tab bar item as a li-element inside of a parent tab bar view.
     *
     * @private
     * @returns {String} The button view's html representation.
     */
    render: function() {
        this.html = '';
        if(this.id.lastIndexOf('_') == 1) {
            this.id = this.id + '_' + this.parentView.usageCounter;
        } else {
            this.id = this.id.substring(0, this.id.lastIndexOf('_')) + '_' + this.parentView.usageCounter;
        }
        M.ViewManager.register(this);

        this.html += '<li><a id="' + this.id + '"' + this.style() + ' href="#">' + this.value + '</a></li>';
        
        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for tab bar item views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            tap: {
                target: this,
                action: 'switchPage'
            }
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * This method is automatically called if a tab bar item is clicked. It delegates the
     * page switching job to M.Controller's switchToTab().
     */
    switchPage: function() {
        if(this.page) {
        	M.ViewManager.setCurrentPage(M.ViewManager.getPage(this.page));
            M.Controller.switchToTab(this);
        } else {
            this.parentView.setActiveTab(this);
        }
    },

    /**
     * Applies some style-attributes to the tab bar item.
     *
     * @private
     * @returns {String} The tab bar item's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        if(this.isActive) {
            html += html != '' ? '' : ' class="';
            html += 'ui-btn-active';
            html += '"';
        }
        if(this.icon) {
            html += ' data-icon="';
            html += this.icon;
            html += '" data-iconpos="top"';
        }
        return html;
    }
    
});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   dominik
// Date:      05.12.11
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * The M.TableView renders a default HTML table, that can be dynamically filled via
 * content binding. Depending on the table's configuration, there will be a static
 * table header, that is visible even if there is no content. It is also possible
 * to always update the header, when applying content binding, too.
 *
 * @extends M.View
 */
M.TableView = M.View.extend(
/** @scope M.TableView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.TableView',

    /**
     * Determines whether to remove all content rows if the table is updated or not.
     *
     * @type Boolean
     */
    removeContentRowsOnUpdate: YES,

    /**
     * Determines whether to remove the header rows if the table is updated or not.
     *
     * @type Boolean
     */
    removeHeaderRowOnUpdate: NO,

    /**
     * Determines whether the table was initialized. If this flag is set to YES,
     * the table's header and colgroup was rendered. Depending on the table's
     * configuration (e.g. the removeHeaderRowOnUpdate property), this flag might
     * change dynamically at runtime.
     *
     * @private
     * @type Boolean
     */
    isInitialized: NO,

    /**
     * This property can be used to specify the table's header and cols, independent
     * from dynamically loaded table content. It can be provided with the table's
     * definition within a page component. The table's content, in contrast, can only
     * be applied via content binding.
     *
     * Note: If the removeHeaderRowOnUpdate property is set to YES, the header will
     * be removed whenever a content binding is applied. So if the header shall be
     * statically specified by the view component, do not set that property to YES!
     *
     * This property should look something like the following:
     *
     *   {
     *     data: ['col1', 'col2', 'col3'],
     *     cols: ['20%', '10%', '70%']
     *   }
     *
     * Note: the cols property of this object is optional. You can also let CSS take
     * care of the columns arrangement or simply let the browser do all the work
     * automatically.
     *
     * @type Object
     */
    header: null,

    /**
     * Renders a table view as a table element within a div box.
     *
     * @private
     * @returns {String} The table view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '_container"><table id="' + this.id +'"' + this.style() + '><thead></thead><tbody></tbody></table></div>';

        return this.html;
    },

    /**
     * Applies some style-attributes to the table.
     *
     * @private
     * @returns {String} The table's styling as html representation.
     */
    style: function() {
        var html = ' class="tmp-table';
        if(this.cssClass) {
            html += ' ' + this.cssClass;
        }
        html += '"'
        return html;
    },

    /**
     * This method is called once the initial rendering was applied to the
     * DOM. So this is where we will add the table's header (if there is
     * one specified)
     */
    theme: function() {
        if(this.header) {
            this.renderHeader();
        }
    },

    /**
     * This method renders the table's header. Based on the table's configuration,
     * this can either happen right at the first rendering or on every content
     * binding update.
     *
     * @private
     */
    renderHeader: function() {
        /* render the table header (if there is one) and define the cols */
        if(this.header && this.header.data) {

            /* render the colgroup element (define the columns) */
            if(this.header.cols && this.header.cols.length > 0) {
                html = '<colgroup>';
                _.each(this.header.cols, function(col) {
                    html += '<col width="' + col + '">';
                });
                html += '</colgroup>';
                $('#' + this.id).prepend(html);
            }

            /* render the table header */
            html = '<tr>';
            _.each(this.header.data, function(col) {
                html += '<th class="tmp-table-th">' + (col && col.toString() ? col.toString() : '') + '</th> ';
            });
            html += '</tr>';
            this.addRow(html, YES);
        }
    },

    /**
     * Updates the table based on its content binding. This should look like the following:
     *
     *   {
     *     header: {
     *       data: ['col1', 'col2', 'col3'],
     *       cols: ['20%', '10%', '70%']
     *     },
     *     content: [
     *       [25, 'Y, 'Lorem Ipsum'],
     *       [25, 46, 'Dolor Sit'],
     *       [25, 46, 'Amet']
     *     ]
     *   }
     *
     * Note: If the content binding specifies a header object, any previously rendered
     * header (and the col definition) will be overwritten!
     *
     * @private
     */
    renderUpdate: function() {
        var html;
        var content = this.value;

        /* clear the table before filling it up again */
        if(this.removeHeaderRowOnUpdate && this.removeContentRowsOnUpdate) {
            this.removeAllRows();
        } else if(this.removeContentRowsOnUpdate) {
            this.removeContentRows();
        }

        if(content && content.content && content.content.length > 0) {

            /* render the table header (if there is one) */
            if(content.header && content.header.data) {
                this.header = content.header;
                this.renderHeader();
            }

            /* render the table's content (row by row) */
            if(content.content && content.content.length > 0) {
                var that = this;
                var zebraFlag = 0;
                _.each(content.content, function(row) {
                    zebraFlag = (zebraFlag === 0 ? 1 : 0);
                    html = '<tr class="tmp-table-tr-' + (zebraFlag === 1 ? 'a' : 'b') + '">';
                    _.each(row, function(col, index) {
                        html += '<td class="tmp-table-td col_'+index+'">' + (col && col.toString() ? col.toString() : '') + '</td> ';
                    });
                    html += '</tr>';
                    that.addRow(html);
                });
            }

        }
        else {
            M.Logger.log('The specified content binding for the table view (' + this.id + ') is invalid!', M.WARN);
        }
    },

    /**
     * This method adds a new row to the table view by simply appending its html representation
     * to the table view inside the DOM. This method is based on jQuery's append().
     *
     * @param {String} row The html representation of a table row to be added.
     * @param {Boolean} addToTableHeader Determines whether or not to add the row to the table's header.
     */
    addRow: function(row, addToTableHeader) {
        if(addToTableHeader) {
            $('#' + this.id + ' thead').append(row);
        } else {
            $('#' + this.id + ' tbody').append(row);
        }
    },

    /**
     * This method removes all of the table view's rows by removing all of its content in the DOM. This
     * method is based on jQuery's empty().
     */
    removeAllRows: function() {
        $('#' + this.id).empty();
    },

    /**
     * This method removes all content rows of the table view by removing the corresponding
     * html in the DOM. This method is based on jQuery's remove().
     */
    removeContentRows: function() {
        $('#' + this.id + ' tr td').parent().remove();
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Sebastian
// Date:      04.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for input type: text
 *
 * @type String
 */
M.INPUT_TEXT = 'text';

/**
 * A constant value for input type: password
 *
 * @type String
 */
M.INPUT_PASSWORD = 'password';

/**
 * A constant value for input type: number
 *
 * @type String
 */
M.INPUT_NUMBER = 'number';

/**
 * A constant value for input type: tel
 *
 * @type String
 */
M.INPUT_TELEPHONE = 'tel';

/**
 * A constant value for input type: url
 *
 * @type String
 */
M.INPUT_URL = 'url';

/**
 * A constant value for input type: email
 *
 * @type String
 */
M.INPUT_EMAIL = 'email';

/**
 * A constant value for input type: time
 *
 * @type String
 */
M.INPUT_TIME = 'time';

/**
 * A constant value for input type: date
 *
 * @type String
 */
M.INPUT_DATE = 'date';

/**
 * A constant value for input type: month
 *
 * @type String
 */
M.INPUT_MONTH = 'month';

/**
 * A constant value for input type: week
 *
 * @type String
 */
M.INPUT_WEEK = 'week';

/**
 * A constant value for input type: datetime
 *
 * @type String
 */
M.INPUT_DATETIME = 'datetime';

/**
 * A constant value for input type: datetime-local
 *
 * @type String
 */
M.INPUT_DATETIME_LOCAL = 'datetime-local';

/**
 * @class
 *
 * M.TextFieldView is the prototype of any text field input view. It can be rendered as both
 * a single line text field and a multiple line text field. If it is styled as a multiple
 * line text field, is has a built-in autogrow mechanism so the textfield is getting larger
 * depending on the number of lines of text a user enters.
 *
 * @extends M.View
 */
M.TextFieldView = M.View.extend(
/** @scope M.TextFieldView.prototype */ {

   /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.TextFieldView',

   /**
    * The name of the text field. During the rendering, this property gets assigned to the name
    * property of the text field's html representation. This can be used to manually access the
    * text field's DOM representation later on.
    *
    * @type String
    */
    name: null,

    /**
     * The label proeprty defines a text that is shown above or next to the textfield as a 'title'
     * for the textfield. e.g. "Name:". If no label is specified, no label will be displayed.
     *
     * @type String
     */
    label: null,

    /**
     * The initial text shown inside the text field describing the input or making a suggestion for input
     * e.g. "Please enter your Name."
     *
     * @type String
     */
    initialText: '',

    /**
     * Determines whether to display the textfield grouped with the label specified with the label property.
     * If set to YES, the textfield and its label are wrapped in a container and styled as a unit 'out of
     * the box'. If set to NO, custom styling could be necessary.
     *
     * If there is no label specified, this property is ignored by default.
     *
     * @type Boolean
     */
    isGrouped: NO,

    /**
     * Defines whether the text field has multiple lines respectively is a text area.
     *
     * @type Boolean
     */
    hasMultipleLines: NO,

    /**
     * This property specifies the input type of this input field. Possible values are:
     *
     *   - M.INPUT_TEXT --> text input (default)
     *   - M.INPUT_PASSWORD --> password
     *   - M.INPUT_NUMBER --> number
     *   - M.INPUT_TELEPHONE --> tel
     *   - M.INPUT_URL --> url
     *   - M.INPUT_EMAIL --> email
     *
     * Note, that these types are not yet supported by all browsers!
     *
     * @type String
     */
    inputType: M.INPUT_TEXT,

    /**
     * This property is used internally to determine all the possible input types for a
     * date textfield.
     *
     * @private
     * @type Array
     */
    dateInputTypes: [M.INPUT_DATETIME, M.INPUT_DATE, M.INPUT_MONTH, M.INPUT_WEEK, M.INPUT_TIME, M.INPUT_DATETIME_LOCAL],

    /**
     * This property can be used to specify the allowed number if chars for this text field
     * view. If nothing is specified, the corresponding 'maxlength' HTML property will not
     * be set.
     *
     * @type Number
     */
    numberOfChars: null,

    /**
     * This property can be used to specify whether to use the native implementation
     * of one of the HTML5 input types if it is available. If set to YES, e.g. iOS5
     * will render its own date/time picker controls to the corresponding input
     * type. If set to no, the native implementation will be disabled.
     *
     * @type Boolean
     */
    useNativeImplementationIfAvailable: YES,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['focus', 'blur', 'enter', 'keyup', 'tap'],

    /**
     * Define whether putting an asterisk to the right of the label for this textfield.
     *
     * @type Boolean
     */
    hasAsteriskOnLabel: NO,

    /**
     * This property can be used to assign a css class to the asterisk on the right of the label.
     *
     * @type String
     */
    cssClassForAsterisk: null,

    /**
     * Renders a TextFieldView
     * 
     * @private
     * @returns {String} The text field view's html representation.
     */
    render: function() {
        this.computeValue();

        this.html = '';
        if(this.label) {
            this.html += '<label for="' + (this.name ? this.name : this.id) + '">' + this.label;
            if(this.hasAsteriskOnLabel) {
                if(this.cssClassForAsterisk) {
                    this.html += '<span class="' + this.cssClassForAsterisk + '">*</span></label>';
                } else {
                    this.html += '<span>*</span></label>';
                }
            } else {
                this.html += '</label>';
            }
        }

		// If the device supports placeholders use the HTML5 placeholde attribute else use javascript workarround
        var placeholder = '';
        if(this.initialText) {
            placeholder = ' placeholder="' + this.initialText + '" ';

        }

        if(this.hasMultipleLines) {
            this.html += '<textarea cols="40" rows="8" name="' + (this.name ? this.name : this.id) + '" id="' + this.id + '"' + this.style() + placeholder + '>' + (this.value ? this.value : '') + '</textarea>';
            
        } else {
            var type = this.inputType;
            if(_.include(this.dateInputTypes, this.inputType) && !this.useNativeImplementationIfAvailable) {
                type = 'text';
            }
            
            this.html += '<input ' + (this.numberOfChars ? 'maxlength="' + this.numberOfChars + '"' : '') + placeholder + 'type="' + type + '" name="' + (this.name ? this.name : this.id) + '" id="' + this.id + '"' + this.style() + ' value="' + (this.value ? this.value : '') + '" />';
        }
        
        return this.html;
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for text field views and
     * their internal events.
     */
    registerEvents: function() {
        this.internalEvents = {
            focus: {
                target: this,
                action: 'gotFocus'
            },
            blur: {
                target: this,
                action: 'lostFocus'
            },
            keyup: {
                target: this,
                action: 'setValueFromDOM'
            }
        };
        /* add TAP handler only if needed */
        var type = this.inputType;
        if (_.include(this.dateInputTypes, this.inputType) && !this.useNativeImplementationIfAvailable) {
            this.internalEvents['tap'] = {
                target:this,
                action:'handleTap'
            };
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * The contentDidChange method is automatically called by the observable when the
     * observable's state did change. It then updates the view's value property based
     * on the specified content binding.
     *
     * This is a special implementation for M.TextFieldView.
     */
    contentDidChange: function(){
        /* if the text field has the focus, we do not apply the content binding */
        if(this.hasFocus) {
            return;
        }

        /* let M.View do the real job */
        this.bindToCaller(this, M.View.contentDidChange)();

        this.renderUpdate();
        this.delegateValueUpdate();
    },

    /**
     * Updates a TextFieldView with DOM access by jQuery.
     *
     * @param {Boolean} preventValueComputing Determines whether to execute computeValue() or not.
     * @private
     */
    renderUpdate: function(preventValueComputing) {
        if(!preventValueComputing) {
            this.computeValue();
        }
        $('#' + this.id).val(this.value);
        this.styleUpdate();
    },

    /**
     * This method is called whenever the view is taped/clicked. Typically a text
     * field view would not use a tap event. But since a tap is called before the
     * focus event, we use this to do some input type depending stuff, e.g. show
     * a date picker.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    handleTap: function(id, event, nextEvent) {
        if(_.include(this.dateInputTypes, this.inputType) && (!M.Environment.supportsInputType(this.inputType) || !this.useNativeImplementationIfAvailable)) {
            M.DatePickerView.show({
                source: this,
                useSourceDateAsInitialDate: YES,
                showDatePicker: (this.inputType !== M.INPUT_TIME),
                showTimePicker: (this.inputType === M.INPUT_TIME || this.inputType === M.INPUT_DATETIME || this.inputType === M.INPUT_DATETIME_LOCAL),
                dateOrder: (this.inputType === M.INPUT_MONTH ? M.DatePickerView.dateOrderMonthOnly : M.DatePickerView.dateOrder),
                dateFormat: (this.inputType === M.INPUT_MONTH ? M.DatePickerView.dateFormatMonthOnly : M.DatePickerView.dateFormat)
            });
        }

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * This method is called whenever the view gets the focus.
     * If there is a initial text specified and the value of this text field
     * still equals this initial text, the value is emptied.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    gotFocus: function(id, event, nextEvent) {
        this.hasFocus = YES;

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * This method is called whenever the view lost the focus.
     * If there is a initial text specified and the value of this text field
     * is empty, the value is set to the initial text.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    lostFocus: function(id, event, nextEvent) {
        this.setValueFromDOM();

        this.hasFocus = NO;

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * Method to append css styles inline to the rendered text field.
     *
     * @private
     * @returns {String} The text field's styling as html representation.
     */
    style: function() {
        var html = ' style="';
        if(this.isInline) {
            html += 'display:inline;';
        }
        html += '"';

        if(!this.isEnabled) {
            html += ' disabled="disabled"';
        }
        
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }

        return html;
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the text field.
     *
     * @private
     */
    theme: function() {
        /* trigger keyup event to make the text field autogrow */
        var jDom = $('#'  + this.id);
        if(this.value) {
            jDom.trigger('keyup').textinput();
            if(!this.isEnabled){
	            jDom.textinput('disable');
	        }
        }

        /* add container-css class */
        jDom.parent().addClass(this.cssClass + '_container');
    },

    /**
     * Method to append css styles inline to the rendered view on the fly.
     *
     * @private
     */
    styleUpdate: function() {
        /* trigger keyup event to make the text field autogrow (enable fist, if necessary) */
        if(this.value) {
            $('#' + this.id).removeAttr('disabled');
            $('#'  + this.id).trigger('keyup');
        }

        if(this.isInline) {
            $('#' + this.id).attr('display', 'inline');
        } else {
            $('#' + this.id).removeAttr('display');
        }

        if(!this.isEnabled) {
            $('#' + this.id).attr('disabled', 'disabled');
        } else {
            $('#' + this.id).removeAttr('disabled');
        }
    },

    /**
     * This method sets its value to the value it has in its DOM representation
     * and then delegates these changes to a controller property if the
     * contentBindingReverse property is set.
     *
     * Additionally call target / action if set.
     *
     * @param {String} id The DOM id of the event target.
     * @param {Object} event The DOM event.
     * @param {Object} nextEvent The next event (external event), if specified.
     */
    setValueFromDOM: function(id, event, nextEvent) {
        this.value = this.secure($('#' + this.id).val());
        this.delegateValueUpdate();

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * This method sets the text field's value, initiates its re-rendering
     * and call the delegateValueUpdate().
     *
     * @param {String} value The value to be applied to the text field view.
     * @param {Boolean} delegateUpdate Determines whether to delegate this value update to any observer or not.
     * @param {Boolean} preventValueComputing Determines whether to execute computeValue() or not.
     */
    setValue: function(value, delegateUpdate, preventValueComputing) {
        this.value = value;

        this.renderUpdate(preventValueComputing);

        if(delegateUpdate) {
            this.delegateValueUpdate();
        }
    },

    /**
     * This method disables the text field by setting the disabled property of its
     * html representation to true.
     */
    disable: function() {
        this.isEnabled = NO;
        this.renderUpdate();
    },

    /**
     * This method enables the text field by setting the disabled property of its
     * html representation to false.
     */
    enable: function() {
        this.isEnabled = YES;
        this.renderUpdate();
    },

    /**
     * This method clears the text field's value, both in the DOM and within the JS object.
     */
    clearValue: function() {
        this.setValue('');

        /* call lostFocus() to get the initial text displayed */
        this.lostFocus();
    },

    /**
     * This method returns the text field view's value.
     *
     * @returns {String} The text field view's value.
     */
    getValue: function() {
        return this.value;
    },
	/**
     *
     * Set a new label for this text field
     * @param txt the new label value
     */
    setLabel: function(txt){
        if(this.label){
            $('label[for="' + this.id + '"]').html(txt);
        }
    }

});

// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      09.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.ToggleView defines the prototype of any toggle view. A toggle view accepts exactly
 * two child views and provides an easy mechanism to toggle between these two views. An
 * easy example would be to define two different button views that can be toggled, a more
 * complex scenario would be to define two content views (M.ScrollView) with own child views
 * and toggle between them.
 *
 * @extends M.View
 */
M.ToggleView = M.View.extend(
/** @scope M.ToggleView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ToggleView',

    /**
     * States whether the toggle view currently displays its first child view or its second
     * child view.
     *
     * @type Boolean
     */
    isInFirstState: YES,

    /**
     * Determines whether to toggle the view on click. This might be useful if the child views
     * are e.g. buttons.
     *
     * @type Boolean
     */
    toggleOnClick: NO,

    /**
     * Contains a reference to the currently displayed view.
     *
     * @type M.View
     */
    currentView: null,

    /**
     * Renders a ToggleView and its child views.
     *
     * @private
     * @returns {String} The toggle view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '">';

        this.renderChildViews();

        this.html += '</div>';
        
        return this.html;
    },

    /**
     * This method renders one child view of the toggle view, based on the isInFirstState
     * property: YES = first child view, NO = second child view.
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();

            if(childViews.length !== 2) {
                M.Logger.log('M.ToggleView requires exactly 2 child views, but ' + childViews.length + ' are given (' + (this.name ? this.name + ', ' : '') + this.id + ')!', M.WARN);
            } else {
                for(var i in childViews) {
                    if(this[childViews[i]]) {
                        if(this.toggleOnClick) {
                            this[childViews[i]].internalEvents = {
                                vclick: {
                                    target: this,
                                    action: 'toggleView'
                                }
                            }
                        }
                        this[childViews[i]]._name = childViews[i];
                        this[childViews[i]].parentView = this;
                        
                        this.html += '<div id="' + this.id + '_' + i + '">';
                        this.html += this[childViews[i]].render();
                        this.html += '</div>';
                    }
                }
                this.currentView = this[childViews[0]];
            }
        }
    },

    /**
     * This method toggles the child views by first emptying the toggle view's content
     * and then rendering the next child view by calling renderUpdateChildViews().
     */
    toggleView: function(id, event, nextEvent) {
        this.isInFirstState = !this.isInFirstState;
        var currentViewIndex = this.isInFirstState ? 0 : 1;
        $('#' + this.id + '_' + (currentViewIndex > 0 ? 0 : 1)).hide();
        $('#' + this.id + '_' + currentViewIndex).show();

        /* set current view */
        var childViews = this.getChildViewsAsArray();
        if(this[childViews[currentViewIndex]]) {
            this.currentView = this[childViews[currentViewIndex]];
        }

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * This method can be used to set on of the toggle view's child views as the active one. Simply pass
     * the view, its id or its name.
     *
     * If a view or id is passed, that does not match on of the toggle view's child views, nothing will be
     * done.
     *
     * @param {Object|String} view The corresponding view.
     */
    setView: function(view) {
        if(typeof(view) === 'string') {
            /* assume a name was given */
            var childViews = this.getChildViewsAsArray();
            if(_.indexOf(childViews, view) >= 0) {
                view = this[view];
            /* assume an id was given */
            } else {
                view = M.ViewManager.getViewById(view) ? M.ViewManager.getViewById(view) : view;
            }
        }

        if(view && typeof(view) === 'object' && view.parentView === this) {
            if(this.currentView !== view) {
                this.toggleView();
            }
        } else {
            M.Logger.log('No valid view passed for toggle view \'' + this._name + '\'.', M.WARN);
        }
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the toggle view respectively
     * its child views.
     *
     * @private
     */
    theme: function() {
        if(this.currentView) {
            this.themeChildViews();
            var currentViewIndex = this.isInFirstState ? 0 : 1;

            $('#' + this.id + '_' + (currentViewIndex > 0 ? 0 : 1)).hide();
        }
    }

});
/**
 * @class
 *
 * This defines the prototype of a toggle switch view
 *
 * General spoken it is an Boolean switch.
 *
 * @extends M.View
 */
M.ToggleSwitchView = M.View.extend(
    /** @scope M.ToggleSwitchView.prototype */ {

        /**
         * The type of this object.
         *
         * @type String
         */
        type:'M.ToggleSwitchView',

        /**
         * From the jQuery mobile page: "All form controls accept a data-mini="true" attribute that renders a smaller version of the standard-sized form elements. In the case of grouped buttons, the data-mini="true" attribute can be added to the containing controlgroup. Compare mini and normal form elements side-by-side."
         *
         * @type Boolean
         */
        isMini:NO,


        /**
         *
         * Think of it as an boolean switch so the on value is set default to true
         * It is set through the render function. If there is no label defined the label gets set by the value.
         *
         * @type String
         */
        onLabel:'',

        /**
         *
         * Think of it as an boolean switch so the off value is set default to false
         * It is set through the render function. If there is no label defined the label gets set by the value.
         *
         * @type String
         */
        offLabel:'',

        /**
         *
         * Think of it as an boolean switch so the on value is set default to true
         *
         * @default YES
         * @type Boolean but could be anything
         */

        onValue:YES,

        /**
         *
         * Think of it as an boolean switch so the off value is set default to false
         *
         * @default NO
         * @type Boolean but could be anything
         */
        offValue:NO,

        /**
         * Optionally wrap the switch markup in a container with the data-role="fieldcontain" attribute to help visually group it in a longer form.
         * @default YES
         * @type Boolean
         */
        fieldcontain:NO,


        /**
         * This property specifies the recommended events for this type of view.
         *
         * @type Array
         */
        recommendedEvents: ['change'],


        /**
         * Renders a selection list.
         *
         * @private
         * @returns {String} The toggle switch view's html representation.
         */
        render:function () {

            this.html = '';
            /* if there is no label put the value as label */
            if (!this.onLabel) {
                this.onLabel = this.onValue;
            }

            /* if there is no label put the value as label */
            if (!this.offLabel) {
                this.offLabel = this.offValue;
            }

            var dataRoleFieldContain = '';

            /*is there is a fieldcontain defined use it*/
            if (this.fieldcontain) {
                dataRoleFieldContain = ' data-role="fieldcontain" ';
            }

            /*should the element be inline?*/
            var isInline = '';
            if (this.isInline) {
                isInline = ' style="display: inline-block" ';
            }

            /*add the label to the view*/
            if (this.label) {
                this.html += '<label' + isInline + ' for="' + this.id + '">' + this.label + '</label>';
            }

            /* build the markup as jquerymobile likes it */
            this.html += '<div' + dataRoleFieldContain + isInline + ' id="' + this.id + '_container" ' + this.style() + '>';
            this.html += '<select name="' + this.id + '" id="' + this.id + '" data-role="slider" data-mini="' + this.isMini + '">';
            this.html += '<option value="' + this.offValue + '">' + this.offLabel + '</option>';
            this.html += '<option value="' + this.onValue + '">' + this.onLabel + '</option>';
            this.html += '</select>';

            this.html += '</div>';


            /* return the markup*/
            return this.html;
        },

        theme: function(){

        },

        /**
         *
         * add the class attribute to the HTML
         *
         * @return {String}
         */

        style:function () {
            var html = ' class="';
            if (this.cssClass) {
                html += this.cssClass;
            }
            html += '" ';
            return html;
        },


        /**
         *
         * returns the value of the selection
         *
         * @return {*} the value of the selection
         */
        getValue:function () {
            var val = $('#' + this.id).val();
            return val;
        },

        /**
         *
         * pass either the name of the option or its value to set the option and toggle the slider
         *
         * @param val the value to be set
         */
        setValue:function (val) {
            //if the name matchs set the option to selected otherwise test the given parameter to the option value
            var useValue = true;
            $('#' + this.id + ' option').each(function () {
                if ($(this).html() === val) {
                    $(this).attr('selected', 'selected');
                    useValue = false;
                }
            });
            if (useValue) {
                //is there an option with the paramet as value. if so then select it
                $('#' + this.id + ' option[value*=' + val + ']').attr('selected', 'selected');
            }
            //toggle the view
            $('#' + this.id).slider('refresh');
        },


        /**
         * sets the value of the toggle switch to onValue
         */
        on:function () {
            this.setValue(this.onValue);
        },

        /**
         * sets the value of the toggle switch to offValue
         */
        off:function () {
            this.setValue(this.offValue);
        },


        /**
         * enable the toggle switch view
         */
        enable:function () {
            $('#' + this.id).slider('enable');
        },


        /**
         * disable the toggle switch view
         */
        disable:function () {
            $('#' + this.id).slider('disable');
        }

    })





// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Sebastian
// Date:      02.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * A constant value for the anchor location: top.
 *
 * @type String
 */
M.TOP = 'header';

/**
 * A constant value for the anchor location: bottom.
 *
 * @type String
 */
M.BOTTOM = 'footer';

/**
 * A constant value for the anchor location: left.
 *
 * @type Number
 */
M.LEFT = 'LEFT';

/**
 * A constant value for the anchor location: center.
 *
 * @type Number
 */
M.CENTER = 'CENTER';

/**
 * A constant value for the anchor location: right.
 *
 * @type Number
 */
M.RIGHT = 'RIGHT';

/**
 * @class
 *
 * The root object for ToolbarViews.
 *
 * @extends M.View
 */
M.ToolbarView = M.View.extend(
/** @scope M.ToolbarView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ToolbarView',

     /**
     * Defines the position of the TabBar. Possible values are:
     *
     * - M.BOTTOM => is a footer bar
     * - M.TOP => is a header bar
     *
     * @type String
     */
    anchorLocation: M.TOP,

    /**
     * Determines whether to display an auto-generated back-button on the left side
     * of the toolbar view or not.
     *
     * @type Boolean
     */
    showBackButton: NO,

    /**
     * If the showBackButton property is set to yes, this property will be used to
     * save a reference to the M.ButtonView.
     */
    backButton: null,

    /**
     * This property determines whether to fix the toolbar to the top / bottom of a
     * page. By default this is set to YES.
     *
     * @type Boolean
     */
    isFixed: YES,


    /**
     * This property determines whether the toolbar is persistent or not.
     * By default this is set to YES.
     * If you like to customize the behavior you can simply define you own identifier. Every M.Toolbar with the same identifier is with each other persistent.
     * If you simply set it to YES the header is persistent to each other header with the flag YES.
     * If it is set to NO, then there is the old style page switch
     *
     * @type Boolean or String
     */

    isPersistent: YES,

    /**
     * This property determines whether to toggle the toolbar on tap on the content area
     * or not. By default this is set to NO.
     *
     * @type Boolean
     */
    toggleOnTap: NO,

    /**
     * Renders a toolbar as a div tag with corresponding data-role attribute and inner
     * h1 child tag (representing the title of the header)
     *
     * @private
     * @returns {String} The toolbar view's html representation.
     */
    render: function() {
        this.html = '<div id="' + this.id + '" data-role="' + this.anchorLocation + '" data-tap-toggle="' + this.toggleOnTap + '"' + this.style();

        if(this.isFixed) {
            this.html += ' data-position="fixed"';
        }

        if(this.isPersistent) {
            if(typeof(this.isPersistent) === "string"){
                this.html += ' data-id="' + this.isPersistent + '"';
            }else{
                this.html += ' data-id="themprojectpersistenttoolbar"';
            }
        }

        this.html += ' data-transition="' + (M.Application.getConfig('useTransitions') ? M.TRANSITION.SLIDE : M.TRANSITION.NONE) + '"';

        this.html += '>';

        this.renderChildViews();

        this.html += '</div>';

        return this.html;
    },

    /**
     * Triggers render() on all children or simply display the value as a label,
     * if it is set.
     */
    renderChildViews: function() {
        if(this.value && this.showBackButton) {
            /* create the toolbar's back button */
            this.backButton = M.ButtonView.design({
                value: 'Back',
                icon: 'arrow-l',
                internalEvents: {
                    tap: {
                        action: function() {
                            history.back(-1);
                        }
                    }
                }
            });

            /* render the back button and add it to the toolbar's html*/
            this.html += '<div class="ui-btn-left">';
            this.html += this.backButton.render();
            this.html += '</div>';

            /* render the centered value */
            this.html += '<h1>' + this.value + '</h1>';
        } else if(this.value) {
            this.html += '<h1>' + this.value + '</h1>';
        } else if (this.childViews) {
            var childViews = this.getChildViewsAsArray();
            var viewPositions = {};
            for(var i in childViews) {
                var view = this[childViews[i]];
                view._name = childViews[i];
                if( viewPositions[view.anchorLocation] ) {
                    M.Logger.log('ToolbarView has two items positioned at M.' +
                        view.anchorLocation + 
                        '.  Only one item permitted in each location', M.WARN);
                    return;
                }
                viewPositions[view.anchorLocation] = YES;
                switch (view.anchorLocation) {
                    case M.LEFT:
                        this.html += '<div class="ui-btn-left">';
                        this.html += view.render();
                        this.html += '</div>';
                        break;
                    case M.CENTER:
                        this.html += '<h1>';
                        this.html += view.render();
                        this.html += '</h1>';
                        break;
                    case M.RIGHT:
                        this.html += '<div class="ui-btn-right">';
                        this.html += view.render();
                        this.html += '</div>';
                        break;
                    default:
                        M.Logger.log('ToolbarView children must have an anchorLocation of M.LEFT, M.CENTER, or M.RIGHT', M.WARN);
                        return;
                }
            }
        }
    },

    /**
     * Updates the value of the toolbar with DOM access by jQuery.
     *
     * @private
     */
    renderUpdate: function() {
        this.computeValue();
        $('#' + this.id + ' h1').text(this.value);
    },

    /**
     * This method is responsible for registering events for view elements and its child views. It
     * basically passes the view's event-property to M.EventDispatcher to bind the appropriate
     * events.
     *
     * It extend M.View's registerEvents method with some special stuff for list views and their
     * internal events.
     */
    registerEvents: function() {
        if(this.backButton) {
            this.backButton.registerEvents();
        }
        this.bindToCaller(this, M.View.registerEvents)();
    },

    /**
     * Applies some style-attributes to the toolbar.
     *
     * @private
     * @returns {String} The toolbar's styling as html representation.
     */
    style: function() {
        var html = '';
        if(this.cssClass) {
            html += ' class="' + this.cssClass + '"';
        }
        return html;
    }
    
});
// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2012 panacoda GmbH. All rights reserved.
// Creator:   Dominik
// Date:      16.02.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * Comment ...
 *
 * @extends M.View
 */
M.WebView = M.View.extend(
/** @scope M.WebView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.WebView',

    /**
     * This property can be used to specify wheter a user should be able to srcoll
     * within the web view or not.
     *
     * Note: If set to NO, the external web content must take care of fitting in the
     * web view. Otherwise some part of the web page won't be visible.
     *
     * @type Boolean
     */
    isScrollable: YES,

    /**
     * This property specifies the recommended events for this type of view.
     *
     * @type Array
     */
    recommendedEvents: ['load'],

    /**
     * This method renders a web view as a simple iFrame element.
     *
     * @private
     * @returns {String} The button view's html representation.
     */
    render: function() {
        this.computeValue();
        this.checkURL();
        this.html = '<div id="' + this.id + '"></div>';

        return this.html;
    },

    /**
     * Check if we can switch to iframe or need to keep div since there's no valid url yet.
     *
     * @private
     */
    theme: function() {
        this.renderUpdate();
    },

    /**
     * This method is called whenever the content bound by content binding changes.
     * It forces the web view to re-render meaning to load the updated url stored
     * in the value property.
     *
     * @private
     */
    renderUpdate: function() {
        if(this.value) {
            this.computeValue();
            this.checkURL();
        }

        if(this.value && this.html && this.html.indexOf('<div') === 0) {
            this.html = '<iframe id="' + this.id + '"' + this.style() + ' src="' + this.value + '" scrolling="' + (this.isScrollable ? 'YES' : 'NO') + '"></iframe>';
            $('#' + this.id).replaceWith(this.html);
            this.registerEvents();
        } else if(this.value && this.html && this.html.indexOf('<iframe') === 0) {
            $('#' + this.id).attr('src', this.value);
        }
    },

    /**
     * This method is used to check the given URL and to make sure there is an
     * HTTP/HTTPS prefix. Otherwise there could occur problems with Espresso.
     *
     * @private
     */
    checkURL: function() {
        if(this.value && this.value.lastIndexOf('http://') < 0 && this.value.lastIndexOf('https://') < 0) {
            this.value = 'http://' + this.value;
        }
    },

    /**
     * This method simply applies an internal CSS class to the web view and,
     * if available, the CSS class specified by the cssClass property of that
     * view element.
     *
     * @private
     * @returns {String} The web view's styling as html representation.
     */
    style: function() {
        var html = ' class="tmp-webview';
        if(this.cssClass) {
            html += ' ' + this.cssClass;
        }
        html += '"';
        return html;
    },

    /**
     * This method can be used to force the web view to reload its original
     * URL. This can either be the one specified by the value property or the
     * one specified by the currently bound content.
     */
    reload: function() {
        $('#' + this.id).attr('src', this.value);
    }

});