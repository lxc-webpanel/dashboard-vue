import { withParams } from 'vuelidate/lib';
import { req } from 'vuelidate/lib/validators/common';

const ipv4Regex = '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(/([0-9]|[12]\\d|3[0-2]))?$';

const ipv6Regex = '^(^(([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?(::1/(\\d|[1-9]\\d|1([0-1]\\d|2[0-8])))?$'; // eslint-disable-line max-len

const buildRegexString = (format) => {
  switch (format) {
    case 'v4':
      return ipv4Regex;
    case 'v6':
      return ipv6Regex;
    case 'both':
      return `${ipv4Regex}|${ipv6Regex}`;
    default:
      return false;
  }
};

const humanFormat = (format) => {
  switch (format) {
    case 'v4':
      return 'IPV4';
    case 'v6':
      return 'IPV6';
    case 'both':
      return 'IPV4/IPV6';
    default:
      return false;
  }
};

export default (format, multiline) => withParams(
  {
    type: 'ip',
    errorParams: humanFormat(format),
    multiline
  },
  (value) => {
    const regexString = buildRegexString(format);

    if (!regexString) {
      throw new Error("[LWP] Invalid ip validator 'format' parameters. Must be 'v4', 'v6', or 'both'.");
    }

    const regex = new RegExp(regexString);

    let valid = true;

    if (multiline) {
      const lines = value.split('\n');

      lines.every((line) => {
        valid = regex.test(line);
        return valid;
      });
    } else {
      valid = regex.test(value);
    }

    return !req(value) || valid;
  }
);
