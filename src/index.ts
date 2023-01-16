import * as dotenv from 'dotenv';
import server from './server';

dotenv.config();

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

export { server };
