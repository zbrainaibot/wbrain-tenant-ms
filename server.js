import APP from 'express';
import DBConnection from './config/dbConnection';
import Utils from './app/utils';
import Config from './config';
import routes from './routes';
import { httpConstants } from './app/common/constants';
import AMQP from './library/lhtamqpclientlibrary';
import sharedLib from './app/sharedLibrary';

const app = new APP()
global.rootDirectory = __dirname;
require('./config/express')(app)
global.lhtWebLog = Utils.lhtLog

class Server {
  static async listen() {
    try {
      await new sharedLib.modules.License(Config.LICENSE_SERVICE_URL).init({
        service: 'wbrain-tenant-microservice',
        licenseKey: Config.LICENSE_KEY,
      });

      await Promise.all([
        DBConnection.connect(),
        AMQP.conn(Config.AMQP_HOST_URL, true),
      ]);
      app.listen(Config.PORT);
      Utils.lhtLog('listen', `Server Started on port ${Config.PORT}`);
      routes(app);
      require('./config/jobInitializer');
    } catch (error) {
      Utils.lhtLog(
        'listen',
        'failed to connect',
        { err: error },
        '',
        httpConstants.LOG_LEVEL_TYPE.ERROR
      );
    }
  }
}

Server.listen();

export default app;
