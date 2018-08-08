import "reflect-metadata";
import "module-alias/register";

import { InversifyExpressServer, interfaces, TYPE } from 'inversify-express-utils';
import DependenciesContainer from "@/config/DependenciesContainer";

// set up container
let container = new DependenciesContainer();

// create server
let server = new InversifyExpressServer(container);

let app = server.build();
app.listen(3000);

console.log("Server started");