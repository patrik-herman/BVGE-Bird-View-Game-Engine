// Importer.js by PDKnight.
// You can find more at https://github.com/PDKnight/Importer.js/

// My own XXHR library, grabbed from https://github.com/PDKnight/XXHR
var XXHR=function(){var t=[":(",":[","._.","(O.o)","d[O_O]b",";(",":'("],e="No XHR, no more fun.",n="The XHR failed",r=function(t){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=typeof arguments.callee.activeXString)for(var n=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],r=0,a=n.length;a>r;r++)try{var o=new ActiveXObject(n[r]);return arguments.callee.activeXString=n[r],o}catch(i){}return new ActiveXObject(arguments.callee.activeXString)}throw"function"==typeof t&&t(e),new Error(e)};return{request:function(e,a,o,i,u){if("string"!=typeof e)throw new Error("XXHR().response function requires at least 1 parameter (string).");var s=r(o),i=i||!0,f=u?"post":"get",u=u?u:null;s.onreadystatechange=function(){if(4==s.readyState){if(!(s.status>=200&&s.status<300||304==s.status)){var e=n+" "+t[Math.floor(Math.random()*t.length)]+" [status:"+s.status+"]";throw"function"==typeof o&&o(e,s.status),new Error(e)}var r=s.responseText;"function"==typeof a&&a(r)}},s.open(f,e,i),s.send(u)}}};

var Importer = {
    version: '1.1.5',
    add: function()
    {
        // skip if no scripts
        if (arguments.length == 0) return;

        // getting urls and endFn
        var urls = [],
            endFn,
            skipOnError = false,
            as = [];

        // load all the arguments into as
        for (var i = arguments.length - 1; i >= 0; i--)
            as.unshift(arguments[i])


        var last = as[as.length - 1],
            beforeLast = as[as.length - 2];


        if (as.length > 2
                && typeof beforeLast == 'function'
                && typeof last == 'boolean')
        {
            endFn = beforeLast;
            skipOnError = last;
            as.splice(-2, 2);
        }
        else if (as.length > 1
                && typeof last == 'function')
        {
            endFn = last;
            as.splice(-1, 1);
        }
        else if (as.length > 1
                && typeof last == 'boolean')
        {
            skipOnError = last;
            as.splice(-1, 1);
        }

        // now args are urls

        // skip if no scripts
        if (as.length == 0) return;

        // recursive loading causing loading
        // all scripts in default order
        this.loadScripts(as, 0, endFn, [], skipOnError);
    },
    loadScripts: function(urls, i, endFn, failedFiles, skipOnError)
    {
        if (i == urls.length)
        {
            if (typeof endFn == 'function')
                endFn(failedFiles);

            return;
        }

        XXHR().request(urls[i], function(r)
        {
            // because setting variables in files and then
            // evaling the files content doesn't put variables
            // into the window object
            var scr = document.createElement('script');

            scr.id = urls[i];

            if (skipOnError)
                scr.innerHTML = 'try{'
                    + r + '}catch(ex){}';
            else
                scr.innerHTML = r

            document.body.appendChild(scr);

            Importer.loadScripts(
                urls, i + 1, endFn, failedFiles, skipOnError
            );
        },
        function(err, status) // if error
        {
            failedFiles.push({
                file: urls[i],
                message: err,
                status: status
            });
            Importer.loadScripts(
                urls, i + 1, endFn, failedFiles, skipOnError
            );
        });
    }
};
