"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/cdk");
const s3 = require("@aws-cdk/aws-s3");
class MyStack extends cdk.Stack {
    constructor(parent, id, props) {
        super(parent, id, props);
        new s3.Bucket(this, 'MyFirstBucket', {
            versioned: true,
            encryption: s3.BucketEncryption.KmsManaged,
        });
    }
}
class MyApp extends cdk.App {
    constructor(argv) {
        super(argv);
        new MyStack(this, 'hello-cdk');
    }
}
process.stdout.write(new MyApp(process.argv).run());
