import { Application, } from '../lib';
import config from './config';

const app = new Application(config);

app.start();
