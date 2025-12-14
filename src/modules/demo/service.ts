import { redisManagerInstance } from "../../lib/redis";
import { ErrorCode } from "../../utils/errorCode";
import type { demo_get_rsp_type } from "./modle";

export abstract class DemoService {
    static async getDemo(): Promise<[number, demo_get_rsp_type | null]> {
        const randValue = Math.floor(Math.random() * 100) + 1;
        const oldCachedValue = await redisManagerInstance.get("demo");
        console.log("oldCachedValue", oldCachedValue);
        await redisManagerInstance.set("demo", randValue.toString());
        const newCachedValue = await redisManagerInstance.get("demo");
        console.log("newCachedValue", newCachedValue);
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