import { InjectData } from '../inject_data';
import moment from 'moment';

/**
 * Data included in every requests
 */

const injectDefaultData = (req, res) => {
    const resCopy = { ...res }; // Do not actually mutate the result
    const data =
        [
            ['utcOffset', moment().utcOffset()],
            ['url', req.url]
        ];
    data.forEach(([key, value]) => {
        // TODO: InjectData is not very efficient
        InjectData.pushData(resCopy, key, value);
    });
    return resCopy;
};
export default injectDefaultData;