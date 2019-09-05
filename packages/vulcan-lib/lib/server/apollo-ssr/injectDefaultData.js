import { InjectData } from './inject_data';
import moment from 'moment';

/**
 * Data included in every requests
 */

const injectDefaultData = (req, { responseHeaders }) => {
    /* legacy: InjectData was part of fast-render and use to take the http res as first param 
    now we simultate the _headers props to allow checking CORS
    */
    const res = { _headers: responseHeaders };
    const data =
        [
            ['utcOffset', moment().utcOffset()],
            ['url', req.url]
        ];
    data.forEach(([key, value]) => {
        // TODO: InjectData is not very efficient
        InjectData.pushData(
            res,
            key,
            value
        );
    });
    return res;
};
export default injectDefaultData;