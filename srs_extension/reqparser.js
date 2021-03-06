// Reference regex: /SRS_[0-9A-Z_]+_\d{2}_\d{3}/g
var getAllReqTags = function (text, prefix, devId) {
    if (!text) return;

    var regexStr = "";
    if (prefix) {
        regexStr = prefix;
    } else {
        regexStr = "SRS_[0-9A-Z_]+_";
    }

    if (devId) {
        regexStr += zeroFill(devId, 2);
    } else {
        regexStr += "\\d{2}";
    }

    regexStr += "_\\d{3}";

    if (regexStr === "") {
        return;
    } else {
        var regex = new RegExp(regexStr, 'g');
        var reqTags = text.match(regex);
        return reqTags;
    }
};

// from : http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }

    return number + ""; // always return a string
}


var getPrefixes = function (text) {
    // This will match (prefix as group 1_)(devId_reqId)
    // Then we can strip off the dev ID and requirement ID, but we allow numbers in the prefix
    var regex = /(SRS_[0-9A-Z_]+_)([0-9]{2}_[0-9]{3})/g;
    var prefixes = Array.from(text.matchAll(regex));
    var dedupedPrefixes = null;

    if (prefixes != null) {
        // First strip the dev ID and requirement ID's (first array item in regex match is everything, second is the first group that we want, index 1)
        prefixes = prefixes.map(function (item){
            return item[1];
        });

        // Then de-duplicate
        dedupedPrefixes = prefixes.filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
        });
    }

    return dedupedPrefixes || [];
};

var getNextReq = function (text, prefix, devId) {
    var maxId = 0;

    var tags = getAllReqTags(text, prefix, devId);
    if (tags) {
        tags.forEach(function (val) {
            var elements = val.split('_');
            var number = elements[elements.length - 1];
            var id = parseInt(number);
            if (id > maxId) {
                maxId = id;
            }
        });
    }

    var reqTag = prefix + zeroFill(devId, 2) + "_" + zeroFill(maxId + 1, 3);

    return reqTag;
};

exports.getPrefixes = getPrefixes;
exports.getNextReq = getNextReq;