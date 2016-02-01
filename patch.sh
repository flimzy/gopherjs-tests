for x in original/*.js; do cat $x | sed -e '/$flushConsole();/a parent.postMessage($global.frameElement.id,"*");' | sed -e '/"use strict";/ r preamble.js' > `basename $x`; done
