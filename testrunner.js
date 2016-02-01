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
/*
// Capture console
(function(){
    var OldConsole = console;
    var divlog = function(m) {
        div = document.getElementById('console');
        if ( typeof(div) !== 'undefined' ) {
            div.innerHTML = div.innerHTML + m + "\n";
        }
    };
    console = {
        assert: function(c,m) {
            if ( c ) {
                divlog(m);
                OldConsole.log(m);
            }
        },
        log: function(m) {
            divlog(m);
            OldConsole.log(m);
        },
        error: function(m) {
            divlog('<span style="color:red">' + m + '</span>');
            OldConsole.error(m);
        },
        clear: function(m) {
            div = document.GetElementById('console');
            if ( typeof(div) !== 'undefined' ) {
                div.innerHTML = '';
            }
            OldConsole.clear();
        }
    };
})();*/

function iframeDoc( id ) {
    frameRef = document.getElementById(id);
    if(!frameRef) return;
    return frameRef.contentWindow
        ? frameRef.contentWindow.document
        : frameRef.contentDocument
}
var tests = [
'archive_tar','crypto_des','database_sql_driver','encoding_hex','go_format','image_jpeg','net_http_fcgi','sync_atomic','archive_zip','crypto_dsa','database_sql','encodingon','go_parser','image','net_mail','sync','bufio','crypto_ecdsa','debug_dwarf','encoding_pem','go_printer','image_png','net_rpconrpc','testing_quick','bytes','crypto_elliptic','debug_elf','encoding_xml','go_scanner','index_suffixarray','net_textproto','compress_bzip2','crypto_hmac','debug_gosym','errors','go_token','io_ioutil','net_url','text_scanner','compress_flate','crypto_md5','debug_macho','expvar','hash_adler32','io','path_filepath','text_tabwriter','compress_gzip','crypto_rand','debug_pe','flag','hash_crc32','math_big','path','text_template','compress_lzw','crypto_rc4','encoding_ascii85','fmt','hash_crc64','math_cmplx','text_template_parse','compress_zlib','crypto_rsa','encoding_asn1','github.com_gophe_gophe','hash_fnv','math','reflect','time','container_heap','crypto_sha1','encoding_base32','github.com_gophe_gophe_tests','html','math_rand','regexp','unicode','container_list','crypto_sha256','encoding_base64','github.com_gophe_gophe_tests_main','html_template','mime','regexp_syntax','unicode_utf16','container_ring','crypto_sha512','encoding_binary','go_ast','image_color','mime_multipart','sort','unicode_utf8','crypto_aes','crypto_subtle','encoding_csv','go_constant','image_draw','mime_quotedprintable','strconv','crypto_cipher','crypto_x509','encoding_gob','go_doc','image_gif','net_http_cookiejar','strings'
]
setInterval(function() {
    console.log('tick');
    var activeTests = document.getElementsByClassName('test');
    for (var i = 0; i < activeTests.length; i++) {
        var id = activeTests[i].id;
        iframe = iframeDoc( id );
        if (iframe !== 'undefined') {
            iframeDiv = iframe.getElementById('console');
            if ( iframeDiv ) {
                targetId = id.slice(0,-6); // remove '-frame' from id
                document.getElementById(targetId).innerHTML = iframeDiv.innerHTML;
            }
        }
    }
},250);

function start_tests(tests) {
    newId = tests.shift();
console.log('newId = ' + newId);
    if(typeof(newId) === 'undefined') {
        console.log("No more tests");
        return;
    }
    console.log("Creating frame id '%s'", newId+'-frame');
    var h1 = document.createElement('h1');
    h1.innerHTML = newId;
    var div = document.createElement('div');
    div.id = newId;
    var iframe = document.createElement('iframe');
    iframe.id = newId + '-frame';
    iframe.src = 'container.html';
    iframe.setAttribute('class','test');
    iframe.addEventListener("mainFinished", function(e) {
        console.log(newId + ' finished');
    });
    window.addEventListener("message", function(e) {
        console.log("got message from child iframe: " + event.data);
        start_tests(tests);
    });
    document.body.appendChild(h1);
    document.body.appendChild(div);
    document.body.appendChild(iframe);
};
var todo = tests.slice(0);
start_tests(todo);
