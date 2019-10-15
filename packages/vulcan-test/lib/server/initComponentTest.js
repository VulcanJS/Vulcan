// setup JSDOM server side for testing (necessary for Enzyme to mount)
import jsdom from 'jsdom-global';
import commonInitComponentTest from '../modules/initComponentTest';

const initComponentTest = () => {
    // init a JSDOM to allow rendering server side
    jsdom('', {
        runScripts: 'outside-only'
    });
    commonInitComponentTest();
};

export default initComponentTest;