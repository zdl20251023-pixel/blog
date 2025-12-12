import { t } from "elysia";

export const demo_get_rsp = t.Object({
    id: t.Number(),
    name: t.String(),
    age: t.Number()
})

export type demo_get_rsp_type = typeof demo_get_rsp.static;