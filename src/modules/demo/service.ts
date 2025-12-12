import type { demo_get_rsp_type } from "./modle";

export abstract class DemoService {    
    static async getDemo(): Promise<demo_get_rsp_type> {
        return Promise.resolve({
            id: Math.floor(Math.random() * 100) + 1,
            name: "John Doe",
            age: 30
        });
    }
}