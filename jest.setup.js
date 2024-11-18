import '@testing-library/jest-dom';
import 'whatwg-fetch';
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
import { Response } from 'node-fetch';
global.Response = Response;

