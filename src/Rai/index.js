/*
* RaiBlocks JavaScript RPC requests and basic functions
* https://github.com/SergiySW/RaiBlocksJS
*
* Released under the BSD 3-Clause License
*
*
* RPC commands full list
* https://github.com/clemahieu/raiblocks/wiki/RPC-protocol
*
* set 'hostUrl' as string. Mask protocol://host:port. Default value is http://localhost:7076. Samples
* http://localhost:7076
* https://raiwallet.info:7077
*
* Request sample
* ---------------------------
* const rai = new Rai();
* const blockCount = rai.rpc('block_count'); // raw rpc action
* const blockCount = rai.blocks.count(); // convenience rpc method
*
*/

import axios from 'axios';
import methods from './methods';
import extendedMethods from '../extended';
import removeEmptyObjectProperties from '../utils/removeEmptyObjectProperties';
import convertObjectNumbersToStrings from '../utils/convertObjectNumbersToStrings';
import convertObjectStringNumbersToNumbers from '../utils/convertObjectStringNumbersToNumbers';
import getConversion from '../utils/getConversion';

export default class Rai {
  constructor(hostUrl) {
    this.hostUrl = hostUrl || 'http://localhost:7076';

    Object.keys(methods).forEach((method) => {
      this[method] = methods[method].call(this, this.rpc);
    });

    this.extended = {};

    Object.keys(extendedMethods).forEach((method) => {
      this.extended[method] = extendedMethods[method].bind(this);
    });

    this.getConversion = getConversion;
  }

  rpc = async (action, _data = {}) => {
    let data = removeEmptyObjectProperties(_data);
    data = convertObjectNumbersToStrings(data);

    const body = Object.assign({}, { action }, data);
    try {
      const response = await axios.post(this.hostUrl, JSON.stringify(body));
      return convertObjectStringNumbersToNumbers(response.data);
    } catch (err) {
      return err;
    }
  };
}
