#!/bin/bash
for x in original/*.js; do
    cat $x | perl -p0e 's/(};\s*?var \$schedule\s?=\s?function)/if(\$scheduled.length==0){parent.postMessage({id:frameElement.id,end:performance.now()},"*");}$1/s' > `basename $x`;
done
