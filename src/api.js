
export class API {
    
    constructor(conf) {
        
        this.basePath = conf && conf.basePath ? conf.basePath : '/api/'
        this.schemaBasePath = conf && conf.schemaBasePath ? conf.schemaBasePath : '/api/schema/'
    }

    async loadSchema(path) {
        const resp = await fetch(`${this.schemaBasePath}${path}/`);
        const json = await resp.json();
        // await new Promise((r) => setTimeout(() => r(), 1000));
        return json;
    }
    async loadData(path, orderBy, orderType) {
        const resp = await fetch(`${this.basePath}${path}/?order_by=${orderBy}&order_type=${orderType}`);
        const json = await resp.json();
        return json;
    }
    
    async fetchData(path, orderBy, orderType) {
        return Promise.all([
            this.loadData(path, orderBy, orderType),
            this.loadSchema(path)
        ]).then((arr) => {
            const schema = arr[1];
            const fields = Object.keys(schema.properties);
            const hiddenFields = fields.flatMap((f) => { 
                if (schema.properties[f].is_hidden) {
                    return f;
                }
            }).filter(f => f != undefined);
            
            const res = {
                entity: {
                    id: 0,
                },
                list: arr[0], 
                schema: {
                    ...schema,
                    title: schema.title,
                    required: schema.required,
                    fields: fields,
                    columns: fields.filter(f => !hiddenFields.includes(f) && schema.properties[f].format != "password" ),
                    hiddenFields: hiddenFields,
                }
            };
            
            return res;
        })
    }
}

