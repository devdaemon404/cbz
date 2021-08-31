import { customAlphabet } from 'nanoid';

const customNano6 = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
const customNano3 = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3);

// A handy util which generates custom id's given a prefix
class IdUtil {
  // Given a prefix, the function generates a custom id
  // Example - 'M-7GWO2F-WJ1'
  static generate = async (prefix: string): Promise<string> => {
    return prefix + customNano6() + '-' + customNano3();
  };
}

export default IdUtil;
