/* eslint-disable no-console */
import { HTTP } from 'meteor/http';

export default (coverageOptions) => {
  let promise = Promise.resolve(true);

  if (coverageOptions) {
    const cLog = (...args) => {
      if (coverageOptions.verbose) {
        console.log(...args);
      }
    };

    cLog('Export code coverage');

    const importCoverageDump = () => new Promise((resolve, reject) => {
      cLog('- In coverage');
      HTTP.get(Meteor.absoluteUrl('coverage/import'), (error, response) => {
        if (error) {
          reject(new Error('Failed to import coverage file'));
          return;
        }

        const { statusCode } = response;

        if (statusCode !== 200) {
          reject(new Error('Failed to import coverage file'));
        }
        resolve();
      });
    });

    const exportReport = (fileType, reportType) => new Promise((resolve, reject) => {
      cLog(`- Out ${fileType}`);
      const url = Meteor.absoluteUrl(`/coverage/export/${fileType}`);
      HTTP.get(url, (error, response) => {
        if (error) {
          reject(new Error(`Failed to save ${fileType} ${reportType}`));
          return;
        }

        const { statusCode } = response;

        if (statusCode !== 200) {
          reject(new Error(`Failed to save ${fileType} ${reportType}`));
        }
        resolve();
      });
    });

    const exportRemap = () => new Promise((resolve, reject) => {
      cLog('- Out remap');
      HTTP.get(Meteor.absoluteUrl('/coverage/export/remap'), (error, response) => {
        if (error) {
          reject(new Error('Failed to remap your coverage'));
          return;
        }

        const { statusCode } = response;

        if (statusCode !== 200) {
          reject(new Error('Failed to remap your coverage'));
        }
        resolve();
      });
    });

    if (coverageOptions.in.coverage) {
      promise = promise.then(() => importCoverageDump());
    }

    if (coverageOptions.out.coverage) {
      promise = promise.then(() => exportReport('coverage', 'dump'));
    }

    if (coverageOptions.out.lcovonly) {
      promise = promise.then(() => exportReport('lcovonly', 'coverage'));
    }

    if (coverageOptions.out.html) {
      promise = promise.then(() => exportReport('html', 'report'));
    }

    if (coverageOptions.out.json) {
      promise = promise.then(() => exportReport('json', 'report'));
    }

    if (coverageOptions.out.text_summary) {
      promise = promise.then(() => exportReport('text-summary', 'report'));
    }

    if (coverageOptions.out.remap) {
      promise = promise.then(() => exportRemap());
    }

    if (coverageOptions.out.json_summary) {
      promise = promise.then(() => exportReport('json-summary', 'dump'));
    }

    promise = promise.catch(console.error);
  }

  return promise;
};
