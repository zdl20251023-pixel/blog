import { ErrorCode } from "../../utils/errorCode";
import type { demo_get_rsp_type } from "./modle";

export abstract class DemoService {
    static async getDemo(): Promise<[number, demo_get_rsp_type | null]> {
        const randValue = Math.floor(Math.random() * 100) + 1;
        if (randValue % 2 === 0) {
            return Promise.resolve([ErrorCode.SUCCESS, {
                id: Math.floor(Math.random() * 100) + 1,
                name: "John Doe",
                age: 30
            }]);
        } else {
            return Promise.resolve([ErrorCode.ERROR, null]);
        }
    }
}