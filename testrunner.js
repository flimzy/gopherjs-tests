"use strict";
// Fix Error prototype for PhantomJS
if (typeof phantom !== "undefined") {
    // Fix Error prototype
    var OriginalErrorPrototype = Error.prototype;
    var OriginalError = Error;
    Error = function(m) {
        try {
            throw new OriginalError(m);
        } catch (e) {
            return e;
        }
    };
    Error.prototype = OriginalErrorPrototype;
}

function iframeDoc( id ) {
    var frameRef = document.getElementById(id);
    if(!frameRef) return;
    return frameRef.contentWindow
        ? frameRef.contentWindow.document
        : frameRef.contentDocument
}

var tests = [
// Breaks in browsers:
// 'database_sql',
'archive_tar','archive_zip','bufio','bytes','compress_bzip2','compress_flate','compress_gzip','compress_lzw','compress_zlib','container_heap','container_list','container_ring','crypto_aes','crypto_cipher','crypto_des','crypto_dsa','crypto_ecdsa','crypto_elliptic','crypto_hmac','crypto_md5','crypto_rand','crypto_rc4','crypto_rsa','crypto_sha1','crypto_sha256','crypto_sha512','crypto_subtle','crypto_x509','database_sql_driver','debug_dwarf','debug_elf','debug_gosym','debug_macho','debug_pe','encoding_ascii85','encoding_asn1','encoding_base32','encoding_base64','encoding_binary','encoding_csv','encoding_gob','encoding_hex','encoding_json','encoding_pem','encoding_xml','errors','expvar','flag','fmt','github.com_gopherjs_gopherjs_js','github.com_gopherjs_gopherjs_tests','github.com_gopherjs_gopherjs_tests_main','go_ast','go_constant','go_doc','go_format','go_parser','go_printer','go_scanner','go_token','hash_adler32','hash_crc32','hash_crc64','hash_fnv','html','html_template','image_color','image_draw','image_gif','image_jpeg','image','image_png','index_suffixarray','io_ioutil','io','math_big','math_cmplx','math','math_rand','mime','mime_multipart','mime_quotedprintable','net_http_cookiejar','net_http_fcgi','net_mail','net_rpc_jsonrpc','net_textproto','net_url','path_filepath','path','reflect','regexp','regexp_syntax','sort','strconv','strings','sync_atomic','sync','testing_quick','text_scanner','text_tabwriter','text_template','text_template_parse','time','unicode','unicode_utf16','unicode_utf8'
];

var active = [];
var startTimes = {};
var maxActive = 1; // Run at most this many concurrent tests

function updateConsole() {
    for (var i=0; i < active.length; i++) {
        updateConsoleFor( active[i] );
    }
};

function updateConsoleFor(id) {
    var iframe = iframeDoc( id + '-frame');
    var iframeDiv = iframe.getElementById('console');
    if ( iframeDiv ) {
        var html = iframeDiv.innerHTML;
        if ( html.length > 0 ) {
            document.getElementById( id ).innerHTML = html;
        }
    }
}

var updateInterval = setInterval(updateConsole,250);

window.addEventListener("message", function(event) {
    var id = event.data.id.replace(/-frame/,'');
console.log('id = '+ id);
    var start = event.data.start;
    var end = event.data.end;
    if (start !== undefined ) {
        startTimes[ id ] = start;
        return;
    }
        
    // Remove id from list of active tests
    var i = active.indexOf( id );
    if ( i != -1 ) {
        active.splice(i,1);
    }
    if ( tests.length == 0 && active.length == 0 ) {
        clearInterval(updateInterval);
    }
    var elapsed = Math.round(end - startTimes[id])/1000;
    console.log("Elapsed: " + elapsed);
    document.getElementById(id + '-h2').innerHTML = elapsed + ' seconds';
    // Introduce a small delay, to ensure the iframe's DOM has a chance to be updated
    setTimeout(function() {
        updateConsoleFor( id );
    }, 100);
    setTimeout(start_tests,0);
});

function start_tests() {
    while( active.length < maxActive ) {
        start_test( tests.shift() );
    }
}

function start_test(newId) {
    active.push(newId);
    if(typeof(newId) === 'undefined') {
        console.log("No more tests");
        return;
    }
    console.log("Creating frame id '%s'", newId+'-frame');
    var h1 = document.createElement('h1');
    h1.innerHTML = newId;
    var h2 = document.createElement('h2');
    h2.id = newId + '-h2';
    var div = document.createElement('div');
    div.id = newId;
    div.innerHTML = '<i>Waiting for test...</i>';
    var iframe = document.createElement('iframe');
    iframe.id = newId + '-frame';
    iframe.src = 'container.html';
    iframe.setAttribute('class','test');
console.log('start ' + performance.now());
    document.body.appendChild(h1);
    document.body.appendChild(h2);
    document.body.appendChild(div);
    document.body.appendChild(iframe);
};
start_tests();
