const _ = require('lodash');

// compare 2 objects with its length, keys, values.
// lettercase of the key is not a concern
// datatype of the value is not a concern
// object should not contain function
// object should not be empty
exports.isEqual = function (obj1, obj2) {

    // console.log(`obj1 result : `, JSON.stringify(obj1));
    //  console.log(`obj2 result : `, JSON.stringify(obj2));

    let allObj1Keys;
    let allObj2Keys;

    try {
        allObj1Keys = Object.keys(obj1);
        allObj2Keys = Object.keys(obj2);
    } catch (error) {
        console.log('Either one object is falsey, either undefined, null, or empty');
        return false;
    }

    // empty object is not falsey
    if (!obj1 || !obj2 || allObj1Keys || allObj2Keys) {
        console.log('Either one object is falsey, either undefined, null, or empty');
        return false;
    }


    // compare length
    if (allObj1Keys.length !== allObj2Keys.length) {
        console.log('length of the two objects is not equal');
        return false;
    }
    //console.log(`length = ${allObj1Keys.length}`);

    // compare key
    for (let i = 0; i < allObj1Keys.length; i++) {
        // console.log(`${allObj1Keys[i].toLocaleLowerCase()} vs ${allObj2Keys[i].toLocaleLowerCase()}`);
        if (allObj1Keys[i].toLocaleLowerCase() !== allObj2Keys[i].toLocaleLowerCase()) {
            console.log('keys of the two objects is not equal');
            console.log(`object1 =  ${allObj1Keys[i].toLocaleLowerCase()} | object2 =  ${allObj2Keys[i].toLocaleLowerCase()}`);
            return false;
        }
    }

    // compare value (disregard the datatype of the value)
    for (let i = 0; i < allObj1Keys.length; i++) {
        // console.log(`${String(obj1[allObj1Keys[i]])} vs ${String(obj2[allObj2Keys[i]])}`);
        if (String(obj1[allObj1Keys[i]]) !== String(obj2[allObj2Keys[i]])) {
            console.log('values of the two objects is not equal');
            console.log(`${allObj1Keys[i]} : object1 =  ${String(obj1[allObj1Keys[i]])} | object2 =  ${String(obj2[allObj2Keys[i]])}`);
            return false;
        }
    }

    return true;
};


//ref https://lodash.com/docs/#isEqual
exports.isIdentical = function (obj1, obj2) {
    return _.isEqual(obj1, obj2);
};
