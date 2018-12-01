
function runner(iterator, preValue) {
    // Check if a generator was passed into runner
    if (typeof iterator === 'function')
        return runner(iterator());

    if (iterator == null || typeof iterator.next !== 'function')
        throw new TypeError('runner expects an iterator/generator');

    const { value, done } = iterator.next(preValue);


    if (done) {
        return Promise.resolve( value == undefined ? preValue : value );
    }
    if (isPromise(value)){
        return value.then( result => runner(iterator, result) );
    } else {
        return Promise.resolve( runner(iterator, value))
    }
}


function isPromise(promise) {
    return promise != null && typeof promise === 'object' && typeof promise.then === 'function';
}


export default runner;