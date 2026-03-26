// numeral.js
// version : 1.4.8
// author : Adam Draper
// license : MIT
// http://adamwdraper.github.com/Numeral-js/
(function () { function o(e) { this._n = e } function u(e, t, n) { var r = Math.pow(10, t), i; i = (Math.round(e * r) / r).toFixed(t); if (n) { var s = new RegExp("0{1," + n + "}$"); i = i.replace(s, "") } return i } function a(e, t) { var n; t.indexOf("$") > -1 ? n = l(e, t) : t.indexOf("%") > -1 ? n = c(e, t) : t.indexOf(":") > -1 ? n = h(e, t) : n = d(e, t); return n } function f(e, t) { if (t.indexOf(":") > -1) e._n = p(t); else if (t === i) e._n = 0; else { var s = t; n[r].delimiters.decimal !== "." && (t = t.replace(/\./g, "").replace(n[r].delimiters.decimal, ".")); var o = new RegExp(n[r].abbreviations.thousand + "(?:\\)|(\\" + n[r].currency.symbol + ")?(?:\\))?)?$"), u = new RegExp(n[r].abbreviations.million + "(?:\\)|(\\" + n[r].currency.symbol + ")?(?:\\))?)?$"), a = new RegExp(n[r].abbreviations.billion + "(?:\\)|(\\" + n[r].currency.symbol + ")?(?:\\))?)?$"), f = new RegExp(n[r].abbreviations.trillion + "(?:\\)|(\\" + n[r].currency.symbol + ")?(?:\\))?)?$"), l = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], c = !1; for (var h = 0; h <= l.length; h++) { c = t.indexOf(l[h]) > -1 ? Math.pow(1024, h + 1) : !1; if (c) break } e._n = (c ? c : 1) * (s.match(o) ? Math.pow(10, 3) : 1) * (s.match(u) ? Math.pow(10, 6) : 1) * (s.match(a) ? Math.pow(10, 9) : 1) * (s.match(f) ? Math.pow(10, 12) : 1) * (t.indexOf("%") > -1 ? .01 : 1) * Number((t.indexOf("(") > -1 ? "-" : "") + t.replace(/[^0-9\.-]+/g, "")); e._n = c ? Math.ceil(e._n) : e._n } return e._n } function l(e, t) { var i = t.indexOf("$") <= 1 ? !0 : !1, s = ""; if (t.indexOf(" $") > -1) { s = " "; t = t.replace(" $", "") } else if (t.indexOf("$ ") > -1) { s = " "; t = t.replace("$ ", "") } else t = t.replace("$", ""); var o = a(e, t); if (i) if (o.indexOf("(") > -1 || o.indexOf("-") > -1) { o = o.split(""); o.splice(1, 0, n[r].currency.symbol + s); o = o.join("") } else o = n[r].currency.symbol + s + o; else if (o.indexOf(")") > -1) { o = o.split(""); o.splice(-1, 0, s + n[r].currency.symbol); o = o.join("") } else o = o + s + n[r].currency.symbol; return o } function c(e, t) { var n = ""; if (t.indexOf(" %") > -1) { n = " "; t = t.replace(" %", "") } else t = t.replace("%", ""); e._n = e._n * 100; var r = a(e, t); if (r.indexOf(")") > -1) { r = r.split(""); r.splice(-1, 0, n + "%"); r = r.join("") } else r = r + n + "%"; return r } function h(e, t) { var n = Math.floor(e._n / 60 / 60), r = Math.floor((e._n - n * 60 * 60) / 60), i = Math.round(e._n - n * 60 * 60 - r * 60); return n + ":" + (r < 10 ? "0" + r : r) + ":" + (i < 10 ? "0" + i : i) } function p(e) { var t = e.split(":"), n = 0; if (t.length === 3) { n += Number(t[0]) * 60 * 60; n += Number(t[1]) * 60; n += Number(t[2]) } else if (t.lenght === 2) { n += Number(t[0]) * 60; n += Number(t[1]) } return Number(n) } function d(e, t) { var s = !1, o = !1, a = "", f = "", l = "", c = Math.abs(e._n); if (e._n === 0 && i !== null) return i; if (t.indexOf("(") > -1) { s = !0; t = t.slice(1, -1) } if (t.indexOf("a") > -1) { if (t.indexOf(" a") > -1) { a = " "; t = t.replace(" a", "") } else t = t.replace("a", ""); if (c >= Math.pow(10, 12)) { a += n[r].abbreviations.trillion; e._n = e._n / Math.pow(10, 12) } else if (c < Math.pow(10, 12) && c >= Math.pow(10, 9)) { a += n[r].abbreviations.billion; e._n = e._n / Math.pow(10, 9) } else if (c < Math.pow(10, 9) && c >= Math.pow(10, 6)) { a += n[r].abbreviations.million; e._n = e._n / Math.pow(10, 6) } else if (c < Math.pow(10, 6) && c >= Math.pow(10, 3)) { a += n[r].abbreviations.thousand; e._n = e._n / Math.pow(10, 3) } } if (t.indexOf("b") > -1) { if (t.indexOf(" b") > -1) { f = " "; t = t.replace(" b", "") } else t = t.replace("b", ""); var h = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], p, d; for (var v = 0; v <= h.length; v++) { p = Math.pow(1024, v); d = Math.pow(1024, v + 1); if (e._n >= p && e._n < d) { f += h[v]; p > 0 && (e._n = e._n / p); break } } } if (t.indexOf("o") > -1) { if (t.indexOf(" o") > -1) { l = " "; t = t.replace(" o", "") } else t = t.replace("o", ""); l += n[r].ordinal(e._n) } if (t.indexOf("[.]") > -1) { o = !0; t = t.replace("[.]", ".") } var m = e._n.toString().split(".")[0], g = t.split(".")[1], y = t.indexOf(","), b = "", w = !1; if (g) { if (g.indexOf("[") > -1) { g = g.replace("]", ""); g = g.split("["); b = u(e._n, g[0].length + g[1].length, g[1].length) } else b = u(e._n, g.length); m = b.split(".")[0]; b.split(".")[1].length ? b = n[r].delimiters.decimal + b.split(".")[1] : b = ""; o && Number(b.slice(1)) === 0 && (b = "") } else m = u(e._n, null); if (m.indexOf("-") > -1) { m = m.slice(1); w = !0 } y > -1 && (m = m.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + n[r].delimiters.thousands)); t.indexOf(".") === 0 && (m = ""); return (s && w ? "(" : "") + (!s && w ? "-" : "") + m + b + (l ? l : "") + (a ? a : "") + (f ? f : "") + (s && w ? ")" : "") } function v(e, t) { n[e] = t } var e, t = "1.4.8", n = {}, r = "en", i = null, s = typeof module != "undefined" && module.exports; e = function (t) { e.isNumeral(t) ? t = t.value() : Number(t) || (t = 0); return new o(Number(t)) }; e.version = t; e.isNumeral = function (e) { return e instanceof o }; e.language = function (t, i) { if (!t) return r; if (t && !i) { if (!n[t]) throw new Error("Unknown language : " + t); r = t } (i || !n[t]) && v(t, i); return e }; e.language("en", { delimiters: { thousands: ",", decimal: "." }, abbreviations: { thousand: "k", million: "m", billion: "b", trillion: "t" }, ordinal: function (e) { var t = e % 10; return ~~(e % 100 / 10) === 1 ? "th" : t === 1 ? "st" : t === 2 ? "nd" : t === 3 ? "rd" : "th" }, currency: { symbol: "$" } }); e.zeroFormat = function (e) { typeof e == "string" ? i = e : i = null }; e.fn = o.prototype = { clone: function () { return e(this) }, format: function (t) { return a(this, t ? t : e.defaultFormat) }, unformat: function (t) { return f(this, t ? t : e.defaultFormat) }, value: function () { return this._n }, valueOf: function () { return this._n }, set: function (e) { this._n = Number(e); return this }, add: function (e) { this._n = this._n + Number(e); return this }, subtract: function (e) { this._n = this._n - Number(e); return this }, multiply: function (e) { this._n = this._n * Number(e); return this }, divide: function (e) { this._n = this._n / Number(e); return this }, difference: function (e) { var t = this._n - Number(e); t < 0 && (t = -t); return t } }; s && (module.exports = e); typeof ender == "undefined" && (this.numeral = e); typeof define == "function" && define.amd && define([], function () { return e }) }).call(this);


