import runner from '../runner';

describe('Test generator runner', () => {

    it('Should throw when provided an invalid iterator/generator', () =>{
        expect( () => runner(() => { next: null })).toThrowError(TypeError);
        expect(() => runner()).toThrowError(TypeError);
        expect(()=> runner({ next: ''})).toThrowError(TypeError);
    });

    // Generator function that are going to be tested with this runner.
    const genToTest = [
    /*  [ (function To Test), ( expectedResult ) ]  */
        [ simpleGen, 30],
        [ simpleGen2, 30],
        [ simpleAsyncGen, 30],
        [ simpleAsyncGen2, 30],
        [ asyncGen, 60 ]
    ];

    genToTest.forEach( ([ genFn, expectedResult]) => {
        it(`Testing ${ genFn.name }`, () => {
            return runner(genFn).then( result => expect(result).toBe(expectedResult));
        });
    });
});


// ************************************************************** //

const timeMultiplier = 10;

function* simpleGen() {
    const x = yield 10;
    const y = yield 20;
    yield x + y;
}

function* simpleGen2() {
    const x = yield 10;
    const y = yield 20;
    return x + y;
}

function* simpleAsyncGen() {
    const x = yield fakeAsync(10);
    const y = yield fakeAsync(20);
    yield x + y;
}

function* simpleAsyncGen2() {
    const x = yield fakeAsync(10);
    const y =yield fakeAsync(20);
    return x + y;
}

function* asyncGen() {
    const gen1 = yield runner(simpleAsyncGen);
    const gen2 = yield runner(simpleGen);
    return gen1 + gen2;
}

function fakeAsync(data) {
    return new Promise( function (resolve, reject) {
        const timer = setTimeout(() => {
            resolve(data);
        },
        Math.round(Math.random() * timeMultiplier ));
    });
}