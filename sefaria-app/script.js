(function() {

// don't indent this block

'use strict';

Promise.onPossiblyUnhandledRejection(
    function(e, promise) {
  throw e;
});

var define = (function() {
  // Resolve functions for
  // Promises that modules will
  // get defined
  var publish = {};

  // Separate promises that various
  // modules will each get defined
  // with a respective single value,
  // so that other modules can
  // register for any via "then"
  var subscribe = {};

  function module(libs, moduleFn) {
    var name = moduleFn.name;

    libs.forEach(function(lib) {
      if (!(lib in subscribe)) {

        subscribe[lib] = new Promise(
            function(resolve, rej) {
          publish[lib] = resolve;
        });

      }
    });

    if (!(name in subscribe)) {
      subscribe[name] = new Promise(
          function(resolve, rej) {
        publish[name] = resolve;
      });
    }

    // list of the separate promises
    // for each dependency that the
    // current module has
    var dependencies = libs.map(
        function(lib) {
      return subscribe[lib];
    });

    // Promise that the list of
    // dependencies will jointly get
    // defined, resolving with the
    // list of respective values
    var publication;

    if (dependencies.length == 0) {
      publication = Promise.resolve(
        [] );
    } else if (
        dependencies.length == 1) {
      publication = new Promise(
          function(resolve, rej) {
        dependencies[0].then(
            function(value) {
          resolve([value]);
        });
      });
     
    } else {
      publication =
          Promise.all(dependencies);
    }

    publication.then(
        function(values) {
      var valueMap = libs.map(
          function(x, i) {
        return [libs[i], values[i]];
      }).reduce(
          function(libMap,
              libValuePair) {
        libMap[libValuePair[0]] =
            libValuePair[1];
        return libMap;
      }, {} );

      var moduleValue =
          moduleFn(valueMap);
      var resolve = publish[name];
      resolve(moduleValue);
    });
  }
  function define(libs, moduleFn) {
    var lib = {};
    var definition;
    var _moduleFn = moduleFn;
    var _libs = libs;
    var name;

    // libs argument comes first,
    // but may be omitted
    if (typeof libs === 'function') {
      _libs = [];
      _moduleFn = libs;
    }
    module(_libs, _moduleFn);
  }

  return define;
})();

/*
Provided that what is above is loaded and executed via a script tag in the HTML document body,
then what is below can be loaded and executed as any number of separate pieces, any time after DOMContentLoaded.
*/

define(function Struct() {
  return {

// < reset indent
forObj: function(obj, fn) {
  Object.keys(obj).forEach(
      function(prop) {
    fn(obj[prop], prop);
  });
},
array: (Function.prototype.call
    .bind(Array.prototype.slice))
// > restore indent

  };
});

define(['Struct'],
    function Code(lib) {
  var Struct = lib.Struct;
  var array = Struct.array;
  var Code;

  return Code = {

// < reset indent
escaping:
      function(escapeFn, strings) {
  var values = array(arguments);
  var result = strings.shift();
  values.shift();
  values.shift();
  while (strings.length) {
    result +=
        escapeFn(values.shift()) +
        strings.shift();
  }
  return result;
},
identity: function(x) { return x; },
raw: function(values) {
  var args = array(values);
  args.unshift(identity);
  return Code.escaping.apply(
      null, args);
},
uri: function(strings) {
  var args = array(arguments);
  args.unshift(encodeURIComponent);
  return Code.escaping.apply(
      null, args);
},
template:
    function(transform, s, obj) {
  var segments = s.split('${');
  var strings = [segments.shift()];
  var values = [];
  var eqn;
  if (typeof transform
      !== 'function') {
    obj = s;
    s = transform;
    transform = Code.raw;
  }
  while (segments.length) {
    eqn = segments.shift().split(
        '}', 2);
    strings.push(eqn[1]);
    values.push(obj[eqn[0]]);
  }
  values.unshift(strings);
  return transform.apply(
      null, values);
}
// > restore indent

  };

});



define(['Struct'], function App(lib) {
  var Struct = lib.Struct;
  var forObj = Struct.forObj;

//<reset indent

function Autowire (client, diagram) {
  var EMPTY = {};
  var name;
  var target;
  var eventMap;
  var eventType;
  var byId = (this.byId = {});
  diagram = diagram || {};
  forObj(diagram,
      function(eventMap, id) {
    var target = (
        window.document
            .getElementById(id));
    byId[id] = target;
    eventMap = eventMap || EMPTY;
    forObj(
        eventMap,
        function(
            listener, eventType) {
      target.addEventListener(
          eventType,
          listener.bind(client));
    });
  });
}

function App(options) {
  var diagram = options.diagram || {};
  var autowire =
      options.autowire || Autowire;
  var wiring =
      new autowire(this, diagram);

  this.byId = wiring.byId;
  this.server = options.server || '';
}

//>restore indent

  return App;
});



addEventListener('load', function(e) {

// don't indent this block

define(['App','Code'],
    function main(lib) {
  var App = lib.App;
  var Code = lib.Code;

  function setText(element, text) {
    element.innerText = text;
  }

  var app = new App({

// < reset indent
server: 'https://www.sefaria.org',
diagram: {
  ref: null,
  resultEn: null,
  resultHe: null,
  resultRef: null,
  refForm: { submit: function(e) {
    var byId = this.byId;

    var ref = byId.ref;
    var resultRef = byId.resultRef;
    var resultHe = byId.resultHe;
    var resultEn = byId.resultEn;

    var address =
        this.server + Code.template(
          Code.uri,
          '/api/texts/${r}?context=0',
          {r: ref.value});

    setText(resultRef,
        'Retrieving...');
    setText(resultHe, '');
    setText(resultEn, '');

    fetch(address).then(
        function(response) {
      response.json().then(
          function(data) {
        setText(resultRef, data.ref);
        setText(resultHe, data.he);
        setText(resultEn, data.text);
      }, function () {
        console.log('JSON error');
      });
    }, function() {
      console.log('Network error');
    }); // fetch.then
  }} // refForm
} // diagram
// > restore indent

  }); // new App
return true;
});



// don't unindent this - didn't indent

}); // addEventListener('load'



// don't unindent this - didn't indent

})();