function formatNumber(number) {
    return numeral(number).format('0,0.00');
}

if (typeof TWEACO == 'undefined' || !TWEACO) {
    var TWEACO = {};
}

TWEACO.apps = TWEACO.apps || {};


(function () {

    
    /**
    * Default configuration
    */
    var config = {
        /**
        * Edge of the window to pin the cart to
        */
        displayEdge: 'right',

        /**
        * Distance from the edge of the window
        */
        edgeDistance: '50px',

        /**
        * The base path of your website to set the cookie to
        */
        cookiePath: '/',

        /**
        * Strings used for display text
        */
        strings: {
            button: '',
            subtotal: '',
            discount: '',
            shipping: ''
        },

        /**
        * Unique ID used on the wrapper element 
        */
        name: '_tweaco_cart_state',

        currencySign:'₡',

        defaultShippingCost:0,

		shippingLegend : 'no incluye costo de envio',
		
		placeOrderButtonText :  'Hacer el pedido',
		
        events: {
            beforeAdd:null   
        }
    };

     ko.extenders.changed = function(target, option) {
                target.subscribe(function(newValue) {                    
                    TWEACO.apps.MiniCart.Save();
                });
                return target;
            };

    TWEACO.apps.MiniCartLine = function(id, description, price, quantity) {
        var self = this;                        
        self.ProductId = id || "";                        
        self.Price = price;
		self.PriceFormated = config.currencySign + formatNumber(price);
        self.Description = description || "";
        self.Quantity = ko.observable(parseInt(quantity) || 1).extend({changed: ""});
        self.SubTotal = ko.computed(function() {
            return self.Price * parseInt("0" + self.Quantity(), 10);
        });
		self.SubTotalFormated = ko.computed(function() {
            return config.currencySign + formatNumber(self.SubTotal());
        });
        self.details=function(){
			 var line = {ProductId: self.ProductId, Price: self.Price, NumericPrice: parseFloat(self.Price), Description: self.Description, Quantity: parseInt(self.Quantity())};
            return line;
        }
    };
    

    TWEACO.apps.MiniCart = (function () {
        

        /**
        * Container for UI elements references
        */
        self.UI = {};
        
        /**
        * Flag to determine if the cart is currently showing
        */
        self.isShowing = false;

        var products=ko.observableArray();
        
        var _init = function (userConfig) {
            var key;
            // Overwrite default configuration with user settings
            for (key in userConfig) {                
                config[key] = userConfig[key];                
            }            

            _buildDOM();
            // Suscribe to DOM events
            _bindEvents();

            // Process any stored data 
            _parseStorage();

            // Update the UI
            if (self.isShowing) {
                setTimeout(function () {
                    self.hide(null);
                }, 500);
            } 

        }

        // Process any stored data 
        var _parseStorage = function() {
            var data= $storage.load();
            var recreatedProducts=[];
            if(data)
            {
                $.each(data, function(i,e) { 
                    recreatedProducts.push(new TWEACO.apps.MiniCartLine(e.details.ProductId,e.details.Description,e.details.Price,e.details.Quantity));                
                    self.isShowing = true;
                });
            }

            products(recreatedProducts);
        };



         /**
        * Shows the cart
        *
        * @param e {event} The triggering event
        */
        self.show = function (e) {
            var from = parseInt(self.UI.cart.offsetTop, 10),
				to = 0;

            if (e && e.preventDefault) { e.preventDefault(); }

            if (typeof config.events.onShow == 'function') {
                config.events.onShow.call(self, e);
            }

            $util.animate(self.UI.cart, 'top', { from: from, to: to }, function () {
                if (typeof config.events.afterShow == 'function') {
                    config.events.afterShow.call(self, e);
                }
            });

            self.UI.summary.style.backgroundPosition = '-195px 2px';
            self.isShowing = true;
        };


        /**
        * Hides the cart off the screen
        *
        * @param e {event} The triggering event
        * @param fully {boolean} Should the cart be fully hidden? Optional. Defaults to false.
        */
        self.hide = function (e, fully) {
            var cartHeight = (self.UI.cart.offsetHeight) ? self.UI.cart.offsetHeight : document.defaultView.getComputedStyle(self.UI.cart, '').getPropertyValue('height'),
				summaryHeight = (self.UI.summary.offsetHeight) ? self.UI.summary.offsetHeight : document.defaultView.getComputedStyle(self.UI.summary, '').getPropertyValue('height'),
				from = parseInt(self.UI.cart.offsetTop, 10),
				to;

            // make the cart fully hidden
            if (fully) {
                to = cartHeight * -1;
                // otherwise only show a little teaser portion of it
            } else {
                to = (cartHeight - summaryHeight - 8) * -1;
            }

            if (e && e.preventDefault) { e.preventDefault(); }

            if (typeof config.events.onHide == 'function') {
                config.events.onHide.call(self, e);
            }

            $util.animate(self.UI.cart, 'top', { from: from, to: to }, function () {
                if (typeof config.events.afterHide == 'function') {
                    config.events.afterHide.call(self, e);
                }
            });

            self.UI.summary.style.backgroundPosition = '-195px -32px';
            self.isShowing = false;
        };


        /**
        * Toggles the display of the cart
        *
        * @param e {event} The triggering event
        */
        self.toggle = function (e) {
            if (self.isShowing) {
                self.hide(e);
            } else {
                self.show(e);
            }
        };

         var _buildDOM = function () {
            var cmd, type, bn;

            self.UI.wrapper = $('#mini-cart')[0];
            self.UI.cart = $('#mini-cart form')[0]
            self.UI.itemList = $('#mini-cart form ul')[0];
            self.UI.summary = $('#mini-cart form p')[0];
            self.UI.button =  $('#mini-cart form p input')[0];
            self.UI.subtotal = $('#mini-cart form p span')[0];
            self.UI.subtotalAmount= $('#mini-cart form p span')[1];

			$('#mini-cart .shipping').text(config.shippingLegend);;
			$('#mini-cart form p input').attr('value',config.placeOrderButtonText);
			
            // Workaround: IE 6 and IE 7/8 in quirks mode do not support position:fixed in CSS
            if (window.attachEvent && !window.opera) {
                var version = navigator.userAgent.match(/MSIE\s([^;]*)/);

                if (version) {
                    version = parseFloat(version[1]);

                    if (version < 7 || (version >= 7 && document.compatMode === 'BackCompat')) {
                        self.UI.cart.style.position = 'absolute';
                        self.UI.wrapper.style[config.displayEdge] = '0';
                        self.UI.wrapper.style.setExpression('top', 'x = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop');
                    }
                }
            }            
        };


        /**
        * Attaches the cart events to it's DOM elements 
        */
        var _bindEvents = function () {

            // Hide the Mini Cart for all non-cart related clicks 
            $event.add(document, 'click', function (e) {
                if (self.isShowing) {
                    var target = e.target;

                    if (!(/input|button|select|option/i.test(target.tagName))) {
                        while (target!=null && target.nodeType === 1) {
                            if (target === self.UI.cart) {
                                return;
                            }

                            target = target.parentNode;
                        }

                        self.hide(null);
                    }
                }
            });
           
            // Show the cart when clicking on the summary 
            $event.add(self.UI.summary, 'click', function (e) {
                var target = e.target;

                if (target !== self.UI.button) {
                    self.toggle(e);
                }
            });

            // Update other windows when HTML5 localStorage is updated
            if (window.attachEvent && !window.opera) {
                // IE (unimplemented)
                //$.event.add(document, 'storage', function (e) {
                //});		    
            } else {
                $event.add(window, 'storage', function (e) {
                    // Safari, Chrome, and Opera	
                    // Firefox (unimplemented since e.key is not passed)
                    if (e.key && e.key == config.name) {                        
                        _parseStorage();                        
                    }
                });
            }
        };
        
    return {
        Products: products,

        FormatCurrency: function (value) {
            return formatCurrency(value);
        },

        AddProduct:function(cartLine){                        

            var existingLine=
                            ko.utils.arrayFirst(products(), function(item) {
                                    return item.ProductId.toLowerCase()=== cartLine.ProductId.toLowerCase();
                            });
            
            self.show(null);            

            if(existingLine)
                //Modifying the Quantity will fire a ko subscription that stores the change.
                existingLine.Quantity((existingLine.Quantity() * 1 ) +cartLine.Quantity());
            else
            {
                this.Products.push(cartLine);                
                $storage.save(products());
            }                                        
        },

        ProductIsInCart: function(productId) {
             var existingLine=
                            ko.utils.arrayFirst(products(), function(item) {
                                    return item.ProductId.toLowerCase()=== productId.toLowerCase();
                            });

            return existingLine!=null;
        },

        RemoveProduct:function(cartLine){
            products.remove(cartLine);
            $storage.save(products());
        },
        Save: function(){
            $storage.save(products());
        },
        Total:ko.computed(function() {
            var total = 0,
                level = 1,
                hex;                  								

            $.each(products(), function() { total += this.SubTotal() });

            if(self.UI.cart){
                // Yellow fade on update
                (function () {
                    hex = level.toString(16);
                    level++;

                    // hide the cart if there's no total
                    if (total == products().length) {
                        self.hide(null, true);
                    }

                    self.UI.subtotalAmount.style.backgroundColor = '#ff' + hex;

                    if (level >= 15) {
                        self.UI.subtotalAmount.style.backgroundColor = 'transparent';                    
                        return;
                    }

                    setTimeout(arguments.callee, 30);
                } ());
            }


            return formatCurrency(total);
        }),
        
        Render: function (userConfig) {
            _init(userConfig); 
			$.each($('.TWMiniCart'), function(){				
				ko.applyBindings(TWEACO.apps.MiniCart, this);
			});             
        },
        Clear: function(){
            this.Products.removeAll();
            $storage.save(products());
        },
        JSONCartState:ko.computed(function() {    
            
            var data = [],
            order = {ShippingCost:config.defaultShippingCost,CurrencySign: config.currencySign, Lines:null},
            product,
            len,
            i,
            lineWithQuantityZero=false;
            
            if(products().length==0) return '';

            for (i = 0, len = products().length; i < len; i++) {
                product = products()[i];                
                data.push(product.details());                
            }

            order.Lines=data;

            return JSON.stringify(order);
        })
    };

    }());


    /** UTILITY METHODS **/    

    $storage = (function () {
        var name = config.name;

        // Use HTML5 client side storage
        if (window.localStorage) {
            return {

                /**
                * Loads the saved data
                * 
                * @return {object}
                */
                load: function () {
                    var data = localStorage.getItem(name);

                    if (data) {
                        data = JSON.parse(unescape(data));
                    }

                    return data;
                },


                /**
                * Saves the data
                *
                * @param products {object} The list of products to save
                */
                save: function (products) {
                    var data = [],
						product,
						len,
						i;

                    if (products) {
                        for (i = 0, len = products.length; i < len; i++) {
                            product = products[i];
                            data.push({
                                details: product.details()
                            });
                        }

                        data = escape(JSON.stringify(data));
                        localStorage.setItem(name, data);
                    }
                },


                /**
                * Removes the saved data
                */
                remove: function () {
                    localStorage.removeItem(name);
                }
            };

            // Otherwise use cookie based storage
        } else {
            return {

                /**
                * Loads the saved data
                * 
                * @return {object}
                */
                load: function () {
                    var data,
						cookies,
						cookie,
						key = name + '=',
						value,
						i;

                    try {
                        cookies = document.cookie.split(';');

                        for (i = 0; i < cookies.length; i++) {
                            cookie = cookies[i];

                            while (cookie.charAt(0) === ' ') {
                                cookie = cookie.substring(1, cookie.length);
                            }

                            if (cookie.indexOf(key) === 0) {
                                value = cookie.substring(key.length, cookie.length);
                                data = JSON.parse(unescape(value));
                            }
                        }
                    } catch (e) { }

                    return data;
                },


                /**
                * Saves the data
                *
                * @param products {object} The list of products to save
                */
                save: function (products, duration) {
                    var date = new Date(),
						data = [],
						product,
						len,
						i;

                    if (products) {
                        for (i = 0, len = products.length; i < len; i++) {
                            product = products[i];
                            data.push({
                                details: product.details
                            });
                        }

                        duration = duration || 30;
                        date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);

                        document.cookie = config.name + '=' + escape(JSON.stringify(data)) + '; expires=' + date.toGMTString() + '; path=' + config.cookiePath;
                    }
                },


                /**
                * Removes the saved data
                */
                remove: function () {
                    this.save(null, -1);
                }
            };
        }
    } ());


    $event = {
        /**
        * Events are added here for easy reference
        */
        cache: [],


        /**
        * Cross browser way to add an event to an object and optionally adjust it's scope
        *
        * @param obj {HTMLElement} The object to attach the event to
        * @param type {string} The type of event excluding "on"
        * @param fn {function} The function
        * @param scope {object} Object to adjust the scope to (optional)
        */
        add: function (obj, type, fn, scope) {
            scope = scope || obj;

            var wrappedFn;

            if (obj.addEventListener) {
                wrappedFn = function (e) { fn.call(scope, e); };
                obj.addEventListener(type, wrappedFn, false);
            } else if (obj.attachEvent) {
                wrappedFn = function () {
                    var e = window.event;
                    e.target = e.target || e.srcElement;

                    e.preventDefault = function () {
                        e.returnValue = false;
                    };

                    fn.call(scope, e);
                };

                obj.attachEvent('on' + type, wrappedFn);
            }

            this.cache.push([obj, type, fn, wrappedFn]);
        },


        /**
        * Cross browser way to remove an event from an object
        *
        * @param obj {HTMLElement} The object to remove the event from
        * @param type {string} The type of event excluding "on"
        * @param fn {function} The function
        */
        remove: function (obj, type, fn) {
            var wrappedFn, item, len, i;

            for (i = 0; i < this.cache.length; i++) {
                item = this.cache[i];

                if (item[0] == obj && item[1] == type && item[2] == fn) {
                    wrappedFn = item[3];

                    if (wrappedFn) {
                        if (obj.removeEventListener) {
                            obj.removeEventListener(type, wrappedFn, false);
                        } else if (obj.detachEvent) {
                            obj.detachEvent('on' + type, wrappedFn);
                        }

                        delete this.cache[i];
                    }
                }
            }
        }
    };


    $util = {
        /**
        * Animation method for elements
        *
        * @param el {HTMLElement} The element to animate
        * @param prop {string} Name of the property to change
        * @param config {object} Properties of the animation
        * @param callback {function} Callback function after the animation is complete
        */
        animate: function (el, prop, config, callback) {
            config = config || {};
            config.from = config.from || 0;
            config.to = config.to || 0;
            config.duration = config.duration || 10;
            config.unit = (/top|bottom|left|right|width|height/.test(prop)) ? 'px' : '';

            var step = (config.to - config.from) / 20;
            var current = config.from;

            (function () {
                el.style[prop] = current + config.unit;
                current += step;

                if ((step > 0 && current > config.to) || (step < 0 && current < config.to) || step === 0) {
                    el.style[prop] = config.to + config.unit;

                    if (typeof callback === 'function') {
                        callback();
                    }

                    return;
                }

                setTimeout(arguments.callee, config.duration);
            })();
        },


        /**
        * Convenience method to return the value of any type of form input
        *
        * @param input {HTMLElement} The element who's value is returned
        */
        getInputValue: function (input) {
            var tag = input.tagName.toLowerCase();

            if (tag == 'select') {
                return input.options[input.selectedIndex].value;
            } else if (tag == 'textarea') {
                return input.innerHTML;
            } else {
                if (input.type == 'radio') {
                    return (input.checked) ? input.value : null;
                } else if (input.type == 'checkbox') {
                    return (input.checked) ? input.value : null;
                } else {
                    return input.value;
                }
            }
        }
    };


    /*
    * Numeric functions
    */
    function formatCurrency(value) {
        return config.currencySign + addCommas(value);
    }

    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }


     /**
    * JSON Parser - See http://www.json.org/js.html
    */
    if (!this.JSON) { JSON = {}; } (function () { function f(n) { return n < 10 ? "0" + n : n; } if (typeof Date.prototype.toJSON !== "function") { Date.prototype.toJSON = function (key) { return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z"; }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf(); }; } var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + string + '"'; } function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === "object" && typeof value.toJSON === "function") { value = value.toJSON(key); } if (typeof rep === "function") { value = rep.call(holder, key, value); } switch (typeof value) { case "string": return quote(value); case "number": return isFinite(value) ? String(value) : "null"; case "boolean": case "null": return String(value); case "object": if (!value) { return "null"; } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === "[object Array]") { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || "null"; } v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]"; gap = mind; return v; } if (rep && typeof rep === "object") { length = rep.length; for (i = 0; i < length; i += 1) { k = rep[i]; if (typeof k === "string") { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v); } } } } else { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v); } } } } v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}"; gap = mind; return v; } } if (typeof JSON.stringify !== "function") { JSON.stringify = function (value, replacer, space) { var i; gap = ""; indent = ""; if (typeof space === "number") { for (i = 0; i < space; i += 1) { indent += " "; } } else { if (typeof space === "string") { indent = space; } } rep = replacer; if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) { throw new Error("JSON.stringify"); } return str("", { "": value }); }; } if (typeof JSON.parse !== "function") { JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === "object") { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } } return reviver.call(holder, key, value); } cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }); } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) { j = eval("(" + text + ")"); return typeof reviver === "function" ? walk({ "": j }, "") : j; } throw new SyntaxError("JSON.parse"); }; } } ());

}());

window.onFormCleared= function(){TWEACO.apps.MiniCart.Clear();}
