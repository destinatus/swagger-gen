import * as fs from "fs";


export default class SwaggerGen {


    public async parseTests(): Promise<any> {


        await fs.readFile("./src/Sample.test.ts", (err, data) => {
            if (err !== null) {
                console.log(err);
            }

            let dataString = data.toString();
            this.processFile(dataString);
        });
    }

    public async processFile(data: any): Promise<any> {
        let router: { [key: string]: any } = {};
        let charArray = Array.from(data);
        let s: string = data.toString();
        let test = s.split('describe(');
        let line = test[1].split('\n')[0];
        //get file tag
        let tag = line.match(/"(.*?)"/);

        router.tag = tag ? tag[1] : 'not found';
        router.data = [];
        let descriptions = test[1].split('it(');
        let testCase: any[] = [];
        let headers: any[] = [];
        let endpoint: string = '';
        let method: string = '';
        //get description for end points
        await descriptions.forEach(description => {
            let swaggerData = new SwaggerData();
            let line = description.split('\n')[0];
            let it = description.split('\nit(');

            it.forEach((line: any) => {
                if (line.search(/expect\(res.status\).to.eq\(20.\)/) > 0) {

                    //response code
                    let statusCode = line.search(/expect\(res.status\).to.eq\([0-9]*\)/g);

                    swaggerData.statusCode = line.substring(statusCode + 25, (statusCode + 28));

                    let test = line.match(/"(.*?)"/);
                    //description
                    swaggerData.description = test ? test[1] : null;

                    //headers
                    let headerLine = line.split('.set');
                    headerLine.forEach((element: any) => {
                        let header = element.match(/(?:'|"|`)(.*?)(?:'|"|`)(?:,\s*)(?:'|"|`)(.*?)(?:'|"|`)/g);
                        if (header !== null) {
                            swaggerData.headers.push(header[0]);
                        }
                    });

                    //body
                    let bodyLines = line.split('.send');
                    let body;
                    bodyLines.forEach((element: any) => {
                        let bodyExtra = element.match(/\(\{(.*?)\}\)/g);

                        let bodys = bodyExtra ? bodyExtra[0] : '';
                        let bodyMatch = bodys.match(/\{(.*?)\}/g);
                        body = bodyMatch ? bodyMatch[0] : null;

                        if (body !== null) {
                            swaggerData.body = body;
                        }
                        // let body;
                        // if(bodyExtra!==null){
                        //     body =bodyExtra.match(/\{(.*?)\}/);
                        // }


                    });
                    // let body = line.match(/send\(.*?\)/g);


                    if (line.match('.get')) {
                        //path

                        let path = line.match(/.get\("(.*?)"/);
                        swaggerData.endpoint = path ? path[1] : null;
                        //method
                        swaggerData.method = 'get';

                    } else if (line.match('.post')) {
                        let path = line.match(/.post\("(.*?)"/);
                        swaggerData.endpoint = path ? path[1] : null;
                        swaggerData.method = 'post';
                        //body
                    } else if (line.match('.delete')) {
                        let path = line.match(/.delete\("(.*?)"/);
                        swaggerData.endpoint = path ? path[1] : null;
                        swaggerData.method = 'delete';
                    } else if (line.match('.options')) {
                        let path = line.match(/.options\("(.*?)"/);
                        swaggerData.endpoint = path ? path[1] : null;
                        swaggerData.method = 'options';
                    } else if (line.match('.put')) {
                        let path = line.match(/.put\("(.*?)"/);
                        swaggerData.endpoint = path ? path[1] : null;
                        swaggerData.method = 'put';
                    }

                    //end and push
                    router.data.push(swaggerData);
                }

            });

        });
        // console.log(router);
        this.createSwagger(router);


    }

    public async createSwagger(router: any) {
        let swagger = {
            "openapi": "3.0.1",
            "info": {
                "title": "defaultTitle",
                "description": "defaultDescription",
                "version": "0.1"
            },
            "servers": [{
                "url": "http://localhost:1344"
            }],
            "paths": {}
        };
        await fs.readFile('./package.json', async (err, data) => {
            // console.log(data.toString());
            let packInfo = await JSON.parse(data.toString());
            console.log(typeof(packInfo));
            // let pack = 
            console.log(packInfo);

            //populate swagger.json
            swagger.info.title = packInfo.name;
            swagger.info.description = packInfo.description;
            swagger.info.version = packInfo.version;
            
            router.data.forEach((element:any) => {
                console.log(element);
            });
            console.log(swagger);
        });
    }

   
}
class Swagg{
    private path: string | undefined;
    private method: string | undefined;
    private methodDesc: string | undefined;
    private parameters: [{}] | undefined;
    private responses: [{
        status: string | undefined, 
        description: string | undefined
    }] | undefined;
        
        
}

class SwaggerData {

    private _endpoint: string | undefined;
    public get endpoint(): string | undefined {
        return this._endpoint;
    }
    public set endpoint(value: string | undefined) {
        this._endpoint = value;
    }
    private _method: string | undefined;
    public get method(): string | undefined {
        return this._method;
    }
    public set method(value: string | undefined) {
        this._method = value;
    }
    private _description: string | undefined;
    public get description(): string | undefined {
        return this._description;
    }
    public set description(value: string | undefined) {
        this._description = value;
    }
    private _responseCodes: string[] | undefined;
    public get responseCodes(): string[] | undefined {
        return this._responseCodes;
    }
    public set responseCodes(value: string[] | undefined) {
        this._responseCodes = value;
    }
    private _content: string | undefined;
    public get content(): string | undefined {
        return this._content;
    }
    public set content(value: string | undefined) {
        this._content = value;
    }
    private _body: {} | undefined;
    public get body(): {} | undefined {
        return this._body;
    }
    public set body(value: {} | undefined) {
        this._body = value;
    }
    private _headers: any[] = [];
    public get headers() {
        return this._headers;
    }
    public set headers(value) {
        this._headers = value;
    }
    private _tag: string | undefined;
    public get tag(): string | undefined {
        return this._tag;
    }
    public set tag(value: string | undefined) {
        this._tag = value;
    }

    private _statusCode: number | undefined;
    public get statusCode(): number | undefined {
        return this._statusCode;
    }
    public set statusCode(value: number | undefined) {
        this._statusCode = value;
    }


    constructor() { };

}
