'use strict'

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectId = (id) => new Types.ObjectId(id);

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

// ['a', 'b', 'c'] => {a: 1, b: 1, c: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 1]));
}

const getUnselectData = (select = []) => {
    return Object.fromEntries(select.map((item) => [item, 0]));
}

const removeUndefinedObject = obj => {
    // Object.keys(obj).forEach(k => obj[k] === null && delete obj[k]);
    // return obj;
    Object.keys(obj).forEach(k => {
        if(obj[k] === null){
            delete obj[k]
        }else if(typeof obj[k] === 'object' && !Array.isArray( obj[k] )){
                obj[k] = removeUndefinedObject(obj[k]);
        }
    });
    return obj;
}

/**
    const a = {
        b: {
            c: 1,
            d: 2 
        }
    }

    ==> db.collection.updateOne({ 
        'b.c': 1, 
        'b.d': 2 
    })
*/
const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if( typeof obj[k] === 'object' && !Array.isArray(obj[k]) ){
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            })
        }else{
            final[k] = obj[k];
        }
    })
    return final;
}

// more populated nested object
/**
 const updateNestedObjectParser = (obj, parent, result = {}) => {
  Object.keys(obj).forEach(k => {
    const propName = parent ? `${parent}.${k}` : k
    if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
      updateNestedObjectParser(obj[k], propName, result)
    }
    else {
      result[propName] = obj[k]
    }
  })
  return result
}
 */

module.exports = {
    getInfoData,
    getSelectData,
    getUnselectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectId
}